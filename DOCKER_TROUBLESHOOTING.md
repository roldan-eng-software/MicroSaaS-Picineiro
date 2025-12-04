# 🐳 TROUBLESHOOTING DOCKER - Propiscineiro

**Problema:** Docker Desktop inativo ou mal configurado  
**Erro:** "unable to get image" + "The system cannot find the file specified"  
**Solução:** Guia passo-a-passo para corrigir

---

## 📋 Diagnóstico Rápido

Execute estes comandos para identificar o problema:

### Verificação 1: Docker Instalado?

```bash
docker --version
```

**Se retornar:** `Docker version X.XX.X`  
✅ Docker está instalado

**Se retornar:** `'docker' is not recognized` ou `command not found`  
❌ Docker não está instalado

---

### Verificação 2: Docker Daemon Rodando?

```bash
docker ps
```

**Se retornar:** Lista de containers (vazia ou com items)  
✅ Docker está rodando

**Se retornar:** `Cannot connect to Docker daemon` ou erro similar  
❌ Docker daemon não está rodando

---

### Verificação 3: Docker Desktop Ativo?

```bash
docker info
```

**Se retornar:** Informações detalhadas de Docker  
✅ Docker Desktop está ativo

**Se retornar:** Erro ou informações cortadas  
❌ Docker Desktop está inativo

---

## 🛠️ Soluções por Sistema Operacional

### WINDOWS (CMD ou PowerShell)

#### Solução 1: Reiniciar Docker Desktop

**Passo 1:** Abra "Tassk Manager" (Ctrl+Shift+Esc)

**Passo 2:** Procure por "Docker Desktop"

**Passo 3:** Se encontrar:
- Clique com botão direito
- Selecione "End Task"

**Passo 4:** Abra Docker Desktop novamente

**Passo 5:** Aguarde ele completamente iniciar (~1-2 minutos)

**Passo 6:** Teste:
```bash
docker ps
```

---

#### Solução 2: Docker Desktop Não Está Instalado

**Se o Docker Desktop não estiver no seu PC:**

1. Acesse: https://www.docker.com/products/docker-desktop
2. Clique em "Download for Windows"
3. Escolha sua versão:
   - **Intel/AMD:** Docker Desktop for Windows (x86)
   - **ARM/M1/M2:** Docker Desktop for Windows (ARM)
4. Execute o instalador
5. Siga os passos (pode pedir para reiniciar)
6. Após instalar, abra Docker Desktop
7. Aguarde ele iniciar completamente

**Teste após instalação:**
```bash
docker --version
docker ps
```

---

#### Solução 3: WSL 2 Não Configurado (Melhor Opção)

Docker Desktop no Windows funciona melhor com **WSL 2** (Windows Subsystem for Linux 2).

**Verificar se WSL 2 está ativo:**

```powershell
wsl --list --verbose
```

**Se não aparecer WSL 2:**

1. Abra PowerShell como administrador
2. Execute:
```powershell
# Habilitar WSL
wsl --install

# Instalar WSL 2 kernel
wsl --install -d Ubuntu

# Definir WSL 2 como padrão
wsl --set-default-version 2
```

3. Reinicie o Windows
4. Abra Docker Desktop
5. Vá em: Settings → Resources → WSL Integration
6. Ative "Enable integration with my default WSL distro"
7. Clique "Apply & Restart"

**Teste:**
```bash
docker ps
```

---

#### Solução 4: Reconfigurar Docker Desktop

**Passo 1:** Abra Docker Desktop

**Passo 2:** Clique no ícone de engrenagem (Settings)

**Passo 3:** Verifique:
- **General:**
  - ☑ "Start Docker Desktop when you log in"
  - ☑ "Use the WSL 2 based engine" (recomendado)

- **Resources:**
  - CPUs: 4+ (ajuste conforme necessário)
  - Memory: 4GB+ (mínimo recomendado)
  - Disk Image Size: 64GB (padrão)

**Passo 4:** Clique "Apply & Restart"

**Passo 5:** Aguarde reiniciar

**Teste:**
```bash
docker ps
```

---

#### Solução 5: Limpar e Resetar Docker (Última Opção)

**Aviso:** Isso vai deletar TODAS as imagens, containers e volumes locais!

**Passo 1:** Abra Docker Desktop

**Passo 2:** Vá em: Settings → Troubleshoot

**Passo 3:** Clique: "Clean / Purge data"

**Passo 4:** Confirme

**Passo 5:** Docker vai resetar completamente

**Passo 6:** Aguarde terminar

**Teste:**
```bash
docker ps
docker images
```

---

### MAC (Intel ou Apple Silicon)

#### Solução 1: Reiniciar Docker Desktop

```bash
# Encerre Docker Desktop
killall Docker

# Aguarde 5 segundos
sleep 5

# Abra novamente (procure no Applications → Docker.app)
# Ou use Spotlight: Cmd+Space, digite "Docker", Enter
```

**Teste:**
```bash
docker ps
```

