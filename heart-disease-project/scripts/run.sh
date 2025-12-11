#!/bin/bash
# One-Click Start Script for Linux/Mac
# Heart Disease Prediction System

echo "=========================================="
echo "Heart Disease Prediction System"
echo "One-Click Startup Script"
echo "=========================================="
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Get script directory
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
PROJECT_DIR="$(dirname "$SCRIPT_DIR")"

echo -e "${YELLOW}Project Directory: $PROJECT_DIR${NC}"
echo ""

# Check if Python is installed
if ! command -v python3 &> /dev/null; then
    echo -e "${RED}Error: Python 3 is not installed${NC}"
    echo "Please install Python 3.8 or higher"
    exit 1
fi

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo -e "${RED}Error: Node.js is not installed${NC}"
    echo "Please install Node.js 14 or higher"
    exit 1
fi

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo -e "${RED}Error: npm is not installed${NC}"
    echo "Please install npm"
    exit 1
fi

echo -e "${GREEN}✓ Python and Node.js are installed${NC}"
echo ""

# Step 1: Install Python dependencies
echo "=========================================="
echo "Step 1: Installing Python dependencies"
echo "=========================================="
cd "$PROJECT_DIR"

if [ ! -d "venv" ]; then
    echo "Creating virtual environment..."
    python3 -m venv venv
fi

source venv/bin/activate

echo "Installing requirements..."
pip install --upgrade pip setuptools wheel
pip install -r requirements.txt

echo -e "${GREEN}✓ Python dependencies installed${NC}"
echo ""

# Step 2: Train ML models if not exists
echo "=========================================="
echo "Step 2: Checking ML models"
echo "=========================================="

if [ ! -f "$PROJECT_DIR/models/model.pkl" ]; then
    echo "Training ML models (this may take a few minutes)..."
    cd "$PROJECT_DIR/ml-pipeline"
    python train_model.py
    echo -e "${GREEN}✓ Models trained successfully${NC}"
else
    echo -e "${GREEN}✓ Models already exist${NC}"
fi
echo ""

# Step 3: Install frontend dependencies
echo "=========================================="
echo "Step 3: Installing frontend dependencies"
echo "=========================================="
cd "$PROJECT_DIR/frontend"

if [ ! -d "node_modules" ]; then
    echo "Installing npm packages..."
    npm install
    echo -e "${GREEN}✓ Frontend dependencies installed${NC}"
else
    echo -e "${GREEN}✓ Frontend dependencies already installed${NC}"
fi
echo ""

# Step 4: Start backend server
echo "=========================================="
echo "Step 4: Starting backend server"
echo "=========================================="
cd "$PROJECT_DIR/backend"

# Start backend in background
python run.py > ../logs/backend.log 2>&1 &
BACKEND_PID=$!
echo "Backend PID: $BACKEND_PID"
echo $BACKEND_PID > ../logs/backend.pid

# Wait for backend to start
echo "Waiting for backend to start..."
sleep 5

if ps -p $BACKEND_PID > /dev/null; then
    echo -e "${GREEN}✓ Backend server started on http://localhost:5000${NC}"
else
    echo -e "${RED}✗ Backend failed to start. Check logs/backend.log${NC}"
fi
echo ""

# Step 5: Start frontend server
echo "=========================================="
echo "Step 5: Starting frontend server"
echo "=========================================="
cd "$PROJECT_DIR/frontend"

# Start frontend in background
npm start > ../logs/frontend.log 2>&1 &
FRONTEND_PID=$!
echo "Frontend PID: $FRONTEND_PID"
echo $FRONTEND_PID > ../logs/frontend.pid

echo -e "${GREEN}✓ Frontend server starting on http://localhost:3000${NC}"
echo ""

# Step 6: Open browser
echo "=========================================="
echo "Opening browser..."
echo "=========================================="

sleep 3

if command -v xdg-open &> /dev/null; then
    xdg-open http://localhost:3000
elif command -v open &> /dev/null; then
    open http://localhost:3000
else
    echo "Please open http://localhost:3000 in your browser"
fi

echo ""
echo "=========================================="
echo -e "${GREEN}✓ Application is running!${NC}"
echo "=========================================="
echo ""
echo "Access the application at:"
echo "  Frontend: http://localhost:3000"
echo "  Backend:  http://localhost:5000"
echo ""
echo "To stop the servers, run: ./scripts/stop.sh"
echo "or press Ctrl+C and then run: kill \$(cat logs/backend.pid logs/frontend.pid)"
echo ""
echo "Login credentials:"
echo "  Admin: admin / admin123"
echo "  Demo:  demo / demo123"
echo ""

# Keep script running
wait
