'use strict';
const express = require('express');
const db = require('../config/database');
const authMiddleware = require('../middleware/auth');
const { validateSugestao, validateStatus } = require('../middleware/validate');

const router = express.Router();

/**
 * POST /sugestoes
 * Pública — qualquer usuário do site pode enviar uma sugestão
 */
router.post('/', validateSugestao, async (req, res) => {
  const { nome, email, mensagem } = req.body;

  try {
    const [result] = await db.query(
      'INSERT INTO sugestoes (nome, email, mensagem) VALUES (?, ?, ?)',
      [nome || null, email || null, mensagem]
    );

    // Log da sugestão recebida
    await db.query(
      'INSERT INTO logs_sistema (acao, detalhes, ip) VALUES (?, ?, ?)',
      ['SUGESTAO_RECEBIDA', `Nova sugestão recebida de ${nome || 'Anônimo'}`, req.ip]
    );

    return res.status(201).json({
      message: 'Sugestão enviada com sucesso! Obrigado pelo feedback.',
      id: result.insertId,
    });
  } catch (err) {
    console.error('Erro ao salvar sugestão:', err);
    return res.status(500).json({ error: 'Erro ao salvar sugestão.' });
  }
});

// ── Rotas protegidas (apenas admin) ─────────────────────────────────────────

/**
 * GET /admin/sugestoes
 * Lista todas as sugestões com filtro opcional por status
 */
router.get('/', authMiddleware, async (req, res) => {
  const { status, page = 1, limit = 20 } = req.query;
  const offset = (parseInt(page) - 1) * parseInt(limit);

  try {
    let whereClause = '';
    const params = [];

    if (status && ['pendente', 'lida'].includes(status)) {
      whereClause = 'WHERE status = ?';
      params.push(status);
    }

    const [[{ total }]] = await db.query(
      `SELECT COUNT(*) AS total FROM sugestoes ${whereClause}`,
      params
    );

    const [sugestoes] = await db.query(
      `SELECT id, nome, email, mensagem, status, data_criacao 
       FROM sugestoes ${whereClause} 
       ORDER BY data_criacao DESC 
       LIMIT ? OFFSET ?`,
      [...params, parseInt(limit), offset]
    );

    return res.json({
      data: sugestoes,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(total / parseInt(limit)),
      },
    });
  } catch (err) {
    console.error('Erro ao listar sugestões:', err);
    return res.status(500).json({ error: 'Erro ao listar sugestões.' });
  }
});

/**
 * PUT /admin/sugestoes/:id
 * Atualiza o status de uma sugestão (pendente ↔ lida)
 */
router.put('/:id', authMiddleware, validateStatus, async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  try {
    const [result] = await db.query(
      'UPDATE sugestoes SET status = ? WHERE id = ?',
      [status, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Sugestão não encontrada.' });
    }

    await db.query(
      'INSERT INTO logs_sistema (acao, detalhes, ip) VALUES (?, ?, ?)',
      ['SUGESTAO_ATUALIZADA', `Sugestão #${id} marcada como "${status}"`, req.ip]
    );

    return res.json({ message: `Sugestão marcada como "${status}".` });
  } catch (err) {
    console.error('Erro ao atualizar sugestão:', err);
    return res.status(500).json({ error: 'Erro ao atualizar sugestão.' });
  }
});

/**
 * DELETE /admin/sugestoes/:id
 * Exclui permanentemente uma sugestão
 */
router.delete('/:id', authMiddleware, async (req, res) => {
  const { id } = req.params;

  try {
    const [result] = await db.query(
      'DELETE FROM sugestoes WHERE id = ?',
      [id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Sugestão não encontrada.' });
    }

    await db.query(
      'INSERT INTO logs_sistema (acao, detalhes, ip) VALUES (?, ?, ?)',
      ['SUGESTAO_EXCLUIDA', `Sugestão #${id} foi excluída pelo admin`, req.ip]
    );

    return res.json({ message: 'Sugestão excluída com sucesso.' });
  } catch (err) {
    console.error('Erro ao excluir sugestão:', err);
    return res.status(500).json({ error: 'Erro ao excluir sugestão.' });
  }
});

module.exports = router;
