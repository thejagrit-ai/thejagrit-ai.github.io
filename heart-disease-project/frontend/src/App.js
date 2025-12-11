import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

// Components
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Prediction from './pages/Prediction';
import BatchPrediction from './pages/BatchPrediction';
import DiseaseInfo from './pages/DiseaseInfo';
import Analytics from './pages/Analytics';
import AdminDashboard from './pages/AdminDashboard';
import Developers from './pages/Developers';

// Context
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';

import './App.css';

function App() {
  return (
    <AuthProvider>
      <ThemeProvider>
        <Router>
          <div className="App">
            <Navbar />
            <main className="main-content">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/predict" element={<Prediction />} />
                <Route path="/batch-predict" element={<BatchPrediction />} />
                <Route path="/disease-info" element={<DiseaseInfo />} />
                <Route path="/analytics" element={<Analytics />} />
                <Route path="/admin" element={<AdminDashboard />} />
                <Route path="/developers" element={<Developers />} />
              </Routes>
            </main>
            <Toaster position="top-right" />
          </div>
        </Router>
      </ThemeProvider>
    </AuthProvider>
  );
}

export default App;
