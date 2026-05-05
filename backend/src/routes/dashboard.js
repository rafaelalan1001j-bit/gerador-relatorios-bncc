'use strict';
const express = require('express');
const db = require('../config/database');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

// Todas as rotas aqui exigem autenticação
router.use(authMiddleware);

/**
 * GET /admin/dashboard
 * Retorna estatísticas gerais do sistema
 */
router.get('/', async (req, res) => {
  try {
    const [[{ totalSugestoes }]] = await db.query(
      'SELECT COUNT(*) AS totalSugestoes FROM sugestoes'
    );
    const [[{ sugestoesPendentes }]] = await db.query(
      'SELECT COUNT(*) AS sugestoesPendentes FROM sugestoes WHERE status = "pendente"'
    );
    const [[{ sugestoesLidas }]] = await db.query(
      'SELECT COUNT(*) AS sugestoesLidas FROM sugestoes WHERE status = "lida"'
    );

    // Últimas 10 atividades do log
    const [logs] = await db.query(
      'SELECT acao, detalhes, ip, data_hora FROM logs_sistema ORDER BY data_hora DESC LIMIT 10'
    );

    // Sugestões mais recentes (5)
    const [recentes] = await db.query(
      `SELECT id, nome, email, LEFT(mensagem, 80) AS resumo, status, data_criacao 
       FROM sugestoes ORDER BY data_criacao DESC LIMIT 5`
    );

    return res.json({
      stats: {
        totalSugestoes,
        sugestoesPendentes,
        sugestoesLidas,
      },
      logsRecentes: logs,
      sugestoesRecentes: recentes,
    });
  } catch (err) {
    console.error('Erro no dashboard:', err);
    return res.status(500).json({ error: 'Erro interno do servidor.' });
  }
});

module.exports = router;
