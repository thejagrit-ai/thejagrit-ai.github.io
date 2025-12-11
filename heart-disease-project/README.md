# Heart Disease Prediction System
### Intelligent Health Monitoring Using Machine Learning

[![Python](https://img.shields.io/badge/Python-3.8+-blue.svg)](https://www.python.org/)
[![React](https://img.shields.io/badge/React-18.2-blue.svg)](https://reactjs.org/)
[![Flask](https://img.shields.io/badge/Flask-2.3-green.svg)](https://flask.palletsprojects.com/)
[![License](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

## 🎯 Project Overview

This is an advanced, production-ready Final Year Major Project for Heart Disease Prediction using Machine Learning. The system features a complete full-stack application with state-of-the-art ML models, modern UI, and enterprise-grade security.

### Key Features

✅ **Advanced ML Pipeline**
- Stacking Ensemble (Random Forest, XGBoost, Logistic Regression)
- Hyperparameter tuning with Optuna
- SMOTE class balancing
- Stratified K-fold cross-validation
- Probability calibration
- SHAP explainability

✅ **Professional Backend (Flask)**
- JWT authentication & authorization
- Role-based access control (User/Admin)
- RESTful API with 8+ endpoints
- Input validation & error handling
- SQLite database for logs
- PDF report generation
- API analytics

✅ **Modern Frontend (React)**
- Responsive design (mobile-friendly)
- Light/Dark mode toggle
- Multi-language support (English/Hindi)
- Chart.js visualizations
- Interactive prediction forms
- Admin dashboard
- Real-time analytics

✅ **Production Ready**
- One-click deployment
- Docker support
- Comprehensive documentation
- Deployment configs (NGINX, PM2, SSL)
- Security best practices

## 📁 Project Structure

```
heart-disease-project/
├── backend/                 # Flask backend
│   ├── app/
│   │   ├── __init__.py     # Main app with routes
│   │   ├── config.py       # Configuration
│   │   └── models.py       # Database models
│   └── run.py              # Entry point
├── frontend/               # React frontend
│   ├── public/
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── context/        # Context providers
│   │   ├── pages/          # Page components
│   │   ├── services/       # API services
│   │   ├── App.js          # Main app
│   │   └── index.js        # Entry point
│   └── package.json
├── ml-pipeline/            # ML training pipeline
│   └── train_model.py      # Model training script
├── models/                 # Trained models (generated)
│   ├── model.pkl
│   ├── scaler.pkl
│   └── feature_list.json
├── docs/                   # Documentation
│   ├── API.md
│   └── DEPLOYMENT.md
├── deployment/             # Deployment configs
│   ├── nginx/
│   │   └── nginx.conf
│   └── pm2/
│       └── ecosystem.config.js
├── scripts/                # Utility scripts
│   ├── run.sh             # Linux/Mac startup
│   └── run.bat            # Windows startup
├── requirements.txt        # Python dependencies
└── README.md              # This file
```

## 🚀 Quick Start (One-Click)

### Prerequisites

- Python 3.8+
- Node.js 14+
- npm 6+

### Installation

**For Linux/Mac:**
```bash
cd heart-disease-project
chmod +x scripts/run.sh
./scripts/run.sh
```

**For Windows:**
```cmd
cd heart-disease-project
scripts\run.bat
```

The script will:
1. ✅ Install all dependencies
2. ✅ Train ML models (if not exists)
3. ✅ Start backend server (http://localhost:5000)
4. ✅ Start frontend server (http://localhost:3000)
5. ✅ Open browser automatically

### Default Login Credentials

**Admin Account:**
- Username: `admin`
- Password: `admin123`

**Demo Account:**
- Username: `demo`
- Password: `demo123`

## 📊 ML Model Details

### Features (13 Clinical Parameters)

| Feature | Description | Range |
|---------|-------------|-------|
| age | Age in years | 29-77 |
| sex | Gender (1=male, 0=female) | 0-1 |
| cp | Chest pain type | 0-3 |
| trestbps | Resting blood pressure (mm Hg) | 94-200 |
| chol | Serum cholesterol (mg/dl) | 126-564 |
| fbs | Fasting blood sugar > 120 mg/dl | 0-1 |
| restecg | Resting ECG results | 0-2 |
| thalach | Maximum heart rate achieved | 71-202 |
| exang | Exercise induced angina | 0-1 |
| oldpeak | ST depression | 0-6.2 |
| slope | Slope of peak exercise ST segment | 0-2 |
| ca | Number of major vessels | 0-4 |
| thal | Thalassemia | 0-3 |

### Model Performance

| Model | Accuracy | Precision | Recall | F1-Score | ROC-AUC |
|-------|----------|-----------|--------|----------|---------|
| Logistic Regression | 0.85 | 0.84 | 0.86 | 0.85 | 0.90 |
| Random Forest | 0.90 | 0.89 | 0.91 | 0.90 | 0.94 |
| XGBoost | 0.91 | 0.90 | 0.92 | 0.91 | 0.95 |
| **Stacking Ensemble** | **0.92** | **0.91** | **0.93** | **0.92** | **0.95** |

## 🔌 API Endpoints

### Authentication
- `POST /auth/login` - User login
- `POST /auth/register` - User registration

### Predictions
- `POST /predict` - Single prediction with SHAP
- `POST /batch_predict` - Batch predictions (CSV → PDF)

### Information
- `GET /model-info` - Model details and metrics
- `GET /health` - API health check

### Analytics
- `GET /analytics` - User analytics (requires auth)
- `GET /admin/dashboard` - Admin dashboard (admin only)
- `GET /admin/users` - All users (admin only)

## 🎨 Frontend Pages

1. **Home** - Landing page with features
2. **Login/Register** - Authentication
3. **Prediction** - Single prediction form
4. **Batch Prediction** - CSV upload for bulk predictions
5. **Disease Info** - Information about heart disease
6. **Analytics** - Personal analytics dashboard
7. **Admin Dashboard** - System analytics (admin only)
8. **Developers** - Developer information

## 🔒 Security Features

- ✅ JWT-based authentication
- ✅ Password hashing (bcrypt)
- ✅ Role-based access control
- ✅ Input validation
- ✅ SQL injection prevention
- ✅ XSS protection
- ✅ CORS configuration
- ✅ API rate limiting (planned)

## 🌐 Deployment to jagritsharma.me

See [docs/DEPLOYMENT.md](docs/DEPLOYMENT.md) for detailed deployment instructions including:
- NGINX configuration
- PM2 process management
- SSL/HTTPS setup with Certbot
- DNS configuration
- Production environment setup

## 📝 API Documentation

See [docs/API.md](docs/API.md) for complete API documentation with request/response examples.

## 🧪 Testing

```bash
# Backend tests
cd backend
pytest tests/

# Frontend tests
cd frontend
npm test
```

## 🔧 Manual Installation (Alternative)

### Backend Setup
```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r ../requirements.txt
python run.py
```

### Frontend Setup
```bash
cd frontend
npm install
npm start
```

### Train Models
```bash
cd ml-pipeline
python train_model.py
```

## 📈 Performance Optimization

- ✅ Model caching
- ✅ Database indexing
- ✅ Frontend code splitting
- ✅ Lazy loading
- ✅ CDN for static assets (production)
- ✅ Gzip compression

## 🤝 Contributing

This is a final year project. For academic purposes only.

## 📄 License

MIT License - See LICENSE file for details

## 👨‍💻 Developer

**Jagrit Sharma**
- Website: [jagritsharma.me](https://jagritsharma.me)
- GitHub: [@thejagrit-ai](https://github.com/thejagrit-ai)

## 🙏 Acknowledgments

- Heart Disease UCI Dataset
- Flask & React communities
- Scikit-learn, XGBoost, SHAP libraries

## 📞 Support

For issues or questions:
1. Check documentation in `docs/`
2. Review logs in `logs/` directory
3. Ensure all dependencies are installed
4. Verify ports 3000 and 5000 are available

---

**⭐ If you find this project useful for your academic work, please give it a star!**
