# 📋 DIRETRIZES DE DESENVOLVIMENTO - Pioneiros SaaS

**Versão:** 2.0  
**Data:** Dezembro 2025  
**Projeto:** Pioneiros - Plataforma de Gestão de Manutenção de Piscinas  
**Stack:** Python (Django) + Bootstrap/Tailwind + PostgreSQL + Docker

---

## 📌 1. PROPÓSITO DO PROJETO

Criar um **SaaS** especializado em **gestão de manutenção de piscinas** que permite usuários:

- 👥 **Dashboard CRM**: Gerenciar clientes com informações completas de piscinas e histórico de serviços
- 📋 **Gerador de Orçamentos**: Criar orçamentos profissionais em PDF com envio automático via WhatsApp
- ⚗️ **Calculadora de Química**: Calcular dosagens precisas de cloro, pH e alcalinidade para cada piscina
- 📊 **Histórico de Serviços**: Rastrear todos os serviços realizados por cliente
- 💬 **Integração WhatsApp**: Enviar orçamentos e comunicações direto com clientes
- 📱 **Responsivo**: Funcionar perfeitamente em desktop, tablet e mobile

**Modelo de Negócio:** Freemium (plano básico grátis + Premium com recursos avançados)

---

## 🛠️ 2. STACK TECNOLÓGICO (OBRIGATÓRIO)

### Backend
- **Framework:** Django 4.2+ (com Django REST Framework para API)
- **ORM:** Django ORM integrado
- **Validação:** Django Forms + DRF Serializers
- **Autenticação:** Django Allauth + DRF Token Auth
- **API:** RESTful com schema automático (DRF)
- **Banco de Dados:** PostgreSQL 15+
- **Celery:** Para tarefas assíncronas (geração PDF, envio WhatsApp)
- **Relatórios PDF:** ReportLab ou WeasyPrint

### Frontend
- **Framework:** Bootstrap 5 ou Tailwind CSS (integrado no Django)
- **Linguagem:** HTML5 + CSS3 + JavaScript vanilla (ou Alpine.js para interatividade)
- **Componentes:** Django Templates com Jinja2
- **Gráficos:** Chart.js ou ApexCharts
- **Forms:** Django Forms com Crispy Forms
- **HTTP Client:** Fetch API ou htmx para AJAX

### Integrações Externas
- **WhatsApp API:** Twilio, MessageBird ou official WhatsApp Business API
- **PDF Generation:** WeasyPrint (CSS para PDF)
- **Armazenamento:** AWS S3, Cloudflare R2 ou local storage
- **Email:** SendGrid ou SMTP próprio
- **Banco de Dados em Produção:** Railway PostgreSQL ou Render Database

### Infraestrutura
- **Containerização:** Docker + Docker Compose
- **Hospedagem Backend:** Railway, Render ou PythonAnywhere
- **Hospedagem Frontend:** Vercel, Netlify ou mesmo backend Django
- **Versionamento:** Git + GitHub
- **CI/CD:** GitHub Actions

---

## 🐳 3. DOCKER - OBRIGAÇÃO CENTRAL

**TODA implementação DEVE começar com Docker. Sem exceções.**

### Estrutura Docker Obrigatória

```yaml
# docker-compose.yml
version: '3.8'
services:
  db:
    image: postgres:15-alpine
    environment:
      POSTGRES_DB: pioneiros
      POSTGRES_USER: dev
      POSTGRES_PASSWORD: dev123
      POSTGRES_INITDB_ARGS: "--encoding=UTF8 --locale=pt_BR.UTF-8"
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U dev"]
      interval: 10s
      timeout: 5s
      retries: 5

  backend:
    build: ./backend
    command: sh -c "python manage.py migrate && python manage.py runserver 0.0.0.0:8000"
    ports:
      - "8000:8000"
    environment:
      DEBUG: "True"
      DATABASE_URL: postgresql://dev:dev123@db:5432/pioneiros
      SECRET_KEY: dev-secret-key-change-in-production
      ALLOWED_HOSTS: "localhost,127.0.0.1"
      ENVIRONMENT: development
    volumes:
      - ./backend:/app
      - ./backend/staticfiles:/app/staticfiles
      - ./backend/media:/app/media
    depends_on:
      db:
        condition: service_healthy
    stdin_open: true
    tty: true

  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"

  celery:
    build: ./backend
    command: celery -A config worker -l info
    environment:
      DEBUG: "True"
      DATABASE_URL: postgresql://dev:dev123@db:5432/pioneiros
      SECRET_KEY: dev-secret-key-change-in-production
      CELERY_BROKER_URL: redis://redis:6379/0
      CELERY_RESULT_BACKEND: redis://redis:6379/0
    volumes:
      - ./backend:/app
    depends_on:
      - db
      - redis
      - backend

volumes:
  postgres_data:
```

