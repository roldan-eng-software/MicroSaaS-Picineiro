# 📋 DIRETRIZES DE DESENVOLVIMENTO - Propiscineiro MicroSaaS

**Versão:** 1.0  
**Data:** Dezembro 2024  
**Projeto:** Propiscineiro - Plataforma de Design de Piscinas  
**Stack:** Python (FastAPI) + React + PostgreSQL + Docker

---

## 📌 1. PROPÓSITO DO PROJETO

Criar um **MicroSaaS** que permite usuários:
- 🏊 Visualizar e customizar designs de piscinas em 3D
- 💾 Salvar projetos na nuvem
- 🎨 Aplicar diferentes estilos e materiais
- 📥 Exportar designs em PDF
- 👥 Compartilhar projetos com outros usuários
- 💳 Sistema de pagamento para recursos premium

**Modelo de Negócio:** Freemium (plano básico grátis + Premium pago)

---

## 🛠️ 2. STACK TECNOLÓGICO (OBRIGATÓRIO)

### Backend
- **Framework:** FastAPI (Python 3.11+)
- **ORM:** SQLAlchemy 2.0+
- **Validação:** Pydantic v2
- **Autenticação:** PyJWT + bcrypt
- **API:** RESTful com documentação automática (Swagger)
- **Banco de Dados:** PostgreSQL 15+

### Frontend
- **Framework:** React 18+
- **Linguagem:** TypeScript
- **Visualização 3D:** Three.js ou Babylon.js
- **UI Framework:** TailwindCSS
- **State Management:** Zustand
- **Build Tool:** Vite
- **HTTP Client:** Axios

### Infraestrutura
- **Containerização:** Docker + Docker Compose
- **Hospedagem Backend:** Railway ou Render
- **Hospedagem Frontend:** Vercel ou Netlify
- **Banco de Dados:** Railway PostgreSQL ou Render Database
- **Armazenamento:** Cloudflare R2 ou AWS S3
- **Versionamento:** Git + GitHub
- **CI/CD:** GitHub Actions (opcional, mas recomendado)

---

## 🐳 3. DOCKER - OBRIGAÇÃO CENTRAL

**TODA implementação DEVE começar com Docker.**

### Estrutura Docker Obrigatória

```yaml
# docker-compose.yml
version: '3.8'
services:
  db:
    image: postgres:15-alpine
    environment:
      POSTGRES_DB: propiscineiro
      POSTGRES_USER: dev
      POSTGRES_PASSWORD: dev123
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data

  backend:
    build: ./backend
    command: uvicorn main:app --host 0.0.0.0 --port 8000 --reload
    ports:
      - "8000:8000"
    environment:
      DATABASE_URL: postgresql://dev:dev123@db:5432/propiscineiro
      SECRET_KEY: dev-secret-key
      DEBUG: "true"
    volumes:
      - ./backend:/app
    depends_on:
      - db

  frontend:
    build: ./frontend
    command: npm run dev
    ports:
      - "5173:5173"
    volumes:
      - ./frontend:/app
      - /app/node_modules

volumes:
  postgres_data:
```

### Requisitos Docker

- ✅ **Dockerfile** em cada serviço (backend e frontend)
- ✅ **docker-compose.yml** configurado
- ✅ **.dockerignore** para otimizar builds
- ✅ Comando para iniciar tudo: `docker-compose up -d`
- ✅ Banco de dados populado automaticamente
- ✅ Variáveis de ambiente via `.env`
- ✅ Nenhuma instalação manual de dependências necessária

---

## 📐 4. ESTRUTURA DE PASSOS OBRIGATÓRIA

**TODO projeto deve ser desenvolvido em 5 fases distintas. NUNCA pule etapas.**

### Fase 1️⃣: Preparação e Infraestrutura
**Duração:** 1-2 dias  
**Escopo:**
- [ ] Criar estrutura de pastas do projeto
- [ ] Configurar Docker e Docker Compose
- [ ] Criar arquivo `.env` com variáveis
- [ ] Documentar instruções de setup
- [ ] Garantir que `docker-compose up` funciona sem erros

**Saída esperada:** Containers rodando, banco de dados pronto, estrutura pronta

