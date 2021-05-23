projeto.service('CidadesService', function ($http, consts, msgs) {
  
  this.get = function (estado) {
    return $http.get(`${consts.oapiUrl}/cidades?estado=${estado}`).catch(function (resp) {
      msgs.addError('Cidade não foi localizada')
    })
  };

  this.getNome = function (nome) {
    return $http.get(`${consts.oapiUrl}/cidade/${nome}`).catch(function (resp) {
      msgs.addError('Cidade não foi localizada')
    })
  };


});