### Requisitos Docker

- ✅ **Dockerfile** na pasta `backend/`
- ✅ **docker-compose.yml** na raiz do projeto
- ✅ **.dockerignore** para otimizar builds
- ✅ Comando para iniciar tudo: `docker-compose up -d`
- ✅ Banco de dados criado automaticamente com migrações
- ✅ Variáveis de ambiente via `.env`
- ✅ Nenhuma instalação manual necessária
- ✅ Redis para cache e fila Celery
- ✅ Health checks configurados

---

## 📐 4. ESTRUTURA DE PASSOS OBRIGATÓRIA

**TODO projeto deve ser desenvolvido em 4 fases distintas. NUNCA pule etapas.**

---

### Fase 1️⃣: Preparação e Infraestrutura

**Duração:** 1-2 dias  
**Escopo:**
- [ ] Criar estrutura de pastas do projeto
- [ ] Configurar Django base (`django-admin startproject config`)
- [ ] Configurar Django Settings (dev e prod)
- [ ] Setup Docker e Docker Compose
- [ ] Criar arquivo `.env` com variáveis
- [ ] Instalar e configurar PostgreSQL no Docker
- [ ] Executar `docker-compose up` com sucesso
- [ ] Documentar instruções de setup em README.md

**Saída esperada:** Containers rodando, banco de dados pronto, Django admin acessível em `http://localhost:8000/admin`

---

### Fase 2️⃣: Backend (Django + API)

**Duração:** 2-3 semanas  
**Escopo incremental:**

#### 2.1 - Setup Inicial Backend
- [ ] Criar `requirements.txt` com dependências (Django, DRF, Psycopg2, Pillow, etc.)
- [ ] Configurar Django Settings para desenvolvimento e produção
- [ ] Setup banco de dados PostgreSQL
- [ ] Criar superuser padrão
- [ ] Configurar Static Files e Media Files
- [ ] Implementar logging centralizado

**Dependências recomendadas:**
```
Django==4.2.8
djangorestframework==3.14.0
django-allauth==0.57.0
django-cors-headers==4.3.1
django-crispy-forms==2.1
crispy-bootstrap5==0.7
psycopg2-binary==2.9.9
Pillow==10.1.0
celery==5.3.4
redis==5.0.1
WeasyPrint==59.3
python-decouple==3.8
requests==2.31.0
```

#### 2.2 - Modelos Django (Database Schema)
- [ ] **Cliente**: nome, telefone, email, endereço, cidade, CPF/CNPJ
- [ ] **Piscina**: vinculada ao cliente, tamanho (litros), tipo (alvenaria, fibra, de vinil), revestimento, profundidade
- [ ] **Serviço**: data, tipo (limpeza, manutenção, tratamento químico), descrição, valor, tempo gasto
- [ ] **Orçamento**: cliente, data, itens (descrição, quantidade, valor unitário), total, status (aberto, aceito, recusado), validade
- [ ] **Cálculo Químico**: cliente/piscina, data, tipo (cloro, pH, alcalinidade), dosagem calculada, observações
- [ ] Timestamps (created_at, updated_at) em todos os modelos
- [ ] Soft delete para registros importantes

#### 2.3 - Autenticação
- [ ] Endpoint de registro (`POST /api/auth/register`)
- [ ] Endpoint de login (`POST /api/auth/login`)
- [ ] Endpoint de logout (`POST /api/auth/logout`)
- [ ] Token-based authentication (DRF)
- [ ] Permissões: usuário só acessa seus próprios dados
- [ ] Email de confirmação (opcional para MVP)

