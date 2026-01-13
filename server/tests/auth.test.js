import request from 'supertest';
import app from '../src/index.js';

describe('Auth API', () => {
  let authToken;
  
  describe('POST /api/auth/register', () => {
    it('deve criar um novo usuário', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send({
          nome: 'Usuário Teste',
          email: 'teste@teste.com',
          senha: '123456'
        });
      
      expect(res.statusCode).toBe(201);
      expect(res.body).toHaveProperty('userId');
    });

    it('não deve criar usuário com email duplicado', async () => {
      await request(app)
        .post('/api/auth/register')
        .send({
          nome: 'Usuário 1',
          email: 'duplicado@teste.com',
          senha: '123456'
        });

      const res = await request(app)
        .post('/api/auth/register')
        .send({
          nome: 'Usuário 2',
          email: 'duplicado@teste.com',
          senha: '123456'
        });
      
      expect(res.statusCode).toBe(409);
    });

    it('deve validar campos obrigatórios', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send({
          email: 'semsenha@teste.com'
        });
      
      expect(res.statusCode).toBe(400);
    });
  });

  describe('POST /api/auth/login', () => {
    beforeAll(async () => {
      await request(app)
        .post('/api/auth/register')
        .send({
          nome: 'Login Teste',
          email: 'login@teste.com',
          senha: '123456'
        });
    });

    it('deve fazer login com credenciais válidas', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'login@teste.com',
          senha: '123456'
        });
      
      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty('token');
      expect(res.body).toHaveProperty('user');
      
      authToken = res.body.token;
    });

    it('não deve fazer login com senha incorreta', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'login@teste.com',
          senha: 'senhaerrada'
        });
      
      expect(res.statusCode).toBe(401);
    });
  });

  describe('GET /api/auth/profile', () => {
    it('deve retornar perfil do usuário autenticado', async () => {
      const res = await request(app)
        .get('/api/auth/profile')
        .set('Authorization', `Bearer ${authToken}`);
      
      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty('email');
    });

    it('não deve retornar perfil sem token', async () => {
      const res = await request(app)
        .get('/api/auth/profile');
      
      expect(res.statusCode).toBe(401);
    });
  });
});

