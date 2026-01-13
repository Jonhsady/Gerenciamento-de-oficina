# 🐳 Guia Docker - Sistema de Oficina

## 📋 Pré-requisitos

- Docker instalado (versão 20.10 ou superior)
- Docker Compose instalado (versão 2.0 ou superior)

### Instalar Docker no Ubuntu/Debian:

```bash
# Atualizar pacotes
sudo apt update

# Instalar dependências
sudo apt install -y apt-transport-https ca-certificates curl software-properties-common

# Adicionar chave GPG do Docker
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /usr/share/keyrings/docker-archive-keyring.gpg

# Adicionar repositório
echo "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/docker-archive-keyring.gpg] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null

# Instalar Docker
sudo apt update
sudo apt install -y docker-ce docker-ce-cli containerd.io docker-compose-plugin

# Adicionar usuário ao grupo docker (para não precisar usar sudo)
sudo usermod -aG docker $USER
newgrp docker
```

## 🚀 Como Usar

### 1️⃣ Configurar Variáveis de Ambiente (Opcional)

```bash
# Copiar arquivo de exemplo
cp .env.example .env

# Editar com suas configurações
nano .env
```

**⚠️ IMPORTANTE:** Em produção, altere o `JWT_SECRET` e as credenciais do admin!

### 2️⃣ Iniciar os Containers

```bash
# Construir e iniciar em segundo plano
docker-compose up -d --build

# Ver logs em tempo real
docker-compose logs -f

# Ver logs apenas do backend
docker-compose logs -f backend

# Ver logs apenas do frontend
docker-compose logs -f frontend
```

### 3️⃣ Acessar a Aplicação

- **Frontend:** http://localhost
- **Backend API:** http://localhost:3000/api/health

**Credenciais padrão:**
- Email: `admin@oficina.com`
- Senha: `admin123`

## 🛠️ Comandos Úteis

### Parar os containers
```bash
docker-compose down
```

### Parar e remover volumes (apaga banco de dados!)
```bash
docker-compose down -v
```

### Reiniciar os containers
```bash
docker-compose restart
```

### Reconstruir as imagens
```bash
docker-compose build --no-cache
```

### Ver status dos containers
```bash
docker-compose ps
```

### Executar comandos dentro do container
```bash
# Backend
docker-compose exec backend sh

# Frontend
docker-compose exec frontend sh
```

### Ver uso de recursos
```bash
docker stats
```

## 📦 Estrutura dos Containers

### Backend (Node.js)
- **Porta:** 3000
- **Tecnologias:** Node.js 18, Express, SQLite
- **Volume:** `./data` (banco de dados persistente)
- **Health Check:** Sim

### Frontend (React + Nginx)
- **Porta:** 80
- **Tecnologias:** React, Vite, Nginx
- **Health Check:** Sim
- **Proxy:** Configurado para `/api` → `backend:3000`

## 🔒 Segurança

### Em Produção:

1. **Altere o JWT_SECRET:**
```bash
# Gerar um secret seguro
openssl rand -base64 32
```

2. **Altere as credenciais do admin** no `.env`

3. **Use HTTPS** (configure um reverse proxy como Traefik ou Nginx)

4. **Configure Firewall:**
```bash
# Permitir apenas portas necessárias
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw enable
```

5. **Configure backup do banco de dados:**
```bash
# Backup manual
docker-compose exec backend cp /app/data/oficina.sqlite /app/data/backup_$(date +%Y%m%d_%H%M%S).sqlite

# Script de backup automático (adicione ao crontab)
0 2 * * * cd /caminho/do/projeto && docker-compose exec -T backend sqlite3 /app/data/oficina.sqlite ".backup '/app/data/backup_$(date +\%Y\%m\%d).sqlite'"
```

## 🌐 Deploy em Servidor

### Usando Docker na VPS/Servidor:

```bash
# 1. Conectar ao servidor
ssh usuario@seu-servidor.com

# 2. Clonar ou transferir o projeto
git clone seu-repositorio.git
# ou
scp -r IDEIAS/ usuario@seu-servidor.com:/home/usuario/

# 3. Entrar na pasta
cd IDEIAS

# 4. Configurar .env
cp .env.example .env
nano .env

# 5. Iniciar
docker-compose up -d --build

# 6. Verificar
docker-compose logs -f
```

## 🐛 Troubleshooting

### Porta já em uso:
```bash
# Verificar o que está usando a porta 80
sudo lsof -i :80

# Mudar a porta no docker-compose.yml
# Trocar "80:80" por "8080:80"
```

### Containers não iniciam:
```bash
# Ver logs de erro
docker-compose logs

# Remover tudo e recomeçar
docker-compose down -v
docker-compose up -d --build
```

### Banco de dados corrompido:
```bash
# Parar containers
docker-compose down

# Remover banco antigo (CUIDADO!)
rm -rf data/oficina.sqlite

# Reiniciar (criará novo banco)
docker-compose up -d
```

### Problemas de permissão:
```bash
# Corrigir permissões da pasta data
sudo chown -R $USER:$USER data/
chmod -R 755 data/
```

## 📊 Monitoramento

### Instalar Portainer (Interface Web para Docker):

```bash
docker volume create portainer_data

docker run -d -p 9000:9000 \
  --name=portainer --restart=always \
  -v /var/run/docker.sock:/var/run/docker.sock \
  -v portainer_data:/data \
  portainer/portainer-ce:latest
```

Acesse: http://localhost:9000

## 🔄 Atualizações

```bash
# 1. Parar containers
docker-compose down

# 2. Atualizar código
git pull
# ou copiar arquivos novos

# 3. Reconstruir e iniciar
docker-compose up -d --build

# 4. Verificar logs
docker-compose logs -f
```

## 📝 Notas Importantes

- ✅ O banco de dados é persistente na pasta `./data`
- ✅ Faça backups regulares do banco de dados
- ✅ Em produção, use variáveis de ambiente seguras
- ✅ Configure HTTPS em produção
- ✅ Monitore os logs regularmente
- ✅ Mantenha o Docker atualizado

## 🆘 Suporte

Para problemas ou dúvidas, verifique:
- Logs: `docker-compose logs`
- Status: `docker-compose ps`
- Recursos: `docker stats`

---

**Desenvolvido com ❤️ para facilitar a gestão de oficinas mecânicas**

