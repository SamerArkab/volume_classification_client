import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Container, Row, Col, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

function SegmentsAndLabel() {
    const [imageUrls, setImageUrls] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [currentData, setCurrentData] = useState(null); // State to store current data
    const [currentVolume, setCurrentVolume] = useState(null); // State to store current volume
    const navigate = useNavigate();
    const [newTitle, setNewTitle] = useState('');
    const [isPopupVisible, setIsPopupVisible] = useState(false);

    const location = useLocation();
    const responseData = location.state ? location.state.responseData : {};

    useEffect(() => {
        // Fetch the list of image filenames from the server
        fetch('https://nutritional-values.mooo.com/api/images')
            .then(response => response.json())
            .then(data => {
                // Filter the filenames that start with "segmented_"
                const filteredData = data.filter(filename => filename.startsWith('segmented_'));
                // Construct the image URLs based on the server URL and the filenames
                const urls = filteredData.map(filename => `https://nutritional-values.mooo.com/uploads/${filename}`);
                setImageUrls(urls);
            })
            .catch(error => {
                console.error('Error fetching images:', error);
            });

        if (responseData.img_volume_label_nut_val && responseData.img_volume_label_nut_val.length > 0) {
            setCurrentData(toTitleCase(responseData.img_volume_label_nut_val[2][0]));
            setCurrentVolume(responseData.img_volume_label_nut_val[1]);
        }
    }, [responseData.img_volume_label_nut_val]);

    // Method to go to next image
    const nextImage = () => {
        if (currentIndex < imageUrls.length - 1) {
            setCurrentIndex(currentIndex + 1); // `Set` is inside the scope of the `nextImage` function, `currentIndex` isn't really changed yet (only after we're outside the function's scope it will update)
            const data = responseData.img_volume_label_nut_val[(currentIndex + 1) * 3 + 2][0]; // Therefore, when I use `currentIndex`, increment it by 1 here too
            setCurrentData(toTitleCase(data));
            const volume = responseData.img_volume_label_nut_val[(currentIndex + 1) * 3 + 1];
            setCurrentVolume(volume);
        }
        else {
            console.log(responseData);
            navigate('/DisplayResults', { state: { responseData } });
        }
    };

    // Method to go to previous image
    const prevImage = () => {
        if (currentIndex > 0) {
            setCurrentIndex(currentIndex - 1);
            const data = responseData.img_volume_label_nut_val[(currentIndex - 1) * 3 + 2][0];
            setCurrentData(toTitleCase(data));
            const volume = responseData.img_volume_label_nut_val[(currentIndex - 1) * 3 + 1];
            setCurrentVolume(volume);
        }
    };

    const toTitleCase = (str) => {
        return str
            .split('_')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
            .join(' ');
    };

    const deleteImage = () => {
        // Get the filename of the current image
        const filename = imageUrls[currentIndex].split('/').pop();

        // Send DELETE request to server
        fetch(`https://nutritional-values.mooo.com/api/delete/${filename}`, {
            method: 'DELETE',
        })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    // Remove the image URL from the list
                    const updatedUrls = imageUrls.filter((url, index) => index !== currentIndex);
                    setImageUrls(updatedUrls);

                    // Remove the corresponding data from responseData.img_volume_label_nut_val
                    const updatedData = [...responseData.img_volume_label_nut_val];
                    updatedData.splice(currentIndex * 3, 3); // Remove 3 items starting from currentIndex * 3
                    location.state.responseData.img_volume_label_nut_val = updatedData;

                    // Move to the previous image, or to the next one if it was the first image
                    if (currentIndex > 0) {
                        setCurrentIndex(prevIndex => prevIndex - 1);
                        const data = toTitleCase(updatedData[(currentIndex - 1) * 3 + 2][0]);
                        setCurrentData(data);
                    } else if (updatedUrls.length > 0) {
                        const data = toTitleCase(updatedData[0][0]);
                        setCurrentData(data);
                    } else {
                        setCurrentData(null);
                    }

                    console.log('Successfully deleted.');
                } else {
                    console.error('Failed to delete image:', data.message);
                }
            })
            .catch(error => {
                console.error('Error sending DELETE request:', error);
            });
    };

    const openPopup = () => {
        setNewTitle(currentData);  // Initialize the new title with the current title
        setIsPopupVisible(true);
    };

    const handleEdit = async () => {
        if (newTitle.trim() !== '') {
            // Modify the newTitle: replace spaces with underscores and convert to lowercase
            const modifiedNewTitle = newTitle.trim().toLowerCase().replace(/ /g, '_');

            // Prepare the data to send in the request body
            const requestData = {
                newName: modifiedNewTitle,
                updatedData: responseData.img_volume_label_nut_val[currentIndex * 3 + 1] // Include volume value
            };

            // Send POST request to server to update the label
            const response = await fetch(`https://nutritional-values.mooo.com/api/edit`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(requestData),
            });

            if (response.ok) {
                // If the request was successful, update the data in the UI
                const updatedData = await response.json();
                const currentDataArray = responseData.img_volume_label_nut_val[currentIndex * 3 + 2];
                updatedData.forEach((value, i) => {
                    currentDataArray[i] = value;
                });
                location.state.responseData.img_volume_label_nut_val[currentIndex * 3 + 2] = currentDataArray;
                setCurrentData(toTitleCase(newTitle));
                setIsPopupVisible(false);
                console.log('Successfully edited.');
            } else {
                console.error('Failed to update title:', await response.text());
            }
        }
    };

    const handleInputChange = (event) => {
        setNewTitle(event.target.value);
    };

    return (
        <div style={{ backgroundColor: '#262626', minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'flex-start', overflowY: 'auto', color: '#fff' }}>
            <Container style={{ backgroundColor: '#333', borderRadius: '1rem', padding: '1rem 2rem 2rem', maxWidth: '27rem', display: 'flex', flexDirection: 'column', justifyContent: 'flex-start', position: 'relative', paddingTop: '2rem', marginTop: '1rem', marginBottom: '1rem' }}>
                <Row className="justify-content-center" style={{ marginBottom: '1rem' }}>
                    <Col xs={4} md={4} style={{ textAlign: 'left' }}>
                        <img src="delete_icon.png" alt="Delete Icon" style={{ height: '2rem', marginRight: '1rem', cursor: imageUrls.length > 0 ? 'pointer' : 'default' }} onClick={imageUrls.length > 0 ? deleteImage : null} />
                        <img src="edit_icon.png" alt="Edit Icon" style={{ height: '2rem', marginRight: '1rem', cursor: imageUrls.length > 0 ? 'pointer' : 'default' }} onClick={imageUrls.length > 0 ? openPopup : null} />
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

                <Row className="justify-content-center" style={{ marginBottom: '1rem' }}>
                    <Col xs={12} style={{ textAlign: 'center' }}>
                        <b style={{
                            fontSize: '1.5rem',
                            textShadow: '2px 2px 4px #000',
                        }}>
                            Volume: {parseFloat(currentVolume).toFixed(2)} ml
                        </b>
                    </Col>
                </Row>

                {isPopupVisible && (
                    <div style={{
                        position: 'fixed',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        backgroundColor: '#615e5e',
                        padding: '2rem',
                        borderRadius: '10px',
                        zIndex: 1000, // This needs to be a high number to make sure it appears above all other content
                    }}>
                        <h2>Fix Food's Name</h2>
                        <input type="text" value={newTitle} onChange={handleInputChange} />
                        <div>
                            <Button variant="secondary" onClick={() => setIsPopupVisible(false)}>
                                Close
                            </Button>
                            <Button variant="primary" onClick={handleEdit}>
                                Save Changes
                            </Button>
                        </div>
                    </div>
                )}

                <Row className="justify-content-center">
                    <Col xs={12} md={8}>
                        {imageUrls.length > 0 && (
                            <div>
                                <img src={imageUrls[currentIndex]} alt={`#${currentIndex}`} style={{ width: '100%', height: 'auto', marginBottom: '2rem' }} />
                                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                    {currentIndex > 0 ? (
                                        <Button variant="outline-light" style={{ minWidth: '4rem', fontSize: '1.125rem' }} onClick={prevImage}>Prev</Button>
                                    ) : (
                                        <div style={{ minWidth: '4rem' }}></div> // This is a placeholder that will take up the same space as the button
                                    )}
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
