import request from 'supertest';
import app from '../src/index.js';

describe('Clientes API', () => {
  let authToken;
  let clienteId;

  beforeAll(async () => {
    // Fazer login com admin
    const res = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'admin@oficina.com',
        senha: 'admin123'
      });
    authToken = res.body.token;
  });

  describe('POST /api/clientes', () => {
    it('deve criar um novo cliente', async () => {
      const res = await request(app)
        .post('/api/clientes')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          nome: 'João Silva',
          cpf_cnpj: '123.456.789-00',
          telefone: '(11) 98765-4321',
          email: 'joao@email.com',
          endereco: 'Rua Teste, 123'
        });
      
      expect(res.statusCode).toBe(201);
      expect(res.body).toHaveProperty('id');
      clienteId = res.body.id;
    });

    it('deve validar nome obrigatório', async () => {
      const res = await request(app)
        .post('/api/clientes')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          telefone: '(11) 98765-4321'
        });
      
      expect(res.statusCode).toBe(400);
    });
  });

  describe('GET /api/clientes', () => {
    it('deve listar clientes', async () => {
      const res = await request(app)
        .get('/api/clientes')
        .set('Authorization', `Bearer ${authToken}`);
      
      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty('clientes');
      expect(Array.isArray(res.body.clientes)).toBe(true);
    });

    it('deve buscar clientes por termo', async () => {
      const res = await request(app)
        .get('/api/clientes?search=João')
        .set('Authorization', `Bearer ${authToken}`);
      
      expect(res.statusCode).toBe(200);
    });
  });

  describe('GET /api/clientes/:id', () => {
    it('deve retornar um cliente específico', async () => {
      const res = await request(app)
        .get(`/api/clientes/${clienteId}`)
        .set('Authorization', `Bearer ${authToken}`);
      
      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty('nome');
    });

    it('deve retornar 404 para cliente inexistente', async () => {
      const res = await request(app)
        .get('/api/clientes/99999')
        .set('Authorization', `Bearer ${authToken}`);
      
      expect(res.statusCode).toBe(404);
    });
  });

  describe('PUT /api/clientes/:id', () => {
    it('deve atualizar um cliente', async () => {
      const res = await request(app)
        .put(`/api/clientes/${clienteId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          nome: 'João Silva Atualizado',
          cpf_cnpj: '123.456.789-00',
          telefone: '(11) 98765-4321',
          email: 'joao.novo@email.com',
          endereco: 'Rua Nova, 456'
        });
      
      expect(res.statusCode).toBe(200);
    });
  });

  describe('DELETE /api/clientes/:id', () => {
    it('deve deletar um cliente', async () => {
      const res = await request(app)
        .delete(`/api/clientes/${clienteId}`)
        .set('Authorization', `Bearer ${authToken}`);
      
      expect(res.statusCode).toBe(200);
    });
  });
});

