const express = require('express');
const router = express.Router();
const oracledb = require('oracledb');
const request = require('request');
const xml2js = require('xml2js').parseString;
const dbConfig = require('../../config/dbconfig.js');
const auth = require('../auth/auth.js');
const GetUserSankhya = require('../auth/getUserSankhya.js')
const moment = require('moment')

const connAttrs = {
  user          : dbConfig.user,
  password      : dbConfig.password,
  connectString : dbConfig.connectString
}

let SQL = '';

/** login post */
router.post('/', function(req, res) {
  let bindValues = {};

  oracledb.getConnection(connAttrs, function (err, connection) {
      if (err) {
          res.set('Content-Type', 'application/json');
          res.status(500).send(JSON.stringify({
              status: 500,
              message: "Error connecting to DB",
              detailed_message: err.message
          }));
          return;
      }

      SQL = `SELECT USU.CODUSU
                    ,USU.NOMEUSU
                    ,USU.CODPARC
                    ,USU.CODEMP
                    ,USU.NOMEUSUCPLT 
                    ,USU.EMAIL
                    ,USU.AD_WINDOWSAD
                    ,USU.AD_STATUS
                    ,USU.CODVEND
                    ,'http://'|| (SELECT SPLIT(TEXTO, 1, ';') FROM TSIPAR WHERE CHAVE LIKE 'IPSERVACESS') ||':8180/mge/Usuario@FOTO@CODUSU='|| USU.CODUSU || '.dbimage' URLIMG
                    ,AGE.SKYPE
                    ,AGE.DEPARTAMENTO
                    ,AGE.CARGO
                    ,AGE.DTNASC
                    ,FC_VALOR_OPCAO('TFPFUN', 'ESTADOCIVIL', FUN.ESTADOCIVIL) ESTADOCIVIL
                    ,FC_VALOR_OPCAO('TFPFUN', 'NACIONALIDADE',FUN.NACIONALIDADE) NACIONALIDADE
                    ,FUN.MATRICULA
                    ,FUN.AD_TIPCONV TIPOPLANOSAUDE
                    ,FUN.AD_ODONTOP CONVODONT
                    ,FUN.AD_CONVENIO CONVFARMACIA
                    ,FUN.AD_SEGURO CONVSEGUROVIDA
                    ,FUN.SENHA SENHAREFEICAO
                    ,FUN.AD_CARTAO NUCARTAOALIM
                    ,FUN.NUMCARTAOPONTO
                    ,FUN.DTADM
                    ,FUN.CPF
                    ,FUN.AD_NUMCARTCONVMED
                    ,FUN.AD_PLANOODONTO
                    ,FUN.AD_NUMCARTCONVODONTO
             FROM TSIUSU USU
                    LEFT JOIN AD_TBTIAGENDAONLINE AGE ON AGE.CODUSU = USU.CODUSU
                    LEFT JOIN TFPFUN FUN ON USU.CODEMP = FUN.CODEMP AND USU.CODFUNC = FUN.CODFUNC 
              WHERE USU.AD_STATUS = 'S'
                    --AND USU.INTERNO IN (MD5_DCCO(UPPER(:USER_NAME)||:PWD))
                    AND (USU.INTERNO IN (:PWD) OR USU.INTERNO IN (:PWD2))
                    AND UPPER(USU.NOMEUSU) = UPPER(:USER_NAME)
                ORDER BY USU.EMAIL`;
    
       bindValues.USER_NAME = req.body.USER_NAME;
       bindValues.PWD = req.body.PWD;
       if(req.body.PWD2 == undefined) {
           bindValues.PWD2 = req.body.PWD;
       } else {
           bindValues.PWD2 = req.body.PWD2;
       }

      connection.execute(SQL, bindValues, {
          outFormat: oracledb.OBJECT
      }, function (err, result) {
          if (err || result.rows.length < 1) {
              res.set('Content-Type', 'application/json');
              var status = err ? 500 : 404;
              res.status(status).send(JSON.stringify({
                  status: status,
                  message: err ? "Error getting the user profile" : "User doesn't exist",
                  detailed_message: err ? err.message : ""
              }));
          } else {
              var result = result.rows;
              var token = auth.geraTokenInt(result[0].CODUSU);
              result[0]["token"] = token;
              //res.contentType('application/json').status(200).send(JSON.stringify(result.rows));
              res.contentType('application/json').status(200).send(JSON.stringify(result));
          }
          // Release the connection
          connection.release(
              function (err) {
                let dtNow = moment();
                  if (err) {
                      console.error(err.message);
                  } else {
                    if(req.body.VERSAO) {
                        console.log("POST /login: " + req.body.USER_NAME + " /versao: " + req.body.VERSAO + " : Connection released " + dtNow.format("DD/MM/YYYY HH:mm:ss"));
                    } else {
                        console.log("POST /login/" + req.body.USER_NAME + " : Connection released " + dtNow.format("DD/MM/YYYY HH:mm:ss"));
                    }
                  }
              });
      });
  });
})

