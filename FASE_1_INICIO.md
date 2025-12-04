# 🚀 GUIA RÁPIDO DE INÍCIO - FASE 1

## ✅ Checklist Fase 1: Preparação e Infraestrutura

Esta é a PRIMEIRA fase. Sem Docker, não há projeto.

### 📋 O que você precisa fazer

- [ ] Crie uma pasta chamada `propiscineiro` (seu projeto raiz)
- [ ] Dentro dela, crie as subpastas: `backend/`, `frontend/`
- [ ] Crie `docker-compose.yml` na raiz
- [ ] Crie `.env` na raiz
- [ ] Crie `.gitignore`
- [ ] Execute `docker-compose up -d`
- [ ] Valide que tudo está rodando

### 🤖 Comando para Cursor IDE

**Cole exatamente isto no Cursor:**

```
Fase 1: Crie a estrutura Docker completa para o Propiscineiro com:

1. docker-compose.yml com 3 serviços:
   - PostgreSQL 15 (porta 5432)
   - FastAPI backend (porta 8000)
   - React frontend (porta 5173)

2. Dockerfile para backend (FastAPI)
   - Python 3.11-slim
   - requirements.txt
   - uvicorn command

3. Dockerfile para frontend (React)
   - Node 18-alpine
   - Vite development server

4. .env na raiz com:
   - DATABASE_URL=postgresql://dev:dev123@db:5432/propiscineiro
   - SECRET_KEY=dev-secret-key-change-in-production
   - DEBUG=true
   - VITE_API_URL=http://localhost:8000

5. Estrutura de pastas:
   propiscineiro/
   ├── backend/
   │   ├── Dockerfile
   │   ├── requirements.txt (FastAPI, SQLAlchemy, psycopg2, pydantic, pyjwt, bcrypt)
   │   └── .dockerignore
   ├── frontend/
   │   ├── Dockerfile
   │   ├── .dockerignore
   │   └── package.json (placeholder para ser criado com npm init)
   ├── docker-compose.yml
   ├── .env
   ├── .gitignore
   └── README.md (instruções de setup)

6. .gitignore com:
   - __pycache__/
   - .venv/
   - node_modules/
   - .env
   - dist/
   - build/

Valide que:
- docker-compose up -d funciona sem erros
- PostgreSQL está rodando em 5432
- Sem pedir pip install ou npm install manualmente
- Todos os containers iniciam corretamente
```

---

## 📁 Estrutura Esperada Após Fase 1

```
propiscineiro/
├── backend/
│   ├── Dockerfile
│   ├── requirements.txt
│   ├── .dockerignore
│   └── (vazio por enquanto)
│
├── frontend/
│   ├── Dockerfile
│   ├── .dockerignore
│   └── (vazio por enquanto)
│
├── docker-compose.yml          ✅ OBRIGATÓRIO
├── .env                        ✅ OBRIGATÓRIO
├── .gitignore                  ✅ OBRIGATÓRIO
└── README.md                   ✅ Instruções

```

---

## 🧪 Como Testar Fase 1

Após pedir para o Cursor criar a estrutura, execute:

```bash
# 1. Navegue até a pasta do projeto
cd propiscineiro

# 2. Inicie os containers
docker-compose up -d

# 3. Verifique se todos os containers estão rodando
docker-compose ps

# Saída esperada:
# NAME                COMMAND             SERVICE       STATUS
# propiscineiro-db-1  "docker-entrypoint.sh postgres" db  Up 2 seconds
# propiscineiro-backend-1  "uvicorn main:app..."  backend  Up 1 second
# propiscineiro-frontend-1 "npm run dev"       frontend  Up 2 seconds

# 4. Teste PostgreSQL
docker-compose exec db psql -U dev -d propiscineiro -c "SELECT 1;"

# Saída esperada: ?column?
#           1
# (1 row)

# 5. Verifique se Backend está respondendo
curl http://localhost:8000/docs

# Saída esperada: HTML da página Swagger

# 6. Verifique se Frontend está respondendo
curl http://localhost:5173

# Saída esperada: HTML do React

# 7. Ver logs do backend
docker-compose logs backend

# 8. Ver logs do frontend
docker-compose logs frontend

# 9. Ver logs de tudo
docker-compose logs -f

# 10. Parar os containers
docker-compose down

# 11. Parar e remover volumes (limpar tudo)
docker-compose down -v

```

---

## ✅ Verificação de Sucesso - Fase 1

Você completou a Fase 1 quando:

- ✅ `docker-compose up -d` executa sem erros
- ✅ `docker-compose ps` mostra 3 containers: db, backend, frontend (all "Up")
- ✅ Consegue se conectar ao PostgreSQL
- ✅ http://localhost:8000/docs abre a documentação Swagger
- ✅ http://localhost:5173 abre uma página React
- ✅ Arquivo `.env` contém todas as variáveis
- ✅ Arquivo `.gitignore` impede commit de credenciais
- ✅ README.md tem instruções claras

---

## 🚫 Problemas Comuns - Fase 1

### Problema: "Port 5432 already in use"

**Causa:** Outro PostgreSQL está rodando  
**Solução:** 
```bash
# Mude a porta em docker-compose.yml
ports:
  - "5433:5432"  # Use 5433 em vez de 5432

# Ou encerre o PostgreSQL existente
# No Mac: brew services stop postgresql
# No Linux: sudo systemctl stop postgresql
```

