# 📋 CHECKLIST RÁPIDO - Propiscineiro Desenvolvimento

Imprima este documento ou tenha aberto enquanto desenvolve!

---

## 🚀 ANTES DE COMEÇAR

- [ ] Leia DIRETRIZES.md completo
- [ ] Leia RESUMO_VISUAL.md para entender a arquitetura
- [ ] Copie o prompt do PROMPT_CURSOR.md
- [ ] Cole o `.cursorrules` na raiz do projeto
- [ ] Abra Cursor IDE
- [ ] Cole o prompt na janela de chat

---

## ✅ FASE 1: INFRAESTRUTURA (1-2 dias)

**Comando para Cursor:**
```
Fase 1: Crie a estrutura Docker completa para o Propiscineiro...
[Use o prompt em FASE_1_INICIO.md]
```

### Validação
- [ ] `docker-compose up -d` roda sem erros
- [ ] `docker-compose ps` mostra 3 containers "Up"
- [ ] `curl http://localhost:8000/docs` retorna Swagger HTML
- [ ] `curl http://localhost:5173` retorna React HTML
- [ ] PostgreSQL conecta: `docker-compose exec db psql -U dev -d propiscineiro`
- [ ] `.env` contém todas as variáveis
- [ ] `.gitignore` contém `.env` e `node_modules/`
- [ ] README.md tem instruções de setup

### Arquivos Criados
- [ ] `docker-compose.yml`
- [ ] `.env`
- [ ] `.gitignore`
- [ ] `backend/Dockerfile`
- [ ] `backend/requirements.txt`
- [ ] `backend/.dockerignore`
- [ ] `frontend/Dockerfile`
- [ ] `frontend/.dockerignore`
- [ ] `README.md`

**Status Fase 1:** ✅ COMPLETO → Próximo: Fase 2

---

## 🐍 FASE 2: BACKEND (1-2 semanas)

### 2.1: Setup FastAPI
**Comando para Cursor:**
```
Fase 2.1: Crie o setup inicial do FastAPI com:
- main.py com FastAPI app
- config.py com variáveis
- database.py com conexão PostgreSQL
- requirements.txt atualizado
- Estrutura de pastas (models/, routers/, schemas/, services/)
```

Validação:
- [ ] `docker-compose exec backend python -c "import main"` funciona
- [ ] `curl http://localhost:8000/docs` mostra documentação vazia
- [ ] Sem erros no `docker-compose logs backend`

### 2.2: Autenticação JWT
**Comando para Cursor:**
```
Fase 2.2: Crie autenticação com:
- POST /auth/register (email, senha)
- POST /auth/login (email, senha)
- JWT token retornado
- Senha hasheada com bcrypt
- Testes pytest
```

Validação:
- [ ] `POST /auth/register` cria usuário
- [ ] `POST /auth/login` retorna JWT token
- [ ] `pytest tests/test_auth.py` passa
- [ ] `/docs` mostra endpoints de auth

### 2.3: CRUD de Projetos
**Comando para Cursor:**
```
Fase 2.3: Crie endpoints de projetos:
- GET /api/v1/projetos (listar)
- POST /api/v1/projetos (criar)
- GET /api/v1/projetos/{id} (obter um)
- PUT /api/v1/projetos/{id} (atualizar)
- DELETE /api/v1/projetos/{id} (deletar)
- Validação de permissão (usuário só vê seus projetos)
- Testes pytest
```

Validação:
- [ ] POST cria projeto com auth
- [ ] GET lista apenas projetos do usuário
- [ ] PUT atualiza projeto
- [ ] DELETE remove projeto
- [ ] Sem auth: retorna 401
- [ ] `pytest tests/test_projetos.py` passa

### 2.4: Upload de Imagens
**Comando para Cursor:**
```
Fase 2.4: Crie upload com:
- POST /api/v1/upload (multipart/form-data)
- Integração Cloudflare R2 (ou AWS S3)
- Validação de tipo (jpg, png)
- Validação de tamanho (máx 5MB)
- Retorna URL pública
- Testes pytest
```

Validação:
- [ ] Upload funciona
- [ ] Arquivo salvo em R2/S3
- [ ] URL pública acessível
- [ ] `pytest tests/test_upload.py` passa

### 2.5: Testes e Documentação
**Comando para Cursor:**
```
Fase 2.5: Adicione testes e documentação:
- Cobertura mínima 70% (pytest --cov)
- Docstrings em todas funções
- README.md com instruções de API
- /docs mostra todos endpoints
```

Validação:
- [ ] `pytest --cov` mostra 70%+ cobertura
- [ ] `docker-compose exec backend pytest --cov`
- [ ] Todos endpoints documentados em `/docs`
- [ ] README.md completo

**Status Fase 2:** ✅ COMPLETO → Próximo: Fase 3

---

## ⚛️ FASE 3: FRONTEND (2-3 semanas)

