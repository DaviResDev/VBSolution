# Como Executar a Aplicação no Windows

## Problema do PowerShell
No Windows PowerShell, o operador `&&` não é válido. Use um dos métodos abaixo:

## Método 1: Comandos Separados
```powershell
# Navegar para o diretório
cd vb-solution-master

# Executar a aplicação
npm run dev
```

## Método 2: Usando Semicolon
```powershell
cd vb-solution-master; npm run dev
```

## Método 3: Usando Command Prompt (cmd)
```cmd
cd vb-solution-master && npm run dev
```

## Método 4: Usando Git Bash
```bash
cd vb-solution-master && npm run dev
```

## Passos Completos

### 1. Abrir Terminal
- **PowerShell**: Pressione `Win + X` e selecione "Windows PowerShell"
- **Command Prompt**: Pressione `Win + R`, digite `cmd` e pressione Enter
- **Git Bash**: Se instalado, procure por "Git Bash" no menu

### 2. Navegar para o Projeto
```powershell
cd "C:\Users\DAVI RESENDE\Downloads\vb-solution-master\vb-solution-master"
```

### 3. Verificar se está no Diretório Correto
```powershell
dir
# Deve mostrar arquivos como package.json, src/, etc.
```

### 4. Instalar Dependências (se necessário)
```powershell
npm install
```

### 5. Executar a Aplicação
```powershell
npm run dev
```

## Resultado Esperado
```
  VITE v5.x.x  ready in xxx ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
  ➜  press h to show help
```

## Acessar a Aplicação
1. Abra o navegador
2. Acesse: `http://localhost:5173/`
3. Faça login ou crie uma conta
4. Navegue para `/activities`
5. Teste clicando em uma tarefa

## Troubleshooting

### Erro: "npm não é reconhecido"
- Instale o Node.js: https://nodejs.org/
- Reinicie o terminal após a instalação

### Erro: "permission denied"
- Execute o PowerShell como Administrador
- Ou use o Command Prompt normal

### Erro: "port already in use"
- Feche outras aplicações que possam estar usando a porta 5173
- Ou use uma porta diferente: `npm run dev -- --port 3000`

### Erro: "module not found"
- Execute `npm install` para instalar dependências
- Verifique se o arquivo `package.json` existe

## Comandos Úteis

```powershell
# Verificar versão do Node.js
node --version

# Verificar versão do npm
npm --version

# Limpar cache do npm
npm cache clean --force

# Remover node_modules e reinstalar
Remove-Item -Recurse -Force node_modules
Remove-Item package-lock.json
npm install
```

## Estrutura de Arquivos Esperada
```
vb-solution-master/
├── package.json
├── src/
│   ├── components/
│   ├── pages/
│   ├── hooks/
│   └── ...
├── supabase/
│   └── migrations/
└── ...
```

## Próximos Passos
Após executar a aplicação com sucesso:

1. **Execute as migrações SQL** no Supabase (veja `EXECUTAR_MIGRACAO_ATIVIDADES.md`)
2. **Teste a funcionalidade** de clicar em tarefas
3. **Verifique se os detalhes** das atividades são exibidos corretamente

## Suporte
Se encontrar problemas:
1. Verifique se está no diretório correto
2. Confirme se o Node.js está instalado
3. Execute `npm install` se necessário
4. Verifique se não há erros no terminal
