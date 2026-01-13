#!/bin/bash

# Script para parar o Sistema de Oficina
# Uso: ./stop.sh

echo "🛑 Parando Sistema de Oficina..."
echo ""

# Tentar ler PIDs salvos
if [ -f .backend.pid ]; then
    BACKEND_PID=$(cat .backend.pid)
    if ps -p $BACKEND_PID > /dev/null 2>&1; then
        echo "   Parando Backend (PID: $BACKEND_PID)..."
        kill -9 $BACKEND_PID 2>/dev/null
    fi
    rm -f .backend.pid
fi

if [ -f .frontend.pid ]; then
    FRONTEND_PID=$(cat .frontend.pid)
    if ps -p $FRONTEND_PID > /dev/null 2>&1; then
        echo "   Parando Frontend (PID: $FRONTEND_PID)..."
        kill -9 $FRONTEND_PID 2>/dev/null
    fi
    rm -f .frontend.pid
fi

# Matar processos por porta (fallback)
if lsof -Pi :3000 -sTCP:LISTEN -t >/dev/null 2>&1; then
    echo "   Liberando porta 3000..."
    kill -9 $(lsof -ti:3000) 2>/dev/null
fi

if lsof -Pi :5173 -sTCP:LISTEN -t >/dev/null 2>&1; then
    echo "   Liberando porta 5173..."
    kill -9 $(lsof -ti:5173) 2>/dev/null
fi

# Matar processos por nome (fallback adicional)
pkill -f "vite" 2>/dev/null
pkill -f "nodemon" 2>/dev/null

echo ""
echo "✅ Sistema parado com sucesso!"
echo ""
echo "💡 Para iniciar novamente: ./start.sh"
echo ""

