import { useLocation } from 'react-router-dom';

function SegmentsAndLabel() {
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

export default SegmentsAndLabel;
