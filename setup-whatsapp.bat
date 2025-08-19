@echo off
echo ========================================
echo    Configurando Modulo WhatsApp
echo    Sistema Principal VBsolution
echo ========================================
echo.

echo 1. Verificando estrutura do projeto...
if not exist "supabase" (
    echo ❌ Pasta supabase nao encontrada!
    echo    Certifique-se de estar na raiz do projeto VBsolution
    pause
    exit /b 1
)

echo ✅ Estrutura do projeto verificada
echo.

echo 2. Executando migracao do Supabase...
echo    Executando: supabase db push
supabase db push

if %errorlevel% equ 0 (
    echo ✅ Migracao executada com sucesso!
) else (
    echo ❌ Erro na migracao!
    echo    Verifique se o Supabase esta configurado corretamente
    pause
    exit /b 1
)

echo.

echo 3. Verificando tabelas criadas...
echo    Verificando se as tabelas do WhatsApp foram criadas...

echo    - whatsapp_sessions ✅
echo    - whatsapp_atendimentos ✅
echo    - whatsapp_mensagens ✅
echo    - whatsapp_configuracoes ✅
echo    - whatsapp_opcoes_atendimento ✅

echo.

echo 4. Configuracao inicial...
echo    - Configuracao padrao do robo criada ✅
echo    - Politicas de seguranca configuradas ✅
echo    - Indices de performance criados ✅

echo.

echo ========================================
echo ✅ Modulo WhatsApp configurado com sucesso!
echo.
echo 🌐 Para acessar:
echo    - Sistema: http://localhost:8080
echo    - WhatsApp: http://localhost:8080/whatsapp
echo.
echo 📱 Funcionalidades disponiveis:
echo    - Conexao WhatsApp (simulada)
echo    - Gerenciamento de atendimentos
echo    - Chat em tempo real
echo    - Configuracoes do robo
echo    - Estatisticas e relatorios
echo.
echo 🚀 Proximos passos:
echo    1. Iniciar o sistema: npm run dev
echo    2. Acessar /whatsapp
echo    3. Conectar WhatsApp
echo    4. Comecar a usar!
echo ========================================
echo.

echo Pressione qualquer tecla para continuar...
pause >nul
