import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import toast from 'react-hot-toast';

const Prediction = () => {
  const [formData, setFormData] = useState({
    age: '', sex: '', cp: '', trestbps: '', chol: '',
    fbs: '', restecg: '', thalach: '', exang: '',
    oldpeak: '', slope: '', ca: '', thal: ''
  });
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const featureInfo = {
    age: 'Age in years',
    sex: 'Sex (1 = male; 0 = female)',
    cp: 'Chest pain type (0-3)',
    trestbps: 'Resting blood pressure (mm Hg)',
    chol: 'Serum cholesterol (mg/dl)',
    fbs: 'Fasting blood sugar > 120 mg/dl (1 = true; 0 = false)',
    restecg: 'Resting electrocardiographic results (0-2)',
    thalach: 'Maximum heart rate achieved',
    exang: 'Exercise induced angina (1 = yes; 0 = no)',
    oldpeak: 'ST depression induced by exercise',
    slope: 'Slope of peak exercise ST segment (0-2)',
    ca: 'Number of major vessels colored by fluoroscopy (0-4)',
    thal: 'Thalassemia (0-3)'
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    const data = {};
    Object.keys(formData).forEach(key => {
      data[key] = parseFloat(formData[key]);
    });
    
    try {
      const response = await api.post('/predict', data);
      setResult(response.data);
      toast.success('Prediction successful!');
    } catch (error) {
      toast.error(error.response?.data?.error || 'Prediction failed');
    }
    setLoading(false);
  };

  if (result) {
    return (
      <div className="result-container">
        <div className="result-card">
          <h2>Prediction Result</h2>
          <div className={`risk-badge risk-${result.risk_level.toLowerCase()}`}>
            Risk Level: {result.risk_level}
          </div>
          <p style={{fontSize: '18px', marginTop: '20px'}}>
            Probability: <strong>{(result.probability * 100).toFixed(2)}%</strong>
          </p>
          <p style={{marginTop: '20px'}}>
            Prediction: <strong>{result.prediction === 1 ? 'Positive' : 'Negative'}</strong>
          </p>
          <button onClick={() => setResult(null)} className="btn btn-primary mt-4">
            Make Another Prediction
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="prediction-container">
      <div className="prediction-form">
        <h2 className="text-center mb-4">Heart Disease Prediction</h2>
        <p className="text-center mb-4">Enter the clinical parameters below</p>
        <form onSubmit={handleSubmit}>
          <div className="form-row">
            {Object.keys(formData).map(key => (
              <div key={key} className="form-group">
                <label className="form-label" title={featureInfo[key]}>
                  {key.toUpperCase()} ℹ️
                </label>
                <input
                  type="number"
                  step="any"
                  className="form-input"
                  value={formData[key]}
                  onChange={(e) => setFormData({...formData, [key]: e.target.value})}
                  required
                />
              </div>
            ))}
          </div>
          <button type="submit" className="btn btn-primary" style={{width: '100%'}} disabled={loading}>
            {loading ? 'Predicting...' : 'Predict'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Prediction;
