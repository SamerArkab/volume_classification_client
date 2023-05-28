import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Container, Row, Col, Button } from 'react-bootstrap';

function SegmentsAndLabel() {
    const [imageUrls, setImageUrls] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [currentData, setCurrentData] = useState(null); // State to store current data

    const location = useLocation();
    const responseData = location.state ? location.state.responseData : {};
    console.log(responseData);

    useEffect(() => {
        // Fetch the list of image filenames from the server
        fetch('http://localhost:5000/api/images')
            .then(response => response.json())
            .then(data => {
                // Filter the filenames that start with "segmented_"
                const filteredData = data.filter(filename => filename.startsWith('segmented_'));
                // Construct the image URLs based on the server URL and the filenames
                const urls = filteredData.map(filename => `http://localhost:5000/uploads/${filename}`);
                setImageUrls(urls);
            })
            .catch(error => {
                console.error('Error fetching images:', error);
            });
    }, []);

    // Method to go to next image
    const nextImage = () => {
        if (currentIndex < imageUrls.length - 1) {
            setCurrentIndex(currentIndex + 1); // `Set` is inside the scope of the `nextImage` function, `currentIndex` isn't really changed yet (only after we're outside the function's scope it will update)
            const data = responseData.img_volume_label_nut_val[(currentIndex + 1) * 3 + 2][0]; // Therefore, when I use `currentIndex`, increment it by 1 here too
            setCurrentData(toTitleCase(data));
        }
        else {

        }
    };

    // Method to go to previous image
    const prevImage = () => {
        if (currentIndex > 0) {
            setCurrentIndex(currentIndex - 1);
            const data = responseData.img_volume_label_nut_val[(currentIndex - 1) * 3 + 2][0];
            setCurrentData(toTitleCase(data));
        }
        else {

        }
    };

    const toTitleCase = (str) => {
        return str
            .split('_')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
            .join(' ');
    };

    return (
        <div style={{ backgroundColor: '#262626', height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', color: '#fff' }}>
            <Container style={{ backgroundColor: '#333', borderRadius: '1rem', padding: '1rem 2rem 2rem', maxWidth: '30rem', display: 'flex', flexDirection: 'column', justifyContent: 'flex-start', position: 'relative' }}>
                <Row className="justify-content-center" style={{ marginBottom: '1rem' }}>
                    <Col xs={4} md={4} style={{ textAlign: 'left' }}>
                        <img src="delete_icon.png" alt="Delete Icon" style={{ height: '2rem', marginRight: '1rem' }} />
                        <img src="edit_icon.png" alt="Edit Icon" style={{ height: '2rem', marginRight: '1rem' }} />
                    </Col>
                    <Col xs={4} md={4} style={{ textAlign: 'center' }}>
                        <b style={{
                            fontSize: '2rem',
                            textShadow: '2px 2px 4px #000',
                        }}>
                            {currentData}
                        </b>
                    </Col>
                    <Col xs={4} md={4}></Col>
                </Row>
                <Row className="justify-content-center">
                    <Col xs={12} md={8}>
                        {imageUrls.length > 0 && (
                            <div>
                                <img src={imageUrls[currentIndex]} alt={`#${currentIndex}`} style={{ width: '100%', height: 'auto', marginBottom: '2rem' }} />
                                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <Button variant="outline-light" style={{ minWidth: '4rem', fontSize: '1.125rem', color: currentIndex === 0 ? '#1b4f72' : 'black' }} onClick={prevImage}>{currentIndex === 0 ? 'Upload New Image' : 'Prev'}</Button>
                                    <Button variant="outline-light" style={{ minWidth: '4rem', fontSize: '1.125rem', color: currentIndex === imageUrls.length - 1 ? '#1b4f72' : 'black' }} onClick={nextImage}>{currentIndex === imageUrls.length - 1 ? 'Total Result' : 'Next'}</Button>
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
