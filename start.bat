@echo off
title Astro Vastu Setu Server
echo ========================================================
echo        Astro Vastu Setu - E-Commerce System
echo ========================================================
echo.
echo Starting Node.js Backend Server connected to MongoDB...
echo.
echo Website is live at:     http://localhost:5000
echo Admin Panel is live at: http://localhost:5000/admin
echo.
echo Press Ctrl+C to stop the server anytime.
echo ========================================================
echo.
cd /d "%~dp0backend"
node server.js
pause