### 3.1: Setup React
**Comando para Cursor:**
```
Fase 3.1: Configure React + TypeScript:
- Vite como build tool
- TypeScript configurado
- TailwindCSS instalado
- Zustand para state
- Axios para HTTP
- Pasta estruturada (components/, pages/, store/, services/)
```

Validação:
- [ ] `npm run dev` funciona (localhost:5173)
- [ ] Sem erros de TypeScript
- [ ] TailwindCSS estilos funcionam
- [ ] Zustand store criado

### 3.2: Autenticação (UI)
**Comando para Cursor:**
```
Fase 3.2: Crie UI de autenticação:
- LoginPage com form (email, senha)
- RegisterPage com form (email, senha, confirmar)
- Validação em tempo real
- Chamadas para /auth/login e /auth/register
- JWT token armazenado em localStorage
- Zustand authStore
- Logout funcional
```

Validação:
- [ ] Consegue fazer registro
- [ ] Consegue fazer login
- [ ] Token salvo no localStorage
- [ ] Logout limpa o token
- [ ] Sem token: não acessa dashboard

### 3.3: Dashboard
**Comando para Cursor:**
```
Fase 3.3: Crie dashboard com:
- NavBar com usuário + logout
- Sidebar com menu
- Lista de projetos (GET /projetos)
- Botão criar novo projeto
- Botão editar projeto
- Botão deletar projeto (com confirmação)
- Busca/filtro por nome
- Cards responsivos
```

Validação:
- [ ] Lista projetos do usuário
- [ ] Criar novo projeto funciona
- [ ] Editar projeto atualiza
- [ ] Deletar remove projeto
- [ ] Busca filtra corretamente

### 3.4: Editor 3D (Three.js)
**Comando para Cursor:**
```
Fase 3.4: Crie editor 3D com:
- Canvas Three.js renderizando piscina
- Controles de câmera (zoom, rotação, pan)
- Painel de propriedades (dimensões, profundidade)
- Seletor de cores/materiais
- Preview em tempo real
- Botão reset câmera
```

Validação:
- [ ] Piscina 3D renderiza
- [ ] Câmera responde
- [ ] Propriedades atualizam modelo
- [ ] Cores/materiais mudam em tempo real

### 3.5: Salvamento e Compartilhamento
**Comando para Cursor:**
```
Fase 3.5: Adicione persistência:
- Botão salvar projeto
- Feedback visual (sucesso/erro)
- Exportar como PDF
- Link de compartilhamento
- Copiar link para clipboard
```

Validação:
- [ ] Salvar persiste no backend
- [ ] PDF exporta com imagem 3D
- [ ] Link compartilhável gerado
- [ ] Copiar funciona

### 3.6: Responsividade
**Comando para Cursor:**
```
Fase 3.6: Faça responsivo:
- Mobile (320px+)
- Tablet (768px+)
- Desktop (1024px+)
- Menu hambúrguer em mobile
- 3D viewer adapta ao tamanho
- Testes em 3 breakpoints
```

Validação:
- [ ] Mobile: menu hambúrguer funciona
- [ ] Tablet: layout adapta
- [ ] Desktop: layout completo
- [ ] Sem scroll horizontal desnecessário
- [ ] 3D viewer sempre visível

**Status Fase 3:** ✅ COMPLETO → Próximo: Fase 4

---

## 🗄️ FASE 4: BANCO DE DADOS (3-5 dias)

### 4.1: Migrações Alembic
**Comando para Cursor:**
```
Fase 4.1: Configure Alembic:
- Inicialize Alembic
- Crie migração inicial (create all tables)
- Script para executar migrações
- Teste: aplicar e reverter migrações
```

Validação:
- [ ] `alembic upgrade head` funciona
- [ ] Tabelas criadas no PostgreSQL
- [ ] `alembic downgrade -1` reverte

### 4.2: Seed Data
**Comando para Cursor:**
```
Fase 4.2: Crie seed data:
- Script Python que popula BD
- Usuários de teste
- Projetos de exemplo
- Materiais pré-configurados
```

Validação:
- [ ] Script roda sem erros
- [ ] Dados aparecem no BD
- [ ] Login com usuário teste funciona

### 4.3: Backups
**Comando para Cursor:**
```
Fase 4.3: Configure backups:
- Script de backup automático
- Documentação de restauração
- Teste de restauração
```

Validação:
- [ ] Backup script roda
- [ ] Arquivo backup criado
- [ ] Consegue restaurar

**Status Fase 4:** ✅ COMPLETO → Próximo: Fase 5

---

## 🌍 FASE 5: DEPLOY (3-5 dias)

### 5.1: Deploy Backend
**Comando para Cursor:**
```
Fase 5.1: Faça deploy do backend:
- Conta Railway ou Render
- Conectar repositório GitHub
- Variáveis de ambiente em produção
- PostgreSQL em produção
- CORS configurado
- Teste da API ao vivo
```

Validação:
- [ ] API rodando em propiscineiro-api.com
- [ ] `/docs` acessível
- [ ] Autenticação funciona
- [ ] Projetos salvam no BD

