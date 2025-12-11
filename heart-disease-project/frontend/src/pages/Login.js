import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const Login = () => {
  const [formData, setFormData] = useState({ username: '', password: '' });
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const result = await login(formData.username, formData.password);
    setLoading(false);
    
    if (result.success) {
      toast.success('Login successful!');
      navigate('/predict');
    } else {
      toast.error(result.error);
    }
  };

  return (
    <div className="prediction-container">
      <div className="prediction-form">
        <h2 className="text-center mb-4">Login</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Username</label>
            <input
              type="text"
              className="form-input"
              value={formData.username}
              onChange={(e) => setFormData({...formData, username: e.target.value})}
              required
            />
          </div>
          <div className="form-group">
            <label className="form-label">Password</label>
            <input
              type="password"
              className="form-input"
              value={formData.password}
              onChange={(e) => setFormData({...formData, password: e.target.value})}
              required
            />
          </div>
          <button type="submit" className="btn btn-primary" style={{width: '100%'}} disabled={loading}>
            {loading ? 'Logging in...' : 'Login'}
          </button>
          <p className="text-center mt-3">
            Don't have an account? <Link to="/register">Register here</Link>
          </p>
          <p className="text-center mt-2" style={{fontSize: '14px', color: '#6b7280'}}>
            Demo credentials: admin/admin123 or demo/demo123
          </p>
        </form>
      </div>
    </div>
  );
};

export default Login;
