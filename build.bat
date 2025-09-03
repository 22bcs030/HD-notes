@echo off

:: Build the frontend
echo Building frontend...
cd frontend
call npm run build

:: Build the backend
echo Building backend...
cd ../backend
call npm run build

echo Build process completed!
