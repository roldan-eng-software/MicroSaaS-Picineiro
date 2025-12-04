# 🚀 Guia Rápido de Inicialização - Propiscineiro

Este guia contém todas as instruções necessárias para iniciar o sistema localmente e analisar o funcionamento completo do MicroSaaS.

---

## 📋 Pré-requisitos

Antes de começar, certifique-se de ter instalado:

- **Docker Desktop** (versão 20.10 ou superior)
  - Download: <https://www.docker.com/products/docker-desktop/>
- **Git** (para clonar o repositório)
  - Download: <https://git-scm.com/downloads>

---

## 🔧 Passo 1: Clonar o Repositório

```bash
git clone https://github.com/roldan-eng-software/MicroSaaS-Picineiro.git
cd MicroSaaS-Picineiro
```

---

## 🐳 Passo 2: Iniciar os Containers Docker

### Opção A: Iniciar todos os serviços (Recomendado)

```bash
docker-compose up -d --build
```

Este comando irá:

- ✅ Construir as imagens do backend e frontend
- ✅ Iniciar o banco de dados PostgreSQL
- ✅ Iniciar o servidor FastAPI (backend)
- ✅ Iniciar o servidor Vite (frontend)

### Opção B: Iniciar apenas backend e banco de dados

```bash
docker-compose up -d --build backend db
```

---

## ⏱️ Passo 3: Aguardar Inicialização

O processo de build pode levar **2-5 minutos** na primeira execução.

Para acompanhar o progresso:

```bash
docker-compose logs -f
```

Para verificar se todos os containers estão rodando:

```bash
docker-compose ps
```

Você deve ver 3 containers com status "Up":

- `microsaas-picineiro-backend-1`
- `microsaas-picineiro-frontend-1`
- `microsaas-picineiro-db-1`

---

## 🌐 Passo 4: Acessar a Aplicação

### Frontend (Interface do Usuário)

**URL:** <http://localhost:5173>

### Backend (API)

**URL:** <http://localhost:8000>

### Documentação da API (Swagger)

**URL:** <http://localhost:8000/docs>

### Documentação da API (ReDoc)

**URL:** <http://localhost:8000/redoc>

---

## 👤 Passo 5: Criar sua Primeira Conta

1. Acesse <http://localhost:5173>
2. Clique em **"Cadastre-se"**
3. Preencha os dados:
   - **Email:** <seu@email.com>
   - **Usuário:** seuusuario
   - **Senha:** mínimo 6 caracteres
   - **Confirmar Senha:** mesma senha
4. Clique em **"Criar Conta"**
5. Você será redirecionado para a página de login

---

## 🔐 Passo 6: Fazer Login

1. Na página de login, insira:
   - **Usuário:** o username que você criou
   - **Senha:** sua senha
2. Clique em **"Entrar"**
3. Você será redirecionado para o **Dashboard**

---

## 📊 Passo 7: Explorar o Sistema

### No Dashboard você pode

✅ **Criar Novo Projeto**

- Clique no botão **"Novo Projeto"**
- Preencha o nome e descrição
- Clique em **"Criar"**

✅ **Visualizar Projetos**

- Veja todos os seus projetos em cards
- Cada card mostra: nome, descrição e data de criação

✅ **Editar Projeto**

- Clique no ícone de lápis no card do projeto
- (Funcionalidade em desenvolvimento)

✅ **Deletar Projeto**

- Clique no ícone de lixeira no card do projeto
- Confirme a exclusão

✅ **Fazer Logout**

- Clique no botão **"Sair"** no canto superior direito

---

## 🧪 Passo 8: Testar a API (Opcional)

### Via Swagger UI (Recomendado para iniciantes)

1. Acesse <http://localhost:8000/docs>
2. Explore os endpoints disponíveis:
   - **Auth**: `/auth/register`, `/auth/token`, `/auth/refresh`
   - **Users**: `/users/me`
   - **Projects**: `/projetos/` (GET, POST, PUT, DELETE)
   - **Upload**: `/api/v1/upload`

### Exemplo: Criar usuário via API

1. No Swagger, expanda **POST /auth/register**
2. Clique em **"Try it out"**
3. Preencha o JSON:

```json
{
  "email": "teste@exemplo.com",
  "username": "testusuario",
  "password": "senha123"
}
```

4. Clique em **"Execute"**
5. Veja a resposta com status 200 e os dados do usuário criado

