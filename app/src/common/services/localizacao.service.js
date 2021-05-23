projeto.service('LocalizacaoService', function ($http, consts, msgs) {
  this.get = function (endereco) {
    //Original
    //var params = {address: endereco, sensor: false}
    //var head = {'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8', 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Headers': 'Content-Type,Accept'}
    //return $http.get('http://maps.googleapis.com/maps/api/geocode/json', {params: params}, {headers: head} )
    msgs.addInfo('Buscando Coordenadas...')
    return $http.get(`${consts.oapiUrl}/location?endereco=${endereco}`).catch(function (resp) {
      msgs.addError('Coordenadas não foram localizadas')
    })
  };
});

