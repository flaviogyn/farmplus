const express = require('express')
const router = express.Router()

/* Home */
router.get('/', (req, res) => {
  res.render('index');
})

/** API */
// const auth = require('../api/auth/auth.js');
// const login_v1 = require('../api/auth/login_v1.js');
// const parceiro_v1 = require('../api/parceiro/parceiro_v1.js');
const produto_v1 = require('../api/produto/produto_v1.js');
// const estoque_v1 = require('./api/estoque/estoque_v1.js');
// const transacao_v1 = require('./api/transacao/transacao_v1.js');

/** Rotas */
// app.use('/api/v1/login', login_v1);
// app.use('/api/v1/parceiro', parceiro_v1);
router.use('/api/v1/produto', produto_v1);
// app.use('/api/v1/estoque', estoque_v1);
// app.use('/api/v1/transacao', transacao_v1);

module.exports = router;

