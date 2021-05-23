const mysql = require('mysql')
const moment = require('moment')
const connStr = {
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_DATABASE
}
const connection = mysql.createConnection(connStr)

async function ExecSQL(sqlQry, res) {
  try {
    return new Promise(function (resolve, reject) {
    connection.query(sqlQry, function (error, results, fields) {
      if (error) {
        console.log(`Error executar SQL:`, error.message)
        reject(error)
      } else {
        resolve(results)
      }
      //connection.end();
      // console.log('Executou mysql em ' + new Date);
    })
  })
  } catch (err) {
    console.log(`Error executar SQL: ${err.message}`)  
    reject(err)
  }
}

/* methods */
connection.connect(function (err) {
  if (err) return console.log(err)
  console.log('Conectou mysql! ' + new Date)
  //createTable(connection);
  //addRows(conn)
})

module.exports = { ExecSQL }
  