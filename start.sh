#!/bin/bash

# Script para iniciar o Sistema de Oficina (modo desenvolvimento)
# Uso: ./start.sh

echo "🚗 Iniciando Sistema de Oficina..."
echo ""

# Verificar se Node.js está instalado
if ! command -v node &> /dev/null; then
    echo "❌ Node.js não está instalado!"
    echo "   Instale o Node.js: https://nodejs.org/"
    exit 1
fi

# Verificar se npm está instalado
if ! command -v npm &> /dev/null; then
    echo "❌ npm não está instalado!"
    exit 1
fi

# Verificar se as dependências estão instaladas
if [ ! -d "node_modules" ]; then
    echo "📦 Instalando dependências..."
    npm run setup
fi

# Verificar se as portas estão livres
if lsof -Pi :3000 -sTCP:LISTEN -t >/dev/null 2>&1; then
    echo "⚠️  Porta 3000 já está em uso. Liberando..."
    kill -9 $(lsof -ti:3000) 2>/dev/null
    sleep 1
fi

if lsof -Pi :5173 -sTCP:LISTEN -t >/dev/null 2>&1; then
    echo "⚠️  Porta 5173 já está em uso. Liberando..."
    kill -9 $(lsof -ti:5173) 2>/dev/null
    sleep 1
fi

echo ""
echo "🔧 Limpando cache do Vite..."
rm -rf client/.vite client/node_modules/.vite client/dist 2>/dev/null

echo ""
echo "🚀 Iniciando servidores..."
echo ""
echo "📍 URLs de Acesso:"
echo "   Frontend: http://localhost:5173"
echo "   Backend:  http://localhost:3000/api/health"
echo ""
echo "🔑 Credenciais padrão:"
echo "   Email: admin@oficina.com"
echo "   Senha: admin123"
echo ""
echo "💡 Pressione Ctrl+C para parar o sistema"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Iniciar com npm run dev (usa concurrently)
npm run dev

