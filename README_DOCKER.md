# 🐳 Sistema de Oficina - Docker

Sistema completo de gerenciamento de oficina mecânica rodando em containers Docker.

## ✅ Status: Sistema Funcionando!

- ✅ Backend (API): http://localhost:3000/api/health
- ✅ Frontend (React): http://localhost
- ✅ Banco de dados SQLite persistente
- ✅ Health checks configurados
- ✅ Nginx otimizado

## 🚀 Como Usar

### Opção 1: Script Automático (Recomendado)

```bash
# Iniciar sistema
./start-docker.sh

# Ver logs
./logs-docker.sh

# Parar sistema
./stop-docker.sh
```

### Opção 2: Docker Compose Manual

```bash
# Iniciar em segundo plano
docker-compose up -d

# Ver logs
docker-compose logs -f

# Parar
docker-compose down
```

## 🔑 Acesso Padrão

- **Email:** admin@oficina.com
- **Senha:** admin123

⚠️ **Altere essas credenciais em produção!**

## 📦 Containers

| Container | Porta | Descrição |
|-----------|-------|-----------|
| oficina-backend | 3000 | API Node.js + Express + SQLite |
| oficina-frontend | 80 | React + Nginx |

## 📂 Volumes Persistentes

- `./data` - Banco de dados SQLite
- `./logs` - Logs da aplicação (se configurado)

## 🛠️ Comandos Úteis

```bash
# Ver status
docker-compose ps

# Ver logs em tempo real
docker-compose logs -f

# Reiniciar
docker-compose restart

# Reconstruir imagens
docker-compose up -d --build

# Parar e remover tudo (incluindo volumes)
docker-compose down -v

# Executar comandos no container
docker-compose exec backend sh
docker-compose exec frontend sh

# Ver uso de recursos
docker stats
```

## 🔧 Configuração Avançada

### Alterar Porta do Frontend

Edite `docker-compose.yml`:

```yaml
frontend:
  ports:
    - "8080:80"  # Ao invés de "80:80"
```

### Alterar Porta do Backend

Edite `docker-compose.yml`:

```yaml
backend:
  ports:
    - "3333:3000"  # Ao invés de "3000:3000"
```

### Variáveis de Ambiente

Crie um arquivo `.env` na raiz:

```bash
JWT_SECRET=seu_secret_super_seguro_aqui
ADMIN_EMAIL=seu@email.com
ADMIN_PASSWORD=senha_forte_aqui
```

## 📊 Monitoramento

### Ver saúde dos containers

```bash
docker-compose ps
```

Output esperado:
```
NAME               STATUS
oficina-backend    Up (healthy)
oficina-frontend   Up (healthy)
```

### Ver logs de erro

```bash
# Últimas 100 linhas
docker-compose logs --tail=100

# Apenas erros
docker-compose logs | grep -i error
```

## 🐛 Problemas Comuns

### Porta já em uso

```bash
# Verificar o que está usando a porta
sudo lsof -i :80
sudo lsof -i :3000

# Matar processos
sudo kill -9 $(lsof -ti:80)
sudo kill -9 $(lsof -ti:3000)
```

### Container não inicia

```bash
# Ver logs detalhados
docker-compose logs backend
docker-compose logs frontend

# Remover tudo e recomeçar
docker-compose down -v
docker-compose up -d --build
```

### Permissão negada

```bash
# Adicionar usuário ao grupo docker
sudo usermod -aG docker $USER
newgrp docker

# Ou executar com sudo
sudo docker-compose up -d
```

### Banco de dados corrompido

```bash
# Fazer backup primeiro!
cp data/oficina.sqlite data/oficina_backup.sqlite

# Remover e deixar recriar
rm data/oficina.sqlite
docker-compose restart backend
```

## 🔒 Segurança em Produção

1. **Altere todas as senhas e secrets**
2. **Use HTTPS** (configure reverse proxy: Nginx, Traefik, Caddy)
3. **Configure firewall**
4. **Faça backups regulares**
5. **Monitore logs**
6. **Mantenha Docker atualizado**

