# Propiscineiro MicroSaaS

Bem-vindo ao projeto Propiscineiro! Este é um MicroSaaS para design e visualização 3D de piscinas, seguindo as diretrizes de desenvolvimento detalhadas em `DIRETRIZES.md`.

## 🚀 Como Começar

Siga estas instruções para configurar e executar o projeto em seu ambiente local.

### Pré-requisitos

Certifique-se de ter o Docker e o Docker Compose instalados em sua máquina.

-   **Docker Desktop:** [https://www.docker.com/products/docker-desktop/](https://www.docker.com/products/docker-desktop/)

### 🛠️ Configuração

1.  **Clone o Repositório (se ainda não o fez):**
    ```bash
    git clone [URL_DO_SEU_REPOSITORIO]
    cd MicroSaaS-Picineiro
    ```

2.  **Variáveis de Ambiente:**
    Crie um arquivo `.env` na raiz do projeto (se não existir) e preencha-o com as variáveis de ambiente necessárias. Um exemplo (`.env.example` ou as descritas em `DIRETRIZES.md`) deve ser consultado.

    Para desenvolvimento local, você pode usar os valores padrão fornecidos no `.env` que você acabou de criar:
    ```env
    # Backend
    DATABASE_URL=postgresql://dev:dev123@db:5432/propiscineiro
    SECRET_KEY=dev-secret-key
    DEBUG=true
    ENVIRONMENT=development
    AWS_ACCESS_KEY_ID=your_aws_access_key_id
    AWS_SECRET_ACCESS_KEY=your_aws_secret_access_key

    # Frontend
    VITE_API_URL=http://localhost:8000
    VITE_APP_NAME=Propiscineiro
    ```

3.  **Construa e Inicie os Containers Docker:**
    No diretório raiz do projeto, execute o seguinte comando para construir as imagens Docker e iniciar os serviços (backend, frontend e banco de dados):

    ```bash
    docker-compose up --build -d
    ```
    -   `--build`: Garante que as imagens Docker sejam construídas antes de iniciar os serviços. Use isso na primeira vez ou sempre que houver alterações nos Dockerfiles.
    -   `-d`: Executa os containers em modo "detached" (em segundo plano).

4.  **Verifique o Status dos Containers:**
    Para verificar se todos os serviços estão rodando corretamente:
    ```bash
    docker-compose ps
    ```

### 🌐 Acessando a Aplicação

-   **Backend (FastAPI):** `http://localhost:8000`
    -   Documentação Swagger UI: `http://localhost:8000/docs`
    -   Documentação ReDoc: `http://localhost:8000/redoc`
-   **Frontend (React):** `http://localhost:5173`

### 🛑 Parando os Containers

Para parar e remover os containers (e as redes/volumes padrão, a menos que especificado):
```bash
docker-compose down
```

### 🧹 Limpeza de Volumes (Opcional)

Se você quiser remover também o volume de dados do PostgreSQL (o que apagará todos os dados do banco de dados), use:
```bash
docker-compose down -v
```

---

## 📄 Estrutura do Projeto

```
.
├── backend/                # Contém o código do FastAPI
│   ├── Dockerfile          # Dockerfile para o serviço de backend
│   └── .dockerignore       # Arquivos/pastas a serem ignorados pelo Docker
├── frontend/               # Contém o código do React
│   ├── Dockerfile          # Dockerfile para o serviço de frontend
│   └── .dockerignore       # Arquivos/pastas a serem ignorados pelo Docker
├── docker-compose.yml      # Configuração do Docker Compose
├── .env                    # Variáveis de ambiente (IGNORADO pelo Git)
├── DIRETRIZES.md           # Documento de diretrizes do projeto
└── README.md               # Este arquivo
```

---

## ✅ Próximos Passos (Conforme `DIRETRIZES.md`)

Após a configuração inicial do Docker, o próximo passo é a **Fase 2: Backend (FastAPI)**, que envolverá a criação da estrutura inicial do backend, modelos, migrações e endpoints de autenticação.
