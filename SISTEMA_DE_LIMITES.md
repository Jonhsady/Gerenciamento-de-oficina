# 🔐 SISTEMA DE LIMITAÇÕES E AUTORIZAÇÃO

## 📋 Visão Geral

O sistema agora possui um mecanismo de controle de acesso que permite:
- ✅ Qualquer pessoa pode criar uma conta
- ✅ Novos usuários têm acesso limitado para testar o sistema
- ✅ Admin pode autorizar usuários para acesso completo
- ✅ Controle granular de limites por usuário

---

## 🎯 Como Funciona

### **1. Criação de Conta**

Qualquer pessoa pode criar uma conta através da tela de registro:
- Acesse `/register`
- Preencha: Nome, Email, Senha
- Conta é criada automaticamente

### **2. Conta com Limitações (Padrão)**

Usuários não autorizados têm os seguintes limites:
- **5 Clientes** - Pode cadastrar até 5 clientes
- **10 Serviços** - Pode cadastrar até 10 serviços
- **10 Peças** - Pode cadastrar até 10 peças  
- **3 Ordens de Serviço** - Pode criar até 3 OS

**Banner Informativo:**
- Um banner roxo aparece no topo mostrando o uso atual
- Exibe barras de progresso
- Alerta quando estiver perto do limite

### **3. Autorização pelo Admin**

O administrador da oficina pode:
- Ver todos os usuários cadastrados
- **Autorizar** usuário → Acesso ilimitado
- **Desautorizar** usuário → Volta aos limites
- **Ajustar limites** individuais
- **Ativar/Desativar** contas
- **Resetar contadores** de uso

---

## 👥 Tipos de Usuário

### **Admin**
- ✅ Acesso total e ilimitado
- ✅ Pode gerenciar outros usuários
- ✅ Não aparece no banner de limites
- ✅ Pode autorizar/desautorizar usuários

### **Usuário Autorizado**
- ✅ Acesso completo ao sistema
- ✅ Sem limitações de uso
- ✅ Não aparece banner de limites
- ⚠️ Pode ser desautorizado pelo admin

### **Usuário Não Autorizado (Padrão)**
- ⚠️ Acesso limitado
- ⚠️ Banner informativo aparece
- ⚠️ Mensagem de erro ao atingir limite
- ✅ Pode ver tudo mas não criar além do limite

---

## 🛠️ Painel de Gerenciamento (Admin)

### Acessar:
1. Faça login como **admin**
2. Clique em **"Gerenciar Usuários"** no menu lateral
3. Verá todos os usuários cadastrados

### Ações Disponíveis:

**🟢 Autorizar**
- Remove todas as limitações
- Usuário terá acesso completo

**🟡 Desautorizar**
- Retorna aos limites padrão
- Útil para reverter autorizações

**🔄 Resetar Contadores**
- Zera os contadores de uso
- Mantém os limites configurados
- Útil para dar "nova chance"

**🔴 Desativar**
- Impede login do usuário
- Não exclui os dados
- Pode ser reativado depois

**🟢 Ativar**
- Permite login novamente
- Restaura o acesso

---

## 📊 Limites por Tipo

| Recurso | Limite Padrão | Admin | Autorizado |
|---------|---------------|-------|------------|
| Clientes | 5 | ∞ | ∞ |
| Serviços | 10 | ∞ | ∞ |
| Peças | 10 | ∞ | ∞ |
| Ordens de Serviço | 3 | ∞ | ∞ |
| Ferramentas | ∞ | ∞ | ∞ |
| Contatos | ∞ | ∞ | ∞ |

---

## 🔔 Mensagens e Alertas

### **Banner de Limite**
```
╔══════════════════════════════════════╗
║  ⚠️ Conta com Limitações             ║
║                                       ║
║  Você está usando uma conta de teste ║
║  Entre em contato com o admin        ║
║                                       ║
║  Clientes: 2/5 [████░░]             ║
║  OS: 1/3 [███░░░]                    ║
╚══════════════════════════════════════╝
```

### **Ao Atingir Limite**
```
❌ Erro: Limite de clientes atingido!

Você criou 5 de 5 clientes.
Entre em contato com o administrador 
para autorização completa.
```

---

## 🎯 Casos de Uso

