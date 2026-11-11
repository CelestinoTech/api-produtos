// Conexão com o PostgreSQL e criação da tabela.
const { Pool, types } = require('pg');

// O PostgreSQL devolve NUMERIC como texto ("19.90"). Isto converte para número (19.9).
types.setTypeParser(1700, (valor) => parseFloat(valor));

// Os dados de conexão vêm do arquivo .env (nunca escreva senha no código!)
const pool = new Pool({
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT) || 5432,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

// Cria a tabela "produtos" automaticamente na primeira vez que a API sobe
async function criarTabela() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS produtos (
      id         SERIAL PRIMARY KEY,
      nome       VARCHAR(100)  NOT NULL,
      preco      NUMERIC(10,2) NOT NULL,
      quantidade INTEGER       NOT NULL DEFAULT 0,
      criado_em  TIMESTAMP     NOT NULL DEFAULT NOW()
    )
  `);
}

module.exports = { pool, criarTabela };
