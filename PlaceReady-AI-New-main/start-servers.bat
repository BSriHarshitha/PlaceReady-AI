@echo off
echo Starting PlaceReady AI Backend and Frontend...

echo Installing backend dependencies...
cd backend
call npm install
start "Backend Server" cmd /k "npm start"

echo Installing frontend dependencies...
cd ../frontend
call npm install
start "Frontend Server" cmd /k "npm start"

echo Both servers are starting...
echo Backend: http://localhost:5000
echo Frontend: http://localhost:3000
pause