#### 2.4 - API CRUD - Clientes
- [ ] `GET /api/clientes/` - Listar clientes do usuário logado
- [ ] `POST /api/clientes/` - Criar novo cliente
- [ ] `GET /api/clientes/{id}/` - Obter cliente com piscinas e histórico
- [ ] `PUT /api/clientes/{id}/` - Atualizar dados do cliente
- [ ] `DELETE /api/clientes/{id}/` - Deletar cliente
- [ ] Filtro por nome, cidade, status
- [ ] Paginação (10-20 itens por página)

#### 2.5 - API CRUD - Piscinas
- [ ] `GET /api/clientes/{cliente_id}/piscinas/` - Listar piscinas do cliente
- [ ] `POST /api/clientes/{cliente_id}/piscinas/` - Adicionar piscina
- [ ] `PUT /api/piscinas/{id}/` - Atualizar dados da piscina
- [ ] `DELETE /api/piscinas/{id}/` - Deletar piscina
- [ ] Validações de volume, profundidade, etc.

#### 2.6 - API CRUD - Serviços
- [ ] `GET /api/clientes/{cliente_id}/servicos/` - Histórico de serviços
- [ ] `POST /api/clientes/{cliente_id}/servicos/` - Registrar novo serviço
- [ ] `PUT /api/servicos/{id}/` - Editar serviço
- [ ] `DELETE /api/servicos/{id}/` - Deletar serviço
- [ ] Filtro por data, tipo de serviço

#### 2.7 - API CRUD - Orçamentos
- [ ] `GET /api/orcamentos/` - Listar orçamentos do usuário
- [ ] `POST /api/orcamentos/` - Criar novo orçamento
- [ ] `GET /api/orcamentos/{id}/` - Obter detalhes do orçamento
- [ ] `PUT /api/orcamentos/{id}/` - Atualizar orçamento
- [ ] `DELETE /api/orcamentos/{id}/` - Deletar orçamento
- [ ] Endpoint para gerar PDF: `GET /api/orcamentos/{id}/pdf/`
- [ ] Endpoint para enviar via WhatsApp: `POST /api/orcamentos/{id}/enviar-whatsapp/`

#### 2.8 - Calculadora de Química (API)
- [ ] `POST /api/calculos/cloro/` - Calcular dosagem de cloro
  - Parâmetros: volume (litros), ppm desejado, tipo de cloro
  - Retorno: gramas/mililitros necessários
- [ ] `POST /api/calculos/ph/` - Calcular correção de pH
  - Parâmetros: volume, pH atual, pH desejado
- [ ] `POST /api/calculos/alcalinidade/` - Calcular correção de alcalinidade
  - Parâmetros: volume, alcalinidade atual, alcalinidade desejada
- [ ] `GET /api/calculos/historico/{cliente_id}/` - Histórico de cálculos

#### 2.9 - Geração de PDF (Celery Task)
- [ ] Criar tarefa Celery: `gerar_orcamento_pdf(orcamento_id)`
- [ ] Usar WeasyPrint para converter HTML → PDF
- [ ] Salvar PDF em S3 ou local storage
- [ ] Retornar URL do PDF
- [ ] Task de limpeza de PDFs antigos

#### 2.10 - Integração WhatsApp
- [ ] Setup Twilio ou MessageBird
- [ ] Criar tarefa Celery: `enviar_orcamento_whatsapp(orcamento_id, telefone_cliente)`
- [ ] Formatar mensagem com link do PDF
- [ ] Registrar log de envio
- [ ] Trata erros gracefully

#### 2.11 - Testes Backend
- [ ] Testes unitários com pytest (modelos, funções de cálculo)
- [ ] Testes de integração para endpoints da API
- [ ] Testes de permissão (usuário não acessa dados de outro usuário)
- [ ] Cobertura mínima: 70%

**Saída esperada:** API completa funcional, testada, documentada no Django REST Swagger

---

### Fase 3️⃣: Frontend (Django Templates + Tailwind)

**Duração:** 2-3 semanas  
**Escopo incremental:**

#### 3.1 - Setup Inicial Frontend
- [ ] Instalar Tailwind CSS (ou Bootstrap 5)
- [ ] Criar base template com navbar
- [ ] Setup CSRF token
- [ ] Criar arquivo de estilos customizados
- [ ] Configurar Font Awesome para ícones
- [ ] Template responsivo mobile-first

#### 3.2 - Autenticação (UI)
- [ ] Página de registro com validação
- [ ] Página de login com validação
- [ ] Dashboard protegido (middleware de autenticação)
- [ ] Logout funcional
- [ ] Perfil do usuário

