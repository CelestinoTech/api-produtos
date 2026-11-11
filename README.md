# API de Produtos — CRUD na AWS

API RESTful com operações CRUD para a entidade **produtos**, hospedada em uma instância **AWS EC2**.

| Item | Escolha |
|---|---|
| Linguagem | Node.js + Express |
| Banco | PostgreSQL (na própria EC2) |
| Segurança | Token próprio (Bearer) definido no `.env` + Security Group da AWS |
| Hospedagem | AWS EC2 (Ubuntu) |
| Testes | Postman (coleção incluída no repositório) |

## Endpoints

Todas as rotas `/produtos` exigem o header `Authorization: Bearer <API_TOKEN>`.

| Método | Rota | O que faz |
|---|---|---|
| GET | `/` | Status da API (pública) |
| GET | `/produtos` | Lista todos os produtos |
| GET | `/produtos/:id` | Busca um produto |
| POST | `/produtos` | Cria um produto |
| PUT | `/produtos/:id` | Atualiza um produto |
| DELETE | `/produtos/:id` | Remove um produto |

Exemplo de corpo (POST/PUT):

```json
{ "nome": "Teclado", "preco": 149.90, "quantidade": 10 }
```

Respostas: `200` OK · `201` criado · `400` dados inválidos · `401` sem token · `404` não encontrado.

## Variáveis de ambiente

Copie `.env.example` para `.env` e preencha: `PORT`, `DB_HOST`, `DB_PORT`, `DB_USER`, `DB_PASSWORD`, `DB_NAME`, `API_TOKEN`.

## Como rodar no servidor

```bash
npm install
cp .env.example .env   # e edite os valores
pm2 start server.js --name api
```

## Estrutura

| Arquivo | Responsabilidade |
|---|---|
| `server.js` | Liga tudo e sobe a API |
| `db.js` | Conexão com o PostgreSQL e criação da tabela |
| `auth.js` | Verificação do token (segurança) |
| `produtos.js` | Rotas do CRUD |
| `api-produtos.postman_collection.json` | Testes prontos para importar no Postman |

## Integrantes

| Nome | Contribuição |
|---|---|
| Integrante 1 | Infraestrutura AWS (EC2, chave SSH, Security Group) e deploy |
| Integrante 2 | Banco de dados (`db.js`, instalação do PostgreSQL) |
| Integrante 3 | Rotas CRUD (`produtos.js`, `server.js`) |
| Integrante 4 | Segurança e testes (`auth.js`, `.env`, coleção Postman, vídeo) |
