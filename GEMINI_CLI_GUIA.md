# 🚀 GUIA COMPLETO - Gemini CLI para Propiscineiro

**Documento:** Como usar Google Gemini CLI para desenvolver o Propiscineiro  
**Data:** Dezembro 2024  
**Versão:** 1.0

---

## 📋 Índice

1. [Instalação do Gemini CLI](#-instalação)
2. [Setup Inicial](#-setup-inicial)
3. [Como Usar com Propiscineiro](#-como-usar)
4. [Fluxo de Desenvolvimento](#-fluxo-de-desenvolvimento)
5. [Comandos Principais](#-comandos-principais)
6. [Troubleshooting](#-troubleshooting)
7. [Dicas e Otimizações](#-dicas-e-otimizações)

---

## 📦 Instalação

### Pré-requisitos

- Node.js 16+ instalado
- npm ou yarn
- Conta Google (para API Key)
- Terminal/CMD

### Passo 1: Instalar Gemini CLI

```bash
# Instale globalmente
npm install -g @google/generative-ai-cli

# Ou instale localmente no projeto
npm install @google/generative-ai-cli
```

### Passo 2: Obter API Key do Google

1. Acesse: https://aistudio.google.com/app/apikeys
2. Clique em "Create API Key"
3. Escolha "Create new API key in new project"
4. Copie a chave (você vai usar em próximos passos)

### Passo 3: Configurar Variável de Ambiente

#### No Windows (CMD):
```cmd
setx GEMINI_API_KEY "sua-api-key-aqui"
```

#### No Windows (PowerShell):
```powershell
[Environment]::SetEnvironmentVariable("GEMINI_API_KEY","sua-api-key-aqui","User")
```

#### No Mac/Linux:
```bash
export GEMINI_API_KEY="sua-api-key-aqui"

# Para persistir entre sessões, adicione a ~/.bashrc ou ~/.zshrc:
echo 'export GEMINI_API_KEY="sua-api-key-aqui"' >> ~/.bashrc
source ~/.bashrc
```

### Passo 4: Verificar Instalação

```bash
gemini --version

# Deve retornar algo como: gemini-cli version 1.x.x
```

**Status:** ✅ Gemini CLI instalado e configurado

---

## ⚙️ Setup Inicial

### Passo 1: Criar Pasta do Projeto

```bash
# Crie a pasta
mkdir propiscineiro
cd propiscineiro

# Inicialize Git
git init

# Crie pasta temporária para armazenar prompts
mkdir .gemini-prompts
```

### Passo 2: Copiar Documentos

Coloque estes 7 arquivos na **raiz** do projeto:

```
propiscineiro/
├── DIRETRIZES.md
├── PROMPT_CURSOR.md
├── FASE_1_INICIO.md
├── RESUMO_VISUAL.md
├── CHECKLIST_RAPIDO.md
├── INDICE.md
└── .gemini-prompts/         ← Nova pasta para prompts Gemini
    └── (vamos criar arquivos aqui)
```

### Passo 3: Criar Prompt Base para Gemini

Crie arquivo `.gemini-prompts/base-prompt.txt`:

```
🎯 VOCÊ É UM ASSISTENTE DE DESENVOLVIMENTO PARA PROPISCINEIRO

Seu objetivo: Ajudar a desenvolver o MicroSaaS Propiscineiro seguindo RIGOROSAMENTE as diretrizes.

REGRAS OBRIGATÓRIAS:
1. SEMPRE leia DIRETRIZES.md antes de responder
2. Docker SEMPRE vem primeiro - toda implementação começa com Docker
3. NUNCA pule fases: Fase 1 → 2 → 3 → 4 → 5 (em ordem)
4. Stack obrigatório:
   - Backend: FastAPI (Python 3.11+) + SQLAlchemy + PostgreSQL
   - Frontend: React 18 + TypeScript + Three.js + Zustand
   - Infraestrutura: Docker + Docker Compose
5. TODO código deve ter TESTES (pytest para backend, Jest para frontend)
6. Mínimo 70% de cobertura de testes
7. USE variáveis de ambiente para dados sensíveis (.env)
8. Implementar segurança desde o início (JWT, bcrypt, SQL injection protection)
9. DOCUMENTAÇÃO em todo código importante
10. Seguir as convenções de nomenclatura de DIRETRIZES.md

FASES OBRIGATÓRIAS (em ordem):
- Fase 1️⃣: Infraestrutura (1-2 dias) - Docker setup
- Fase 2️⃣: Backend (1-2 semanas) - FastAPI completo
- Fase 3️⃣: Frontend (2-3 semanas) - React completo
- Fase 4️⃣: Database (3-5 dias) - Migrações e backups
- Fase 5️⃣: Deploy (3-5 dias) - Produção

QUANDO RESPONDER:
Para CADA requisição:
1. Identifique qual FASE você está
2. Valide se requisição está dentro dessa fase
3. Se fora do escopo: "Esta tarefa é da Fase X, você está na Fase Y."
4. GERE código completo, testado e documentado
5. SEMPRE forneça como criar/atualizar Docker se necessário
6. Forneça comandos exatos para testar

NÃO FAÇA:
1. Pular Docker
2. Misturar fases
3. Código sem testes
4. Segurança depois
5. Credentials no código

Entendido? Confirme que leu estas instruções.
```

**Status:** ✅ Setup inicial completo

---

## 🎯 Como Usar Gemini CLI com Propiscineiro

### Opção 1: Interativo (Recomendado)

**Comando básico:**

```bash
gemini
```

Isso abre um chat interativo onde você:

1. **Primeira mensagem:** Cole o conteúdo de `.gemini-prompts/base-prompt.txt`
2. **Aguarde:** Gemini vai confirmar que entendeu as regras
3. **Peça Fase 1:** Digite seu primeiro comando

**Exemplo de primeira mensagem:**

```
Cole o conteúdo completo de base-prompt.txt aqui
(Ctrl+V após copiar)
```

**Gemini vai responder:**

```
✅ Entendido! Sou seu assistente de desenvolvimento para o Propiscineiro.

Estou seguindo rigorosamente as diretrizes de DIRETRIZES.md.

Qual é sua primeira tarefa? Mencione a FASE que quer trabalhar.

Estou pronto para começar com Fase 1: Infraestrutura (Docker).
```

### Opção 2: Via Arquivo (Batch)

**Crie um arquivo de prompt:**

```bash
# Crie arquivo com seu comando
echo "Fase 1: Crie a estrutura Docker completa..." > .gemini-prompts/fase-1.txt

# Execute
gemini < .gemini-prompts/fase-1.txt
```

### Opção 3: Via CLI Direto

**Para consultas rápidas:**

```bash
gemini "Qual é a Fase 1 de DIRETRIZES.md?"
```

---

## 🔄 Fluxo de Desenvolvimento

### Fluxo Completo com Gemini CLI

```
┌─────────────────────────────────────────────────────────────┐
│                    INÍCIO DO PROJETO                        │
└─────────────────────────────────────────────────────────────┘
                              ↓
1. Terminal: gemini
   ↓
2. Cole conteúdo de base-prompt.txt
   ↓
3. Gemini confirma regras
   ↓
┌─────────────────────────────────────────────────────────────┐
│                    FASE 1: INFRAESTRUTURA                   │
└─────────────────────────────────────────────────────────────┘
                              ↓
Você: "Fase 1: Crie estrutura Docker com:
       - docker-compose.yml
       - Dockerfiles
       - .env
       - requirements.txt"
                              ↓
Gemini: [Gera código completo]
                              ↓
Você: Copia código para arquivos
                              ↓
Você: docker-compose up -d
                              ↓
Você: Valida com CHECKLIST_RAPIDO.md
                              ↓
Você: "Fase 1 ✅ COMPLETO"
                              ↓
┌─────────────────────────────────────────────────────────────┐
│                    FASE 2: BACKEND (2.1)                    │
└─────────────────────────────────────────────────────────────┘
                              ↓
Você: "Fase 2.1: Setup FastAPI com:
       - main.py
       - config.py
       - database.py
       - models/"
                              ↓
Gemini: [Gera código FastAPI]
                              ↓
[Repete para 2.2, 2.3, 2.4, 2.5]
                              ↓
┌─────────────────────────────────────────────────────────────┐
│                    FASE 3: FRONTEND (3.1)                   │
└─────────────────────────────────────────────────────────────┘
                              ↓
[Similar ao backend, em sub-fases]
                              ↓
┌─────────────────────────────────────────────────────────────┐
│                 FASE 4 e 5: DB + DEPLOY                     │
└─────────────────────────────────────────────────────────────┘
                              ↓
                        🎉 MVP PRONTO 🎉
```

---

## 💻 Comandos Principais

### 1. Iniciar Sessão Interativa

```bash
gemini
```

**Melhor para:**
- Conversas longas
- Debugging
- Perguntas de acompanhamento
- Desenvolvimento iterativo

**Exemplo de uso:**

```
$ gemini

> Cole aqui o conteúdo de base-prompt.txt

> Fase 1: Crie docker-compose.yml com PostgreSQL, FastAPI e React

> (Gemini responde)

> Me explique a seção de autenticação do docker-compose

> (Gemini explica)

> Crie agora o Dockerfile do backend

> (Gemini cria)

> Sair digitando: exit ou Ctrl+D
```

### 2. Comando Único

```bash
gemini "Qual é a estrutura de pastas do backend de DIRETRIZES.md?"
```

**Melhor para:**
- Consultas rápidas
- Referências
- Verificações simples

### 3. A Partir de Arquivo

```bash
# Crie arquivo com prompt longo
cat > .gemini-prompts/fase-2-auth.txt << 'EOF'
Fase 2.2: Crie autenticação JWT completa com:
- Usuario model com SQLAlchemy
- JWT token generation
- bcrypt password hashing
- POST /auth/register endpoint
- POST /auth/login endpoint
- Testes pytest
- Documentação
EOF

# Execute
gemini < .gemini-prompts/fase-2-auth.txt
```

### 4. Pipar Múltiplos Comandos

```bash
# Salve múltiplos prompts
cat > .gemini-prompts/batch.txt << 'EOF'
Prompt 1: Explique DIRETRIZES.md em 100 palavras

Prompt 2: Qual é a estrutura do docker-compose.yml?

Prompt 3: Como configurar PostgreSQL?
EOF

# Execute (Gemini responde cada um)
gemini < .gemini-prompts/batch.txt
```

---

## 🛠️ Workflow Prático Passo-a-Passo

### Dia 1: Começar Fase 1

**1. Prepare o ambiente:**

```bash
# Terminal 1: Inicie Gemini
gemini

# (Em outra aba do terminal)
# Terminal 2: Você vai colar arquivos aqui
```

**2. Cole o prompt base (no Gemini):**

```
[Cole conteúdo de base-prompt.txt]
```

**3. Gemini confirma:**

```
✅ Regras entendidas. Pronto para Fase 1.
```

**4. Peça Fase 1:**

```
Fase 1: Crie a estrutura Docker completa com:
- docker-compose.yml (PostgreSQL 15, FastAPI, React)
- Dockerfile para backend (Python 3.11)
- Dockerfile para frontend (Node 18)
- requirements.txt com FastAPI, SQLAlchemy, bcrypt, PyJWT
- .env com variáveis
- .gitignore
- README.md com instruções

Valide que docker-compose up -d funciona sem erros.
```

**5. Gemini gera código:**

```
Aqui está a estrutura Docker completa:

# docker-compose.yml
version: '3.8'
services:
  db:
    image: postgres:15-alpine
    environment:
      POSTGRES_DB: propiscineiro
      ...
  
  backend:
    build: ./backend
    ...
  
  frontend:
    build: ./frontend
    ...
```

**6. Você copia para arquivos (Terminal 2):**

```bash
# Crie pastas
mkdir -p backend frontend

# Crie arquivo docker-compose.yml e copie conteúdo de Gemini
nano docker-compose.yml

# Crie arquivo backend/Dockerfile
nano backend/Dockerfile

# Etc...
```

**7. Teste:**

```bash
docker-compose up -d
docker-compose ps
```

**8. Valide com CHECKLIST_RAPIDO.md:**

```
- [ ] docker-compose up -d sem erros
- [ ] 3 containers rodando
- [ ] Swagger em localhost:8000/docs
- [ ] React em localhost:5173
```

**9. Fase 1 completa:**

```
✅ Fase 1: COMPLETO

Próximo: Fase 2.1 - Setup FastAPI
```

### Dia 2-3: Fase 2.1 (Backend Setup)

**1. Converse com Gemini:**

```
Fase 2.1: Crie setup FastAPI com:
- main.py com app inicializado
- config.py com variáveis
- database.py com SQLAlchemy
- Estrutura de pastas
- Alembic para migrações

Docker já existe, só adicione se necessário.
```

**2. Gemini gera código:**

```python
# backend/main.py
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
...

app = FastAPI(title="Propiscineiro")

@app.get("/health")
def health():
    return {"status": "ok"}
```

**3. Você copia para `backend/main.py`**

**4. Teste:**

```bash
docker-compose exec backend python -c "import main"
curl http://localhost:8000/health
```

**5. Continue assim para 2.2, 2.3, 2.4, 2.5...**

---

## 📝 Comandos Essenciais Gemini CLI

### Salvar Conversa

```bash
# Gemini salva conversas automaticamente em ~/.gemini/history/
# Para acessá-las depois:
ls ~/.gemini/history/
```

### Limpar Histórico

```bash
# Se necessário, limpe (cuidado!)
rm -rf ~/.gemini/history/*
```

### Usar em Subpasta

```bash
# Se estiver em subfolder, use --project
gemini --project propiscineiro
```

### Definir Modelo Específico

```bash
# Use modelo específico (padrão é gemini-pro)
gemini --model gemini-2.0-flash
```

### Ver Tokens/Uso

```bash
# Verificar uso de API
gemini --usage
```

### Help

```bash
gemini --help
```

---

## 🔧 Troubleshooting

### Problema 1: "API Key not found"

**Causa:** Variável de ambiente não está definida

**Solução (Windows):**
```cmd
setx GEMINI_API_KEY "sua-chave-aqui"
# Reinicie o terminal/CMD depois
```

**Solução (Mac/Linux):**
```bash
export GEMINI_API_KEY="sua-chave-aqui"
# Ou adicione a ~/.bashrc ou ~/.zshrc para persistir
```

### Problema 2: "Command not found: gemini"

**Causa:** Gemini CLI não instalado globalmente

**Solução:**
```bash
npm install -g @google/generative-ai-cli
# Ou instale localmente:
npm install @google/generative-ai-cli
# E use: npx gemini
```

### Problema 3: "Rate limit exceeded"

**Causa:** Muitas requisições muito rápido

**Solução:**
```bash
# Aguarde alguns minutos
# Ou divida requisições em múltiplas conversas
# Gemini tem limite de tokens por minuto
```

### Problema 4: "Context too long"

**Causa:** Prompt muito longo para Gemini processar

**Solução:**
- Divida em múltiplos prompts menores
- Refira-se a arquivos em vez de copiar todo conteúdo
- Use: "Consulte DIRETRIZES.md seção 3" em vez de copiar

### Problema 5: Gemini esqueceu as regras

**Causa:** Sessão muito longa, contexto perdido

**Solução:**
```bash
# Inicie nova sessão
exit  # ou Ctrl+D para sair

# Abra nova sessão
gemini

# Cole base-prompt.txt novamente
```

---

## ⚡ Dicas e Otimizações

### Dica 1: Use Arquivos para Referência

**Em vez de copiar tudo:**

```
❌ Errado:
"Gere código que segue as convenções em DIRETRIZES.md..."
[copia 2000 linhas de DIRETRIZES.md]

✅ Correto:
"Gere código que segue as convenções em seção 5 de DIRETRIZES.md:
- Backend: snake_case, UPPER_SNAKE_CASE para constantes
- Frontend: PascalCase para componentes"
```

### Dica 2: Peça para Validar Código

```bash
Você: "Valide este código FastAPI conforme DIRETRIZES.md:
       [cole código]
       
       - Tem docstrings?
       - Tem type hints?
       - Está validando input?
       - Tem tratamento de erro?"

Gemini: [lista problemas e soluções]
```

### Dica 3: Use Prompts de Estrutura

**Crie arquivo `.gemini-prompts/template-backend.txt`:**

```
Fase 2.X: Crie [NOME] seguindo:

1. Estrutura:
   - models/[nome].py
   - schemas/[nome].py
   - routers/[nome].py
   - services/[nome]_service.py
   - tests/test_[nome].py

2. Requisitos:
   - Type hints obrigatórios
   - Docstrings em todos funções
   - Testes com pytest
   - Cobertura 70%+

3. Validações:
   [especifique]

4. Endpoints:
   [liste]

Confira DIRETRIZES.md seção 2 para o stack exato.
```

### Dica 4: Organize Prompts por Fase

```bash
.gemini-prompts/
├── base-prompt.txt
├── fase-1-docker.txt
├── fase-2-auth.txt
├── fase-2-crud.txt
├── fase-2-tests.txt
├── fase-3-setup.txt
├── fase-3-auth-ui.txt
└── templates/
    ├── backend-endpoint.txt
    └── react-component.txt
```

### Dica 5: Debugar com Gemini

```bash
# Quando algo não funciona:
Você: "Este código dá erro [erro aqui].
       [cole código]
       
       Confira DIRETRIZES.md para convenções.
       Por que está falhando?"

Gemini: [explica o problema e propõe solução]
```

### Dica 6: Integrar com Git

```bash
# Após Gemini gerar código:
git add .
git commit -m "Fase X.Y: [descrição]"
git push origin main

# Depois peça a Gemini:
"Próximo: Fase X.Z - [nome da próxima]"
```

---

## 📊 Workflow Diário Recomendado

### Manhã:

```bash
# 1. Abra Gemini
gemini

# 2. Pergunte prioridades
"Revise CHECKLIST_RAPIDO.md. Qual é o próximo passo em [Fase X]?"

# 3. Gemini diz o que fazer

# 4. Você passa para o editor:
"Implemente: [tarefa específica]"

# 5. Gemini gera código
```

### Meio do Dia:

```bash
# 1. Teste código
docker-compose exec backend pytest --cov

# 2. Se houver erro
"Este teste falha: [erro]. Conserte."

# 3. Gemini propõe solução

# 4. Implemente
```

### Final do Dia:

```bash
# 1. Valide com CHECKLIST
"Completei essas sub-fases: [lista].
   Validei tudo conforme CHECKLIST_RAPIDO.md?"

# 2. Gemini confirma

# 3. Commit e push
git commit -m "Fase X.Y concluída - [descrição]"

# 4. Planeje próxima
"Amanhã começarei Fase X.Z. Preciso de orientação?"
```

---

## 🎯 Exemplo Completo: Fase 1

### Sessão Gemini (Transcrição)

```
$ gemini

> Você: [Cole conteúdo de base-prompt.txt]

> Gemini: ✅ Entendido! Sou seu assistente para Propiscineiro.
          Regras obedecidas. Pronto para Fase 1.

> Você: Fase 1: Crie estrutura Docker com:
        - docker-compose.yml
        - Dockerfiles (backend + frontend)
        - requirements.txt
        - .env
        - .gitignore
        - README.md

> Gemini: [Gera código completo em 3 blocos]

> Você: Pronto! Criei todos os arquivos.
        Executei: docker-compose up -d
        Resultado: 3 containers Up

> Gemini: Ótimo! Valide com:
          - curl http://localhost:8000/docs
          - curl http://localhost:5173
          - docker-compose ps

> Você: Tudo funcionando!

> Gemini: Fase 1 ✅ COMPLETO!
          Próximo: Fase 2.1 - Setup FastAPI.
          Quer começar?

> Você: Sim! Fase 2.1: Setup FastAPI com...

> exit (ou Ctrl+D)
```

---

## 📚 Recursos Adicionais

### Links Úteis

- Gemini CLI GitHub: https://github.com/google/generative-ai-cli
- Google AI Studio: https://aistudio.google.com
- Documentação Gemini: https://ai.google.dev

### Alternativas se Tiver Problemas

Se Gemini CLI tiver limitações, você pode:

1. **Usar Google AI Studio (web):**
   - https://aistudio.google.com
   - Cole base-prompt.txt lá
   - Mesma funcionalidade mas em navegador

2. **Usar Claude (Anthropic):**
   - https://claude.ai
   - Cole base-prompt.txt
   - Funciona similar

3. **Voltar para Cursor IDE:**
   - Use PROMPT_CURSOR.md
   - Mesma abordagem

---

## ✅ Checklist de Setup

- [ ] Node.js 16+ instalado (`node --version`)
- [ ] npm instalado (`npm --version`)
- [ ] Gemini CLI instalado (`npm install -g @google/generative-ai-cli`)
- [ ] API Key do Google obtida
- [ ] GEMINI_API_KEY configurada em variável de ambiente
- [ ] `gemini --version` funciona
- [ ] Pasta propiscineiro criada
- [ ] 7 arquivos DIRETRIZES.md, PROMPT_*.md etc copiados
- [ ] Pasta .gemini-prompts/ criada
- [ ] base-prompt.txt em .gemini-prompts/
- [ ] `gemini` abre sem erros
- [ ] Primeira conversa com base-prompt.txt funciona

**Status:** ✅ Tudo pronto para começar

---

## 🚀 Próximos Passos

1. **Configure tudo acima**
2. **Abra terminal:**
   ```bash
   cd propiscineiro
   gemini
   ```

3. **Cole conteúdo de `.gemini-prompts/base-prompt.txt`**

4. **Gemini confirma regras**

5. **Peça Fase 1:**
   ```
   Fase 1: Crie estrutura Docker conforme FASE_1_INICIO.md
   ```

6. **Gemini cria código**

7. **Você copia para arquivos**

8. **Valida com CHECKLIST_RAPIDO.md**

9. **Continua Fases 2-5**

10. **🎉 MVP ao vivo!**

---

## 📞 Suporte

Se algo não funcionar:

1. **Verifique instalação:**
   ```bash
   gemini --version
   echo $GEMINI_API_KEY
   ```

2. **Consulte DIRETRIZES.md:**
   - Seção 10: Contato e Escopo

3. **Leia troubleshooting acima**

4. **Tente Google AI Studio (web):**
   - https://aistudio.google.com

---

**Documento criado:** Dezembro 2024  
**Versão:** 1.0  
**Projeto:** Propiscineiro MicroSaaS  
**Ferramenta:** Google Gemini CLI

**Boa sorte! 🚀**