/** valida token */
router.get('/validatetoken', auth.validaToken, function(req, res) {
  res.json({ "auth": true });
})

/** valida token web */
router.get('/validatetokenweb', function(req, res) {
	const token = req.body.token || req.query.token || req.headers['x-access-token']
	return auth.validaTokenWeb(req, res, token)
})
  
/** authenticate post */
router.post('/authenticate', function(req, res) {
  let bindValues = {};

  oracledb.getConnection(connAttrs, function (err, connection) {
      if (err) {
          res.set('Content-Type', 'application/json');
          res.status(500).send(JSON.stringify({
              status: 500,
              message: "Error connecting to DB",
              detailed_message: err.message
          }));
          return;
      }

      SQL = `SELECT CODUSU
               FROM TSIUSU USU
              WHERE USU.AD_STATUS = 'S'
                    AND USU.INTERNO IN (MD5_DCCO(UPPER(:USER_NAME)||:PWD))`;
    
      bindValues.USER_NAME = req.body.USER_NAME;
      bindValues.PWD = req.body.PWD;

      connection.execute(SQL, bindValues, {
          outFormat: oracledb.OBJECT
      }, function (err, result) {
          if (err || result.rows.length < 1) {
              res.set('Content-Type', 'application/json');
              var status = err ? 500 : 404;
              res.status(status).send(JSON.stringify({
                  status: status,
                  message: err ? "Error getting the user profile" : "User doesn't exist",
                  detailed_message: err ? err.message : ""
              }));
          } else {
              var result = result.rows;
              res.contentType('application/json').status(200).send(JSON.stringify( auth.geraToken(req, res, result[0].CODUSU) ));
          }
          // Release the connection
          connection.release(
              function (err) {
                  if (err) {
                      console.error(err.message);
                  } else {
                      console.log("POST /authenticate/" + req.body.USER_NAME + " : Connection released");
                  }
              });
      });
  });
})

