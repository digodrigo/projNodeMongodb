@echo off
cd /d "%~dp0"
start "Frontend" cmd /k "npm run dev"
start "Backend" cmd /k "npm run server"
