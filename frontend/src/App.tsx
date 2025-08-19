import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import WhatsAppPage from '@/pages/WhatsAppPage';
import ConfiguracaoPage from '@/pages/ConfiguracaoPage';
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<WhatsAppPage />} />
          <Route path="/configuracao" element={<ConfiguracaoPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
