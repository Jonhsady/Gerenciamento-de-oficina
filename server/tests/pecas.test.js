import request from 'supertest';
import app from '../src/index.js';

describe('Peças API', () => {
  let authToken;
  let pecaId;

  beforeAll(async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'admin@oficina.com',
        senha: 'admin123'
      });
    authToken = res.body.token;
  });

  describe('POST /api/pecas', () => {
    it('deve criar uma nova peça', async () => {
      const res = await request(app)
        .post('/api/pecas')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          nome: 'Filtro de Óleo',
          codigo: 'FO-001',
          descricao: 'Filtro de óleo para motores 1.0',
          quantidade: 50,
          quantidade_minima: 10,
          valor_unitario: 25.90,
          localizacao: 'Prateleira A1',
          fornecedor: 'Fornecedor XYZ',
          categoria: 'Filtros'
        });
      
      expect(res.statusCode).toBe(201);
      expect(res.body).toHaveProperty('id');
      pecaId = res.body.id;
    });

    it('deve validar campos obrigatórios', async () => {
      const res = await request(app)
        .post('/api/pecas')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          codigo: 'FO-002'
        });
      
      expect(res.statusCode).toBe(400);
    });
  });

  describe('GET /api/pecas', () => {
    it('deve listar peças', async () => {
      const res = await request(app)
        .get('/api/pecas')
        .set('Authorization', `Bearer ${authToken}`);
      
      expect(res.statusCode).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
    });
  });

  describe('PATCH /api/pecas/:id/quantidade', () => {
    it('deve adicionar quantidade ao estoque', async () => {
      const res = await request(app)
        .patch(`/api/pecas/${pecaId}/quantidade`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          quantidade: 10,
          operacao: 'adicionar'
        });
      
      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty('novaQuantidade');
      expect(res.body.novaQuantidade).toBe(60);
    });

    it('deve remover quantidade do estoque', async () => {
      const res = await request(app)
        .patch(`/api/pecas/${pecaId}/quantidade`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          quantidade: 5,
          operacao: 'remover'
        });
      
      expect(res.statusCode).toBe(200);
      expect(res.body.novaQuantidade).toBe(55);
    });

    it('não deve permitir quantidade negativa', async () => {
      const res = await request(app)
        .patch(`/api/pecas/${pecaId}/quantidade`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          quantidade: 100,
          operacao: 'remover'
        });
      
      expect(res.statusCode).toBe(400);
    });
  });

  describe('GET /api/pecas/estoque/baixo', () => {
    it('deve listar peças com estoque baixo', async () => {
      const res = await request(app)
        .get('/api/pecas/estoque/baixo')
        .set('Authorization', `Bearer ${authToken}`);
      
      expect(res.statusCode).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
    });
  });
});

