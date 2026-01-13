# 🚗 Sistema de Gerenciamento de Oficina

Sistema completo para gerenciamento de oficinas mecânicas com autenticação, controle de estoque, ordens de serviço e muito mais!

## ✨ Funcionalidades

- 👥 **Gestão de Clientes** - Cadastro completo com CPF/CNPJ, telefone, e-mail
- 🔧 **Catálogo de Serviços** - Controle de serviços oferecidos com preços
- 📦 **Estoque de Peças** - Gerenciamento de peças com quantidade e preço
- 🛠️ **Gerenciamento de Ferramentas** - Controle de ferramentas e seu status
- 📋 **Ordens de Serviço** - Criação e acompanhamento de OS
- 📞 **Agenda de Contatos** - Cadastro de fornecedores e contatos
- 👤 **Sistema de Usuários** - Múltiplos usuários com permissões
- 🔒 **Autenticação Segura** - JWT + Bcrypt
- 📊 **Dashboard** - Estatísticas e visão geral do negócio
- 🎯 **Sistema de Limites** - Controle de uso para usuários não autorizados

## 🚀 Início Rápido

### Opção 1: Modo Desenvolvimento (Recomendado para testes)

```bash
# 1. Entre na pasta do projeto
cd /home/jonhsady/projects/IDEIAS

# 2. Instale as dependências (primeira vez apenas)
npm run setup

# 3. Inicie o sistema
./start.sh
```

### Opção 2: Docker (Recomendado para produção)

```bash
# 1. Entre na pasta do projeto
cd /home/jonhsady/projects/IDEIAS

# 2. Inicie com Docker
./start-docker.sh

# Ou manualmente
docker-compose up -d
```

## 🔑 Acesso ao Sistema

Após iniciar, acesse:

- **Frontend**: http://localhost:5173 (desenvolvimento) ou http://localhost (Docker)
- **Backend API**: http://localhost:3000/api/health

**Credenciais padrão do administrador:**
- **Email**: admin@oficina.com
- **Senha**: admin123

⚠️ **IMPORTANTE**: Altere a senha após o primeiro acesso!

## 📂 Estrutura do Projeto

```
IDEIAS/
├── server/              # Backend (Node.js + Express)
│   ├── src/
│   │   ├── config/      # Configurações (database, etc)
│   │   ├── controllers/ # Lógica de negócio
│   │   ├── middleware/  # Middlewares (auth, validation)
│   │   └── routes/      # Rotas da API
│   ├── tests/           # Testes unitários e integração
│   ├── Dockerfile       # Imagem Docker do backend
│   └── package.json
├── client/              # Frontend (React + Vite)
│   ├── src/
│   │   ├── components/  # Componentes reutilizáveis
│   │   ├── pages/       # Páginas da aplicação
│   │   ├── services/    # Serviços (API client)
│   │   └── store/       # Estado global (Zustand)
│   ├── Dockerfile       # Imagem Docker do frontend
│   ├── nginx.conf       # Configuração do Nginx
│   └── package.json
├── data/                # Banco de dados SQLite
├── docker-compose.yml   # Orquestração Docker
├── start.sh            # Script de inicialização
├── stop.sh             # Script para parar
└── README.md           # Este arquivo
```

## 🛠️ Scripts Disponíveis

### Desenvolvimento

```bash
# Iniciar sistema completo (backend + frontend)
./start.sh

# Parar sistema
./stop.sh

# Apenas backend
npm run server:dev

# Apenas frontend
npm run client:dev
```

### Docker

```bash
# Iniciar com Docker
./start-docker.sh

# Parar containers
./stop-docker.sh

# Ver logs
./logs-docker.sh
```

### Testes

```bash
# Rodar todos os testes
npm test

# Testes do backend
npm run server:test

# Testes do frontend
npm run client:test

# Testes em modo watch
npm run test:watch
```

### Build de Produção

```bash
# Build do frontend
npm run build

# Iniciar em produção
npm start
```

## 📋 Pré-requisitos

### Para desenvolvimento:

- Node.js 16+ (recomendado 18+)
- npm 8+

### Para Docker:

- Docker 20.10+
- Docker Compose 2.0+

## 🔧 Instalação Completa

### 1. Clonar ou baixar o projeto

```bash
# Se usar Git
git clone seu-repositorio.git
cd IDEIAS

# Se baixou ZIP
unzip IDEIAS.zip
cd IDEIAS
```

### 2. Instalar dependências

```bash
# Instalar backend e frontend
npm run setup

# Ou instalar separadamente
npm install
cd client && npm install
```

### 3. Configurar variáveis de ambiente (opcional)

```bash
# Copiar arquivo de exemplo
cp env.example .env

# Editar configurações
nano .env
```

### 4. Iniciar o sistema

```bash
./start.sh
```

## 🔒 Segurança

O sistema inclui várias camadas de segurança:

- ✅ Autenticação JWT
- ✅ Senhas criptografadas com Bcrypt
- ✅ Rate limiting (proteção contra força bruta)
- ✅ Helmet.js (headers de segurança)
- ✅ CORS configurado
- ✅ Validação de dados (express-validator)
- ✅ SQL injection protection (prepared statements)
- ✅ XSS protection

### Recomendações para Produção:

1. Altere o `JWT_SECRET` no arquivo `.env`
2. Use HTTPS (configure um reverse proxy)
3. Altere as credenciais padrão do admin
4. Configure firewall
5. Faça backups regulares do banco de dados
6. Monitore os logs

