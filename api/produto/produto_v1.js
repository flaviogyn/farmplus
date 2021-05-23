const express = require('express')
const router = express.Router()
const moment = require('moment')
const db = require('../../services/index')
const auth = require('../auth/auth.js')

router.get('/', async (req, res) => {
  let sql = 'SELECT * FROM produtos ORDER BY produto'
  let dados = await db.ExecSQL(sql, res)
  console.log('dados', dados)
  return res.json(dados)
})

router.get('/:id', async (req, res) => {
  let sql = `SELECT * FROM produtos WHERE id = ${parseInt(req.params.id)}`
  let dados = await db.ExecSQL(sql, res)
  console.log('dados', dados)
  return res.json(dados)
})

router.get('/count/qtd', async (req, res) => {
  let sql = `SELECT COUNT(*) QTD FROM produtos`
  let dados = await db.ExecSQL(sql, res)
  console.log('dados', dados)
  return res.json(dados)
})

router.post('/', async (req, res) => {
  let produto = req.body.produto
  let sql = `SELECT COUNT(*) FROM produtos WHERE produto like '%${produto}%'}`
  let count = await db.ExecSQL(sql, res)[0]
  if(count == 0)   {
    let sql = `INSERT INTO produtos VALUES ('${produto}')`
    let dados = await db.ExecSQL(sql, res)
    console.log('dados', dados)
    return res.json(dados)
  }
})

router.patch('/:id', async (req, res) => {
  let produto = req.body.produto
  let categoria = req.body.categoria
  let sql = `UPDATE FROM produtos SET produto = '${produto}', categoria = '${categoria}' WHERE id = ${parseInt(req.params.id)}`
  let count = await db.ExecSQL(sql, res)[0]
  if(count == 0)   {
    let sql = `INSERT INTO produtos VALUES ('${produto}')`
    let dados = await db.ExecSQL(sql, res)
    console.log('dados', dados)
    return res.json(dados)
  }
})

router.delete('/:id', async (req, res) => {
  let sql = `DELETE * FROM produtos WHERE id = ${parseInt(req.params.id)}`
  let dados = await db.ExecSQL(sql, res)
  console.log('dados', dados)
  return res.json(dados)
})

module.exports = router;