#### 3.3 - Dashboard Principal
- [ ] Cards com estatísticas:
  - Total de clientes
  - Serviços este mês
  - Orçamentos pendentes
  - Faturamento
- [ ] Gráficos com Chart.js:
  - Serviços por tipo (últimos 30 dias)
  - Faturamento mensal
  - Clientes por cidade

#### 3.4 - Gestão de Clientes (CRM)
- [ ] Página listando todos os clientes (tabela responsiva)
- [ ] Filtro por nome, cidade, status
- [ ] Paginação (20 clientes por página)
- [ ] Botão "Novo Cliente" com modal de criação
- [ ] Card de cliente com:
  - Informações básicas
  - Dados de piscinas (tabela inline)
  - Últimos serviços realizados
  - Ações: Editar, Deletar, Ver Detalhes
- [ ] Página de detalhes do cliente:
  - Informações completas
  - Abas: Piscinas | Serviços | Orçamentos
  - Adicionar piscina
  - Registrar novo serviço
  - Visualizar histórico

#### 3.5 - Gestão de Piscinas
- [ ] Dentro do cliente, seção de piscinas
- [ ] Form para adicionar piscina (tamanho, tipo, revestimento, profundidade)
- [ ] Editar/deletar piscina
- [ ] Mostrar volume total em litros

#### 3.6 - Gestão de Serviços
- [ ] Página de histórico de serviços (todos os clientes)
- [ ] Filtro por cliente, data, tipo de serviço
- [ ] Formulário para registrar novo serviço
- [ ] Editar/deletar serviço
- [ ] Mostrar total de serviços e receita

#### 3.7 - Gerador de Orçamentos
- [ ] Página de novo orçamento
- [ ] Seleção de cliente (com autocomplete)
- [ ] Seleção de piscina do cliente
- [ ] Tabela de itens (descrição, quantidade, valor unitário)
- [ ] Adicionar/remover itens dinamicamente com JavaScript
- [ ] Cálculo automático do total
- [ ] Data de validade
- [ ] Botão "Salvar Orçamento"
- [ ] Botão "Gerar PDF" (download)
- [ ] Botão "Enviar via WhatsApp" (abre modal com número)
- [ ] Página de orçamentos (listar todos, filtro por cliente/status)
- [ ] Visualizar orçamento (modal ou página)
- [ ] Alterar status (aberto, aceito, recusado)

#### 3.8 - Calculadora de Química
- [ ] Página interativa com abas: Cloro | pH | Alcalinidade
- [ ] Aba Cloro:
  - Input: Volume (litros)
  - Input: PPM desejado (dropdown: 1.0, 1.5, 2.0, 2.5, 3.0)
  - Input: Tipo de cloro (dropdown)
  - Botão "Calcular"
  - Resultado mostrado em destaque (gramas ou mL)
  - Botão "Usar na Piscina" (salva cálculo vinculado ao cliente)
- [ ] Aba pH:
  - Input: Volume
  - Input: pH atual
  - Input: pH desejado
  - Resultado: Gramas de ácido/base necessárias
- [ ] Aba Alcalinidade:
  - Similar ao pH
- [ ] Histórico de cálculos do cliente
- [ ] Gráfico de evolução (últimos cálculos)

#### 3.9 - Responsividade
- [ ] Mobile: Stack vertical, navegação hambúrguer
- [ ] Tablet: 2 colunas
- [ ] Desktop: Layout completo
- [ ] Testar em Chrome, Firefox, Safari, Mobile Safari

**Saída esperada:** Interface intuitiva, funcional e pronta para produção

---

### Fase 4️⃣: Hospedagem e Deploy

**Duração:** 3-5 dias  
**Escopo:**

#### 4.1 - Setup Ambiente de Produção
- [ ] Criar arquivo `.env.production`
- [ ] Configurar SECRET_KEY segura
- [ ] Configurar ALLOWED_HOSTS
- [ ] Desabilitar DEBUG
- [ ] Configurar banco PostgreSQL em produção
- [ ] Setup Redis em produção (para Celery e cache)

#### 4.2 - Deploy Backend
- [ ] Criar conta em Railway ou Render
- [ ] Conectar repositório GitHub
- [ ] Configurar variáveis de ambiente
- [ ] Setup PostgreSQL no Railway/Render
- [ ] Executar migrações em produção
- [ ] Configurar Celery worker
- [ ] Setup logs centralizados (opcional: Sentry)
- [ ] Teste da API em produção

