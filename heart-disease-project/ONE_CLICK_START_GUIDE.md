# 🚀 ONE-CLICK START GUIDE
## Heart Disease Prediction System - Quick Setup

This guide will help you get the entire system running in **under 5 minutes**!

---

## ⚡ Prerequisites Check

Before starting, ensure you have:

### Required Software
- ✅ **Python 3.8 or higher** - [Download](https://www.python.org/downloads/)
- ✅ **Node.js 14 or higher** - [Download](https://nodejs.org/)
- ✅ **npm** (comes with Node.js)

### Verify Installation
```bash
# Check Python
python --version  # or python3 --version

# Check Node.js
node --version

# Check npm
npm --version
```

---

## 🎯 Method 1: One-Click Start (Recommended)

### For Linux/Mac Users

1. **Extract the ZIP file**
   ```bash
   unzip heart-disease-project.zip
   cd heart-disease-project
   ```

2. **Make script executable**
   ```bash
   chmod +x scripts/run.sh
   ```

3. **Run the script**
   ```bash
   ./scripts/run.sh
   ```

That's it! The script will:
- Install all dependencies
- Train ML models
- Start backend server
- Start frontend server
- Open your browser automatically

### For Windows Users

1. **Extract the ZIP file**
   - Right-click `heart-disease-project.zip`
   - Select "Extract All..."
   - Navigate to extracted folder

2. **Run the script**
   - Double-click `scripts\run.bat`
   - OR open Command Prompt and run:
   ```cmd
   cd heart-disease-project
   scripts\run.bat
   ```

The script handles everything automatically!

---

## 🌐 Access the Application

Once the script completes, the application will be available at:

### URLs
- **Frontend (User Interface)**: http://localhost:3000
- **Backend (API Server)**: http://localhost:5000

### Default Login Credentials

**Admin Account** (Full Access):
- Username: `admin`
- Password: `admin123`

**Demo Account** (User Access):
- Username: `demo`
- Password: `demo123`

---

## 📖 What Happens During Setup?

### Step 1: Dependency Installation (2-3 minutes)
```
✓ Creating Python virtual environment
✓ Installing Python packages (Flask, scikit-learn, etc.)
✓ Installing Node.js packages (React, axios, etc.)
```

### Step 2: ML Model Training (1-2 minutes)
```
✓ Generating/loading dataset
✓ Training Random Forest model
✓ Training XGBoost model
✓ Training Logistic Regression model
✓ Creating stacking ensemble
✓ Saving models to disk
```

### Step 3: Server Startup (10 seconds)
```
✓ Starting Flask backend on port 5000
✓ Starting React frontend on port 3000
✓ Opening browser
```

---

## 🎮 Using the Application

### 1. Login
- Open http://localhost:3000
- Click "Login"
- Use credentials: `admin` / `admin123`

### 2. Make a Prediction
- Click "Predict" in navigation
- Fill in the 13 clinical parameters
- Click "Predict" button
- View results with risk level and probability

### 3. Batch Predictions
- Click "Batch Upload"
- Upload a CSV file with patient data
- Download PDF report with predictions

### 4. View Analytics
- Click "Analytics"
- See your prediction history
- View risk distribution charts

### 5. Admin Dashboard (Admin Only)
- Click "Admin"
- View system statistics
- Monitor all users and predictions

---

## 🛠️ Method 2: Manual Setup (Alternative)

If the one-click script doesn't work, follow these steps:

### Step 1: Install Backend Dependencies
```bash
cd heart-disease-project

# Create virtual environment
python -m venv venv

# Activate virtual environment
# On Linux/Mac:
source venv/bin/activate
# On Windows:
venv\Scripts\activate

# Install requirements
pip install -r requirements.txt
```

### Step 2: Train ML Models
```bash
cd ml-pipeline
python train_model.py
cd ..
```

### Step 3: Start Backend
```bash
cd backend
python run.py
# Backend will start on http://localhost:5000
```

### Step 4: Install Frontend Dependencies (New Terminal)
```bash
cd frontend
npm install
```

### Step 5: Start Frontend
```bash
npm start
# Frontend will start on http://localhost:3000
```

---

## ❌ Troubleshooting

### Issue: Port Already in Use

**Backend (Port 5000):**
```bash
# Linux/Mac
lsof -ti:5000 | xargs kill -9

# Windows
netstat -ano | findstr :5000
taskkill /PID <PID> /F
```

**Frontend (Port 3000):**
```bash
# Linux/Mac
lsof -ti:3000 | xargs kill -9

# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F
```

### Issue: Python Not Found
- Ensure Python 3.8+ is installed
- Try `python3` instead of `python`
- Add Python to system PATH

### Issue: Node/npm Not Found
- Install Node.js from nodejs.org
- Restart terminal/command prompt
- Verify with `node --version`

### Issue: Permission Denied (Linux/Mac)
```bash
chmod +x scripts/run.sh
sudo ./scripts/run.sh
```

### Issue: Module Not Found
```bash
# Reinstall dependencies
pip install -r requirements.txt
cd frontend && npm install
```

### Issue: Models Not Loading
```bash
# Retrain models
cd ml-pipeline
python train_model.py
```

---

## 🔄 Stopping the Application

### Linux/Mac
```bash
# Press Ctrl+C in the terminal
# OR kill processes
kill $(cat logs/backend.pid logs/frontend.pid)
```

### Windows
- Close the backend and frontend command windows
- OR press Ctrl+C in each window

---

## 📊 Project Structure

```
heart-disease-project/
├── backend/          ← Flask API
├── frontend/         ← React UI
├── ml-pipeline/      ← Model training
├── models/           ← Trained models
├── scripts/          ← Startup scripts
├── docs/             ← Documentation
└── deployment/       ← Deploy configs
```

---

## 🎓 For Academic Evaluation

### Key Features to Demonstrate

1. **Advanced ML Pipeline**
   - Show models/ directory with trained models
   - Explain stacking ensemble approach
   - Demonstrate SHAP explainability

2. **Full-Stack Implementation**
   - Show backend API endpoints
   - Demonstrate responsive frontend
   - Show JWT authentication

3. **Production Readiness**
   - One-click deployment
   - Comprehensive documentation
   - Security features

4. **Extra Features**
   - Dark mode toggle
   - Multi-language support
   - Admin dashboard
   - PDF report generation
   - Real-time analytics

---

## 📝 Important Notes

1. **First Run**: Initial setup takes 3-5 minutes due to model training
2. **Subsequent Runs**: Only ~30 seconds as models are cached
3. **Data Privacy**: All data is stored locally (SQLite database)
4. **Port Requirements**: Ensure ports 3000 and 5000 are available
5. **Internet**: Required for initial dependency installation

---

## 🆘 Need Help?

1. Check `logs/backend.log` for backend errors
2. Check `logs/frontend.log` for frontend errors
3. Read `README.md` for detailed documentation
4. Check `docs/API.md` for API documentation
5. See `docs/DEPLOYMENT.md` for deployment guide

---

## ✅ Verification Checklist

After setup, verify:

- [ ] Backend is running: http://localhost:5000/health
- [ ] Frontend is accessible: http://localhost:3000
- [ ] Can login with demo credentials
- [ ] Can make a prediction
- [ ] Models are loaded (no errors in logs)
- [ ] Database file created: backend/heart_disease.db

---

## 🎉 Success!

If you see the homepage and can login, you're all set!

**Next Steps:**
1. Explore all features
2. Try making predictions
3. Check admin dashboard
4. Review the code structure
5. Read deployment guide for production

---

**⚡ Tip**: For faster subsequent runs, keep the virtual environment activated and don't delete node_modules!

**🌟 For Production**: See `docs/DEPLOYMENT.md` for deploying to jagritsharma.me