---

### Fase 2️⃣: Backend (FastAPI)
**Duração:** 1-2 semanas  
**Escopo incremental:**

#### 2.1 - Setup Inicial Backend
- [ ] Criar `requirements.txt` com todas as dependências
- [ ] Configurar FastAPI com estrutura em camadas
- [ ] Criar modelos Pydantic para validação
- [ ] Configurar conexão com PostgreSQL via SQLAlchemy
- [ ] Criar script de migração de banco de dados
- [ ] Implementar logging centralizado

#### 2.2 - Autenticação e Usuários
- [ ] Criar tabela de usuários com hash de senha
- [ ] Endpoint de registro (`POST /auth/register`)
- [ ] Endpoint de login (`POST /auth/login`)
- [ ] Endpoint de refresh token (`POST /auth/refresh`)
- [ ] Middleware de autenticação JWT
- [ ] Validação de email (opcional para MVP)

#### 2.3 - CRUD de Projetos de Piscina
- [ ] Criar modelo de Projeto (`Projeto`)
- [ ] Endpoints CRUD completos:
  - `GET /projetos` - Listar todos os projetos do usuário
  - `POST /projetos` - Criar novo projeto
  - `GET /projetos/{id}` - Obter um projeto
  - `PUT /projetos/{id}` - Atualizar projeto
  - `DELETE /projetos/{id}` - Deletar projeto
- [ ] Validações de permissão (usuário só acessa seus projetos)
- [ ] Timestamps (created_at, updated_at)

#### 2.4 - Upload de Imagens/Arquivos
- [ ] Endpoint para upload de imagens de fundo
- [ ] Integração com Cloudflare R2 ou AWS S3
- [ ] Gerar URLs públicas para images
- [ ] Validar tipo e tamanho de arquivo
- [ ] Cleanup de arquivos quando projeto é deletado

#### 2.5 - Testes Backend
- [ ] Testes unitários com pytest
- [ ] Testes de integração para API
- [ ] Cobertura mínima: 70%
- [ ] Documentação automática com Swagger em `/docs`

**Saída esperada:** API completa e testada, documentada automaticamente

---

### Fase 3️⃣: Frontend (React)
**Duração:** 2-3 semanas  
**Escopo incremental:**

#### 3.1 - Setup Inicial Frontend
- [ ] Criar projeto React com Vite
- [ ] Configurar TypeScript
- [ ] Instalar TailwindCSS
- [ ] Configurar Zustand para state management
- [ ] Variáveis de ambiente (`.env.local`)
- [ ] Configurar Axios com interceptadores

#### 3.2 - Autenticação (UI)
- [ ] Página de registro com validação
- [ ] Página de login com validação
- [ ] Armazenar token no localStorage
- [ ] Rota protegida para dashboard
- [ ] Logout funcional
- [ ] Refresh automático de token

#### 3.3 - Dashboard Básico
- [ ] Layout com navbar e sidebar
- [ ] Listar projetos do usuário
- [ ] Botão criar novo projeto
- [ ] Botão editar projeto
- [ ] Botão deletar projeto (com confirmação)
- [ ] Busca/filtro por nome do projeto

#### 3.4 - Editor de Piscina (Visualização 3D)
- [ ] Canvas 3D com Three.js ou Babylon.js
- [ ] Renderizar modelo base de piscina
- [ ] Controles de câmera (zoom, rotação, pan)
- [ ] Painel de propriedades (dimensões, profundidade)
- [ ] Seletor de cores/materiais
- [ ] Preview em tempo real

#### 3.5 - Salvamento e Compartilhamento
- [ ] Botão salvar projeto
- [ ] Feedback visual de sucesso/erro
- [ ] Exportar como PDF (com biblioteca html2pdf)
- [ ] Link de compartilhamento (público ou privado)
- [ ] Copiar link para clipboard

#### 3.6 - Responsividade
- [ ] Design mobile-first
- [ ] Testar em tablet, mobile, desktop
- [ ] Toques responsivos no 3D viewer

**Saída esperada:** Interface completa, intuitiva e responsiva

---

