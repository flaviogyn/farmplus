projeto.controller('peacCtrl', [
  '$scope',
  '$http',
  '$location',
  '$rootScope',
  'auth',
  'listas',
  'msgs',
  'tabs',
  'consts',
  peacController
])

function peacController($scope, $http, $location, $rootScope, auth, listas, msgs, tabs, consts) {
  var vm = this
  vm.alerts = [];
  vm.filtro = {};
  vm.log = {};

  //Init
  vm.initTabCreate = () => {
  }

  vm.getName = (list, name) => {
    let ret = 0
    for (var i = 0; i < list.length; i++) {
      if (list[i].name == name) {
        ret = list[i].id;
        break;
      }
    }
    return ret
  }

  vm.addAlert = function (mensagem) {
    vm.alerts.push({ msg: JSON.stringify(mensagem) });
    //jsonStr.replace("","/({|}[,]*|[^{}:]+:[^{}:,]*[,{]*)/g")
  };

  vm.addAlertValidade = function (mensagem) {
    vm.alerts.push({ type: 'warning', msg: mensagem });
  };

  vm.closeAlert = function (index) {
    vm.alerts.splice(index, 1);
  };

  vm.getProduto = () => {
    const page = parseInt($location.search().page) || 1
    var url = `${consts.apiUrl}/produto`
    msgs.addInfo('Aguarde consulta sendo realizada!')

    $http.get(url).then(function (resp) {
      vm.crms = resp.data
      vm.crm = {}
      tabs.show(vm, { tabList: true, tabCreate: true })
    }).catch(function (resp) {
      vm.addAlert(resp.data)
    })
  }

  vm.create = function () {
    if (!vm.validaEntradas()) {
      const url = `${consts.apiUrl}/produto`;

      $http.post(url, vm.crm).then(function (resp) {
        console.log(resp.data)
        msgs.addSuccess('Operação realizada com sucesso!!')
        vm.crm = {}
        vm.getProduto()
      }).catch(function (resp) {
        //msgs.addError(resp.data)
        vm.addAlert(resp.data)
      })
    }
  }

  vm.cancel = function () {
    tabs.show(vm, { tabList: true, tabCreate: true })
    vm.alerts.splice(0, vm.alerts.length);
    vm.crm = {}
    vm.mensagens = {}
    vm.initTabCreate()
  }

  vm.update = function () {
    vm.alerts.splice(0, vm.alerts.length);
    const url = `${consts.apiUrl}/produto/${vm.crm.id}`
    $http.patch(url, vm.crm).then(function (response) {
      //vm.crm = {}
      vm.getProduto('true')
      //tabs.show(vm, { tabList: true, tabCreate: true })
      msgs.addSuccess('Atualização realizada com sucesso!')
    }).catch(function (resp) {
      //msgs.addError(resp.data)
      vm.addAlert(resp.data)
    })
  }

  vm.delete = function () {
    vm.alerts.splice(0, vm.alerts.length);
    const url = `${consts.apiUrl}/produto/${vm.crm.id}`
    $http.delete(url, vm.crm).then(function (response) {
      vm.crm = {}
      vm.getProduto()
      tabs.show(vm, { tabList: true, tabCreate: true })
      msgs.addSuccess('Exclusão realizada com sucesso!')
    }).catch(function (resp) {
      vm.addAlert(resp.data)
    })
  }

  vm.validaEntradas = function () {
    let ret = false
    // for (var i = 0; i < vm.alerts.length; i++) {
    //   vm.alerts.splice(i, 1);
    // }
    vm.alerts.splice(0, vm.alerts.length);

    if (vm.crm.dtCadastro == undefined) {
      var dt = new Date()
      vm.crm.dtCadastro = dt.toISOString()
    }
    if (isNaN(vm.crm.idApi)) {
      vm.addAlertValidade('Selecione a API!')
      ret = true
    }
    if (isNaN(vm.crm.modalidade)) {
      vm.addAlertValidade('Selecione Modalidade da Operação!')
      ret = true
    }
    if (isNaN(vm.crm.cnpjClienteFinal)) {
      vm.addAlertValidade('CNPJ do Cliente sem preencher!')
      ret = true
    }
    if (vm.crm.razaoSocialClienteFinal == undefined || vm.crm.razaoSocialClienteFinal == '') {
      vm.addAlertValidade('Razão Social do Cliente sem preencher!')
      ret = true
    }
    if (isNaN(vm.crm.cep)) {
      vm.addAlertValidade('CEP sem preencher!')
      ret = true
    }
    if (vm.crm.nomeLogradouro == undefined || vm.crm.nomeLogradouro == '') {
      vm.addAlertValidade('Logradouro sem preencher!')
      ret = true
    }
    if (vm.crm.numeroLogradouro == undefined || vm.crm.numeroLogradouro == '') {
      vm.addAlertValidade('Número sem preencher!')
      ret = true
    }
    if (vm.crm.complemento == undefined || vm.crm.complemento == '') {
      vm.addAlertValidade('Complemento sem preencher!')
      ret = true
    }
    if (vm.crm.nomeBairro == undefined || vm.crm.nomeBairro == '') {
      vm.addAlertValidade('Bairro sem preencher!')
      ret = true
    }
    if (vm.crm.cidade == undefined || vm.crm.cidade == '') {
      vm.addAlertValidade('Cidade sem preencher!')
      ret = true
    }
    if (vm.crm.codigoIbgeMunicipio == undefined || vm.crm.codigoIbgeMunicipio == '') {
      vm.addAlertValidade('Código IBGE do Cliente sem preencher!')
      ret = true
    }
    if (isNaN(vm.crm.cnaeClienteFinal)) {
      vm.addAlertValidade('CNAE do Cliente sem preencher!')
      ret = true
    }
    if (isNaN(vm.crm.cnaePortariaGrandeEmpresa)) {
      vm.addAlertValidade('CNAE da Portaria Grande Empresa sem preencher!')
      ret = true
    }
    if (isNaN(vm.crm.naturezaClienteFinal)) {
      vm.addAlertValidade('Selecione Natureza do Cliente!')
      ret = true
    }
    if (isNaN(vm.crm.valorOperacao)) {
      vm.addAlertValidade('Selecione Valor da Operação!')
      ret = true
    }
    if (vm.crm.ecgDeveSerSomadoAoValorOperacao == undefined || vm.crm.ecgDeveSerSomadoAoValorOperacao == '') {
      vm.addAlertValidade('Selecione ECG deve ser somado a operação!')
      ret = true
    }
    if (vm.crm.dataContratacao == undefined ||  vm.crm.dataContratacao == '') {
      vm.addAlertValidade('Data Contratação sem preencher!')
      ret = true
    }
    if (vm.crm.dataPrimeiraLiberacao == undefined ||  vm.crm.dataPrimeiraLiberacao == '') {
      vm.addAlertValidade('Data 1a. Liberação sem preencher!')
      ret = true
    }
    if (isNaN(vm.crm.valorPrimeiraLiberacao)) {
      vm.addAlertValidade('Vlr 1a. LIberação sem preencher!')
      ret = true
    }
    if (isNaN(vm.crm.indexadorTaxaJuros)) {
      vm.addAlertValidade('Selecione o Indexador Taxas de Juros!')
      ret = true
    }
    if (isNaN(vm.crm.percentualIndexador)) {
      vm.addAlertValidade('Preencha Percentual do Indexador!')
      ret = true
    }
    if (isNaN(vm.crm.taxaEfetivaAnual)) {
      vm.addAlertValidade('Preencha Taxa Efetuva Anual!')
      ret = true
    }
    if (vm.crm.riscoOperacao == undefined ||  vm.crm.riscoOperacao == '') {
      vm.addAlertValidade('Selecione a Classif. Risco da Operação!')
      ret = true
    }
    if (isNaN(vm.crm.receitaBrutaClienteFinal)) {
      vm.addAlertValidade('Preencha a Receita Bruta!')
      ret = true
    }
    if (vm.crm.tipoReceitaBruta == undefined || vm.crm.tipoReceitaBruta == '') {
      vm.addAlertValidade('Selecione o Tipo Receira Bruta!')
      ret = true
    }
    if (vm.crm.dataReferenciaReceitaBruta == undefined || vm.crm.dataReferenciaReceitaBruta == '') {
      vm.addAlertValidade('Preencha a Data Referência Receita!')
      ret = true
    }
    if (isNaN(vm.crm.tipoGarantia)) {
      vm.addAlertValidade('Selecione o Tipo de Garantia!')
      ret = true
    }
    if (vm.crm.dataAmortizacao == undefined || vm.crm.dataAmortizacao == '') {
      vm.addAlertValidade('Preencha a Data Amortização!')
      ret = true
    }

    // regras de negócio

    return ret
  }

  vm.showTabUpdate = function (crm) {
    vm.crm = crm
    tabs.show(vm, { tabUpdate: true, tabLista: true })
  }

  vm.showTabDelete = function (crm) {
    vm.crm = crm
    tabs.show(vm, { tabDelete: true })
  }

  vm.getProduto()
}

