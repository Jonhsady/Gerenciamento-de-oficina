#!/bin/bash

echo "🔍 Verificando Sistema de Oficina..."
echo ""

# Verificar Node.js
if command -v node &> /dev/null; then
    NODE_VERSION=$(node -v)
    echo "✅ Node.js instalado: $NODE_VERSION"
else
    echo "❌ Node.js NÃO instalado"
    exit 1
fi

# Verificar npm
if command -v npm &> /dev/null; then
    NPM_VERSION=$(npm -v)
    echo "✅ npm instalado: $NPM_VERSION"
else
    echo "❌ npm NÃO instalado"
    exit 1
fi

echo ""

# Verificar estrutura de pastas
echo "📁 Verificando estrutura..."

if [ -d "server" ]; then
    echo "✅ Pasta server encontrada"
else
    echo "❌ Pasta server NÃO encontrada"
fi

if [ -d "client" ]; then
    echo "✅ Pasta client encontrada"
else
    echo "❌ Pasta client NÃO encontrada"
fi

if [ -f "package.json" ]; then
    echo "✅ package.json do servidor encontrado"
else
    echo "❌ package.json do servidor NÃO encontrado"
fi

if [ -f "client/package.json" ]; then
    echo "✅ package.json do client encontrado"
else
    echo "❌ package.json do client NÃO encontrado"
fi

echo ""

# Verificar arquivo .env
if [ -f ".env" ]; then
    echo "✅ Arquivo .env encontrado"
else
    echo "⚠️  Arquivo .env NÃO encontrado"
    if [ -f ".env.example" ]; then
        echo "   Criando .env a partir do .env.example..."
        cp .env.example .env
        echo "✅ Arquivo .env criado!"
    fi
fi

echo ""

# Verificar dependências
echo "📦 Verificando dependências..."

if [ -d "node_modules" ]; then
    echo "✅ Dependências do servidor instaladas"
else
    echo "⚠️  Dependências do servidor NÃO instaladas"
    echo "   Execute: npm install"
fi

if [ -d "client/node_modules" ]; then
    echo "✅ Dependências do client instaladas"
else
    echo "⚠️  Dependências do client NÃO instaladas"
    echo "   Execute: cd client && npm install"
fi

echo ""
echo "🎯 Próximos passos:"
echo ""
echo "1. Se as dependências não estão instaladas:"
echo "   npm install"
echo "   cd client && npm install && cd .."
echo ""
echo "2. Para iniciar o sistema:"
echo "   npm run dev"
echo ""
echo "3. Acesse:"
echo "   Frontend: http://localhost:5173"
echo "   Backend:  http://localhost:3000"
echo ""
echo "4. Login padrão:"
echo "   Email: admin@oficina.com"
echo "   Senha: admin123"
echo ""
echo "✨ Sistema pronto para uso!"

