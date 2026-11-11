// Rotas CRUD da entidade "produtos".
const express = require('express');
const { pool } = require('./db');

const router = express.Router();

// Confere se os dados enviados no corpo (body) são válidos
function validar(body) {
  const { nome, preco, quantidade } = body || {};
  if (typeof nome !== 'string' || nome.trim() === '') return 'O campo "nome" é obrigatório';
  if (typeof preco !== 'number' || preco < 0) return 'O campo "preco" deve ser um número >= 0';
  if (quantidade !== undefined && (!Number.isInteger(quantidade) || quantidade < 0)) {
    return 'O campo "quantidade" deve ser um número inteiro >= 0';
  }
  return null; // sem erro
}

// Confere se o id da URL é um número inteiro
function lerId(req, res) {
  const id = Number(req.params.id);
  if (!Number.isInteger(id) || id <= 0) {
    res.status(400).json({ erro: 'id inválido' });
    return null;
  }
  return id;
}

// READ (todos) -> GET /produtos
router.get('/', async (req, res) => {
  const resultado = await pool.query('SELECT * FROM produtos ORDER BY id');
  res.json(resultado.rows);
});

// READ (um) -> GET /produtos/:id
router.get('/:id', async (req, res) => {
  const id = lerId(req, res);
  if (!id) return;
  const resultado = await pool.query('SELECT * FROM produtos WHERE id = $1', [id]);
  if (resultado.rows.length === 0) return res.status(404).json({ erro: 'Produto não encontrado' });
  res.json(resultado.rows[0]);
});

// CREATE -> POST /produtos
router.post('/', async (req, res) => {
  const erro = validar(req.body);
  if (erro) return res.status(400).json({ erro });
  const { nome, preco, quantidade = 0 } = req.body;
  const resultado = await pool.query(
    'INSERT INTO produtos (nome, preco, quantidade) VALUES ($1, $2, $3) RETURNING *',
    [nome.trim(), preco, quantidade]
  );
  res.status(201).json(resultado.rows[0]);
});

// UPDATE -> PUT /produtos/:id
router.put('/:id', async (req, res) => {
  const id = lerId(req, res);
  if (!id) return;
  const erro = validar(req.body);
  if (erro) return res.status(400).json({ erro });
  const { nome, preco, quantidade = 0 } = req.body;
  const resultado = await pool.query(
    'UPDATE produtos SET nome = $1, preco = $2, quantidade = $3 WHERE id = $4 RETURNING *',
    [nome.trim(), preco, quantidade, id]
  );
  if (resultado.rows.length === 0) return res.status(404).json({ erro: 'Produto não encontrado' });
  res.json(resultado.rows[0]);
});

// DELETE -> DELETE /produtos/:id
router.delete('/:id', async (req, res) => {
  const id = lerId(req, res);
  if (!id) return;
  const resultado = await pool.query('DELETE FROM produtos WHERE id = $1 RETURNING *', [id]);
  if (resultado.rows.length === 0) return res.status(404).json({ erro: 'Produto não encontrado' });
  res.json({ mensagem: 'Produto removido com sucesso', produto: resultado.rows[0] });
});

module.exports = router;