### 5.2: Deploy Frontend
**Comando para Cursor:**
```
Fase 5.2: Faça deploy do frontend:
- Conta Vercel ou Netlify
- Conectar repositório GitHub
- Build otimizado
- Variáveis de ambiente apontando para API produção
- Teste completo
```

Validação:
- [ ] App rodando em propiscineiro.com
- [ ] Login/logout funciona
- [ ] Dashboard carrega projetos
- [ ] Editor 3D funciona

### 5.3: Domínio + SSL
**Comando para Cursor:**
```
Fase 5.3: Configure domínio:
- Registrar domínio principal
- DNS apontando para Vercel/Render
- SSL automático ativo
```

Validação:
- [ ] https://propiscineiro.com funciona
- [ ] Certificado válido
- [ ] Sem avisos de segurança

### 5.4: Landing Page
**Comando para Cursor:**
```
Fase 5.4: Crie landing page:
- Página inicial atrativa
- Features listadas
- Pricing (Freemium)
- CTA para registro
- Footer com links
- SEO básico (meta tags)
```

Validação:
- [ ] Landing acessível
- [ ] Estilos alinhados com app
- [ ] Links funcionam
- [ ] Mobile responsivo

### 5.5: Testes Produção
**Comando para Cursor:**
```
Fase 5.5: Teste produção:
- Fluxo completo (registro → login → criar projeto → salvar)
- Performance (Lighthouse 90+)
- Compatibilidade (Chrome, Firefox, Safari)
- Teste de carga básico
```

Validação:
- [ ] Fluxo completo funciona
- [ ] Lighthouse score 80+
- [ ] Sem erros no console
- [ ] Rápido em conexão 3G

**Status Fase 5:** ✅ COMPLETO → 🎉 MVP AO VIVO!

---

## 🔄 Checklist de Segurança

- [ ] Senhas hasheadas com bcrypt
- [ ] JWT com 24h expiração
- [ ] CORS apenas para domínios permitidos
- [ ] SQL injection protegido (SQLAlchemy)
- [ ] Rate limiting em auth endpoints
- [ ] HTTPS obrigatório em produção
- [ ] `.env` não commitado
- [ ] Sem credenciais no código
- [ ] Input validado em todos endpoints
- [ ] CSRF tokens em forms sensíveis

---

## 📊 Checklist de Qualidade

- [ ] Cobertura testes: 70%+
- [ ] Sem TODOs no código
- [ ] Docstrings completas (Python)
- [ ] Type hints (Python e TypeScript)
- [ ] ESLint limpo (frontend)
- [ ] Sem console.log em produção
- [ ] Sem `any` type em TypeScript
- [ ] README.md atualizado
- [ ] CHANGELOG.md preenchido

---

## 🚀 Comandos Essenciais

```bash
# Docker
docker-compose up -d              # Iniciar
docker-compose down               # Parar
docker-compose logs -f            # Ver logs
docker-compose ps                 # Status

# Backend
docker-compose exec backend pytest --cov     # Testes
docker-compose exec backend python -m black . # Format
docker-compose exec backend flake8 .         # Lint

# Frontend
docker-compose exec frontend npm test        # Testes
docker-compose exec frontend npm run build   # Build

# Git
git add .                         # Stage
git commit -m "Mensagem"          # Commit
git push origin main              # Push
git pull origin main              # Pull

# Banco
docker-compose exec db psql -U dev -d propiscineiro
```

---

## 📱 URLs Desenvolvimento

| Serviço | URL | Status |
|---------|-----|--------|
| Frontend | http://localhost:5173 | ✅ |
| Backend | http://localhost:8000 | ✅ |
| API Docs | http://localhost:8000/docs | ✅ |
| Database | localhost:5432 | ✅ |

---

## 💾 URLs Produção

| Serviço | URL |
|---------|-----|
| App | https://propiscineiro.com |
| Landing | https://propiscineiro.com |
| API | https://api.propiscineiro.com |
| Docs | https://api.propiscineiro.com/docs |

---

## 📞 Suporte e Troubleshooting

**Problema: Container não inicia**
```bash
docker-compose logs [serviço]  # Ver logs
docker-compose down -v         # Limpar tudo
docker-compose up -d           # Reiniciar
```

**Problema: Porta em uso**
```bash
# Mude a porta em docker-compose.yml
ports:
  - "5434:5432"  # Use 5434 em vez de 5432
```

**Problema: BD não conecta**
```bash
docker-compose exec db psql -U dev -d propiscineiro
# Teste comando acima
```

**Problema: Node modules corrupto**
```bash
docker-compose exec frontend rm -rf node_modules
docker-compose up -d --build
```

---

**Documento criado:** Dezembro 2024  
**Versão:** 1.0  
**Projeto:** Propiscineiro MicroSaaS  
**Mantenedor:** Seu Nome

---

**🎯 Próximo passo:** Leia FASE_1_INICIO.md e comece com Cursor IDE! 🚀
