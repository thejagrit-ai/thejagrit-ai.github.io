import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FaHeartbeat, FaChartLine, FaUpload, FaShieldAlt, FaUserMd, FaRobot } from 'react-icons/fa';

const Home = () => {
  const { isAuthenticated } = useAuth();

  return (
    <div className="home">
      <section className="hero">
        <div className="container">
          <h1>Heart Disease Prediction System</h1>
          <p>AI-Powered Intelligent Health Monitoring</p>
          <p>Advanced Machine Learning for Early Detection</p>
          {!isAuthenticated ? (
            <div style={{ marginTop: '30px' }}>
              <Link to="/register" className="btn btn-primary" style={{ marginRight: '15px' }}>
                Get Started
              </Link>
              <Link to="/login" className="btn btn-secondary">
                Login
              </Link>
            </div>
          ) : (
            <Link to="/predict" className="btn btn-primary" style={{ marginTop: '30px' }}>
              Make a Prediction
            </Link>
          )}
        </div>
      </section>

      <section className="features">
        <div className="container">
          <h2 className="text-center mb-4">Advanced Features</h2>
          <div className="features-grid">
            <div className="card feature-card">
              <div className="feature-icon"><FaRobot /></div>
              <h3>AI-Powered Predictions</h3>
              <p>Stacking ensemble with Random Forest, XGBoost, and Logistic Regression</p>
            </div>

            <div className="card feature-card">
              <div className="feature-icon"><FaChartLine /></div>
              <h3>SHAP Explainability</h3>
              <p>Understand which factors contribute most to the prediction</p>
            </div>

            <div className="card feature-card">
              <div className="feature-icon"><FaUpload /></div>
              <h3>Batch Processing</h3>
              <p>Upload CSV files for bulk predictions with PDF reports</p>
            </div>

            <div className="card feature-card">
              <div className="feature-icon"><FaShieldAlt /></div>
              <h3>Secure & Private</h3>
              <p>JWT authentication with role-based access control</p>
            </div>

            <div className="card feature-card">
              <div className="feature-icon"><FaUserMd /></div>
              <h3>Clinical Grade</h3>
              <p>Trained on comprehensive heart disease datasets</p>
            </div>

            <div className="card feature-card">
              <div className="feature-icon"><FaHeartbeat /></div>
              <h3>Real-time Analytics</h3>
              <p>Track predictions and monitor health trends over time</p>
            </div>
          </div>
        </div>
      </section>

      <section style={{ padding: '80px 20px', background: '#f9fafb' }}>
        <div className="container text-center">
          <h2>How It Works</h2>
          <div className="grid grid-3" style={{ marginTop: '40px' }}>
            <div className="card">
              <h3>1. Input Data</h3>
              <p>Enter 13 clinical parameters including age, blood pressure, cholesterol, etc.</p>
            </div>
            <div className="card">
              <h3>2. AI Analysis</h3>
              <p>Our ML models analyze the data and generate predictions with explanations</p>
            </div>
            <div className="card">
              <h3>3. Get Results</h3>
              <p>Receive risk assessment with probability scores and actionable insights</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
