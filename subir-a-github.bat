@echo off
cd /d "%~dp0"
set REMOTE=https://github.com/apuherrerafo/herrerapatronibrief.git

if not exist ".git" (
  git init
  git branch -M main
  git remote add origin %REMOTE%
)

git add .
git status
echo.
echo Si todo se ve bien, se hara commit y push.
pause
git commit -m "H&P Brief: formulario clientes + panel admin"
git push -u origin main
pause
