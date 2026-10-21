@echo off
title J.A.R.V.I.S. // Age of Ultron Holographic Screensaver Launcher
set "INDEX_PATH=file:///%~dp0index.html"
set "INDEX_PATH=%INDEX_PATH:\=/%"

echo [J.A.R.V.I.S.] Initializing Mark XLIII Holographic Neural Matrix Screensaver...

where msedge >nul 2>nul
if %ERRORLEVEL% EQU 0 (
    start "" msedge --kiosk "%INDEX_PATH%" --edge-kiosk-type=fullscreen --no-first-run
    exit /b 0
)

where chrome >nul 2>nul
if %ERRORLEVEL% EQU 0 (
    start "" chrome --kiosk --app="%INDEX_PATH%"
    exit /b 0
)

start "" "%~dp0index.html"