### Exemplo com HTTPS (Traefik)

```yaml
# docker-compose.yml
services:
  frontend:
    labels:
      - "traefik.enable=true"
      - "traefik.http.routers.oficina.rule=Host(`seu-dominio.com`)"
      - "traefik.http.routers.oficina.entrypoints=websecure"
      - "traefik.http.routers.oficina.tls.certresolver=letsencrypt"
```

## 📝 Backup e Restore

### Fazer Backup

```bash
# Backup manual
docker-compose exec backend cp /app/data/oficina.sqlite /app/data/backup_$(date +%Y%m%d_%H%M%S).sqlite

# Ou copiar direto
cp data/oficina.sqlite backups/oficina_$(date +%Y%m%d).sqlite
```

### Restaurar Backup

```bash
# Parar sistema
docker-compose down

# Restaurar arquivo
cp backups/oficina_20241021.sqlite data/oficina.sqlite

# Reiniciar
docker-compose up -d
```

### Backup Automático (Cron)

```bash
# Adicionar ao crontab
crontab -e

# Backup diário às 2h da manhã
0 2 * * * cd /caminho/do/projeto && cp data/oficina.sqlite backups/oficina_$(date +\%Y\%m\%d).sqlite
```

## 🌐 Deploy em Servidor

### VPS/Cloud (Ubuntu/Debian)

```bash
# 1. Conectar ao servidor
ssh usuario@seu-servidor.com

# 2. Instalar Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh
sudo usermod -aG docker $USER

# 3. Instalar Docker Compose
sudo apt install docker-compose-plugin

# 4. Clonar ou transferir projeto
git clone seu-repositorio.git
# ou
scp -r IDEIAS/ usuario@servidor:/home/usuario/

# 5. Configurar
cd IDEIAS
nano .env  # Alterar secrets e senhas

# 6. Iniciar
./start-docker.sh

# 7. Configurar firewall
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw enable
```

## 📈 Performance

### Otimizações Aplicadas

- ✅ Build multi-stage (imagens menores)
- ✅ Nginx com Gzip
- ✅ Cache de assets estáticos
- ✅ Headers de segurança
- ✅ Health checks
- ✅ Restart automático

### Recursos Utilizados

```bash
# Ver uso de CPU e memória
docker stats

# Exemplo de output esperado:
# oficina-backend   0.50%    50MB / 2GB    2.5%
# oficina-frontend  0.01%    10MB / 2GB    0.5%
```

## 📚 Documentação Adicional

- [Docker Setup Completo](./DOCKER_SETUP.md)
- [Guia Rápido](./GUIA_RAPIDO.md)
- [Sistema de Limites](./SISTEMA_DE_LIMITES.md)

## 🆘 Suporte

### Verificar Saúde do Sistema

```bash
# Status dos containers
docker-compose ps

# Testar backend
curl http://localhost:3000/api/health

# Testar frontend
curl http://localhost/

# Ver logs
docker-compose logs --tail=50 -f
```

### Comandos de Debug

```bash
# Entrar no container backend
docker-compose exec backend sh

# Entrar no container frontend
docker-compose exec frontend sh

# Ver configuração do Nginx
docker-compose exec frontend cat /etc/nginx/conf.d/default.conf

# Ver processos rodando
docker-compose top
```

## ✨ Funcionalidades

- 🚗 Gestão de Clientes
- 🔧 Catálogo de Serviços
- 📦 Controle de Estoque de Peças
- 🛠️ Gerenciamento de Ferramentas
- 📋 Ordens de Serviço
- 📞 Agenda de Contatos
- 👥 Sistema de Usuários e Permissões
- 🔒 Autenticação JWT
- 📊 Dashboard com Estatísticas

## 📄 Licença

Desenvolvido para facilitar a gestão de oficinas mecânicas.

---

**🎉 Sistema pronto para uso em produção!**

Para mais informações, consulte a [documentação completa](./DOCKER_SETUP.md).