### Exemplo: Fazer login via API

1. Expanda **POST /auth/token**
2. Clique em **"Try it out"**
3. Preencha:
   - **username:** testusuario
   - **password:** senha123
4. Clique em **"Execute"**
5. Copie o `access_token` da resposta

### Exemplo: Usar token para criar projeto

1. Clique no botão **"Authorize"** no topo da página
2. Cole o token no formato: `Bearer SEU_TOKEN_AQUI`
3. Clique em **"Authorize"** e depois **"Close"**
4. Agora você pode testar endpoints protegidos como **POST /projetos/**

---

## 🔍 Passo 9: Verificar Logs

### Ver logs de todos os serviços

```bash
docker-compose logs -f
```

### Ver logs apenas do backend

```bash
docker-compose logs -f backend
```

### Ver logs apenas do frontend

```bash
docker-compose logs -f frontend
```

### Ver logs do banco de dados

```bash
docker-compose logs -f db
```

---

## 🗄️ Passo 10: Acessar o Banco de Dados (Opcional)

### Conectar ao PostgreSQL via terminal

```bash
docker-compose exec db psql -U dev -d propiscineiro
```

### Comandos úteis no PostgreSQL

```sql
-- Listar todas as tabelas
\dt

-- Ver estrutura da tabela users
\d users

-- Ver todos os usuários
SELECT * FROM users;

-- Ver todos os projetos
SELECT * FROM projects;

-- Sair do psql
\q
```

---

## 🧹 Comandos Úteis de Manutenção

### Parar todos os containers

```bash
docker-compose down
```

### Parar e remover volumes (apaga dados do banco)

```bash
docker-compose down -v
```

### Reiniciar apenas um serviço

```bash
docker-compose restart backend
```

### Reconstruir e reiniciar tudo

```bash
docker-compose down
docker-compose up -d --build
```

### Ver uso de recursos

```bash
docker stats
```

---

## 🧪 Executar Testes do Backend

### Rodar todos os testes

```bash
docker-compose exec backend python -m pytest
```

### Rodar testes com cobertura

```bash
docker-compose exec backend python -m pytest --cov
```

### Rodar testes específicos

```bash
docker-compose exec backend python -m pytest tests/test_auth.py
docker-compose exec backend python -m pytest tests/test_projects.py
docker-compose exec backend python -m pytest tests/test_upload.py
```

---

## 📁 Estrutura do Projeto

```
MicroSaaS-Picineiro/
├── backend/                    # Backend FastAPI
│   ├── app/
│   │   ├── models.py          # Modelos do banco de dados
│   │   ├── schemas.py         # Schemas Pydantic
│   │   ├── auth.py            # Autenticação JWT
│   │   ├── security.py        # Hashing de senhas
│   │   ├── config.py          # Configurações
│   │   ├── database.py        # Conexão com PostgreSQL
│   │   └── routers/
│   │       └── upload.py      # Router de upload
│   ├── tests/                 # Testes automatizados
│   ├── static/uploads/        # Arquivos enviados
│   ├── main.py                # Aplicação principal
│   ├── requirements.txt       # Dependências Python
│   └── Dockerfile
│
├── frontend/                   # Frontend React + TypeScript
│   ├── src/
│   │   ├── pages/
│   │   │   ├── auth/          # Páginas de login/registro
│   │   │   └── dashboard/     # Dashboard principal
│   │   ├── components/
│   │   │   └── layout/        # Layout e navbar
│   │   ├── store/
│   │   │   └── authStore.ts   # State management (Zustand)
│   │   ├── services/
│   │   │   └── api.ts         # Cliente Axios
│   │   ├── types/
│   │   │   └── index.ts       # Tipos TypeScript
│   │   ├── App.tsx            # Rotas principais
│   │   ├── main.tsx           # Entry point
│   │   └── index.css          # Estilos globais
│   ├── package.json
│   ├── tailwind.config.js     # Configuração Tailwind
│   └── Dockerfile
│
├── docker-compose.yml          # Orquestração Docker
├── .env                        # Variáveis de ambiente
└── README.md                   # Documentação principal
```

---

## 🔐 Variáveis de Ambiente

O arquivo `.env` já está configurado para desenvolvimento local:

```env
# Backend
DATABASE_URL=postgresql://dev:dev123@db:5432/propiscineiro
SECRET_KEY=dev-secret-key
DEBUG=true
ENVIRONMENT=development

# Frontend
VITE_API_URL=http://localhost:8000
VITE_APP_NAME=Propiscineiro
```

⚠️ **IMPORTANTE:** Nunca commite o arquivo `.env` com credenciais reais em produção!

---

## 🐛 Solução de Problemas Comuns

### Problema: Porta 5432 já em uso

**Solução:** Pare o PostgreSQL local ou mude a porta no `docker-compose.yml`:

```yaml
ports:
  - "5433:5432"  # Usa porta 5433 no host
```

### Problema: Porta 8000 já em uso

**Solução:** Mude a porta do backend no `docker-compose.yml`:

```yaml
ports:
  - "8001:8000"  # Usa porta 8001 no host
```

### Problema: Frontend não carrega

**Solução:** Verifique os logs e reconstrua:

```bash
docker-compose logs frontend
docker-compose up -d --build frontend
```

### Problema: Erro de autenticação no login

**Solução:** Verifique se o backend está rodando:

```bash
curl http://localhost:8000/
```

### Problema: Banco de dados não conecta

**Solução:** Recrie o container do banco:

```bash
docker-compose down -v
docker-compose up -d db
```

---

## 📚 Recursos Adicionais

### Documentação das Tecnologias

- **FastAPI:** <https://fastapi.tiangolo.com/>
- **React:** <https://react.dev/>
- **TypeScript:** <https://www.typescriptlang.org/>
- **TailwindCSS:** <https://tailwindcss.com/>
- **Zustand:** <https://zustand-demo.pmnd.rs/>
- **Docker:** <https://docs.docker.com/>

### Arquivos de Referência

- `CHECKLIST_RAPIDO.md` - Checklist completo de desenvolvimento
- `DIRETRIZES.md` - Diretrizes detalhadas do projeto
- `README.md` - Documentação geral

---

## ✅ Checklist de Verificação

Antes de considerar o sistema funcionando, verifique:

- [ ] Todos os 3 containers estão com status "Up"
- [ ] Frontend acessível em <http://localhost:5173>
- [ ] Backend acessível em <http://localhost:8000>
- [ ] Swagger UI acessível em <http://localhost:8000/docs>
- [ ] Consegue criar uma conta
- [ ] Consegue fazer login
- [ ] Consegue criar um projeto
- [ ] Consegue visualizar projetos no dashboard
- [ ] Consegue deletar um projeto
- [ ] Consegue fazer logout

---

## 🎯 Próximos Passos

Após explorar o sistema, você pode:

1. **Implementar o Editor 3D** (Fase 3.4)
   - Integrar Three.js
   - Criar controles de câmera
   - Adicionar propriedades de piscina

2. **Adicionar Funcionalidades**
   - Edição de projetos
   - Exportação para PDF
   - Compartilhamento de projetos
   - Upload de imagens de referência

3. **Melhorias de UX**
   - Animações de transição
   - Loading states
   - Mensagens de sucesso/erro
   - Validações em tempo real

4. **Deploy em Produção**
   - Configurar Railway/Render para backend
   - Configurar Vercel/Netlify para frontend
   - Configurar domínio personalizado
   - Implementar SSL/HTTPS

---

## 💡 Dicas de Desenvolvimento

### Hot Reload está ativo

- Mudanças no **backend** recarregam automaticamente
- Mudanças no **frontend** recarregam automaticamente

### Para editar o código

1. Abra o projeto em seu editor favorito (VS Code, Cursor, etc.)
2. Faça alterações nos arquivos
3. Veja as mudanças refletidas automaticamente no navegador

### Para adicionar dependências

**Backend:**

```bash
# Adicione ao requirements.txt
docker-compose up -d --build backend
```

**Frontend:**

```bash
# Entre no container
docker-compose exec frontend sh
npm install nome-do-pacote
exit
# Reconstrua
docker-compose up -d --build frontend
```

---

## 📞 Suporte

Se encontrar problemas:

1. Verifique os logs: `docker-compose logs -f`
2. Consulte a seção "Solução de Problemas"
3. Verifique a documentação em `DIRETRIZES.md`
4. Reconstrua tudo do zero: `docker-compose down -v && docker-compose up -d --build`

---

**Desenvolvido com ❤️ usando FastAPI, React, TypeScript e TailwindCSS**

**Versão:** 1.0.0  
**Data:** Dezembro 2024  
**Projeto:** Propiscineiro MicroSaaS
