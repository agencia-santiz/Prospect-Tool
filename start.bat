@echo off
echo ==========================================
echo    Iniciando Bloom Leads (Front + Back)
echo ==========================================

:: Inicia o Backend em uma nova janela
echo [1/2] Iniciando Backend...
start "Bloom Leads - Backend" cmd /k "npm run backend"

:: Inicia o Frontend em uma nova janela
echo [2/2] Iniciando Frontend...
start "Bloom Leads - Frontend" cmd /k "npm run dev"

echo.
echo Servidores em processo de inicializacao!
echo Frontend: http://localhost:3000
echo Backend:  http://127.0.0.1:8787
echo.
pause
