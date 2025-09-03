@echo off
echo GitHub Profile Data Fetcher
echo ==========================

REM Check if Python is installed
python --version >nul 2>&1
if errorlevel 1 (
    echo Python is not installed or not in PATH
    echo Please install Python from https://python.org
    pause
    exit /b 1
)

REM Install requirements
echo Installing required packages...
pip install -r requirements.txt

REM Run the script
echo.
echo Starting GitHub profile fetcher...
python github_profile_fetcher.py

echo.
echo Press any key to exit...
pause >nul