### Problema: "Cannot connect to Docker daemon"

**Causa:** Docker Desktop não está rodando  
**Solução:** Inicie Docker Desktop

### Problema: Frontend não compilando

**Causa:** package.json não existe  
**Solução:** O Cursor deve criar um placeholder, será substituído na Fase 3

### Problema: "Permission denied" em volumes

**Causa:** Permissões do arquivo  
**Solução:**
```bash
chmod -R 755 backend frontend
```

---

## 📝 Próximos Passos Após Fase 1

✅ **Fase 1 Completa!**

Agora você pode iniciar a **Fase 2: Backend (FastAPI)**.

Peça ao Cursor:

```
Fase 2.1: Crie o setup inicial do FastAPI com:
- main.py com FastAPI app inicializado
- config.py com variáveis de configuração
- database.py com conexão PostgreSQL via SQLAlchemy
- requirements.txt atualizado
- Estrutura de pastas (models/, routers/, schemas/, services/)
- Dockerfile atualizado se necessário

Valide com: docker-compose exec backend python -c "import main"
```

---

## 🐳 Comandos Docker Úteis

```bash
# Ver containers rodando
docker-compose ps

# Iniciar containers
docker-compose up -d

# Parar containers
docker-compose stop

# Parar e remover (limpeza completa)
docker-compose down

# Ver logs de um serviço
docker-compose logs backend
docker-compose logs frontend
docker-compose logs db

# Ver logs em tempo real
docker-compose logs -f

# Executar comando dentro de um container
docker-compose exec backend bash
docker-compose exec frontend sh
docker-compose exec db psql -U dev

# Reconstruir imagens
docker-compose build

# Reconstruir e iniciar
docker-compose up -d --build

# Limpar tudo (containers, networks, volumes)
docker-compose down -v

# Ver tamanho dos volumes
docker volume ls
```

---

## 📚 Estrutura de Arquivos Esperada

Copie este template e ajuste conforme o Cursor criar:

### docker-compose.yml (template)
```yaml
version: '3.8'
services:
  db:
    image: postgres:15-alpine
    environment:
      POSTGRES_DB: ${DB_NAME:-propiscineiro}
      POSTGRES_USER: ${DB_USER:-dev}
      POSTGRES_PASSWORD: ${DB_PASSWORD:-dev123}
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data
    networks:
      - propiscineiro-network

  backend:
    build: ./backend
    command: uvicorn main:app --host 0.0.0.0 --port 8000 --reload
    ports:
      - "8000:8000"
    environment:
      DATABASE_URL: postgresql://${DB_USER:-dev}:${DB_PASSWORD:-dev123}@db:5432/${DB_NAME:-propiscineiro}
      SECRET_KEY: ${SECRET_KEY:-dev-secret-key}
      DEBUG: ${DEBUG:-true}
    volumes:
      - ./backend:/app
    depends_on:
      - db
    networks:
      - propiscineiro-network

  frontend:
    build: ./frontend
    command: npm run dev
    ports:
      - "5173:5173"
    volumes:
      - ./frontend:/app
      - /app/node_modules
    environment:
      VITE_API_URL: ${VITE_API_URL:-http://localhost:8000}
    networks:
      - propiscineiro-network

volumes:
  postgres_data:

networks:
  propiscineiro-network:
    driver: bridge
```

### .env (template)
```env
# Database
DATABASE_URL=postgresql://dev:dev123@db:5432/propiscineiro
DB_NAME=propiscineiro
DB_USER=dev
DB_PASSWORD=dev123

# Backend
SECRET_KEY=dev-secret-key-change-in-production
DEBUG=true
ENVIRONMENT=development

# Frontend
VITE_API_URL=http://localhost:8000
VITE_APP_NAME=Propiscineiro
```

### .gitignore (template)
```
# Python
__pycache__/
*.py[cod]
*$py.class
*.so
.Python
build/
develop-eggs/
dist/
downloads/
eggs/
.eggs/
lib/
lib64/
parts/
sdist/
var/
wheels/
*.egg-info/
.installed.cfg
*.egg
.venv
venv/
ENV/

# Node
node_modules/
npm-debug.log
yarn-debug.log
yarn-error.log
.pnpm-debug.log
dist/
build/

# IDE
.vscode/
.idea/
*.swp
*.swo
*~
.DS_Store

# Environment
.env
.env.local
.env.*.local

# Docker
.docker

# Logs
*.log
logs/
```

---

## 🎯 Resumo Fase 1

| Item | Status | Comando para Validar |
|------|--------|----------------------|
| Docker Compose | ✅ Pronto | `docker-compose ps` |
| PostgreSQL | ✅ Rodando | `docker-compose exec db psql -U dev -c "SELECT 1"` |
| Backend | ✅ Standby | `curl http://localhost:8000/docs` |
| Frontend | ✅ Standby | `curl http://localhost:5173` |
| .env | ✅ Configurado | `cat .env` |
| .gitignore | ✅ Pronto | `git status` |

---

**Pronto para começar?**

Copie o prompt de Fase 1 acima e cole no Cursor IDE!

Depois que Fase 1 estiver 100% completa, volte aqui e peça para iniciar a **Fase 2: Backend**.

---

**Criado em:** Dezembro 2024  
**Versão:** 1.0  
**Projeto:** Propiscineiro
