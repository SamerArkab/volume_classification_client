import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Container, Row, Col, Form, Button } from 'react-bootstrap';

function ImageUploader() {
    const [selectedImage, setSelectedImage] = useState(null);
    const navigate = useNavigate();

    // Function to handle the image selection
    const handleImageUpload = (event) => {
        setSelectedImage(event.target.files[0]);
    };

    // Function to send the image to the server
    const uploadImage = async () => {
        try {
            const formData = new FormData();
            formData.append('image', selectedImage, selectedImage.name);

            const response = await axios.post('http://localhost:5000/api/upload', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });

            // Handle the response from the server
            console.log(response.data);

            navigate('/SegmentsAndLabel', { state: { responseData: response.data } }); // Pass response data as state while navigating 
        } catch (error) {
            // Handle any errors that occurred during the request
            console.error('Error uploading image:', error);
        }
    };

    return (
        <div style={{ backgroundColor: '#262626', color: '#fff', height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <Container style={{ backgroundColor: '#333', borderRadius: '1rem', padding: '1rem 2rem 2rem', maxWidth: '32rem', display: 'flex', flexDirection: 'column', justifyContent: 'flex-start' }}>
                <Row className="justify-content-center" style={{ marginTop: '1rem' }}>
                    <Col xs={12}>
                        <h2 style={{ marginBottom: '1rem', textAlign: 'center', fontSize: '3rem', textShadow: '2px 2px 4px #000' }}>Image Uploader</h2>
                        <Form>
                            <Form.Group controlId="imageUpload">
                                <Form.Label style={{ fontWeight: 'bold', fontSize: '1.125rem', marginRight: '1rem' }}>Upload Image</Form.Label>
                                <Form.Control type="file" style={{ marginTop: '1rem', marginBottom: '1rem' }} onChange={handleImageUpload} />
                            </Form.Group>
                            <Button variant="outline-light" style={{ width: '100%', fontSize: '1.125rem' }} onClick={uploadImage}>
                                Upload Image
                            </Button>
                        </Form>
                    </Col>
                </Row>
            </Container>
        </div>
    );
}

export default ImageUploader;
