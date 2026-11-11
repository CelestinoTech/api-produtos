// Arquivo principal: liga tudo e coloca a API no ar.
const path = require('path');

// 1) Carrega as variáveis do arquivo .env (precisa vir ANTES de tudo)
require('dotenv').config({ path: path.join(__dirname, '.env'), quiet: true });

const express = require('express');
const { criarTabela } = require('./db');
const autenticar = require('./auth');
const produtosRouter = require('./produtos');

const app = express();
app.use(express.json()); // permite receber JSON no corpo das requisições

// Rota pública, só para conferir se a API está no ar (dá para abrir no navegador)
app.get('/', (req, res) => {
  res.json({ status: 'ok', mensagem: 'API de produtos funcionando' });
});

// Todas as rotas /produtos exigem o token (middleware "autenticar")
app.use('/produtos', autenticar, produtosRouter);

// Qualquer outra rota: 404
app.use((req, res) => {
  res.status(404).json({ erro: 'Rota não encontrada' });
});

// Tratamento de erros (ex.: JSON mal formatado ou falha no banco)
app.use((err, req, res, next) => {
  if (err.type === 'entity.parse.failed') {
    return res.status(400).json({ erro: 'JSON inválido no corpo da requisição' });
  }
  console.error(err);
  res.status(500).json({ erro: 'Erro interno do servidor' });
});

const PORT = process.env.PORT || 3000;

// Cria a tabela (se ainda não existir) e só depois começa a ouvir a porta
criarTabela()
  .then(() => {
    app.listen(PORT, () => console.log(`API rodando na porta ${PORT}`));
  })
  .catch((err) => {
    console.error('Não foi possível conectar ao banco:', err.message);
    process.exit(1);
  });
