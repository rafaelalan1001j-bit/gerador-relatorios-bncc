'use strict';
const { body, validationResult } = require('express-validator');

/**
 * Retorna erros de validação como resposta 422 se existirem
 */
function handleValidationErrors(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({
      error: 'Dados inválidos.',
      details: errors.array().map((e) => ({ field: e.path, message: e.msg })),
    });
  }
  next();
}

/**
 * Validação para POST /login
 */
const validateLogin = [
  body('email')
    .trim()
    .isEmail().withMessage('E-mail inválido.')
    .normalizeEmail(),
  body('senha')
    .trim()
    .notEmpty().withMessage('Senha obrigatória.')
    .isLength({ min: 4 }).withMessage('Senha deve ter ao menos 4 caracteres.'),
  handleValidationErrors,
];

/**
 * Validação para POST /sugestoes
 */
const validateSugestao = [
  body('nome')
    .optional({ checkFalsy: true })
    .trim()
    .isLength({ max: 255 }).withMessage('Nome muito longo.')
    .escape(),
  body('email')
    .optional({ checkFalsy: true })
    .trim()
    .isEmail().withMessage('E-mail inválido.')
    .normalizeEmail(),
  body('mensagem')
    .trim()
    .notEmpty().withMessage('Mensagem é obrigatória.')
    .isLength({ min: 5, max: 2000 }).withMessage('Mensagem deve ter entre 5 e 2000 caracteres.')
    .escape(),
  handleValidationErrors,
];

/**
 * Validação para PUT /admin/sugestoes/:id
 */
const validateStatus = [
  body('status')
    .trim()
    .isIn(['pendente', 'lida']).withMessage('Status deve ser "pendente" ou "lida".'),
  handleValidationErrors,
];

module.exports = { validateLogin, validateSugestao, validateStatus };
