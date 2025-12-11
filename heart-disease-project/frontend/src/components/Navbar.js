import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { FaSun, FaMoon, FaLanguage } from 'react-icons/fa';

const Navbar = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const { theme, toggleTheme, language, toggleLanguage } = useTheme();

  const translations = {
    en: {
      home: 'Home',
      predict: 'Predict',
      batch: 'Batch Upload',
      info: 'Disease Info',
      analytics: 'Analytics',
      admin: 'Admin',
      developers: 'Developers',
      login: 'Login',
      register: 'Register',
      logout: 'Logout'
    },
    hi: {
      home: 'होम',
      predict: 'भविष्यवाणी',
      batch: 'बैच अपलोड',
      info: 'रोग जानकारी',
      analytics: 'विश्लेषण',
      admin: 'व्यवस्थापक',
      developers: 'डेवलपर्स',
      login: 'लॉगिन',
      register: 'पंजीकरण',
      logout: 'लॉगआउट'
    }
  };

  const t = translations[language];

  return (
    <nav className="navbar">
      <div className="navbar-content">
        <Link to="/" className="navbar-brand">
          ❤️ Heart Disease Prediction
        </Link>
        
        <ul className="navbar-nav">
          <li><Link to="/" className="nav-link">{t.home}</Link></li>
          {isAuthenticated && (
            <>
              <li><Link to="/predict" className="nav-link">{t.predict}</Link></li>
              <li><Link to="/batch-predict" className="nav-link">{t.batch}</Link></li>
              <li><Link to="/disease-info" className="nav-link">{t.info}</Link></li>
              <li><Link to="/analytics" className="nav-link">{t.analytics}</Link></li>
              {user?.role === 'admin' && (
                <li><Link to="/admin" className="nav-link">{t.admin}</Link></li>
              )}
            </>
          )}
          <li><Link to="/developers" className="nav-link">{t.developers}</Link></li>
          
          <li>
            <span className="theme-toggle" onClick={toggleTheme}>
              {theme === 'light' ? <FaMoon /> : <FaSun />}
            </span>
          </li>
          
          <li>
            <span className="theme-toggle" onClick={toggleLanguage}>
              <FaLanguage /> {language.toUpperCase()}
            </span>
          </li>
          
          {isAuthenticated ? (
            <li>
              <button onClick={logout} className="btn btn-primary">
                {t.logout}
              </button>
            </li>
          ) : (
            <>
              <li><Link to="/login" className="btn btn-primary">{t.login}</Link></li>
              <li><Link to="/register" className="btn btn-secondary">{t.register}</Link></li>
            </>
          )}
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
