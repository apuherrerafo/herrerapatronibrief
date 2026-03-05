@echo off
cd /d "%~dp0"
set NODEDIR=
if exist "C:\Program Files\nodejs\node.exe" set NODEDIR=C:\Program Files\nodejs
if exist "%LOCALAPPDATA%\Programs\node\node.exe" set NODEDIR=%LOCALAPPDATA%\Programs\node
if defined NODEDIR (
  set "PATH=%NODEDIR%;%PATH%"
  "%NODEDIR%\npx.cmd" --yes serve -l 8080
) else (
  npx --yes serve -l 8080
)
