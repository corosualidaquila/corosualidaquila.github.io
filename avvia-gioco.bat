@echo off
cd /d "%~dp0"
start "Server coro" /min cmd /c "py server.py"
timeout /t 2 /nobreak >nul
start "" "http://127.0.0.1:8001/index.html"