## 👥 Sistema de Usuários

### Tipos de Usuário

- **Admin**: Acesso total, sem limites
- **Usuário**: Acesso controlado com limites de uso

### Limites para Usuários Não Autorizados

Novos usuários podem se cadastrar mas terão acesso limitado até que um administrador os autorize:

- **Clientes**: 5 cadastros
- **Serviços**: 10 cadastros
- **Peças**: 10 cadastros
- **Ordens de Serviço**: 3 criações

### Autorizar Usuários

1. Faça login como admin
2. Vá em "Gerenciar Usuários"
3. Clique em "Autorizar" para liberar acesso completo

## 📊 API Endpoints

### Autenticação
- `POST /api/auth/register` - Registrar novo usuário
- `POST /api/auth/login` - Fazer login

### Recursos (requer autenticação)
- `GET /api/clientes` - Listar clientes
- `POST /api/clientes` - Criar cliente
- `GET /api/servicos` - Listar serviços
- `POST /api/servicos` - Criar serviço
- `GET /api/pecas` - Listar peças
- `POST /api/pecas` - Criar peça
- `GET /api/ferramentas` - Listar ferramentas
- `POST /api/ferramentas` - Criar ferramenta
- `GET /api/contatos` - Listar contatos
- `POST /api/contatos` - Criar contato
- `GET /api/ordens-servico` - Listar OS
- `POST /api/ordens-servico` - Criar OS

### Admin (requer role admin)
- `GET /api/usuarios` - Listar usuários
- `PATCH /api/usuarios/:id/authorize` - Autorizar usuário
- `PATCH /api/usuarios/:id/toggle-active` - Ativar/desativar
- `DELETE /api/usuarios/:id/reset-usage` - Resetar limites

## 🐛 Solução de Problemas

### Porta já em uso

```bash
# Liberar porta 3000 (backend)
lsof -ti:3000 | xargs kill -9

# Liberar porta 5173 (frontend)
lsof -ti:5173 | xargs kill -9

# Ou usar o script de parada
./stop.sh
```

### Erro ao instalar dependências

```bash
# Limpar cache do npm
npm cache clean --force

# Reinstalar
rm -rf node_modules client/node_modules
npm run setup
```

### Banco de dados corrompido

```bash
# Fazer backup primeiro!
cp data/oficina.sqlite data/oficina_backup.sqlite

# Remover banco (será recriado)
rm data/oficina.sqlite

# Reiniciar sistema
./start.sh
```

### Problemas com React Icons

```bash
# Limpar cache do Vite
rm -rf client/.vite client/node_modules/.vite

# Reinstalar react-icons
cd client
npm install react-icons --force
cd ..

# Reiniciar
./start.sh
```

## 📦 Backup e Restore

### Fazer Backup

```bash
# Backup do banco de dados
cp data/oficina.sqlite backups/oficina_$(date +%Y%m%d).sqlite

# Backup completo do projeto
tar -czf oficina_backup_$(date +%Y%m%d).tar.gz \
  --exclude=node_modules \
  --exclude=client/node_modules \
  --exclude=client/dist \
  .
```

### Restaurar Backup

```bash
# Restaurar banco de dados
cp backups/oficina_20241021.sqlite data/oficina.sqlite

# Restaurar projeto completo
tar -xzf oficina_backup_20241021.tar.gz
```

## 🌐 Deploy

### Deploy em VPS/Cloud

```bash
# 1. Conectar ao servidor
ssh usuario@seu-servidor.com

# 2. Instalar Node.js (se necessário)
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# 3. Copiar projeto
scp -r IDEIAS/ usuario@servidor:/home/usuario/

# 4. No servidor, instalar e iniciar
cd /home/usuario/IDEIAS
npm run setup
npm start

# Ou com Docker
./start-docker.sh
```

### Deploy com PM2 (recomendado)

```bash
# Instalar PM2
sudo npm install -g pm2

# Iniciar aplicação
pm2 start server/src/index.js --name oficina

# Auto-start no boot
pm2 startup
pm2 save

# Gerenciar
pm2 status
pm2 logs oficina
pm2 restart oficina
```

## 📚 Documentação Adicional

- [Guia Docker](./DOCKER_SETUP.md) - Setup completo com Docker
- [Sistema de Limites](./SISTEMA_DE_LIMITES.md) - Como funciona o sistema de autorização
- [README Docker](./README_DOCKER.md) - Comandos Docker específicos

## 🤝 Contribuindo

Este é um projeto privado para gerenciamento de oficinas mecânicas.

## 📄 Licença

MIT License - Use livremente em seu negócio!

## 🆘 Suporte

Para problemas ou dúvidas:

1. Verifique este README
2. Consulte os logs: `tail -f logs/*.log` (desenvolvimento)
3. Verifique os logs Docker: `docker-compose logs -f`
4. Teste os endpoints da API: `curl http://localhost:3000/api/health`

## 📝 Changelog

### v1.0.0 (2024-10-21)
- ✅ Sistema completo funcional
- ✅ Autenticação e autorização
- ✅ CRUD de todas as entidades
- ✅ Sistema de limites de uso
- ✅ Dashboard com estatísticas
- ✅ Docker configurado
- ✅ Testes implementados
- ✅ Documentação completa

---

**Desenvolvido com ❤️ para facilitar a gestão de oficinas mecânicas**

🚗 **Bom uso e bons negócios!**