### Fase 4️⃣: Banco de Dados e Dados Persistentes
**Duração:** 3-5 dias  
**Escopo:**

#### 4.1 - Migrações com Alembic
- [ ] Configurar Alembic para versionamento do DB
- [ ] Criar migrações automáticas
- [ ] Script para executar migrações dentro do Docker

#### 4.2 - Seed Data (Dados Iniciais)
- [ ] Usuários de teste
- [ ] Projetos de exemplo
- [ ] Materiais pré-configurados para piscinas
- [ ] Script de seed em Python

#### 4.3 - Backups e Restauração
- [ ] Documentar processo de backup
- [ ] Script para backup automático
- [ ] Plano de disaster recovery

**Saída esperada:** Banco robusto, versionado e recuperável

---

### Fase 5️⃣: Hospedagem, Deploy e Landing Page
**Duração:** 3-5 dias  
**Escopo:**

#### 5.1 - Deploy Backend
- [ ] Criar conta no Railway ou Render
- [ ] Conectar repositório GitHub
- [ ] Configurar variáveis de ambiente em produção
- [ ] Setup de PostgreSQL em produção
- [ ] CORS configurado corretamente
- [ ] Logs centralizados
- [ ] Monitoramento de erros (Sentry opcional)
- [ ] Teste de API em produção

#### 5.2 - Deploy Frontend
- [ ] Criar conta no Vercel ou Netlify
- [ ] Conectar repositório GitHub
- [ ] Build otimizado
- [ ] Variáveis de ambiente de produção
- [ ] Teste de aplicação em produção
- [ ] CDN automático

#### 5.3 - Domínio e SSL
- [ ] Registrar domínio (ex: propiscineiro.com)
- [ ] Apontar DNS
- [ ] SSL automático via Vercel/Render
- [ ] Certificado válido e confiável

#### 5.4 - Landing Page
- [ ] Criar página landing com informações
- [ ] Seção de features
- [ ] Pricing (Freemium)
- [ ] Call-to-action para registro
- [ ] Footer com links
- [ ] SEO básico (meta tags, títulos)
- [ ] Hospedado no Vercel

#### 5.5 - Testes de Produção
- [ ] Testar fluxo completo: registro → login → criar projeto → salvar
- [ ] Teste de carga básico
- [ ] Verificar performance (Lighthouse)
- [ ] Teste em navegadores diferentes

**Saída esperada:** Aplicação ao vivo, pronta para usuários

---

## 📝 5. CONVENÇÕES DE CÓDIGO

### Backend (Python/FastAPI)

```python
# Nomenclatura
- Funções: snake_case
- Constantes: UPPER_SNAKE_CASE
- Classes: PascalCase
- Privados: _leading_underscore

# Exemplo de endpoints
GET    /api/v1/projetos           - Listar
POST   /api/v1/projetos           - Criar
GET    /api/v1/projetos/{id}      - Obter um
PUT    /api/v1/projetos/{id}      - Atualizar
DELETE /api/v1/projetos/{id}      - Deletar

# Versionamento de API
Sempre usar /api/v1/ como prefixo
```

### Frontend (React/TypeScript)

```typescript
// Nomenclatura
- Componentes: PascalCase (Botao, ListaProjetos)
- Hooks: camelCase, prefixar com "use"
- Arquivos: PascalCase para componentes, camelCase para utils
- Props: camelCase
- Estado Zustand: snake_case

// Estrutura de pastas
src/
├── components/     (componentes reutilizáveis)
├── pages/         (páginas/rotas)
├── hooks/         (hooks customizados)
├── store/         (Zustand state)
├── services/      (chamadas de API)
├── types/         (interfaces TypeScript)
├── utils/         (funções utilitárias)
└── styles/        (estilos globais)
```

### Variáveis de Ambiente

```env
# Backend
DATABASE_URL=postgresql://user:pass@localhost:5432/propiscineiro
SECRET_KEY=sua-chave-secreta-super-segura
DEBUG=false
ENVIRONMENT=production
AWS_ACCESS_KEY_ID=xxx
AWS_SECRET_ACCESS_KEY=xxx

# Frontend
VITE_API_URL=https://api.propiscineiro.com
VITE_APP_NAME=Propiscineiro
```

