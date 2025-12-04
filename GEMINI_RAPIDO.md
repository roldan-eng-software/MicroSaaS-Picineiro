# ⚡ RÁPIDO - Primeiros Passos com Gemini CLI

**Se você quer começar AGORA, siga isto:**

---

## 1️⃣ Instalar (5 min)

```bash
# Instale Gemini CLI
npm install -g @google/generative-ai-cli

# Verifique
gemini --version
```

---

## 2️⃣ API Key (5 min)

1. Acesse: https://aistudio.google.com/app/apikeys
2. Clique "Create API Key"
3. Copie a chave
4. No terminal:

**Windows (CMD):**
```cmd
setx GEMINI_API_KEY "sua-chave-aqui"
# Reinicie o CMD após isto
```

**Mac/Linux:**
```bash
export GEMINI_API_KEY="sua-chave-aqui"
```

---

## 3️⃣ Criar Projeto (5 min)

```bash
# Crie pasta
mkdir propiscineiro
cd propiscineiro

# Inicie Git
git init

# Crie pasta para prompts
mkdir .gemini-prompts
```

---

## 4️⃣ Copiar Documentos (2 min)

Coloque estes 7 arquivos na **raiz** do projeto:

- DIRETRIZES.md
- PROMPT_CURSOR.md
- FASE_1_INICIO.md
- RESUMO_VISUAL.md
- CHECKLIST_RAPIDO.md
- INDICE.md
- GEMINI_CLI_GUIA.md ← este arquivo

---

## 5️⃣ Criar Prompt Base (2 min)

Crie arquivo `.gemini-prompts/base-prompt.txt`:

```
🎯 ASSISTENTE PROPISCINEIRO

Objetivo: Desenvolver MicroSaaS Propiscineiro seguindo DIRETRIZES.md

REGRAS:
1. Leia DIRETRIZES.md antes de responder
2. Docker SEMPRE primeiro
3. NUNCA pule Fases: 1 → 2 → 3 → 4 → 5
4. Stack: FastAPI + React + PostgreSQL + Docker
5. Testes obrigatórios (70%+ cobertura)
6. Segurança desde dia 1
7. Variáveis de ambiente para credentials
8. Documentação em tudo

FASES (em ordem):
- Fase 1: Docker (1-2 dias)
- Fase 2: Backend (1-2 semanas)
- Fase 3: Frontend (2-3 semanas)
- Fase 4: Database (3-5 dias)
- Fase 5: Deploy (3-5 dias)

VALIDAR:
- Código completo, testado
- Docker atualizado se necessário
- Comandos para testar fornecidos

NÃO FAZER:
- Pular Docker
- Misturar fases
- Código sem testes
- Segurança depois

Confirme que leu.
```

---

## 6️⃣ Começar (agora!)

```bash
# Abra Gemini
gemini

# (No terminal do Gemini, cole:)
# Conteúdo de .gemini-prompts/base-prompt.txt

# Gemini vai confirmar regras

# Depois peça:
Fase 1: Crie estrutura Docker com:
- docker-compose.yml
- Dockerfiles (backend + frontend)
- requirements.txt
- .env
- .gitignore
- README.md

Valide que docker-compose up -d funciona.

# Gemini cria código
# Você copia para arquivos
# Testa com: docker-compose up -d
# Valida com CHECKLIST_RAPIDO.md
# Próximo: Fase 2
```

---

## ✅ Checklist Rápido

- [ ] Gemini CLI instalado (`gemini --version`)
- [ ] API Key configurada (`echo $GEMINI_API_KEY`)
- [ ] Pasta propiscineiro criada
- [ ] 7 arquivos copiados
- [ ] .gemini-prompts/base-prompt.txt criado
- [ ] `gemini` abre sem erro
- [ ] Primeira conversa funciona
- [ ] Fase 1 iniciada

---

## 🚀 Próximo

Vá para **GEMINI_CLI_GUIA.md** para guia completo.

Ou comece agora digitando: `gemini`

---

**Feito! Boa sorte! 💪**
