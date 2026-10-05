@echo off
cd /d "%~dp0"
echo ==========================================
echo TRAVYN WEBSITE SERVER
echo ==========================================
if not exist node_modules (
  echo Installing required packages...
  npm install
)
echo Starting server on http://localhost:3000 ...
start "" "http://localhost:3000"
npm start
pause