---

#### Solução 2: Docker Desktop Não Instalado

1. Acesse: https://www.docker.com/products/docker-desktop
2. Clique em "Download for Mac"
3. Escolha sua versão:
   - **Intel Mac:** "Mac with Intel Chip"
   - **Apple Silicon (M1/M2/M3):** "Mac with Apple Silicon"
4. Execute o instalador
5. Siga os passos
6. Arraste Docker para Applications
7. Abra Docker.app

**Teste:**
```bash
docker --version
docker ps
```

---

#### Solução 3: Aumentar Recursos

Docker no Mac às vezes fica lento se recursos estão limitados.

```bash
# Abra Docker Desktop preferences
# Docker icon → Preferences (ou Settings)

# Vá para: Resources
# Aumente:
# - CPUs: 4+
# - Memory: 4GB+
# - Disk: 64GB+

# Clique: Apply & Restart
```

**Teste:**
```bash
docker ps
```

---

#### Solução 4: Resetar Docker

```bash
# Abra Docker Desktop
# Docker icon → Troubleshoot
# Clique: "Reset to defaults"

# Ou via terminal:
# Encerre Docker
killall Docker

# Remova configurações
rm -rf ~/Library/Containers/com.docker.docker

# Abra Docker novamente
```

**Teste:**
```bash
docker ps
```

---

### LINUX (Ubuntu/Fedora/Debian)

#### Solução 1: Instalar Docker

```bash
# Ubuntu/Debian
sudo apt update
sudo apt install docker.io

# Fedora
sudo dnf install docker

# Inicie o daemon
sudo systemctl start docker
sudo systemctl enable docker

# Teste
docker --version
sudo docker ps
```

---

#### Solução 2: Dar Permissão sem sudo

```bash
# Crie grupo docker
sudo groupadd docker

# Adicione seu usuário
sudo usermod -aG docker $USER

# Aplique novas permissões
newgrp docker

# Teste (sem sudo!)
docker ps
```

---

#### Solução 3: Reiniciar Docker Daemon

```bash
# Reinicie o serviço
sudo systemctl restart docker

# Ou encerre e inicie manualmente
sudo systemctl stop docker
sudo systemctl start docker

# Teste
docker ps
```

---

#### Solução 4: Verificar Status

```bash
# Ver status
sudo systemctl status docker

# Ver logs se algo errar
sudo journalctl -u docker -n 50

# Testar conectividade
docker run hello-world
```

---

## 🔍 Erro Específico: "The system cannot find the file specified"

Este erro geralmente aparece no Windows quando:

### Causa 1: WSL 2 Não Ativo

**Solução:**
```powershell
# No PowerShell como admin
wsl --list --verbose

# Se não tiver WSL 2, instale
wsl --install -d Ubuntu

# Defina como padrão
wsl --set-default-version 2

# Configure Docker Desktop para WSL 2
# Settings → Resources → WSL Integration → Enable
```

---

### Causa 2: Caminho de Arquivo com Espaços

Se seu projeto tem espaço no caminho:
- ❌ `C:\Meus Documentos\propiscineiro`
- ✅ `C:\Users\YourName\propiscineiro` ou `C:\projects\propiscineiro`

**Solução:**
```bash
# Mude para caminho sem espaços
mkdir C:\projects\propiscineiro
cd C:\projects\propiscineiro
```

---

### Causa 3: Caracteres Especiais no Caminho

- ❌ Evite: `C:\proj-eto\`, `C:\проект\`, `C:\项目\`
- ✅ Use: `C:\projects\propiscineiro`

**Solução:**
```bash
# Crie pasta com nome simples
mkdir %USERPROFILE%\projects
cd %USERPROFILE%\projects\propiscineiro
```

---

## ✅ Teste Completo de Docker

Após aplicar uma solução, execute este teste completo:

```bash
# 1. Verificar versão
docker --version
# Deve retornar: Docker version X.XX.X

# 2. Verificar daemon
docker ps
# Deve retornar: vazio ou lista de containers

# 3. Testar conexão
docker run hello-world
# Deve retornar: "Hello from Docker!"

# 4. Ver imagens
docker images
# Deve listar as imagens

# 5. Ver informações
docker info
# Deve retornar: informações completas
```

**Se todos passarem:** ✅ Docker está OK!

---

## 🚀 Próximo Passo: Testar Propiscineiro

Após Docker funcionando, teste o docker-compose:

```bash
# 1. Navegue até projeto
cd propiscineiro

# 2. Construa as imagens
docker-compose build

# Deve retornar: Successfully built XXX

# 3. Inicie containers
docker-compose up -d

# 4. Verifique
docker-compose ps

# Deve retornar: 3 containers (db, backend, frontend)

