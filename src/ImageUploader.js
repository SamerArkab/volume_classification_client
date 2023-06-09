import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Container, Row, Col, Form, Button, Spinner } from 'react-bootstrap';

function ImageUploader() {
    const [selectedImage, setSelectedImage] = useState(null);
    const [loading, setLoading] = useState(false);
    const [requestId, setRequestId] = useState(null);
    const navigate = useNavigate();

    // Function to handle the image selection
    const handleImageUpload = (event) => {
        setSelectedImage(event.target.files[0]);
    };

    // Function to send the image to the server
    const uploadImage = async () => {
        setLoading(true);
        try {
            const formData = new FormData();
            formData.append('image', selectedImage, selectedImage.name);

            const response = await axios.post('https://nutritional-values.mooo.com/api/upload', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });

            // Handle the response from the server
            console.log(response.data);

            setRequestId(response.data.requestId); // Store the request ID
        } catch (error) {
            // Handle any errors that occurred during the request
            console.error('Error uploading image:', error);
        } finally {
            setLoading(false);
        }
    };

    // Function to check the processing results
    const checkResults = async () => {
        try {
            const response = await axios.get(`https://nutritional-values.mooo.com/api/result/${requestId}`);

            if (response.status === 200) {
                const result = response.data;
                // Handle the result
                console.log(result);
                navigate('/SegmentsAndLabel', { state: { responseData: result } }); // Pass response data as state while navigating
            } else {
                console.error('Error retrieving processing results:', response.data.message);
            }
        } catch (error) {
            console.error('Error retrieving processing results:', error);
        }
    };

    return (
        <div style={{ backgroundColor: '#262626', color: '#fff', minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', overflowY: 'auto' }}>
            <Container style={{ backgroundColor: '#333', borderRadius: '1rem', padding: '1rem 2rem 2rem', maxWidth: '27rem', display: 'flex', flexDirection: 'column', justifyContent: 'flex-start' }}>
                <Row className="justify-content-center" >
                    <Col sm={12}>
                        <p style={{ fontSize: '2rem', textShadow: '2px 2px 4px #000' }}><b>Instructions:</b></p>
                        <ol>
                            <li>Choose an image from your gallery or take a new picture to upload for analysis.</li>
                            <li>Please isolate and display only the plate in the uploaded image for the best results.</li>
                            <li>Analysis of your image might take up to two minutes, depending on the volume and ingredients on your plate.</li>
                            <li>After clicking on the "Upload Image" button, a "Check Results" button will appear. Click it to see if your results are ready to be displayed (please be patient, as mentioned above, this may take a couple of minutes).</li>
                        </ol>
                    </Col>
                    <Col sm={12}>
                        <b style={{ marginBottom: '1rem', textAlign: 'center', fontSize: '3rem', textShadow: '2px 2px 4px #000' }}>Image Analyzer</b>
                        <Form>
                            <Form.Group controlId="imageUpload">
                                <Form.Control type="file" accept="image/*" style={{ marginTop: '1rem', marginBottom: '1rem' }} onChange={handleImageUpload} disabled={loading || requestId !== null} />
                            </Form.Group>
                            <Button variant="outline-light" style={{ width: '100%', fontSize: '1.125rem' }} onClick={uploadImage} disabled={loading || requestId !== null}>
                                {loading ? <Spinner animation="border" size="sm" /> : 'Upload Image'}
                            </Button>
                            {requestId && (
                                <Button variant="outline-light" style={{ width: '100%', fontSize: '1.125rem', marginTop: '1rem' }} onClick={checkResults}>
                                    Check Results
                                </Button>
                            )}
                        </Form>
                    </Col>
                </Row>
            </Container>
        </div>
    );
}

export default ImageUploader;
