@echo off
cd /d "%~dp0"
echo Iniciando servidor en http://localhost:8080 ...
start "" cmd /c "timeout /t 3 /nobreak >nul && start http://localhost:8080"
call servidor-fullpath.bat
pause
