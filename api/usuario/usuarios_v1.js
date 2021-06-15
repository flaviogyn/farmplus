const express = require('express')
const router = express.Router()
const moment = require('moment')
const db = require('../../services/index')

router.get('/', async (req, res) => {
  let sql = 'SELECT * FROM usuarios ORDER BY nome'
  let dados = await db.ExecSQL(sql, res)
  console.log('dados', dados)
  return res.json(dados)
})

router.get('/:id', async (req, res) => {
  let sql = `SELECT * FROM usuarios WHERE id = ${parseInt(req.params.id)}`
  let dados = await db.ExecSQL(sql, res)
  console.log('dados', dados)
  return res.json(dados)
})

router.get('/count/qtd', async (req, res) => {
  let sql = `SELECT COUNT(*) QTD FROM usuarios`
  let dados = await db.ExecSQL(sql, res)
  console.log('dados', dados)
  return res.json(dados)
})

router.post('/', async (req, res) => {
  let produto = req.body.produto
  let categoria = req.body.categoria
  let descricao = req.body.descricao
  let preco = req.body.preco
  let isFavorite = req.body.isFavorite == true ? 1 : 0
  let imageUrl = req.body.imageUrl

  let sql = `SELECT COUNT(*) FROM usuarios WHERE produto like '%${produto}%'}`
  let count = await db.ExecSQL(sql, res)[0]
  if(count == 0)   {
    let sql = `INSERT INTO usuarios (produto, categoria, descricao, preco, isFavorite, imageUrl)  VALUES ('${produto}', '${categoria}', '${descricao}', ${preco}, ${isFavorite}, '${imageUrl}')`
    let dados = await db.ExecSQL(sql, res)
    console.log('dados', dados)
    return res.json(dados)
  }
})

router.patch('/:id', async (req, res) => {
  let produto = req.body.produto
  let categoria = req.body.categoria
  let sql = `UPDATE FROM usuarios SET produto = '${produto}', categoria = '${categoria}' WHERE id = ${parseInt(req.params.id)}`
  let dados = await db.ExecSQL(sql, res)
  console.log('dados', dados)
  return res.json(dados)
})

router.delete('/:id', async (req, res) => {
  let sql = `DELETE * FROM usuarios WHERE id = ${parseInt(req.params.id)}`
  let dados = await db.ExecSQL(sql, res)
  console.log('dados', dados)
  return res.json(dados)
})

module.exports = router;
