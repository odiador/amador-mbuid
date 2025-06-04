import { Navigate, Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import Navigation from './components/Navigation';
import UIGeneratorPage from './pages/UIGeneratorPage';
import UMLEditorPage from './pages/UMLEditorPage';

function App() {
  return (
    <Router>
      <div style={{ minHeight: '100vh', background: '#f9fafb' }}>
        <Navigation />
        <Routes>
          <Route path="/" element={<Navigate to="/uml-editor" replace />} />
          <Route path="/uml-editor" element={<UMLEditorPage />} />
          <Route path="/ui-generator" element={<UIGeneratorPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;