# 5. Teste se está rodando
curl http://localhost:8000/docs      # Backend
curl http://localhost:5173           # Frontend
docker-compose exec db psql -U dev -d propiscineiro -c "SELECT 1;"  # DB
```

---

## 📞 Troubleshooting Avançado

### Problema: "Bind for 0.0.0.0:5432 failed"

**Causa:** Porta já está em uso

**Solução:**
```bash
# No docker-compose.yml, mude:
ports:
  - "5433:5432"  # Use 5433 em vez de 5432

# Ou encerre processo usando a porta
# Windows: netstat -ano | findstr :5432
# Mac/Linux: lsof -i :5432
```

---

### Problema: "Disk space is low"

**Causa:** Docker está usando muito espaço

**Solução:**
```bash
# Limpe containers não usados
docker container prune

# Limpe imagens não usadas
docker image prune

# Limpe volumes não usados
docker volume prune

# Limpe tudo (cuidado!)
docker system prune -a
```

---

### Problema: "Cannot create container: name already exists"

**Causa:** Container com mesmo nome já existe

**Solução:**
```bash
# Remova o container
docker rm nome-do-container

# Ou force remover
docker rm -f nome-do-container

# No docker-compose:
docker-compose down
docker-compose up -d
```

---

### Problema: "Out of Memory"

**Causa:** Docker sem RAM suficiente

**Solução:**
```bash
# Aumente RAM alocada
# Windows/Mac: Docker Desktop → Settings → Resources → Memory
# Aumente para 4GB, 6GB, 8GB conforme necessário

# Ou reduza uso via docker-compose.yml:
services:
  backend:
    mem_limit: 512m
  frontend:
    mem_limit: 256m
```

---

## 📋 Checklist de Diagnóstico

Execute isto quando Docker não funcionar:

- [ ] `docker --version` retorna versão?
- [ ] `docker ps` não retorna erro?
- [ ] `docker info` mostra informações?
- [ ] `docker run hello-world` funciona?
- [ ] Docker Desktop está aberto (Windows/Mac)?
- [ ] WSL 2 está ativo (Windows)?
- [ ] Não há firewall bloqueando Docker?
- [ ] Portas 5432, 8000, 5173 estão livres?
- [ ] Caminho do projeto não tem espaços ou caracteres especiais?
- [ ] Tem espaço em disco (mínimo 10GB)?
- [ ] Tem RAM suficiente alocada (mínimo 4GB)?

---

## 🎯 Fluxo de Resolução

```
Docker não funciona?
    ↓
1. Qual SO? (Windows/Mac/Linux)
    ↓
2. Docker instalado? (docker --version)
    ↓ Não → Instale
    ↓ Sim
3. Docker daemon rodando? (docker ps)
    ↓ Não → Inicie daemon
    ↓ Sim
4. Docker Desktop ativo? (Windows/Mac apenas)
    ↓ Não → Abra Docker Desktop
    ↓ Sim
5. Teste: docker run hello-world
    ↓ Sucesso → ✅ Docker OK!
    ↓ Erro → Verifique logs
6. Verifique configurações (RAM, espaço, WSL 2)
7. Última opção: Reset completo
    ↓
✅ Docker pronto para usar!
```

---

## 📞 Se Ainda Não Funcionar

### Coletar Informações para Suporte

```bash
# Salve saída destes comandos
docker --version > docker-info.txt
docker ps 2>&1 >> docker-info.txt
docker info 2>&1 >> docker-info.txt
docker logs <container-id> 2>&1 >> docker-info.txt

# Compartilhe o arquivo docker-info.txt com suporte
```

### Verificar Logs

**Windows:**
- Docker Desktop → Settings → Troubleshoot → View logs

**Mac:**
```bash
log stream --level debug --predicate 'process == "Docker"' 2>&1 | head -50
```

**Linux:**
```bash
sudo journalctl -u docker -n 100
sudo tail -f /var/log/docker.log
```

---

## 🚨 Últimas Opções

### Opção 1: Reinstalar Docker

```bash
# Windows
# Control Panel → Programs → Uninstall a program
# Procure "Docker" e desinstale
# Reinicie Windows
# Baixe e instale novamente

# Mac
# Arraste Docker.app para Trash
# Limpe preferências: rm -rf ~/Library/Preferences/Docker*
# Reinstale

# Linux
sudo apt remove docker.io
sudo apt install docker.io
```

---

### Opção 2: Docker Alternativo (Podman)

Se Docker não funcionar, tente Podman:

```bash
# Windows: https://podman.io/docs/installation/windows
# Mac: brew install podman
# Linux: sudo apt install podman

# Teste
podman --version
podman ps
podman run hello-world
```

---

## ✅ Sucesso!

Quando `docker ps` retornar sem erro e `docker run hello-world` funcionar:

```bash
✅ Docker está completamente funcional!

Próximo: Volte para o Gemini e peça:
"Fase 1: Crie estrutura Docker completa..."
```

---

**Documento criado:** Dezembro 2024  
**Versão:** 1.0  
**Projeto:** Propiscineiro MicroSaaS  
**Problema:** Docker Desktop inativo ou mal configurado

**Boa sorte! 🚀**
