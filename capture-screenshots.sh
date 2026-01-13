#!/bin/bash

# Script para capturar screenshots do sistema
# Uso: ./capture-screenshots.sh

echo "📸 Script de Captura de Screenshots"
echo "===================================="
echo ""
echo "Este script vai te ajudar a capturar as telas principais do sistema."
echo ""
echo "📋 Telas que precisam ser capturadas:"
echo "  1. Dashboard"
echo "  2. Clientes"
echo "  3. Serviços"
echo "  4. Peças"
echo "  5. Ferramentas"
echo "  6. Ordens de Serviço"
echo "  7. Usuários (Admin)"
echo "  8. Login"
echo ""
echo "⚠️  IMPORTANTE:"
echo "  - Certifique-se de que o sistema está rodando (./start.sh)"
echo "  - Acesse http://localhost:5173 no navegador"
echo "  - Navegue pelas telas e capture as screenshots"
echo ""
echo "🛠️  Ferramentas recomendadas para captura:"
echo ""
echo "  Linux:"
echo "    - flameshot (recomendado): sudo apt install flameshot"
echo "    - gnome-screenshot: já instalado no GNOME"
echo "    - scrot: sudo apt install scrot"
echo ""
echo "  Windows:"
echo "    - Snipping Tool (Win + Shift + S)"
echo "    - Lightshot"
echo ""
echo "  Mac:"
echo "    - Cmd + Shift + 4 (área selecionada)"
echo "    - Cmd + Shift + 3 (tela inteira)"
echo ""
echo "📁 As screenshots devem ser salvas em:"
echo "   docs/screenshots/"
echo ""
echo "📝 Nomes dos arquivos:"
echo "  - dashboard.png"
echo "  - clientes.png"
echo "  - servicos.png"
echo "  - pecas.png"
echo "  - ferramentas.png"
echo "  - ordens-servico.png"
echo "  - usuarios.png"
echo "  - login.png"
echo ""
echo "💡 Dicas:"
echo "  - Use resolução de pelo menos 1920x1080"
echo "  - Capture a tela inteira do navegador"
echo "  - Certifique-se de que os dados estão visíveis"
echo "  - Use formato PNG para melhor qualidade"
echo ""
read -p "Pressione ENTER para abrir o navegador e começar a captura..."

# Verifica se o sistema está rodando
if ! curl -s http://localhost:5173 > /dev/null 2>&1; then
    echo "❌ O sistema não está rodando!"
    echo "   Execute: ./start.sh"
    exit 1
fi

echo "✅ Sistema está rodando!"
echo ""
echo "🌐 Abrindo navegador..."
echo "   URL: http://localhost:5173"
echo ""

# Tenta abrir o navegador (funciona na maioria dos sistemas)
if command -v xdg-open > /dev/null; then
    xdg-open http://localhost:5173 2>/dev/null &
elif command -v open > /dev/null; then
    open http://localhost:5173 2>/dev/null &
fi

echo "📸 Agora você pode capturar as screenshots!"
echo ""
echo "Quando terminar, as screenshots estarão prontas para o README."
echo ""

