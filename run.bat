@echo off
echo ===================================================
echo Starting MEEWA B2B Platform
echo ===================================================
echo This will start both the FastAPI backend and Next.js frontend.
echo Press Ctrl+C in this terminal to gracefully shut down both servers.
echo.

:: Check if python virtual environment and dependencies exist
if not exist "backend\venv\Scripts\uvicorn.exe" (
    echo [INFO] Python virtual environment or dependencies missing. Setting up now...
    cd backend
    if not exist "venv\Scripts\activate.bat" (
        py -m venv venv
    )
    call venv\Scripts\activate.bat
    echo [INFO] Installing requirements...
    python -m pip install -r requirements.txt
    cd ..
)

echo Starting MEEWA services concurrently...
call npx -y concurrently "cd backend && call venv\Scripts\activate.bat && python -m uvicorn main:app --reload --reload-exclude venv --port 8000" "cd frontend && npm run dev -- -p 3000" "cd backend && call venv\Scripts\activate.bat && python -m uvicorn admin_main:app --reload --reload-exclude venv --port 8001" "cd admin_frontend && npm run dev -- -p 3001" --kill-others --names "API,WEB,ADMIN_API,ADMIN_WEB" --prefix-colors "blue,green,magenta,yellow"
