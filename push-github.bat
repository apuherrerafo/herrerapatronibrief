@echo off
cd /d "%~dp0"
set "GITDIR="
if exist "C:\Program Files\Git\cmd" set "GITDIR=C:\Program Files\Git\cmd"
if exist "%LOCALAPPDATA%\Programs\Git\cmd" set "GITDIR=%LOCALAPPDATA%\Programs\Git\cmd"
if exist "C:\Program Files (x86)\Git\cmd" set "GITDIR=C:\Program Files (x86)\Git\cmd"
if defined GITDIR set "PATH=%GITDIR%;%PATH%"

set REMOTE=https://github.com/apuherrerafo/herrerapatronibrief.git
if not exist ".git" (
  git init
  git branch -M main
  git remote add origin %REMOTE%
)
git add .
git commit -m "Update H&P Brief" --allow-empty
if errorlevel 1 exit /b 1
git push -u origin main
if errorlevel 1 (
  echo.
  echo Si pide usuario/contraseña: usa tu usuario de GitHub y un Personal Access Token como contraseña.
  echo Crear token: GitHub.com - Settings - Developer settings - Personal access tokens - repo
  pause
  exit /b 1
)
