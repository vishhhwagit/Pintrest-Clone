@echo off
title Pinverse
cd /d "%~dp0"
echo.
echo  Starting Pinverse...
echo  Open http://localhost:3000 in your browser
echo  Demo login: demo@pinverse.app / demo1234
echo.
call npm run dev
pause
