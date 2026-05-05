'use strict';
require('dotenv').config();
const mysql = require('mysql2/promise');
const bcrypt = require('bcrypt');

const DB_CONFIG = {
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT) || 3306,
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  multipleStatements: true,
  timezone: '-03:00',
};

const DB_NAME = process.env.DB_NAME || 'bncc_admin';

async function setup() {
  console.log('🔧 Iniciando configuração do banco de dados...\n');

  let conn;
  try {
    // Conectar sem banco específico para criar o banco
    conn = await mysql.createConnection(DB_CONFIG);

    // Criar banco se não existir
    await conn.query(`CREATE DATABASE IF NOT EXISTS \`${DB_NAME}\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`);
    console.log(`✅ Banco de dados "${DB_NAME}" criado/verificado.`);

    // Selecionar banco
    await conn.query(`USE \`${DB_NAME}\``);

    // Criar tabela admin
    await conn.query(`
      CREATE TABLE IF NOT EXISTS admin (
        id INT AUTO_INCREMENT PRIMARY KEY,
        email VARCHAR(191) NOT NULL UNIQUE,
        senha_hash VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);
    console.log('✅ Tabela "admin" criada/verificada.');

    // Criar tabela sugestoes
    await conn.query(`
      CREATE TABLE IF NOT EXISTS sugestoes (
        id INT AUTO_INCREMENT PRIMARY KEY,
        nome VARCHAR(255) DEFAULT NULL,
        email VARCHAR(255) DEFAULT NULL,
        mensagem TEXT NOT NULL,
        status ENUM('pendente', 'lida') NOT NULL DEFAULT 'pendente',
        data_criacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        INDEX idx_status (status),
        INDEX idx_data (data_criacao)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);
    console.log('✅ Tabela "sugestoes" criada/verificada.');

    // Criar tabela logs_sistema
    await conn.query(`
      CREATE TABLE IF NOT EXISTS logs_sistema (
        id INT AUTO_INCREMENT PRIMARY KEY,
        acao VARCHAR(255) NOT NULL,
        detalhes TEXT DEFAULT NULL,
        ip VARCHAR(45) DEFAULT NULL,
        data_hora TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        INDEX idx_data_hora (data_hora)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);
    console.log('✅ Tabela "logs_sistema" criada/verificada.\n');

    // Criar admin padrão se não existir
    const [existingAdmin] = await conn.query(
      'SELECT id FROM admin WHERE email = ? LIMIT 1',
      ['admin@bnccreports.com']
    );

    if (existingAdmin.length === 0) {
      const senhaInicial = 'Admin@2026';
      const senhaHash = await bcrypt.hash(senhaInicial, 12);

      await conn.query(
        'INSERT INTO admin (email, senha_hash) VALUES (?, ?)',
        ['admin@bnccreports.com', senhaHash]
      );

      console.log('👤 Admin padrão criado com sucesso!');
      console.log('━'.repeat(40));
      console.log('  📧 Email : admin@bnccreports.com');
      console.log('  🔑 Senha : Admin@2026');
      console.log('━'.repeat(40));
      console.log('  ⚠️  IMPORTANTE: Troque a senha após o primeiro acesso!\n');
    } else {
      console.log('ℹ️  Admin já existe, pulando criação.\n');
    }

    // Inserir log inicial
    await conn.query(
      'INSERT INTO logs_sistema (acao, detalhes, ip) VALUES (?, ?, ?)',
      ['SETUP_BANCO', 'Banco de dados configurado com sucesso', '127.0.0.1']
    );

    console.log('🎉 Setup concluído! O backend está pronto para uso.');
    console.log('   Execute: npm run dev (dentro de /backend)');

  } catch (err) {
    console.error('\n❌ Erro durante o setup:', err.message);
    if (err.code === 'ECONNREFUSED') {
      console.error('   Verifique se o MySQL está rodando e as credenciais estão corretas no .env');
    }
    process.exit(1);
  } finally {
    if (conn) await conn.end();
  }
}

setup();
