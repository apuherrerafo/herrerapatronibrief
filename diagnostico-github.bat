@echo off
cd /d "%~dp0"
echo === Diagnostico GitHub ===
echo.

set "GITDIR="
if exist "C:\Program Files\Git\cmd" set "GITDIR=C:\Program Files\Git\cmd"
if exist "%LOCALAPPDATA%\Programs\Git\cmd" set "GITDIR=%LOCALAPPDATA%\Programs\Git\cmd"
if defined GITDIR (
  set "PATH=%GITDIR%;%PATH%"
  echo [OK] Git encontrado en: %GITDIR%
) else (
  echo [ERROR] Git NO encontrado en:
  echo   - C:\Program Files\Git\cmd
  echo   - %%LOCALAPPDATA%%\Programs\Git\cmd
  echo.
  echo Instala Git desde https://git-scm.com/download/win
  echo o indica donde esta instalado para actualizar push-github.bat
  goto :fin
)

echo.
echo Comprobando comando git...
git --version 2>nul
if errorlevel 1 (
  echo [ERROR] git --version fallo
  goto :fin
)
echo.

if not exist ".git" (
  echo Inicializando repo...
  git init
  git branch -M main
  git remote add origin https://github.com/apuherrerafo/herrerapatronibrief.git
  echo.
)

echo Estado del remoto:
git remote -v
echo.
echo Intentando: git add . ...
git add .
echo.
echo Intentando: git commit ...
git commit -m "Update H&P Brief" --allow-empty
echo.
echo Intentando: git push ...
echo (Si pide usuario/contraseña: usa tu usuario de GitHub y un Personal Access Token como contraseña)
echo.
git push -u origin main
if errorlevel 1 (
  echo.
  echo [FALLO] git push devolvio error.
  echo - Si pide autenticacion: en GitHub.com ^> Settings ^> Developer settings ^> Personal access tokens, crea un token con permiso "repo" y usalo como contraseña.
  echo - Si dice "repository not found": comprueba que el repo https://github.com/apuherrerafo/herrerapatronibrief existe y tienes permiso.
)

:fin
echo.
pause
