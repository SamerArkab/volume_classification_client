import React, { useEffect, useState, useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import { Container, Row, Col, Table, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

function DisplayResults() {
    const navigate = useNavigate();
    const location = useLocation();
    const responseData = useMemo(() => location.state ? location.state.responseData : {}, [location.state]);
    console.log(responseData.img_volume_label_nut_val);

    const [sums, setSums] = useState([]);
    const [dishNames, setDishNames] = useState('');

    const labels = ["Calories", "Fat", "Cholesterol", "Sodium", "Carbohydrates", "Sugars", "Protein"];

    useEffect(() => {
        const bigArray = responseData.img_volume_label_nut_val || [];
        calculateSum(bigArray);

        // Delete all saved images
        fetch('https://labelvolumenutritionserver.chickenkiller.com/api/deleteAll', {
            method: 'GET',
        })
            .catch(error => {
                console.error('Error:', error);
            });
    }, [responseData]);

    function calculateSum(bigArray) {
        let sums = Array(7).fill(0); // To store sums of indices 2 to 9
        let names = []; // To store names of dishes

        for (let i = 2; i < bigArray.length; i += 3) { // Start at index 2, increment by 3 each iteration
            let smallArray = bigArray[i]; // The small array

            for (let j = 2; j < smallArray.length; j++) { // Start at index 2 of the small array
                sums[j - 2] += smallArray[j]; // Add to the corresponding sum
            }

            let dishName = smallArray[0]
                .split('_')
                .map(word => word.split(' ').map(part => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase()).join(' '))
                .join(' ');

            if (!names.includes(dishName)) {
                names.push(dishName);
            }
        }

        setSums(sums.map(sum => Number(sum.toFixed(2))));
        setDishNames(names.join(' + '));
    }

    function goBack() {
        navigate('/');
        window.location.reload(); // Refresh the page
    }

    return (
        <div style={{ backgroundColor: '#262626', minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', color: '#fff' }}>
            <Container style={{ backgroundColor: '#333', borderRadius: '1rem', padding: '1rem', maxWidth: '27rem', textAlign: 'center' }}>
                <Row>
                    <Col xs={12} md={8}>
                        <p style={{ marginBottom: '1rem', fontSize: '2.5rem' }}>Your dish is made of:<br></br> {dishNames}</p>
                    </Col>
                </Row>
                <Row style={{ display: 'flex', justifyContent: 'center', marginBottom: '1rem' }}>
                    <Col xs={12} md={8}>
                        <Table bordered hover variant="dark">
                            <tbody>
                                {labels.map((label, index) => (
                                    <tr key={index} style={{ fontSize: '1.5rem' }}>
                                        <td>{label}</td>
                                        <td>{sums[index]}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </Table>
                    </Col>
                </Row>
                <Row>
                    <Col xs={12}>
                        <Button onClick={goBack} variant="outline-light" style={{ marginTop: '1rem' }}>Analyze New Food!</Button>
                    </Col>
                </Row>
            </Container>
        </div>
    );
}

export default DisplayResults;
