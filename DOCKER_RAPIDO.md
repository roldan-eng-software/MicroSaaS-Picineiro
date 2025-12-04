# ⚡ SOLUÇÃO RÁPIDA - Docker Não Funciona

**Você recebeu erro do Gemini sobre Docker?**

Siga EXATAMENTE isto:

---

## 🔧 Passo 1: Verificar Docker (30 segundos)

Abra seu terminal/CMD e execute:

```bash
docker --version
```

### Resultado 1: ✅ Mostra versão (ex: Docker version 24.0.0)

**Próximo passo:** Vá para "Passo 2"

### Resultado 2: ❌ Erro "command not found" ou "'docker' is not recognized"

**Docker não está instalado**

1. Acesse: https://www.docker.com/products/docker-desktop
2. Clique em "Download for Windows" (ou Mac/Linux)
3. Instale
4. Reinicie seu PC
5. Abra Docker Desktop
6. Depois volte para "Passo 2"

---

## 🔧 Passo 2: Verificar se Docker Está Rodando (30 segundos)

Execute:

```bash
docker ps
```

### Resultado 1: ✅ Retorna lista vazia ou com containers

**Docker está rodando! Vá para Passo 3**

### Resultado 2: ❌ Erro "Cannot connect to Docker daemon"

**Docker não está iniciado**

#### Se for Windows:
1. Procure "Docker Desktop" no menu Iniciar
2. Abra
3. Aguarde 1-2 minutos para completar inicialização
4. Veja se o ícone do Docker aparece na bandeja (canto inferior direito)
5. Execute de novo: `docker ps`

#### Se for Mac:
1. Procure Docker (Cmd+Space, digite "Docker")
2. Abra Docker.app
3. Aguarde 1-2 minutos
4. Execute: `docker ps`

#### Se for Linux:
```bash
sudo systemctl start docker
docker ps
```

---

## 🔧 Passo 3: Teste Completo (1 minuto)

Execute:

```bash
docker run hello-world
```

### Resultado 1: ✅ Mostra mensagem "Hello from Docker!"

**PERFEITO! Docker está funcionando!**

Volte para seu Gemini e execute novamente:
```
Fase 1: Crie estrutura Docker completa...
```

### Resultado 2: ❌ Erro "unable to get image"

**Seu Docker não consegue baixar imagens (provavelmente conexão)**

1. Reinicie Docker Desktop
2. Verifique sua conexão internet
3. Tente novamente:
```bash
docker run hello-world
```

Se ainda não funcionar:
- Leia **DOCKER_TROUBLESHOOTING.md** seção "Causa 1: WSL 2 Não Ativo"

---

## 🎯 Se Você Usa Windows

**Importante:** Windows precisa de WSL 2 para Docker funcionar bem.

Verifique:

```powershell
wsl --list --verbose
```

Se não mostrar WSL 2:

```powershell
# Como administrador:
wsl --install -d Ubuntu
wsl --set-default-version 2
```

Depois reinicie Windows e abra Docker Desktop.

---

## ✅ Você Completou!

Se chegou aqui e `docker ps` funciona:

```
✅ Docker está 100% funcionando!

Próximo: Use seu Gemini para Fase 1
```

Se ainda não funciona:

```
Leia DOCKER_TROUBLESHOOTING.md seção apropriada para seu SO
```

---

**Feito! Boa sorte! 🚀**
