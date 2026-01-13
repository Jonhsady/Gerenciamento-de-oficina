#!/bin/bash

# Script para parar o sistema Docker
# Uso: ./stop-docker.sh

echo "🛑 Parando Sistema de Oficina..."
echo ""

# Parar e remover containers
docker-compose down

echo ""
echo "✅ Sistema parado com sucesso!"
echo ""
echo "💡 Para iniciar novamente: ./start-docker.sh"
echo ""

