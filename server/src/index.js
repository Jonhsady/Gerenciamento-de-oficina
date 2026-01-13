import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';
import rateLimit from 'express-rate-limit';
import { initDatabase } from './config/database.js';
import { errorHandler } from './middleware/errorHandler.js';
import authRoutes from './routes/auth.routes.js';
import usuariosRoutes from './routes/usuarios.routes.js';
import servicosRoutes from './routes/servicos.routes.js';
import pecasRoutes from './routes/pecas.routes.js';
import ferramentasRoutes from './routes/ferramentas.routes.js';
import contatosRoutes from './routes/contatos.routes.js';
import clientesRoutes from './routes/clientes.routes.js';
import ordensServicoRoutes from './routes/ordensServico.routes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Segurança
app.use(helmet());
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? ['https://seudominio.com'] 
    : ['http://localhost:5173', 'http://localhost:3000'],
  credentials: true
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100, // limite de requisições
  message: 'Muitas requisições deste IP, tente novamente mais tarde.'
});
app.use('/api/', limiter);

// Logging
if (process.env.NODE_ENV !== 'test') {
  app.use(morgan('combined'));
}

// Body parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Inicializar banco de dados
initDatabase();

// Rotas
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Sistema de Oficina rodando!' });
});

app.use('/api/auth', authRoutes);
app.use('/api/usuarios', usuariosRoutes);
app.use('/api/servicos', servicosRoutes);
app.use('/api/pecas', pecasRoutes);
app.use('/api/ferramentas', ferramentasRoutes);
app.use('/api/contatos', contatosRoutes);
app.use('/api/clientes', clientesRoutes);
app.use('/api/ordens-servico', ordensServicoRoutes);

// Error handling
app.use(errorHandler);

// 404
app.use((req, res) => {
  res.status(404).json({ error: 'Rota não encontrada' });
});

if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    console.log(`🚗 Servidor rodando na porta ${PORT}`);
    console.log(`🔒 Ambiente: ${process.env.NODE_ENV}`);
  });
}

export default app;

