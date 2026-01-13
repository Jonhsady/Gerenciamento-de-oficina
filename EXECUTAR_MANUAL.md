# 🚀 EXECUTAR O SISTEMA - GUIA MANUAL

## Forma Mais Simples (Recomendada)

### Abra 2 terminais separados:

**TERMINAL 1 - Servidor (Backend):**
```bash
cd /home/jonhsady/projects/IDEIAS
npm run server:dev
```

**TERMINAL 2 - Cliente (Frontend):**
```bash
cd /home/jonhsady/projects/IDEIAS/client
npm run dev
```

---

## Ou use um único terminal:

```bash
cd /home/jonhsady/projects/IDEIAS
npm run dev
```

Este comando inicia servidor e cliente juntos automaticamente!

---

## Acessar o Sistema:

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:3000/api

**Login:**
- Email: admin@oficina.com
- Senha: admin123

---

## ✅ O que deve aparecer:

**Servidor:**
```
✅ Banco de dados inicializado!
🚗 Servidor rodando na porta 3000
🔒 Ambiente: development
```

**Cliente:**
```
VITE v5.x.x ready in XXX ms

➜  Local:   http://localhost:5173/
➜  Network: use --host to expose
```

---

## 🔧 Se der erro de porta em uso:

```bash
# Matar processos nas portas
lsof -ti :3000 | xargs kill -9
lsof -ti :5173 | xargs kill -9

# Tentar novamente
npm run dev
```

---

## 📱 Pronto para usar!

Assim que o sistema iniciar, abra seu navegador em http://localhost:5173