#### 4.3 - Deploy Frontend
- [ ] Build estático: `python manage.py collectstatic --noinput`
- [ ] Hospedar via Railway/Render (mesmo servidor do backend)
- [ ] Ou fazer deploy separado em Vercel/Netlify

#### 4.4 - Configurações Finais
- [ ] Registrar domínio
- [ ] Apontar DNS
- [ ] SSL automático (Railway/Render inclusos)
- [ ] Configurar email (SendGrid ou SMTP)
- [ ] Testar WhatsApp API em produção

#### 4.5 - Testes de Produção
- [ ] Fluxo completo: login → criar cliente → gerar orçamento → enviar WhatsApp
- [ ] Performance em produção
- [ ] Verificar logs
- [ ] Testar PDF generation
- [ ] Testar WhatsApp integration

**Saída esperada:** Aplicação ao vivo e acessível

---

## 📝 5. CONVENÇÕES DE CÓDIGO

### Backend (Python/Django)

```python
# Nomenclatura
- Funções: snake_case
- Constantes: UPPER_SNAKE_CASE
- Classes: PascalCase
- Métodos privados: _leading_underscore
- Variáveis: snake_case

# Modelos Django
class Cliente(models.Model):
    usuario = models.ForeignKey(User, on_delete=models.CASCADE)
    nome = models.CharField(max_length=255)
    telefone = models.CharField(max_length=20)
    email = models.EmailField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['usuario', '-created_at']),
        ]

# Endpoints API
GET    /api/clientes/           - Listar
POST   /api/clientes/           - Criar
GET    /api/clientes/{id}/      - Obter um
PUT    /api/clientes/{id}/      - Atualizar
DELETE /api/clientes/{id}/      - Deletar

# Versionamento de API
Sempre usar /api/ como prefixo
Considerar /api/v1/ para expansão futura
```

### Frontend (Django Templates + JavaScript)

```html
<!-- Nomenclatura de templates -->
base.html
pages/dashboard.html
pages/clientes/lista.html
pages/clientes/detalhe.html
pages/orcamentos/novo.html
pages/calculadora.html

<!-- IDs e Classes CSS -->
- IDs: camelCase (modalNovoCliente, formOrcamento)
- Classes: kebab-case (btn-primary, card-cliente)
- Data attributes: data-cliente-id, data-orcamento-id

<!-- JavaScript -->
- Funções: camelCase
- Constantes: UPPER_SNAKE_CASE
- Variáveis: camelCase
```

### Estrutura de Pastas

```
pioneiros/
├── config/                    # Configurações Django
│   ├── settings/
│   │   ├── base.py           # Configurações comuns
│   │   ├── development.py    # Dev settings
│   │   └── production.py     # Prod settings
│   ├── urls.py
│   └── wsgi.py
├── apps/
│   ├── usuarios/             # Autenticação e usuários
│   ├── clientes/             # Gestão de clientes
│   ├── piscinas/             # Gestão de piscinas
│   ├── servicos/             # Histórico de serviços
│   ├── orcamentos/           # Gerador de orçamentos
│   └── quimica/              # Calculadora de química
├── templates/                # Templates HTML
├── static/                   # CSS, JS, imagens
├── media/                    # Uploads de usuários
├── tests/                    # Testes automatizados
├── docker-compose.yml
├── Dockerfile
├── requirements.txt
├── manage.py
└── README.md
```

### Variáveis de Ambiente

```env
# Backend
DEBUG=False
SECRET_KEY=sua-chave-segura-super-longa-e-aleatoria
DATABASE_URL=postgresql://user:password@localhost:5432/pioneiros
ALLOWED_HOSTS=localhost,127.0.0.1,seu-dominio.com
ENVIRONMENT=production

# WhatsApp/Twilio
TWILIO_ACCOUNT_SID=xxxxx
TWILIO_AUTH_TOKEN=xxxxx
TWILIO_PHONE_NUMBER=+5511999999999
TWILIO_WHATSAPP_NUMBER=+55119999999999

# Email
EMAIL_BACKEND=sendgrid
SENDGRID_API_KEY=xxxxx

# S3/Cloud Storage
AWS_ACCESS_KEY_ID=xxxxx
AWS_SECRET_ACCESS_KEY=xxxxx
AWS_STORAGE_BUCKET_NAME=pioneiros-bucket
AWS_S3_REGION_NAME=us-east-1
```

