const request = require('request-promise')

async function getCEP(cep) {
  // http://enderecos.metheora.com/api/cep/74575350
  const options = {
    method: 'GET',
    uri: "http://api.postmon.com.br/v1/cep/" + cep,
    headers: { 'User-Agent': 'Request-Promise' },
    json: true
  }

  if (cep) {
    request(options)
      .then(function (repos) {
        res.json(repos)
      })
      .catch(function (err) {
        console.log(`Erro cep: ${err}`);
        res.status(500).json({ errors: [err.error] })
      })
  }

}

async function getCidade(nome) {
  // http://enderecos.metheora.com/api/cidade/ + cidade

  const options = {
    method: 'GET',
    uri: `http://enderecos.metheora.com/api/cidade/${nome}`,
    headers: { 'User-Agent': 'Request-Promise' },
    json: true
  }

  if (nome) {
    request(options)
      .then(function (resp) {
        res.json(resp)
      })
      .catch(function (err) {
        console.log(`Erro cidade: ${err}`);
        res.status(500).json({ errors: [err.error] })
      })
  }

}

async function getCidades(estado) {
  //"http://educacao.dadosabertosbr.com/api/cidades/" + estado

  const options = {
    method: 'GET',
    uri: `http://enderecos.metheora.com/api/estado/${estado}/cidades`,
    headers: { 'User-Agent': 'Request-Promise' },
    json: true
  }

  if (estado) {
    request(options)
      .then(function (repos) {
        //console.log('User has %d repos', repos.length);
        res.json(repos)
      })
      .catch(function (err) {
        console.log(`Erro cidades: ${err}`);
        res.status(500).json({ errors: [err.error] })
      })
  }
}

async function getLocation(estado) {}

module.exports = { getCEP, getCidade, getCidades, getLocation }