#!/bin/bash

# Script para iniciar o sistema com Docker
# Uso: ./start-docker.sh

echo "🐳 Iniciando Sistema de Oficina com Docker..."
echo ""

# Verificar se Docker está instalado
if ! command -v docker &> /dev/null; then
    echo "❌ Docker não está instalado!"
    echo "   Instale o Docker primeiro: https://docs.docker.com/get-docker/"
    exit 1
fi

# Verificar se Docker Compose está instalado
if ! command -v docker-compose &> /dev/null && ! docker compose version &> /dev/null 2>&1; then
    echo "❌ Docker Compose não está instalado!"
    echo "   Instale o Docker Compose primeiro: https://docs.docker.com/compose/install/"
    exit 1
fi

# Verificar se arquivo .env existe, se não, copiar do exemplo
if [ ! -f .env ]; then
    echo "⚠️  Arquivo .env não encontrado!"
    if [ -f env.example ]; then
        echo "📋 Copiando env.example para .env..."
        cp env.example .env
        echo "✅ Arquivo .env criado!"
        echo "⚠️  IMPORTANTE: Edite o .env e altere o JWT_SECRET em produção!"
        echo ""
    else
        echo "⚠️  Criando .env com valores padrão..."
        cat > .env << 'EOF'
JWT_SECRET=seu_jwt_secret_super_seguro_123456
ADMIN_EMAIL=admin@oficina.com
ADMIN_PASSWORD=admin123
PORT=3000
NODE_ENV=production
EOF
        echo "✅ Arquivo .env criado com valores padrão!"
        echo ""
    fi
fi

# Criar pasta data se não existir
if [ ! -d data ]; then
    echo "📁 Criando pasta para banco de dados..."
    mkdir -p data
    chmod 755 data
fi

echo "🏗️  Construindo e iniciando containers..."
echo ""

# Parar containers existentes
docker-compose down 2>/dev/null

# Construir e iniciar em segundo plano
if docker compose up -d --build; then
    echo ""
    echo "✅ Sistema iniciado com sucesso!"
    echo ""
    echo "📍 URLs:"
    echo "   Frontend: http://localhost"
    echo "   Backend:  http://localhost:3000/api/health"
    echo ""
    echo "🔑 Credenciais padrão:"
    echo "   Email: admin@oficina.com"
    echo "   Senha: admin123"
    echo ""
    echo "📋 Comandos úteis:"
    echo "   Ver logs:        docker-compose logs -f"
    echo "   Parar sistema:   docker-compose down"
    echo "   Reiniciar:       docker-compose restart"
    echo "   Status:          docker-compose ps"
    echo ""
    echo "⏳ Aguarde alguns segundos para o sistema inicializar completamente..."
    echo ""
    
    # Mostrar logs por 5 segundos
    timeout 5 docker-compose logs -f || true
    
    echo ""
    echo "✨ Sistema pronto para uso!"
    echo ""
else
    echo ""
    echo "❌ Erro ao iniciar o sistema!"
    echo "   Verifique os logs: docker-compose logs"
    exit 1
fi

