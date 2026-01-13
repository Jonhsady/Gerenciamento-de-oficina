# Dockerfile - Backend (Node.js + Express + SQLite)
FROM node:18-alpine

# Instalar dependências do sistema
RUN apk add --no-cache sqlite

# Criar diretório de trabalho
WORKDIR /app

# Copiar package.json e package-lock.json
COPY package*.json ./

# Instalar dependências
RUN npm install --production

# Copiar código fonte
COPY . .

# Criar diretório para o banco de dados
RUN mkdir -p /app/data

# Expor a porta
EXPOSE 3000

# Variáveis de ambiente padrão
ENV NODE_ENV=production
ENV PORT=3000
ENV JWT_SECRET=change_this_secret_in_production
ENV ADMIN_EMAIL=admin@oficina.com
ENV ADMIN_PASSWORD=admin123

# Healthcheck
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3000/api/health', (r) => {process.exit(r.statusCode === 200 ? 0 : 1)})"

# Iniciar aplicação
CMD ["node", "src/index.js"]

