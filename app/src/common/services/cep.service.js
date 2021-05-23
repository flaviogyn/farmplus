projeto.service('CepService', function($http, consts, msgs) {
    this.get = function(cep) {
      return $http.get(`${consts.oapiUrl}/cep?cep=${cep}`).catch(function(resp) {
      	msgs.addError('CEP não foi localizado')
    	})
    };
});

