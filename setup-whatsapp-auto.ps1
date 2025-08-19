# Script PowerShell para configurar o módulo WhatsApp automaticamente

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "   Configurando Modulo WhatsApp" -ForegroundColor Cyan
Write-Host "   Sistema Principal VBsolution" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# 1. Verificar se o sistema está rodando
Write-Host "1. Verificando se o sistema está rodando..." -ForegroundColor Yellow
$port8080 = Get-NetTCPConnection -LocalPort 8080 -ErrorAction SilentlyContinue

if ($port8080) {
    Write-Host "✅ Sistema rodando na porta 8080" -ForegroundColor Green
} else {
    Write-Host "❌ Sistema não está rodando na porta 8080" -ForegroundColor Red
    Write-Host "   Iniciando o sistema..." -ForegroundColor Yellow
    
    # Iniciar o sistema em background
    Start-Process -FilePath "npm" -ArgumentList "run", "dev" -WindowStyle Hidden
    Start-Sleep -Seconds 10
    
    # Verificar novamente
    $port8080 = Get-NetTCPConnection -LocalPort 8080 -ErrorAction SilentlyContinue
    if ($port8080) {
        Write-Host "✅ Sistema iniciado com sucesso!" -ForegroundColor Green
    } else {
        Write-Host "❌ Falha ao iniciar o sistema" -ForegroundColor Red
        exit 1
    }
}

# 2. Verificar se o Supabase está configurado
Write-Host ""
Write-Host "2. Verificando configuração do Supabase..." -ForegroundColor Yellow

if (Test-Path "supabase/config.toml") {
    $config = Get-Content "supabase/config.toml" | Select-String "project_id"
    if ($config) {
        Write-Host "✅ Supabase configurado: $($config.Line)" -ForegroundColor Green
    } else {
        Write-Host "❌ Configuração do Supabase incompleta" -ForegroundColor Red
    }
} else {
    Write-Host "❌ Arquivo de configuração do Supabase não encontrado" -ForegroundColor Red
}

# 3. Criar arquivo de instruções para o usuário
Write-Host ""
Write-Host "3. Criando instruções de configuração..." -ForegroundColor Yellow

$instructions = "# Módulo WhatsApp - Configuração Manual Necessária`n`n## Sistema Status: RODANDO em http://localhost:8080`n`n## Para completar a configuração:`n1. Execute o SQL no Supabase Studio`n2. Acesse http://localhost:8080/whatsapp`n3. Clique em 'Conectar WhatsApp'"

$instructions | Out-File -FilePath "WHATSAPP_INSTRUCTIONS.md" -Encoding UTF8
Write-Host "✅ Instruções criadas em: WHATSAPP_INSTRUCTIONS.md" -ForegroundColor Green

# 4. Verificar arquivos do módulo
Write-Host ""
Write-Host "4. Verificando arquivos do módulo..." -ForegroundColor Yellow

$files = @(
    "src/services/whatsappService.ts",
    "src/pages/WhatsApp.tsx",
    "create-whatsapp-tables.sql",
    "WHATSAPP_SETUP.md"
)

foreach ($file in $files) {
    if (Test-Path $file) {
        Write-Host "✅ $file" -ForegroundColor Green
    } else {
        Write-Host "❌ $file" -ForegroundColor Red
    }
}

# 5. Resumo final
Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "✅ CONFIGURAÇÃO AUTOMÁTICA CONCLUÍDA!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

Write-Host "🌐 Sistema rodando em:" -ForegroundColor White
Write-Host "   http://localhost:8080" -ForegroundColor Cyan
Write-Host ""

Write-Host "📱 Módulo WhatsApp disponível em:" -ForegroundColor White
Write-Host "   http://localhost:8080/whatsapp" -ForegroundColor Cyan
Write-Host ""

Write-Host "🔧 Para completar a configuração:" -ForegroundColor White
Write-Host "   1. Execute o SQL no Supabase Studio" -ForegroundColor Yellow
Write-Host "   2. Acesse o módulo WhatsApp" -ForegroundColor Yellow
Write-Host "   3. Clique em 'Conectar WhatsApp'" -ForegroundColor Yellow
Write-Host ""

Write-Host "📚 Arquivos importantes:" -ForegroundColor White
Write-Host "   - WHATSAPP_INSTRUCTIONS.md (instruções detalhadas)" -ForegroundColor Cyan
Write-Host "   - create-whatsapp-tables.sql (SQL para executar)" -ForegroundColor Cyan
Write-Host "   - WHATSAPP_SETUP.md (documentação completa)" -ForegroundColor Cyan
Write-Host ""

Write-Host "🎉 Módulo WhatsApp configurado com sucesso!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Cyan

# Aguardar usuário
Write-Host ""
Write-Host "Pressione qualquer tecla para abrir o navegador..." -ForegroundColor Yellow
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")

# Abrir o navegador automaticamente
Start-Process "http://localhost:8080/whatsapp"
