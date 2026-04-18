@echo off
title LUXE Jewelry - Full Stack Launcher
color 0A

echo.
echo  ========================================
echo   LUXE Jewelry - Starting Full Stack
echo  ========================================
echo.

:: Step 0: Start XAMPP MySQL if not running
echo  [0/2] Checking MySQL...
netstat -an | findstr ":3306" >nul 2>&1
if errorlevel 1 (
    echo  Starting XAMPP MySQL...
    start /B "" "C:\xampp\mysql\bin\mysqld.exe" --defaults-file="C:\xampp\mysql\bin\my.ini"
    echo  Waiting for MySQL to be ready...
    :WAIT_MYSQL
    timeout /t 2 /nobreak >nul
    netstat -an | findstr ":3306" >nul 2>&1
    if errorlevel 1 goto WAIT_MYSQL
    echo  MySQL is ready!
) else (
    echo  MySQL is already running.
)
echo.

:: Start Backend (FastAPI with uvicorn)
echo  [1/2] Starting Backend (FastAPI)...
start "LUXE Backend" cmd /k "cd /d %~dp0jewelry-backend && call venv\Scripts\activate && uvicorn main:app --reload --host 0.0.0.0 --port 8000"

:: Wait a moment for backend to initialize
timeout /t 3 /nobreak >nul

:: Start Frontend (Next.js)
echo  [2/2] Starting Frontend (Next.js)...
start "LUXE Frontend" cmd /k "cd /d %~dp0jewelry-store && npm run dev"

echo.
echo  ========================================
echo   All servers are starting!
echo  ----------------------------------------
echo   MySQL:    localhost:3306 (XAMPP)
echo   Backend:  http://localhost:8000
echo   Frontend: http://localhost:3000
echo  ========================================
echo.
echo  Press any key to close this launcher...
echo  (The servers will keep running)
pause >nul
