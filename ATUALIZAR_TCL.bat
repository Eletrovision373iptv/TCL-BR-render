@echo off
title Robo TCL TV - Eletrovision
cls

echo ======================================================
echo    INICIANDO ATUALIZACAO TCL / LG CHANNELS
echo ======================================================
echo.

:: ENTRA NA PASTA DA TCL
cd /d "C:\Users\Uso\Desktop\tcl BR"

:: 1. GERA A LISTA
echo [PASSO 1/3] Gerando lista TCL M3U...
python gerar_tcl.py

:: 2. SALVA NO GIT
echo.
echo [PASSO 2/3] Gravando mudancas...
git add .
git commit -m "Atualizacao TCL TV"

:: 3. ENVIA PARA O GITHUB
echo.
echo [PASSO 3/3] Enviando para o GitHub...
git push origin main --force

echo.
echo ======================================================
echo    SUCESSO! Painel TCL Atualizado.
echo ======================================================
pause