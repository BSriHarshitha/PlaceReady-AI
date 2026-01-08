@echo off
echo Starting PlaceReady AI Development Server...
echo.

cd frontend
echo Installing dependencies...
call npm install

echo.
echo Starting React development server...
echo Open http://localhost:3000 in your browser
echo.

call npm start

pause