### **Caso 1: Oficina Pequena (1 Dono)**
- Admin cria conta
- Admin tem acesso total
- Não precisa autorizar outros

### **Caso 2: Teste por Cliente**
- Cliente cria conta
- Testa o sistema com limites
- Gosta e pede autorização
- Admin autoriza → acesso completo

### **Caso 3: Múltiplos Funcionários**
- Dono é admin
- Funcionários criam contas
- Admin autoriza funcionários de confiança
- Novos funcionários ficam limitados

### **Caso 4: Usuário Temporário**
- Cria conta para demonstração
- Usa os limites gratuitos
- Admin não autoriza
- Após algum tempo, admin desativa

---

## 🔧 Configuração Técnica

### **Banco de Dados**
```sql
usuarios:
- autorizado (0 ou 1)
- limite_clientes (padrão: 5)
- limite_servicos (padrão: 10)
- limite_pecas (padrão: 10)
- limite_os (padrão: 3)

uso_usuarios:
- usuario_id
- tipo (clientes, servicos, pecas, os)
- quantidade
```

### **API Endpoints**
```
GET  /api/usuarios/me/usage       - Ver próprio uso
GET  /api/usuarios                - Listar todos (admin)
PATCH /api/usuarios/:id/authorize - Autorizar/desautorizar
PATCH /api/usuarios/:id/limits    - Ajustar limites
PATCH /api/usuarios/:id/toggle-active - Ativar/desativar
DELETE /api/usuarios/:id/reset-usage - Resetar contadores
```

### **Middlewares**
```javascript
checkLimit('clientes')  - Verifica antes de criar
incrementUsage(userId, 'clientes') - Incrementa após criar
```

---

## 📱 Interface do Usuário

### **Banner (Usuário Limitado)**
- Aparece no topo após login
- Mostra barras de progresso
- Pode ser fechado (volta no próximo login)
- Não aparece para admin/autorizados

### **Menu Admin**
- Item "Gerenciar Usuários" só para admin
- Tabela completa com todos os usuários
- Botões de ação coloridos
- Legenda explicativa

---

## 🚀 Benefícios do Sistema

### **Para o Dono da Oficina:**
✅ Controle total sobre quem usa o sistema
✅ Pode dar acesso de teste antes de autorizar
✅ Protege dados sensíveis
✅ Gerencia equipe facilmente

### **Para Novos Usuários:**
✅ Pode testar o sistema sem compromisso
✅ Vê todas as funcionalidades
✅ Entende o valor antes de pedir acesso completo
✅ Processo simples de registro

### **Para a Segurança:**
✅ Previne abuso do sistema
✅ Controle de recursos
✅ Rastreabilidade de uso
✅ Fácil revogar acessos

---

## 💡 Dicas de Uso

### **Como Admin:**
1. Monitore novos registros regularmente
2. Converse com usuários antes de autorizar
3. Use "resetar contadores" em vez de desautorizar
4. Desative contas não utilizadas
5. Mantenha poucos admins

### **Como Usuário:**
1. Teste o sistema dentro dos limites
2. Entre em contato com admin se gostar
3. Seja claro sobre suas necessidades
4. Respeite os limites enquanto não autorizado

---

## ❓ Perguntas Frequentes

**P: Posso aumentar os limites padrão?**
R: Sim, o admin pode ajustar limites individuais para cada usuário.

**P: Usuários autorizados podem criar admins?**
R: Não, apenas admins podem gerenciar usuários.

**P: O que acontece se eu desautorizar um usuário que já passou do limite?**
R: Ele não poderá criar novos registros, mas os existentes permanecem.

**P: Posso ver quem está próximo do limite?**
R: Sim, na página de gerenciamento aparece o uso de cada usuário.

**P: Como criar o primeiro admin?**
R: O sistema cria automaticamente com:
- Email: admin@oficina.com
- Senha: admin123
- **Altere a senha após primeiro login!**

---

## 🎉 Resumo

**Sistema implementado com sucesso!**

✅ Registro livre para todos
✅ Limites automáticos para novos usuários
✅ Banner informativo elegante
✅ Painel completo de gerenciamento
✅ Controle total pelo admin
✅ Segurança e rastreabilidade

**Agora sua oficina tem controle total sobre quem usa o sistema!** 🚗✨

