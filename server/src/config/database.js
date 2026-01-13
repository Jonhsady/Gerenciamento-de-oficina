import Database from 'better-sqlite3';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { existsSync, mkdirSync } from 'fs';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const dbDir = join(__dirname, '../../../database');
if (!existsSync(dbDir)) {
  mkdirSync(dbDir, { recursive: true });
}

const dbPath = process.env.NODE_ENV === 'test' 
  ? ':memory:' 
  : join(dbDir, 'oficina.db');

export const db = new Database(dbPath);
db.pragma('journal_mode = WAL');

export function initDatabase() {
  // Tabela de Usuários
  db.exec(`
    CREATE TABLE IF NOT EXISTS usuarios (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nome TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      senha TEXT NOT NULL,
      role TEXT DEFAULT 'usuario',
      ativo INTEGER DEFAULT 1,
      autorizado INTEGER DEFAULT 0,
      limite_clientes INTEGER DEFAULT 5,
      limite_servicos INTEGER DEFAULT 10,
      limite_pecas INTEGER DEFAULT 10,
      limite_os INTEGER DEFAULT 3,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Tabela de Contadores de Uso
  db.exec(`
    CREATE TABLE IF NOT EXISTS uso_usuarios (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      usuario_id INTEGER NOT NULL,
      tipo TEXT NOT NULL,
      quantidade INTEGER DEFAULT 0,
      FOREIGN KEY (usuario_id) REFERENCES usuarios(id),
      UNIQUE(usuario_id, tipo)
    )
  `);

  // Tabela de Clientes
  db.exec(`
    CREATE TABLE IF NOT EXISTS clientes (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nome TEXT NOT NULL,
      cpf_cnpj TEXT,
      telefone TEXT,
      email TEXT,
      endereco TEXT,
      observacoes TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Tabela de Serviços
  db.exec(`
    CREATE TABLE IF NOT EXISTS servicos (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nome TEXT NOT NULL,
      descricao TEXT,
      valor REAL NOT NULL,
      tempo_estimado INTEGER,
      categoria TEXT,
      ativo INTEGER DEFAULT 1,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Tabela de Peças
  db.exec(`
    CREATE TABLE IF NOT EXISTS pecas (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nome TEXT NOT NULL,
      codigo TEXT UNIQUE,
      descricao TEXT,
      quantidade INTEGER DEFAULT 0,
      quantidade_minima INTEGER DEFAULT 0,
      valor_unitario REAL NOT NULL,
      localizacao TEXT,
      fornecedor TEXT,
      categoria TEXT,
      ativo INTEGER DEFAULT 1,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Tabela de Ferramentas
  db.exec(`
    CREATE TABLE IF NOT EXISTS ferramentas (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nome TEXT NOT NULL,
      codigo TEXT UNIQUE,
      descricao TEXT,
      quantidade INTEGER DEFAULT 1,
      estado TEXT DEFAULT 'Boa',
      localizacao TEXT,
      data_aquisicao DATE,
      valor REAL,
      em_uso INTEGER DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Tabela de Contatos (Fornecedores/Parceiros)
  db.exec(`
    CREATE TABLE IF NOT EXISTS contatos (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nome TEXT NOT NULL,
      tipo TEXT NOT NULL,
      empresa TEXT,
      telefone TEXT,
      email TEXT,
      endereco TEXT,
      observacoes TEXT,
      ativo INTEGER DEFAULT 1,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Tabela de Ordens de Serviço
  db.exec(`
    CREATE TABLE IF NOT EXISTS ordens_servico (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      numero_os TEXT UNIQUE NOT NULL,
      cliente_id INTEGER NOT NULL,
      veiculo_placa TEXT,
      veiculo_modelo TEXT,
      veiculo_ano TEXT,
      status TEXT DEFAULT 'Aberta',
      data_abertura DATETIME DEFAULT CURRENT_TIMESTAMP,
      data_prevista DATE,
      data_conclusao DATETIME,
      valor_total REAL DEFAULT 0,
      observacoes TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (cliente_id) REFERENCES clientes(id)
    )
  `);

  // Tabela de Itens da OS (Serviços)
  db.exec(`
    CREATE TABLE IF NOT EXISTS os_servicos (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      ordem_servico_id INTEGER NOT NULL,
      servico_id INTEGER NOT NULL,
      quantidade INTEGER DEFAULT 1,
      valor_unitario REAL NOT NULL,
      valor_total REAL NOT NULL,
      FOREIGN KEY (ordem_servico_id) REFERENCES ordens_servico(id) ON DELETE CASCADE,
      FOREIGN KEY (servico_id) REFERENCES servicos(id)
    )
  `);

  // Tabela de Itens da OS (Peças)
  db.exec(`
    CREATE TABLE IF NOT EXISTS os_pecas (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      ordem_servico_id INTEGER NOT NULL,
      peca_id INTEGER NOT NULL,
      quantidade INTEGER NOT NULL,
      valor_unitario REAL NOT NULL,
      valor_total REAL NOT NULL,
      FOREIGN KEY (ordem_servico_id) REFERENCES ordens_servico(id) ON DELETE CASCADE,
      FOREIGN KEY (peca_id) REFERENCES pecas(id)
    )
  `);

  // Atualizar estrutura de usuários existentes
  try {
    db.exec(`
      ALTER TABLE usuarios ADD COLUMN autorizado INTEGER DEFAULT 0;
    `);
  } catch (e) {
    // Coluna já existe
  }

  try {
    db.exec(`
      ALTER TABLE usuarios ADD COLUMN limite_clientes INTEGER DEFAULT 5;
    `);
  } catch (e) {
    // Coluna já existe
  }

  try {
    db.exec(`
      ALTER TABLE usuarios ADD COLUMN limite_servicos INTEGER DEFAULT 10;
    `);
  } catch (e) {
    // Coluna já existe
  }

  try {
    db.exec(`
      ALTER TABLE usuarios ADD COLUMN limite_pecas INTEGER DEFAULT 10;
    `);
  } catch (e) {
    // Coluna já existe
  }

  try {
    db.exec(`
      ALTER TABLE usuarios ADD COLUMN limite_os INTEGER DEFAULT 3;
    `);
  } catch (e) {
    // Coluna já existe
  }

  // Criar usuário admin padrão se não existir
  const adminExists = db.prepare('SELECT id FROM usuarios WHERE email = ?')
    .get(process.env.ADMIN_EMAIL || 'admin@oficina.com');
  
  if (!adminExists) {
    const hashedPassword = bcrypt.hashSync(process.env.ADMIN_PASSWORD || 'admin123', 10);
    db.prepare(`
      INSERT INTO usuarios (nome, email, senha, role, autorizado, limite_clientes, limite_servicos, limite_pecas, limite_os)
      VALUES (?, ?, ?, ?, 1, 999999, 999999, 999999, 999999)
    `).run('Administrador', process.env.ADMIN_EMAIL || 'admin@oficina.com', hashedPassword, 'admin');
    
    console.log('✅ Usuário administrador criado com sucesso!');
  } else {
    // Atualizar admin existente para ter acesso ilimitado
    db.prepare(`
      UPDATE usuarios 
      SET autorizado = 1, 
          limite_clientes = 999999, 
          limite_servicos = 999999, 
          limite_pecas = 999999, 
          limite_os = 999999
      WHERE email = ?
    `).run(process.env.ADMIN_EMAIL || 'admin@oficina.com');
  }

  console.log('✅ Banco de dados inicializado!');
}

export default db;

