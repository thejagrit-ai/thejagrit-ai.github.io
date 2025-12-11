#!/bin/bash
# Stop script for Heart Disease Prediction System

echo "Stopping Heart Disease Prediction System..."

# Stop backend
if [ -f logs/backend.pid ]; then
    kill $(cat logs/backend.pid) 2>/dev/null
    rm logs/backend.pid
    echo "✓ Backend stopped"
fi

# Stop frontend
if [ -f logs/frontend.pid ]; then
    kill $(cat logs/frontend.pid) 2>/dev/null
    rm logs/frontend.pid
    echo "✓ Frontend stopped"
fi

# Kill any remaining processes
pkill -f "python.*run.py" 2>/dev/null
pkill -f "react-scripts start" 2>/dev/null

echo "✓ All services stopped"
