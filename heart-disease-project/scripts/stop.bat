@echo off
echo Stopping Heart Disease Prediction System...

taskkill /F /IM python.exe /FI "WINDOWTITLE eq Heart Disease Backend*" 2>nul
taskkill /F /IM node.exe /FI "WINDOWTITLE eq Heart Disease Frontend*" 2>nul

echo All services stopped
pause