/** login sankhya */
router.get('/loginsnk/:JSESSIONID', async function(req, res) {
  
  let link = `http://201.48.122.66:8180/mge/service.sbr`;
  let Cookie = `Cookie: 'JSESSIONID=${req.params.JSESSIONID};'`;
  let header = `{ ${Cookie}, 'Content-Type': 'text/xml;charset=ISO-8859-1;' }`;
  let param = `{ serviceName: 'CRUDServiceProvider.loadView' }`; 
  let body = `'<serviceRequest serviceName="CRUDServiceProvider.loadView">
                  <requestBody>
                      <query viewName="VW_USUARIO_DCCO" orderBy="NOMEUSU">
                      <fields>
                          <field>CODPARC</field>
                          <field>CODUSU</field>
                          <field>NOMEUSU</field>
                          <field>CODVEND</field>
                          <field>CODFUNC</field>
                          <field>CODEMP</field>
                          <field>AD_WINDOWSAD</field>
                          <field>EMAIL</field>
                          <field>NOMEUSUCPLT</field>
                          <field>ATIVO</field>
                          <field>ATIVO_USU</field>
                          <field>AD_STATUS</field>
                          <field>AD_RAMAL</field>
                          <field>AD_TELEFONE</field>
                          <field>URLIMG</field>
                          <field>SKYPE</field>
                          <field>DEPARTAMENTO</field>
                          <field>CARGO</field>
                          <field>DTNASC</field>
                          <field>ESTADOCIVIL</field>
                          <field>NACIONALIDADE</field>
                          <field>NATURAL</field>
                          <field>EMPRESA</field>
                          <field>CIDADETRAB</field>
                          <field>MATRICULA</field>
                          <field>TIPOPLANOSAUDE</field>
                          <field>CONVODONT</field>
                          <field>CONVFARMACIA</field>
                          <field>CONVSEGUROVIDA</field>
                          <field>SENHAREFEICAO</field>
                          <field>VLRCARTAOALIM</field>
                          <field>NUMCARTAOPONTO</field>
                          <field>PIS</field>
                          <field>NROCNH</field>
                          <field>VENCIMENTOCNH</field>
                          <field>CATEGORIACNH</field>
                          <field>DTADM</field>
                          <field>NUCARTAOSAUDE</field>
                      </fields>
                      <where>VW_USUARIO_DCCO.AD_STATUS = 'S' 
                              AND VW_USUARIO_DCCO.CODUSU = STP_GET_CODUSULOGADO
                      </where>
                      </query>
                  </requestBody>
              </serviceRequest>'`;

  /* Pode usar o axios também: 
     https://www.npmjs.com/package/axios
  */
  
  /*
      Transforma json em xml
      xml2js = require('xml2js');

      var obj = {name: "Super", Surname: "Man", age: 23};

      var builder = new xml2js.Builder();
      var xml = builder.buildObject(obj);
  */

  //'Content-Type': 'text/xml;charset=ISO-8859-1;' },

  if(req.params.JSESSIONID) {
      const options = { 
          method: 'POST',
          url: 'http://201.48.122.66:8180/mge/service.sbr',
          qs: { serviceName: 'CRUDServiceProvider.loadView' },
          headers: {
              Cookie: 'JSESSIONID=' + req.params.JSESSIONID + ';',
                      'Content-Type': 'text/xml;charset=UTF-8;' },
          body: '<serviceRequest serviceName="CRUDServiceProvider.loadView">\r\n\t<requestBody>\r\n\t\t<query viewName="VW_USUARIO_DCCO" orderBy="NOMEUSU">\r\n\t\t   <fields>\r\n                <field>CODPARC</field>\r\n                <field>CODUSU</field>\r\n                <field>NOMEUSU</field>\r\n                <field>CODVEND</field>\r\n                <field>CODFUNC</field>\r\n                <field>CODEMP</field>\r\n                <field>AD_WINDOWSAD</field>\r\n                <field>EMAIL</field>\r\n                <field>NOMEUSUCPLT</field>\r\n                <field>ATIVO</field>\r\n                <field>ATIVO_USU</field>\r\n                <field>AD_STATUS</field>\r\n                <field>AD_RAMAL</field>\r\n                <field>AD_TELEFONE</field>\r\n                <field>URLIMG</field>\r\n                <field>SKYPE</field>\r\n                <field>DEPARTAMENTO</field>\r\n                <field>CARGO</field>\r\n                <field>DTNASC</field>\r\n                <field>ESTADOCIVIL</field>\r\n                <field>NACIONALIDADE</field>\r\n                <field>NATURAL</field>\r\n                <field>EMPRESA</field>\r\n                <field>CIDADETRAB</field>\r\n                <field>MATRICULA</field>\r\n                <field>TIPOPLANOSAUDE</field>\r\n                <field>CONVODONT</field>\r\n                <field>CONVFARMACIA</field>\r\n                <field>CONVSEGUROVIDA</field>\r\n                <field>SENHAREFEICAO</field>\r\n                <field>VLRCARTAOALIM</field>\r\n                <field>NUMCARTAOPONTO</field>\r\n                <field>PIS</field>\r\n                <field>NROCNH</field>\r\n                <field>VENCIMENTOCNH</field>\r\n                <field>CATEGORIACNH</field>\r\n                <field>DTADM</field>\r\n                <field>CPF</field>\r\n                <field>AD_NUMCARTCONVMED</field>\r\n                <field>AD_PLANOODONTO</field>\r\n                <field>AD_NUMCARTCONVODONTO</field>\r\n\t\t   </fields>\r\n\t\t   <where>VW_USUARIO_DCCO.AD_STATUS = \'S\' \r\n\t\t          AND VW_USUARIO_DCCO.CODUSU = STP_GET_CODUSULOGADO\r\n\t\t   </where>\r\n\t\t</query>\r\n\t</requestBody>\r\n</serviceRequest>\r\n'
      };

      await request(options, function (error, response, body) {
          if (error) {
              console.log('Error request > ', error);
              res.status(401).end();
          } else {
              xml2js(body, { explicitArray : false, encoding: 'UTF-8' }, function(error, result) {
                  if(error) {
                      console.log('Error xml > ', error);
                      res.status(401).end();
                  }
                  if(parseInt(result.serviceResponse.$.status) == 1) {
                      var result = result.serviceResponse.responseBody.records.record;
                      var token = auth.geraTokenInt(result.CODUSU);
                      result["token"] = token;
                      res.json(result);
                  } else {
                      res.status(401).end();
                  }
                  //res.json(JSON.stringify(result.serviceResponse.responseBody[0].records[0].record));    
              });
          }
      });
  }
  else {
      res.status(401).end();
  };

});

router.get('/usersankhya/:mgesession', async function(req, res){
    var dados = new GetUserSankhya(req, res, { urlSanhya: '', mgeSession: req.params.mgesession })
    console.log(await dados.checkUser())
    
})

module.exports = router;