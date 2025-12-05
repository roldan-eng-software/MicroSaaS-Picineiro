# Guia de Criação e Gerenciamento de Acesso Superusuário no SaaS

Este documento detalha as etapas para criar o acesso de superusuário e gerenciar usuários no sistema SaaS. O acesso de superusuário concede privilégios administrativos para controlar e configurar o sistema.

## Introdução ao Acesso Superusuário

O superusuário tem controle total sobre o sistema, incluindo a capacidade de:
*   Criar o primeiro superusuário (se nenhum existir).
*   Listar todos os usuários.
*   Obter detalhes de qualquer usuário.
*   Atualizar informações de usuário, incluindo a promoção/rebaixamento para/de superusuário.
*   Excluir usuários (com restrição para o último superusuário).

## Pré-requisitos

Antes de prosseguir, certifique-se de que o ambiente de backend está configurado e o banco de dados está migrado. Isso inclui:
*   Python e `pip` instalados.
*   Dependências do backend instaladas (`pip install -r backend/requirements.txt`).
*   O banco de dados deve estar acessível e com as migrações mais recentes aplicadas (Alembic).

## 1. Criando o Superusuário Inicial

A criação do primeiro superusuário é um processo especial, pois não pode haver um superusuário existente para autenticar a requisição. O endpoint `/api/v1/admin/initial-superuser` foi projetado para ser usado apenas uma vez.

**Endpoint:** `POST /api/v1/admin/initial-superuser`

**Payload (JSON):**

```json
{
  "email": "seu_email@example.com",
  "username": "seu_usuario_admin",
  "password": "sua_senha_segura"
}
```

**Instruções:**

1.  **Certifique-se de que nenhum superusuário exista no banco de dados.** Se você está configurando o sistema pela primeira vez ou se todos os superusuários foram removidos, este endpoint estará disponível.
2.  Envie uma requisição `POST` para o endpoint usando o `curl` ou uma ferramenta como Postman/Insomnia.

    ```bash
    curl -X POST "http://localhost:8000/api/v1/admin/initial-superuser" \
         -H "Content-Type: application/json" \
         -d 
```json
{
  "email": "admin@example.com",
  "username": "superadmin",
  "password": "verysecretpassword"
}
```
    ```

3.  **Resposta Esperada (Sucesso):** Um status `201 Created` e os detalhes do usuário superusuário criado.

    ```json
    {
      "email": "admin@example.com",
      "username": "superadmin",
      "is_superuser": true,
      "id": 1,
      "projects": []
    }
    ```

4.  **Resposta Esperada (Falha):** Se um superusuário já existir, você receberá um status `403 Forbidden` com a mensagem: "Já existe um superusuário. Esta rota é apenas para criação inicial."

## 2. Autenticando como Superusuário

Após criar o superusuário, você precisará obter um token de acesso para interagir com os endpoints administrativos.

**Endpoint:** `POST /auth/token`

**Payload (Form Data):**

```
username: seu_usuario_admin
password: sua_senha_segura
```

**Instruções:**

1.  Envie uma requisição `POST` para `http://localhost:8000/auth/token` com suas credenciais de superusuário.

    ```bash
    curl -X POST "http://localhost:8000/auth/token" \
         -H "Content-Type: application/x-www-form-urlencoded" \
         -d "username=superadmin&password=verysecretpassword"
    ```

2.  A resposta incluirá um `access_token`. Guarde este token, pois ele será usado para autenticar suas requisições aos endpoints administrativos.

    ```json
    {
      "access_token": "eyJhbGciOiJIUzI1Ni...",
      "token_type": "bearer"
    }
    ```

## 3. Gerenciando Usuários como Superusuário

Com o token de acesso do superusuário, você pode acessar os seguintes endpoints para gerenciar usuários. Lembre-se de incluir o token no cabeçalho `Authorization` como `Bearer <YOUR_ACCESS_TOKEN>`.

### 3.1 Listar Todos os Usuários

**Endpoint:** `GET /api/v1/admin/users`

```bash
curl -X GET "http://localhost:8000/api/v1/admin/users" \
     -H "Authorization: Bearer <YOUR_ACCESS_TOKEN>"
```

### 3.2 Obter Detalhes de um Usuário Específico

**Endpoint:** `GET /api/v1/admin/users/{user_id}`

Substitua `{user_id}` pelo ID do usuário.

```bash
curl -X GET "http://localhost:8000/api/v1/admin/users/2" \
     -H "Authorization: Bearer <YOUR_ACCESS_TOKEN>"
```

### 3.3 Promover/Rebaixar um Usuário a Superusuário

**Endpoint:** `PUT /api/v1/admin/users/{user_id}`

Substitua `{user_id}` pelo ID do usuário e inclua `is_superuser: true` ou `is_superuser: false` no payload.

**Promover:**

```bash
curl -X PUT "http://localhost:8000/api/v1/admin/users/2" \
     -H "Content-Type: application/json" \
     -H "Authorization: Bearer <YOUR_ACCESS_TOKEN>" \
     -d 
```json
{
  "is_superuser": true
}
```

**Rebaixar:**

```bash
curl -X PUT "http://localhost:8000/api/v1/admin/users/2" \
     -H "Content-Type: application/json" \
     -H "Authorization: Bearer <YOUR_ACCESS_TOKEN>" \
     -d 
```json
{
  "is_superuser": false
}
```

### 3.4 Excluir um Usuário

**Endpoint:** `DELETE /api/v1/admin/users/{user_id}`

Substitua `{user_id}` pelo ID do usuário.

```bash
curl -X DELETE "http://localhost:8000/api/v1/admin/users/3" \
     -H "Authorization: Bearer <YOUR_ACCESS_TOKEN>"
```

**Observação:** Não é possível excluir o último superusuário do sistema. Esta é uma medida de segurança para evitar que o sistema fique sem administração.

## Considerações de Segurança

*   **Senhas Fortes:** Sempre use senhas fortes e únicas para contas de superusuário.
*   **Acesso Restrito:** O acesso aos endpoints administrativos deve ser restrito e monitorado.
*   **Princípio do Menor Privilégio:** Crie superusuários apenas quando estritamente necessário.
*   **Tokens de Acesso:** Proteja os tokens de acesso. Eles concedem acesso total ao sistema.
*   **Auditoria:** Considere implementar logs de auditoria para todas as ações realizadas por superusuários.
