import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Container, Row, Col, Button } from 'react-bootstrap';

function SegmentsAndLabel() {
    const [imageUrls, setImageUrls] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const location = useLocation();
    const responseData = location.state.responseData;
    console.log(responseData.data);
    useEffect(() => {
        // Fetch the list of image filenames from the server
        fetch('http://localhost:5000/api/images')
            .then(response => response.json())
            .then(data => {
                // Construct the image URLs based on the server URL and the filenames
                const urls = data.map(filename => `http://localhost:5000/uploads/${filename}`);
                setImageUrls(urls);
            })
            .catch(error => {
                console.error('Error fetching images:', error);
            });
    }, []);

    // Method to go to next image
    const nextImage = () => {
        if (currentIndex < imageUrls.length - 1) {
            setCurrentIndex(currentIndex + 1);
        }
        if (currentIndex === imageUrls.length - 1) {

        }
    };

    // Method to go to previous image
    const prevImage = () => {
        if (currentIndex > 0) {
            setCurrentIndex(currentIndex - 1);
        }
    };

    return (
        <div style={{ backgroundColor: '#262626', height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', color: '#fff' }}>
            <Container style={{ backgroundColor: '#333', borderRadius: '1rem', padding: '1rem 2rem 2rem', maxWidth: '18rem', display: 'flex', flexDirection: 'column', justifyContent: 'flex-start' }}>
                <Row className="justify-content-center">
                    <Col sm={12}>
                        <h2 style={{ marginBottom: '1rem', textAlign: 'center', fontSize: '3rem', textShadow: '2px 2px 4px #000' }}>Display Segment</h2>
                        {imageUrls.length > 0 && (
                            <div>
                                <img src={imageUrls[currentIndex]} alt={`#${currentIndex}`} style={{ maxWidth: '18rem', height: 'auto', marginBottom: '2rem' }} />
                                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <Button variant="outline-light" style={{ minWidth: '4rem', fontSize: '1.125rem' }} onClick={prevImage}>Prev</Button>
                                    <Button variant="outline-light" style={{ minWidth: '4rem', fontSize: '1.125rem', marginLeft: 'auto' }} onClick={nextImage}>{currentIndex === imageUrls.length - 1 ? 'Total Result' : 'Next'}</Button>
                                </div>
                            </div>
                        )}
                    </Col>
                </Row>
            </Container>
        </div>
    );
}

export default SegmentsAndLabel;
