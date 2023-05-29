import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import ImageUploader from './ImageUploader';
import SegmentsAndLabel from './SegmentsAndLabel';
import DisplayResults from './DisplayResults';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<ImageUploader />} />
        <Route path="/SegmentsAndLabel" element={<SegmentsAndLabel />} />
        <Route path="/DisplayResults" element={<DisplayResults />} />
      </Routes>
    </Router>
  );
}

export default App;
