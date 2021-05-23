(function () {

  'use strict'
  projeto.controller('dashCtrl', [
    '$http',
    'consts',
    'msgs',
    'auth',
    DashController
  ])

  function DashController($http, consts, msgs, auth) {
    const vm = this

    vm.produtos = 0
    vm.produtores = 0
    vm.compradores = 0
    vm.total = 0

    vm.getDashboard = function (api) {
      let url
      if(api == 1) {
        url = `${consts.apiUrl}/produto/count/qtd`  
      }
      $http.get(url).then(function (resp) {
        if (api == 1) {
          vm.produtos = resp.data[0].QTD
        } else if (api == 2) {
          vm.produtores = resp.data[0].QTD
        } else {
          vm.compradores = resp.data[0].QTD
        } 
      }).catch(function (resp) {
        msgs.addError(resp.data)
      })
      vm.total = vm.compradores + vm.produtores
    }

    vm.getDashboard(1)
    // vm.getDashboard(2)
    // vm.getDashboard(3)

  }
  //função autoenvocada do javascript para fugir escopo global  
})()

