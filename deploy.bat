@echo off

echo ===== Checking Prerequisites =====
where npm >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
  echo Node.js and npm are required. Please install them first.
  echo Visit: https://nodejs.org/
  exit /b 1
)

echo ===== Building the application =====
cd frontend
call npm run build
cd ..\backend
call npm run build
cd ..

echo ===== Creating environment files if needed =====
if not exist backend\.env (
  echo Creating backend .env file
  copy backend\.env.sample backend\.env
  echo Please update the values in backend\.env with your production settings!
)

if not exist frontend\.env.production (
  echo Creating frontend .env.production file
  echo REACT_APP_API_URL=http://localhost:8000/api > frontend\.env.production
  echo Please update the REACT_APP_API_URL in frontend\.env.production with your production backend URL!
)

echo ===== Deployment preparation complete! =====
echo Next steps:
echo 1. Update environment variables in backend\.env and frontend\.env.production
echo 2. Deploy the backend by running: node backend\dist\index.js
echo 3. Serve the frontend from: frontend\build
echo.
echo For more deployment options and detailed instructions, see DEPLOYMENT.md
