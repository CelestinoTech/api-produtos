// Segurança: "token próprio" no formato Bearer.
// O token fica no .env (API_TOKEN). Quem não enviar o token certo recebe 401.
function autenticar(req, res, next) {
  const header = req.headers.authorization || ''; // ex.: "Bearer abc123..."
  const [tipo, token] = header.split(' ');

  if (!process.env.API_TOKEN || tipo !== 'Bearer' || token !== process.env.API_TOKEN) {
    return res.status(401).json({
      erro: 'Não autorizado. Envie o header Authorization: Bearer <seu token>',
    });
  }

  next(); // token correto: segue para a rota
}

module.exports = autenticar;