---

## 🔐 6. SEGURANÇA

### Obrigações Mínimas

- [ ] Senhas hasheadas com bcrypt
- [ ] JWT com expiração de 24h
- [ ] CORS configurado apenas para domínios permitidos
- [ ] SQL Injection proteção (SQLAlchemy paramétrico)
- [ ] Rate limiting em endpoints de autenticação
- [ ] Validação de entrada em TODOS os endpoints
- [ ] HTTPS em produção (obrigatório)
- [ ] Variáveis sensíveis nunca em .env do git
- [ ] Tokens não armazenados em localStorage (usar httpOnly cookies se possível)
- [ ] CSFR token para operações sensíveis

---

## 📊 7. QUALIDADE DE CÓDIGO

### Testes Obrigatórios

- [ ] Backend: pytest com cobertura mínima 70%
- [ ] Frontend: Jest/Vitest com testes de componentes críticos
- [ ] E2E: Cypress para fluxos principais (depois do MVP)

### Linting e Formatação

- [ ] Backend: Black + Flake8 + isort
- [ ] Frontend: ESLint + Prettier
- [ ] Pre-commit hooks configurados

### Documentação

- [ ] Swagger/OpenAPI automático no backend
- [ ] README.md com instruções de setup
- [ ] Docstrings em funções Python
- [ ] Comentários em código complexo
- [ ] CHANGELOG.md atualizando versões

---

## 🚨 8. PROBLEMAS COMUNS A EVITAR

### ❌ NUNCA FAÇA ISSO

1. **Pular Docker:** Sempre comece com Docker. Sem exceções.
2. **Misturar fases:** Não comece frontend sem backend pronto.
3. **Segurança depois:** Implemente segurança desde o início.
4. **Banco sem migração:** Use Alembic desde dia 1.
5. **Credentials no código:** Use variáveis de ambiente.
6. **Sem testes:** Testes são investimento, não luxo.
7. **Deploy sem staging:** Teste em um ambiente de staging antes de produção.
8. **Ignorar logs:** Logs são essenciais para debug em produção.
9. **Performance depois:** Monitore performance desde o início.
10. **Sem versionamento:** Commit todo dia, pushes frequentes.

---

## ✅ 9. CHECKLIST DE CONCLUSÃO

### MVP (Mínimo Viável)

- [ ] Autenticação funcional
- [ ] CRUD de projetos
- [ ] Visualização 3D básica
- [ ] Salvamento na nuvem
- [ ] Deploy em produção
- [ ] Landing page básica

### Phase 2 (Após MVP)

- [ ] Exportar PDF
- [ ] Compartilhar projetos
- [ ] Premium features
- [ ] Sistema de pagamento
- [ ] Analytics básico

---

## 📞 10. CONTATO E ESCOPO

**Desenvolvedor Principal:** [Seu Nome]  
**Projeto:** Propiscineiro MicroSaaS  
**Última Atualização:** Dezembro 2024

### Quando Pedir Ajuda a Agentes de IA

✅ **Peça ajuda com:**
- Código seguindo estas diretrizes
- Estrutura de projeto
- Debugging de erros
- Otimização de performance
- Testes e qualidade
- Deploy e infraestrutura

❌ **NÃO peça ajuda com:**
- Mudar de stack tecnológico
- Pular fases do desenvolvimento
- Features fora do escopo
- Código sem testes
- Deploy sem staging

---

## 🎯 RESUMO EXECUTIVO

1. **Docker first** - Tudo dentro de containers
2. **Fases claras** - Nunca pule passos
3. **Backend sólido** - FastAPI + PostgreSQL + JWT
4. **Frontend limpo** - React + Three.js + Zustand
5. **Testes sempre** - Cobertura mínima 70%
6. **Segurança desde dia 1** - Sem exceções
7. **Deploy organizado** - Backend → Frontend → Landing
8. **Documentação viva** - Mantida atualizada

---

**Última revisão:** Dezembro 2024  
**Próxima revisão:** Quando MVP ficar pronto  
**Mantenedor:** Equipe de Desenvolvimento
