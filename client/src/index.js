import React from 'react';
import ReactDOM from 'react-dom/client';
import './assets/index.css';
import Homepage from './pages/Home/Homepage';
import Sites from './pages/Sites/Sites';
import Analytics from './pages/Analytics/Analytics';
import History from './pages/History/History';
import Navbar from './components/ui/navbar'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Router>
      <Navbar/>
      <Routes>
        <Route exact path="/" element={<Homepage />}/>
        <Route exact path='/sites' element={<Sites />}/>
        <Route exact path='/analytics' element={<Analytics />}/>
        <Route exact path='/history' element={<History />}/>
      </Routes>
    </Router>
  </React.StrictMode>
);