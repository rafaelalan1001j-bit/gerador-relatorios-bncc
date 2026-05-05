'use strict';
require('dotenv').config();
const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('../config/database');
const { validateLogin } = require('../middleware/validate');

const router = express.Router();
const SECRET = process.env.JWT_SECRET;
const EXPIRES_IN = process.env.JWT_EXPIRES_IN || '8h';

/**
 * POST /login
 * Autentica o administrador e retorna um JWT
 */
router.post('/', validateLogin, async (req, res) => {
  const { email, senha } = req.body;

  try {
    // Buscar admin pelo email
    const [rows] = await db.query(
      'SELECT id, email, senha_hash FROM admin WHERE email = ? LIMIT 1',
      [email]
    );

    if (rows.length === 0) {
      // Não revelar se email existe ou não (segurança)
      return res.status(401).json({ error: 'Credenciais inválidas.' });
    }

    const admin = rows[0];

    // Verificar senha com bcrypt
    const senhaValida = await bcrypt.compare(senha, admin.senha_hash);
    if (!senhaValida) {
      return res.status(401).json({ error: 'Credenciais inválidas.' });
    }

    // Gerar JWT
    const token = jwt.sign(
      { id: admin.id, email: admin.email, role: 'admin' },
      SECRET,
      { expiresIn: EXPIRES_IN }
    );

    // Registrar log de acesso
    await db.query(
      'INSERT INTO logs_sistema (acao, detalhes, ip) VALUES (?, ?, ?)',
      ['LOGIN_ADMIN', `Admin ${admin.email} fez login`, req.ip]
    );

    return res.json({
      token,
      admin: { id: admin.id, email: admin.email },
      expiresIn: EXPIRES_IN,
    });
  } catch (err) {
    console.error('Erro no login:', err);
    return res.status(500).json({ error: 'Erro interno do servidor.' });
  }
});

module.exports = router;