---

## 🔐 6. SEGURANÇA

### Obrigações Mínimas

- [ ] Senhas hasheadas (Django usa bcrypt por padrão)
- [ ] CSRF token em todos os forms
- [ ] Permissões: usuário só acessa seus próprios dados
- [ ] SQL Injection proteção (Django ORM paramétrico)
- [ ] XSS proteção (Django auto-escapa templates)
- [ ] Rate limiting em endpoints de autenticação
- [ ] Validação de entrada em TODOS os forms e API
- [ ] HTTPS em produção (obrigatório)
- [ ] Variáveis sensíveis nunca em git (usar `.env`)
- [ ] Secrets rotacionados periodicamente
- [ ] CORS configurado apenas para domínios permitidos
- [ ] Logs de atividades sensíveis (login, orçamentos, serviços)

---

## 📊 7. QUALIDADE DE CÓDIGO

### Testes Obrigatórios

- [ ] Backend: pytest com cobertura mínima 70%
  ```bash
  pytest --cov=apps --cov-report=html
  ```
- [ ] Testes de modelos (factory_boy para fixtures)
- [ ] Testes de API (APITestCase do DRF)
- [ ] Testes de permissões
- [ ] E2E: Selenium (opcional, mas recomendado)

### Linting e Formatação

- [ ] Backend: Black + Flake8 + isort
  ```bash
  black .
  isort .
  flake8
  ```
- [ ] Pre-commit hooks configurados

### Documentação

- [ ] README.md com instruções de setup
- [ ] Docstrings em modelos e funções (Google style)
- [ ] Comentários em código complexo
- [ ] CHANGELOG.md atualizando versões
- [ ] Swagger automático para API

---

## 🚨 8. PROBLEMAS COMUNS A EVITAR

### ❌ NUNCA FAÇA ISSO

1. **Pular Docker:** Sempre comece com Docker. Sem exceções.
2. **Misturar fases:** Não comece frontend sem backend pronto.
3. **Segurança depois:** Implemente desde o início.
4. **DEBUG=True em produção:** Verifica antes de deploy.
5. **Credentials no código:** Use `.env`.
6. **Sem testes:** Testes economizam tempo depois.
7. **Deploy direto para production:** Use staging antes.
8. **Ignorar logs:** Logs são essenciais para debug.
9. **Sem versionamento:** Commit todo dia.
10. **Sem backup de banco:** Configure backup automático.
11. **N+1 queries:** Use `select_related()` e `prefetch_related()`
12. **Sem paginação:** Sempre pagine grandes resultados.

---

## ✅ 9. CHECKLIST DE CONCLUSÃO

### MVP (Mínimo Viável)

- [ ] Autenticação funcional
- [ ] CRUD de clientes com piscinas
- [ ] Gerador básico de orçamentos
- [ ] Calculadora de química
- [ ] PDF generation funcional
- [ ] Integração WhatsApp em testes
- [ ] Deploy em produção
- [ ] Testes com cobertura 70%

### Phase 2 (Após MVP)

- [ ] WhatsApp integration production-ready
- [ ] Relatórios avançados
- [ ] Agendamento de serviços
- [ ] Estoque de produtos químicos
- [ ] Sistema de pagamento online
- [ ] App mobile (React Native)
- [ ] Analytics e dashboards avançados

---

## 📞 10. INSTRUÇÕES PARA AGENTES DE IA

### ✅ QUANDO USAR ESTE ARQUIVO

Este arquivo **DEFINE O ESCOPO E AS REGRAS** para desenvolvimento do projeto Pioneiros. Qualquer geração de código, estrutura ou arquitetura **DEVE SEGUIR RIGOROSAMENTE** as diretrizes aqui descritas.

### 🚫 REGRA CENTRAL

**Não adicione, modifique ou remova nada fora das diretrizes. Se precisar de algo novo:**

1. Verifique se está dentro do escopo (seções 1-9)
2. Se não estiver, pergunte primeiro (não presuma)
3. Mantenha a estrutura de fases
4. Respeite o stack: Django + Bootstrap/Tailwind + PostgreSQL + Docker

