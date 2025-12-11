@echo off
REM One-Click Start Script for Windows
REM Heart Disease Prediction System

echo ==========================================
echo Heart Disease Prediction System
echo One-Click Startup Script
echo ==========================================
echo.

REM Get script directory
set SCRIPT_DIR=%~dp0
set PROJECT_DIR=%SCRIPT_DIR%..

echo Project Directory: %PROJECT_DIR%
echo.

REM Check if Python is installed
python --version >nul 2>&1
if errorlevel 1 (
    echo Error: Python is not installed
    echo Please install Python 3.8 or higher
    pause
    exit /b 1
)

REM Check if Node.js is installed
node --version >nul 2>&1
if errorlevel 1 (
    echo Error: Node.js is not installed
    echo Please install Node.js 14 or higher
    pause
    exit /b 1
)

REM Check if npm is installed
npm --version >nul 2>&1
if errorlevel 1 (
    echo Error: npm is not installed
    echo Please install npm
    pause
    exit /b 1
)

echo [OK] Python and Node.js are installed
echo.

REM Step 1: Install Python dependencies
echo ==========================================
echo Step 1: Installing Python dependencies
echo ==========================================
cd /d %PROJECT_DIR%

if not exist "venv" (
    echo Creating virtual environment...
    python -m venv venv
)

call venv\Scripts\activate.bat

echo Installing requirements...
python -m pip install --upgrade pip setuptools wheel
pip install -r requirements.txt

echo [OK] Python dependencies installed
echo.

REM Step 2: Train ML models if not exists
echo ==========================================
echo Step 2: Checking ML models
echo ==========================================

if not exist "%PROJECT_DIR%\models\model.pkl" (
    echo Training ML models (this may take a few minutes)...
    cd /d %PROJECT_DIR%\ml-pipeline
    python train_model.py
    echo [OK] Models trained successfully
) else (
    echo [OK] Models already exist
)
echo.

REM Step 3: Install frontend dependencies
echo ==========================================
echo Step 3: Installing frontend dependencies
echo ==========================================
cd /d %PROJECT_DIR%\frontend

if not exist "node_modules" (
    echo Installing npm packages...
    call npm install
    echo [OK] Frontend dependencies installed
) else (
    echo [OK] Frontend dependencies already installed
)
echo.

REM Create logs directory
if not exist "%PROJECT_DIR%\logs" mkdir "%PROJECT_DIR%\logs"

REM Step 4: Start backend server
echo ==========================================
echo Step 4: Starting backend server
echo ==========================================
cd /d %PROJECT_DIR%\backend

start "Heart Disease Backend" cmd /c "python run.py > ..\logs\backend.log 2>&1"
echo [OK] Backend server starting on http://localhost:5000
echo.

timeout /t 5 /nobreak >nul

REM Step 5: Start frontend server
echo ==========================================
echo Step 5: Starting frontend server
echo ==========================================
cd /d %PROJECT_DIR%\frontend

start "Heart Disease Frontend" cmd /c "npm start > ..\logs\frontend.log 2>&1"
echo [OK] Frontend server starting on http://localhost:3000
echo.

REM Step 6: Open browser
echo ==========================================
echo Opening browser...
echo ==========================================

timeout /t 5 /nobreak >nul

start http://localhost:3000

echo.
echo ==========================================
echo [OK] Application is running!
echo ==========================================
echo.
echo Access the application at:
echo   Frontend: http://localhost:3000
echo   Backend:  http://localhost:5000
echo.
echo Login credentials:
echo   Admin: admin / admin123
echo   Demo:  demo / demo123
echo.
echo To stop the servers, close the backend and frontend windows
echo or press Ctrl+C in each window
echo.
pause
