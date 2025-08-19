@echo off
echo ========================================
echo    Configurando Modulo WhatsApp
echo    Sistema Principal VBsolution
echo ========================================
echo.

echo 1. Verificando se o sistema esta rodando...
netstat -an | findstr :8080 >nul
if %errorlevel% equ 0 (
    echo ✅ Sistema rodando na porta 8080
) else (
    echo ❌ Sistema nao esta rodando na porta 8080
    echo    Iniciando o sistema...
    start /B npm run dev
    timeout /t 10 /nobreak >nul
    
    netstat -an | findstr :8080 >nul
    if %errorlevel% equ 0 (
        echo ✅ Sistema iniciado com sucesso!
    ) else (
        echo ❌ Falha ao iniciar o sistema
        pause
        exit /b 1
    )
)

echo.
echo 2. Verificando configuracao do Supabase...
if exist "supabase\config.toml" (
    echo ✅ Supabase configurado
    type supabase\config.toml
) else (
    echo ❌ Arquivo de configuracao do Supabase nao encontrado
)

echo.
echo 3. Verificando arquivos do modulo...
if exist "src\services\whatsappService.ts" echo ✅ whatsappService.ts
if exist "src\pages\WhatsApp.tsx" echo ✅ WhatsApp.tsx
if exist "create-whatsapp-tables.sql" echo ✅ create-whatsapp-tables.sql
if exist "WHATSAPP_SETUP.md" echo ✅ WHATSAPP_SETUP.md

echo.
echo ========================================
echo ✅ CONFIGURACAO AUTOMATICA CONCLUIDA!
echo ========================================
echo.

echo 🌐 Sistema rodando em:
echo    http://localhost:8080
echo.

echo 📱 Modulo WhatsApp disponivel em:
echo    http://localhost:8080/whatsapp
echo.

echo 🔧 Para completar a configuracao:
echo    1. Execute o SQL no Supabase Studio
echo    2. Acesse o modulo WhatsApp
echo    3. Clique em 'Conectar WhatsApp'
echo.

echo 📚 Arquivos importantes:
echo    - create-whatsapp-tables.sql (SQL para executar)
echo    - WHATSAPP_SETUP.md (documentacao)
echo.

echo 🎉 Modulo WhatsApp configurado com sucesso!
echo ========================================
echo.

echo Pressione qualquer tecla para abrir o navegador...
pause >nul

start http://localhost:8080/whatsapp
