import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import ImageUploader from './ImageUploader';
import SegmentsAndLabel from './SegmentsAndLabel';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<ImageUploader />} />
        <Route path="/SegmentsAndLabel" element={<SegmentsAndLabel />} />
      </Routes>
    </Router>
  );
}

export default App;
