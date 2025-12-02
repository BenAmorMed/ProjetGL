@echo off
echo Setting up environment...
set "PATH=%PATH%;C:\Program Files\nodejs"
echo Path updated. Checking Node version:
node -v
echo Checking NPM version:
call npm -v
cd frontend
echo Starting frontend...
call npm run dev
pause
