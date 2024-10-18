// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Register from './components/Auth/Register';
import Login from './components/Auth/Login';
import Dashboard from './components/Dashboard/Dashboard';
import TopUp from './components/Payment/TopUp';

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/topup" element={<TopUp />} />
            </Routes>
        </Router>
    );
}

export default App;
