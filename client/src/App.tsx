import './App.css';
import Login from '@/pages/login';
import Register from '@/pages/register';
import Messenger from '@/pages/messenger';

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/" element={<Messenger />} />
      </Routes>
    </Router>
  );
}

export default App;
