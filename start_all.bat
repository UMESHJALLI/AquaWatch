@echo off
title AquaWatch — Satellite Water Body & River Discharge Monitoring
color 0B

echo.
echo  ========================================================================
echo   🌊 AquaWatch — Satellite Water Body & River Discharge Monitoring
echo   IEEE ESCI 2026 Prototype · Multi-Source Optical/SAR Fusion & Discharge
echo  ========================================================================
echo.

:: Detect Python executable
set "PYTHON_EXE="
if exist "C:\Users\jalliumesh\anaconda3\python.exe" (
    set "PYTHON_EXE=C:\Users\jalliumesh\anaconda3\python.exe"
) else (
    where python >nul 2>&1
    if not errorlevel 1 (
        set "PYTHON_EXE=python"
    )
)

if "%PYTHON_EXE%"=="" (
    echo  [ERROR] Python 3.11+ was not found on your system!
    echo  Please ensure Python is installed and added to PATH.
    pause
    exit /b 1
)

echo  [OK] Using Python: %PYTHON_EXE%

:: Check Node.js
where node >nul 2>&1
if errorlevel 1 (
    echo  [ERROR] Node.js was not found. Please install Node.js 18+ from https://nodejs.org
    pause
    exit /b 1
)
echo  [OK] Node.js detected.

echo.
echo  [1/3] Starting FastAPI Backend on port 8000...
start "AquaWatch Backend" cmd /k "cd /d "%~dp0backend" && "%PYTHON_EXE%" -m uvicorn app.main:app --port 8000 --reload"

echo  [2/3] Starting React Frontend on port 5173...
start "AquaWatch Frontend" cmd /k "cd /d "%~dp0frontend" && npm run dev"

echo.
echo  [3/3] Waiting for servers to initialize...
timeout /t 5 /nobreak >nul

echo.
echo  ========================================================================
echo   AquaWatch is now running!
echo.
echo   - Web Dashboard:     http://localhost:5173
echo   - FastAPI Backend:   http://localhost:8000
echo   - Interactive Docs:  http://localhost:8000/docs
echo  ========================================================================
echo.

start http://localhost:5173

echo  Both backend and frontend terminals are running in separate windows.
echo  To shut down AquaWatch, simply close those two command prompt windows.
echo.
pause
