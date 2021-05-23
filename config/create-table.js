const mysql = require('mysql');
const connection = mysql.createConnection({
  host: 'mysql.portaldolote.com.br',
  port: 3306,
  user: 'portaldolote',
  password: 'p0rt2ld0l0t3yyyy',
  database: 'portaldolote'
});

// node create-table.js

connection.connect(function (err) {
  if (err) return console.log(err);
  console.log('conectou!');
  createTable(connection);
})

function addRows(conn) {
  const sql = "INSERT INTO Clientes(Nome,CPF) VALUES ?";
  const values = [
    ['teste1', '12345678901'],
    ['teste1', '09876543210'],
    ['teste3', '12312312399']
  ];
  conn.query(sql, [values], function (error, results, fields) {
    if (error) return console.log(error);
    console.log('adicionou registros!');
    conn.end();//fecha a conexão
  });
}

/*
CREATE TABLE parceiros (
    id int NOT NULL AUTO_INCREMENT,
    nome varchar(150) NOT NULL,
    tipo CHAR(1) NOT NULL,
    cpf_cnpj VARCHAR(15) NOT NULL,
    rg_ie VARCHAR(15) NULL,
    telefone VARCHAR(15) NULL,
    celular VARCHAR(15) NULL,
    whatsapp VARCHAR(15) NULL,
    email VARCHAR(25) NULL,
    endereco VARCHAR(1000) NULL,
    bairro VARCHAR(50) NULL,
    cidade VARCHAR(50) NULL,
    cep VARCHAR(9) NULL,
    estado CHAR(2) NULL,
    local_atuacao VARCHAR(1000) NULL,
    location VARCHAR(25) NULL,
    register TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP(),
	 PRIMARY KEY (id)
)
*/

/*
CREATE TABLE produto (
    id int NOT NULL AUTO_INCREMENT,
    produto varchar(150) NOT NULL,
    categoria varchar(50) NULL,
    register TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP(),
	 PRIMARY KEY (id)
)
*/

/*
CREATE TABLE produto_parceiro (
    id int NOT NULL AUTO_INCREMENT,
    id_parceiro INT,
    id_produto INT,
    produto varchar(150) NOT NULL,
    tipo CHAR(1) NOT NULL,
    register TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP(),
	 PRIMARY KEY (id),
	 FOREIGN KEY (id_parceiro) REFERENCES parceiros (id),
    FOREIGN KEY (id_produto) REFERENCES produtos (id)
)
*/

/*
CREATE TABLE estoque (
    id int NOT NULL AUTO_INCREMENT,
    id_produto_parceiro INT,
    quantidade int,
    preco DECIMAL(10, 2) NOT NULL,
    dtentrega TIMESTAMP NOT NULL,
    local_entrega VARCHAR(1000) NOT NULL,
    img_url VARCHAR(3000) NULL,
    register TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP(),
	 PRIMARY KEY (id),
    FOREIGN KEY (id_produto_parceiro) REFERENCES produto_parceiro (id)
)
*/

/*CREATE TABLE transacao (
    id int NOT NULL AUTO_INCREMENT,
    id_estoque INT,
    quantidade int,
    preco DECIMAL(10, 2) NOT NULL,
    status VARCHAR(10) NULL,
    register TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP(),
	 PRIMARY KEY (id)
)
*/

function createTable(conn) {

  const sql = "CREATE TABLE IF NOT EXISTS Clientes (\n" +
    "ID int NOT NULL AUTO_INCREMENT,\n" +
    "Nome varchar(150) NOT NULL,\n" +
    "CPF char(11) NOT NULL,\n" +
    "PRIMARY KEY (ID)\n" +
    ");";

  conn.query(sql, function (error, results, fields) {
    if (error) return console.log(error);
    console.log('criou a tabela!');
    addRows(conn);
  });
}