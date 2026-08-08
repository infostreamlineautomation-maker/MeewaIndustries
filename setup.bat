@echo off
echo ===================================================
echo Setting up MEEWA B2B Export Platform
echo ===================================================

echo [1/4] Checking prerequisites...
where py >nul 2>nul
if %errorlevel% neq 0 (
    echo Python is not installed or not in PATH! Please install Python.
    exit /b 1
)
where npm >nul 2>nul
if %errorlevel% neq 0 (
    echo Node.js/npm is not installed or not in PATH! Please install Node.js.
    exit /b 1
)

echo [2/4] Setting up Backend...
if not exist "backend" mkdir backend
cd backend
if not exist "venv" (
    echo Creating Python virtual environment...
    py -m venv venv
)
echo Activating venv and installing dependencies...
call venv\Scripts\activate.bat
pip install fastapi uvicorn sqlalchemy alembic psycopg2-binary
echo Initializing Alembic...
if not exist "alembic" (
    alembic init alembic
)
cd ..

echo [3/4] Setting up Frontend (Public and Admin)...
if not exist "frontend" (
    echo Creating Next.js public frontend...
    call npx -y create-next-app@latest frontend --typescript --tailwind --eslint --app --src-dir --import-alias "@/*" --use-npm
) else (
    echo Public frontend directory already exists.
    cd frontend
    call npm install
    cd ..
)

if not exist "admin_frontend" (
    echo Creating Next.js admin frontend...
    call npx -y create-next-app@latest admin_frontend --typescript --tailwind --eslint --app --src-dir --import-alias "@/*" --use-npm
) else (
    echo Admin frontend directory already exists.
    cd admin_frontend
    call npm install
    cd ..
)

echo ===================================================
echo Setup Complete!
echo Run 'run.bat' to start the development servers.
echo ===================================================
pause
