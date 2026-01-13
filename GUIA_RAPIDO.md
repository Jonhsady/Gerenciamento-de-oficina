# 🚀 Guia Rápido de Uso

## Instalação e Execução

### 1. Instalar Dependências

```bash
cd /home/jonhsady/projects/IDEIAS

# Instalar dependências do servidor
npm install

# Instalar dependências do cliente
cd client
npm install
cd ..
```

### 2. Iniciar o Sistema

```bash
# Opção 1: Iniciar tudo de uma vez (recomendado)
npm run dev

# Opção 2: Iniciar separadamente
# Terminal 1 - Servidor (porta 3000)
npm run server

# Terminal 2 - Frontend (porta 5173)
cd client && npm run dev
```

### 3. Acessar o Sistema

- **Frontend**: http://localhost:5173
- **API**: http://localhost:3000/api

**Login Padrão:**
- Email: `admin@oficina.com`
- Senha: `admin123`

---

## 📱 Como Usar

### 1. Dashboard
- Visualize estatísticas de ordens de serviço
- Veja peças com estoque baixo
- Acesse ações rápidas

### 2. Clientes
1. Clique em "Novo Cliente"
2. Preencha nome (obrigatório) e dados de contato
3. Salve

### 3. Serviços
1. Clique em "Novo Serviço"
2. Informe nome, valor e tempo estimado
3. Adicione categoria (opcional)
4. Salve

### 4. Peças
1. Clique em "Nova Peça"
2. Preencha nome, quantidade e valor unitário
3. Configure quantidade mínima para alertas
4. Adicione localização e fornecedor
5. Salve

**Atualizar Estoque:**
- Clique no ícone de edição ao lado da quantidade
- Escolha "Adicionar" ou "Remover"
- Informe a quantidade
- Sistema atualiza automaticamente

### 5. Ferramentas
1. Clique em "Nova Ferramenta"
2. Informe nome e estado de conservação
3. Adicione localização
4. Salve

**Marcar Em Uso:**
- Clique no badge de status (Disponível/Em uso)
- Status alterna automaticamente

### 6. Contatos
1. Clique em "Novo Contato"
2. Informe nome e tipo (Fornecedor/Parceiro/Cliente/Outro)
3. Adicione dados de contato
4. Salve

### 7. Ordens de Serviço

**Criar Nova OS:**
1. Clique em "Nova OS"
2. Selecione o cliente
3. Preencha dados do veículo
4. Adicione serviços:
   - Clique em "Adicionar Serviço"
   - Selecione o serviço
   - Ajuste quantidade se necessário
5. Adicione peças:
   - Clique em "Adicionar Peça"
   - Selecione a peça
   - Defina quantidade
   - Sistema baixa automaticamente do estoque
6. Adicione data prevista e observações
7. Confira o valor total
8. Clique em "Criar Ordem de Serviço"

**Gerenciar OS:**
- Clique no ícone de visualizar para ver detalhes
- Altere o status conforme o andamento:
  - Aberta → Em Andamento → Concluída

---

## 🔧 Funcionalidades Especiais

### Alertas de Estoque
- Sistema alerta automaticamente quando peças atingem quantidade mínima
- Peças sem estoque são destacadas em vermelho
- Dashboard mostra as 5 peças mais críticas

### Controle de Estoque Automático
- Ao criar uma OS com peças, o estoque é baixado automaticamente
- Ao excluir uma OS, as peças retornam ao estoque

### Busca e Filtros
- Todas as telas têm busca integrada
- Ordens de serviço podem ser filtradas por status
- Busque por nome, código, telefone, etc.

### Validações
- Sistema valida todos os dados antes de salvar
- Campos obrigatórios são marcados com *
- Mensagens de erro claras e específicas

---

## 🧪 Testar a API

### Usando cURL

```bash
# Login
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@oficina.com","senha":"admin123"}'

# Listar clientes (substitua SEU_TOKEN pelo token recebido)
curl http://localhost:3000/api/clientes \
  -H "Authorization: Bearer SEU_TOKEN"

# Criar cliente
curl -X POST http://localhost:3000/api/clientes \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer SEU_TOKEN" \
  -d '{"nome":"João Silva","telefone":"11999999999"}'
```

### Usando Insomnia/Postman

1. Importe a URL base: `http://localhost:3000/api`
2. Faça login em `/auth/login`
3. Copie o token retornado
4. Adicione o header `Authorization: Bearer SEU_TOKEN` nas próximas requisições

---

## 🐛 Resolução de Problemas

### Servidor não inicia
```bash
# Verifique se a porta 3000 está livre
lsof -i :3000

# Mate o processo se necessário
kill -9 PID
```

### Cliente não inicia
```bash
# Verifique se a porta 5173 está livre
lsof -i :5173

# Limpe o cache do npm
cd client
rm -rf node_modules package-lock.json
npm install
```

### Erro de autenticação
- Verifique se o arquivo `.env` existe
- Certifique-se de que JWT_SECRET está configurado
- Tente fazer login novamente

### Banco de dados corrompido
```bash
# Exclua o banco (você perderá todos os dados!)
rm database/oficina.db

# Reinicie o servidor (banco será recriado)
npm run server
```

---

## 💡 Dicas

1. **Primeiro Uso:**
   - Cadastre alguns clientes
   - Adicione serviços comuns da sua oficina
   - Configure o estoque de peças
   - Registre suas ferramentas

2. **Manutenção Regular:**
   - Monitore o dashboard diariamente
   - Reabasteça peças com estoque baixo
   - Mantenha os dados de clientes atualizados

3. **Segurança:**
   - Altere a senha padrão do admin
   - Use senhas fortes
   - Faça backup regular do banco de dados

4. **Backup:**
   ```bash
   # Copiar banco de dados
   cp database/oficina.db database/backup_$(date +%Y%m%d).db
   ```

---

## 📞 Estrutura de Dados

### Cliente
- nome* (obrigatório)
- cpf_cnpj
- telefone
- email
- endereco
- observacoes

### Serviço
- nome* (obrigatório)
- descricao
- valor* (obrigatório)
- tempo_estimado (minutos)
- categoria
- ativo

### Peça
- nome* (obrigatório)
- codigo
- descricao
- quantidade* (obrigatório)
- quantidade_minima* (obrigatório)
- valor_unitario* (obrigatório)
- localizacao
- fornecedor
- categoria

### Ferramenta
- nome* (obrigatório)
- codigo
- descricao
- quantidade
- estado (Ótima, Boa, Regular, Ruim, Manutenção)
- localizacao
- data_aquisicao
- valor

### Contato
- nome* (obrigatório)
- tipo* (Fornecedor, Parceiro, Cliente, Outro)
- empresa
- telefone
- email
- endereco
- observacoes

### Ordem de Serviço
- cliente_id* (obrigatório)
- veiculo_placa
- veiculo_modelo
- veiculo_ano
- status (Aberta, Em Andamento, Aguardando Peças, Concluída, Cancelada)
- data_abertura (automático)
- data_prevista
- data_conclusao (automático ao concluir)
- observacoes
- servicos[] (array de serviços)
- pecas[] (array de peças)

---

**Pronto! Agora você está pronto para gerenciar sua oficina! 🎉**

