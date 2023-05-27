//import { useLocation } from 'react-router-dom';
import React, { useEffect, useState } from 'react';

function SegmentsAndLabel() {
    const [imageUrls, setImageUrls] = useState([]);

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
  
    return (
      <div>
        <h1>Image Display</h1>
        {imageUrls.map((imageUrl, index) => (
          <div key={index}>
            <img src={imageUrl} alt={`# ${index}`} />
          </div>
        ))}
      </div>
    );
  }
    /*
    const location = useLocation();
    const responseData = location.state?.responseData;

    return (
        <div style={{ backgroundColor: '#262626', height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', color: '#fff' }}>
            <h1>Other Page</h1>
            {responseData && (
                <div>
                    <h2>Response Data:</h2>
                    <pre>{JSON.stringify(responseData, null, 2)}</pre>
                </div>
            )}
        </div>
    );
}
*/
export default SegmentsAndLabel;
