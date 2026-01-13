#!/bin/bash

# Script para ver logs do sistema Docker
# Uso: ./logs-docker.sh [backend|frontend]

if [ "$1" == "backend" ]; then
    echo "📋 Logs do Backend:"
    docker-compose logs -f backend
elif [ "$1" == "frontend" ]; then
    echo "📋 Logs do Frontend:"
    docker-compose logs -f frontend
else
    echo "📋 Logs do Sistema:"
    docker-compose logs -f
fi