### ✅ O que pode fazer

- Gerar código seguindo estas diretrizes
- Estruturar pastas e arquivos
- Criar modelos, views, serializers, forms
- Implementar APIs REST
- Debugar erros
- Otimizar performance
- Escrever testes
- Configurar deploy

### ❌ O que NÃO pode fazer

- **Mudar de framework** (Django é obrigatório)
- **Mudar de banco** (PostgreSQL é obrigatório)
- **Remover Docker** (Docker é central)
- **Pular fases** (sempre siga ordem)
- **Adicionar features não planejadas** (avise primeiro)
- **Deixar código sem testes** (teste obrigatório)
- **Ignorar segurança** (implemente desde início)
- **Gerar código desorganizado** (respeite estrutura)

### 📋 Prompt Padrão para Gerar Código

Quando pedir ao agente para gerar código, use:

```
Gere [componente/modelo/função] para o projeto Pioneiros, seguindo RIGOROSAMENTE as DIRETRIZES.md.

Específico:
- [Descrição exata do que precisa]
- Stack: Django + [Bootstrap ou Tailwind]
- Fase atual: [número da fase]
- Considere: [requisitos específicos]

Siga:
1. Nomenclatura conforme seção 5
2. Estrutura de pastas conforme seção 5
3. Segurança conforme seção 6
4. Qualidade conforme seção 7
```

### Exemplo Real

```
Gere o modelo Django "Orçamento" para o projeto Pioneiros, seguindo RIGOROSAMENTE as DIRETRIZES.md.

Específico:
- Modelo: Orçamento (vinculado a Cliente)
- Campos: cliente, data, itens (inline), total, status, data_validade
- Soft delete
- Timestamps
- Meta: ordering e indexes

Siga:
1. Nomenclatura PascalCase
2. Estrutura em apps/orcamentos/models.py
3. Sem DEBUG ou TODOs
4. Com docstrings
```

---

## ✅ CHECKLIST PRÉ-DEPLOY

Antes de fazer deploy, verifique:

- [ ] DEBUG=False em `settings/production.py`
- [ ] SECRET_KEY segura e longa
- [ ] ALLOWED_HOSTS configurado
- [ ] Database em produção funcional
- [ ] Redis em produção funcional
- [ ] Celery tasks testadas
- [ ] Email/SendGrid configurado
- [ ] WhatsApp/Twilio configurado
- [ ] PDF generation testado
- [ ] HTTPS/SSL automático
- [ ] Backups configurados
- [ ] Logs centralizados
- [ ] Testes passando (70%+ cobertura)
- [ ] Docker build sem erros
- [ ] Variáveis de ambiente em `.env.production`

---

## 📖 11. CONTATO E MANTENEDOR

**Desenvolvedor Principal:** Você  
**Projeto:** Pioneiros - Gestão de Piscinas SaaS  
**Última Atualização:** Dezembro 2025  
**Stack Final:** Django 4.2 + PostgreSQL + Bootstrap/Tailwind + Docker

### Quando Solicitar Ajuda

✅ **Peça ajuda com:**
- Código seguindo as diretrizes
- Estrutura de projeto
- Debugging de erros
- Testes e qualidade
- Deploy e infraestrutura
- Otimização de performance

❌ **Evite:**
- Mudar stack ou frameworks
- Adicionar features não planejadas
- Ignorar fases de desenvolvimento
- Código sem testes

---

## 🎯 RESUMO EXECUTIVO

1. **Docker First** - Tudo containerizado desde início
2. **Fases Claras** - Fase 1 → 2 → 3 → 4, nunca pule
3. **Backend Sólido** - Django + DRF + PostgreSQL + Celery
4. **Frontend Limpo** - Django Templates + Tailwind + Chart.js
5. **Testes Sempre** - Cobertura mínima 70%
6. **Segurança Dia 1** - CSRF, permissões, validação
7. **Deploy Organizado** - Staging antes de production
8. **Documentação Viva** - Mantida atualizada
9. **WhatsApp Native** - Integração com Twilio ou official API
10. **Qualidade** - Black, Flake8, pre-commit hooks

---

**Próxima Revisão:** Quando MVP estiver pronto  
**Versão:** 2.0 (Dezembro 2025)  
**Projeto:** Pioneiros SaaS
