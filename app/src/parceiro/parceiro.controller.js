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
  'CidadesService',
  'CepService',
  peacController
])

function peacController($scope, $http, $location, $rootScope, auth, listas, msgs, tabs, consts, CidadesService, CepService) {
  var vm = this

  //Init
  vm.initTabCreate = () => {
    var dt = new Date()
    var dt2 = new Date()
    dt2.setMonth(dt2.getMonth() + 37)

    vm.crm.dtCadastro = dt.toISOString()
    vm.crm.idApi = 1
    vm.crm.cnpjAgenteFinanceiro = 18734994000135
    vm.crm.idOperacaoAgente = 15
    vm.crm.codigoIbgeMunicipioInvestimento = 520870
    vm.crm.estado = 'GO'
    vm.crm.dataContratacao = dt.toISOString()
    vm.crm.dataPrimeiraLiberacao = dt.toISOString()
    //vm.crm.cnaePortariaGrandeEmpresa = 100001
    //vm.crm.dataVencimentoOperacao = dt2.getDate().toString().padStart(2, '0') + "/" + dt2.getMonth().toString().padStart(2, '0') + "/" + dt2.getFullYear()
  }

  vm.filtro = {};
  vm.log = {};

  // listas
  vm.estados = listas.getEstados()
  vm.linhaPeac = listas.getLinhaPeac()
  vm.modalidades = listas.getCodigoModalidade()
  vm.tipoLogradouro = listas.getCodigoTipoLogradouro()
  vm.naturezaCliente = listas.getCodigoNaturezaClienteFinal()
  vm.EcgDeveSerSomadoAoValorOperacao = listas.getCodigoEcgDeveSerSomadoAoValorOperacao()
  vm.indexadorTaxaJuros = listas.getCodigoIndexadorTaxaJuros()
  vm.classRiscoOperacao = listas.getCodigoClassRiscoOperacao()
  vm.tipoReceitaBruta = listas.getCodigoTipoReceitaBruta()
  vm.tipoGarantia = listas.getCodigoTipoGarantia()

  vm.getId = (list, id) => {
    let ret = ""
    for (var i = 0; i < list.length; i++) {
      if (list[i].id == id) {
        ret = list[i].name;
        break;
      }
    }
    return ret
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

  $scope.$watch("vm.crm.estado", function (value) {
    if (value) {
      vm.getCidades()
    }
  })

  $scope.$watch("vm.crm.cidade", function (value) {
    if (value && value != "null") {
      CidadesService.getNome(value).then(function (resp) {
        if (resp.data.length > 0) {
          let CodigoIBGE = resp.data[0].CodigoIBGE
          vm.crm.codigoIbgeMunicipio = CodigoIBGE.toString().substring(0, CodigoIBGE.length - 1);
        } else {
          msgs.addWarning('Código IBGE não localizado do cliente')
        }
      })
    }
  })

  $scope.$watch("vm.crm.cep", function (value) {
    if (value && value != "null") {
      CepService.get(value).then(function (resp) {
        if (resp.data) {
          if (vm.crm.nomeLogradouro == undefined) {
            vm.crm.nomeLogradouro = resp.data.logradouro
            let index = vm.crm.nomeLogradouro.split(" ")
            vm.crm.tipoLogradouro = vm.getName(vm.tipoLogradouro, index[0])
          }
          if (vm.crm.nomeBairro == undefined) {
            vm.crm.nomeBairro = resp.data.bairro;
          }
          vm.crm.estado = resp.data.estado;
          vm.crm.cidade = resp.data.cidade;
          vm.crm.codigoIbgeMunicipio = resp.data.cidade_info.codigo_ibge
        } else {
          vm.crm.tipoLogradouro = 99
          msgs.addWarning('CEP não localizado')
        }
      })
    }
  });

  vm.getCidades = function () {
    if (vm.crm.estado == undefined) {
      vm.crm.estado = 'GO'
    }
    CidadesService.get(vm.crm.estado).then(function (resp) {
      //console.log('controller cidades: ' +  JSON.stringify(resp.data))
      if (resp.data.length > 0) {
        vm.cidades = resp.data
      } else {
        msgs.addWarning('Cidades não foram localizadas.')
      }
    })
  }

  vm.getCpfCnpj = (id) => {
    if (id) {
      var url = `${consts.apiUrl}/cpfcnpj/${id}`
      msgs.addInfo('Aguarde consultando cliente!');
      $http.get(url).then(function (resp) {
        vm.crm.contrato = resp.data[0].CONTRATO
        vm.crm.razaoSocialClienteFinal = resp.data[0].CLIENTE
      }).catch(function (resp) {
        msgs.addWarning('Cliente e Contrato não localizado!')
      })
    }
  }

  vm.alerts = [];

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

  vm.validarCNPJ = function (cnpj) {
    cnpj = cnpj.replace(/[^\d]+/g, '');
    if (cnpj == '') return false;
    if (cnpj.length != 14)
      return false;
    // LINHA 10 - Elimina CNPJs invalidos conhecidos
    if (cnpj == "00000000000000" ||
      cnpj == "11111111111111" ||
      cnpj == "22222222222222" ||
      cnpj == "33333333333333" ||
      cnpj == "44444444444444" ||
      cnpj == "55555555555555" ||
      cnpj == "66666666666666" ||
      cnpj == "77777777777777" ||
      cnpj == "88888888888888" ||
      cnpj == "99999999999999")
      return false; // LINHA 21

    // Valida DVs LINHA 23 -
    tamanho = cnpj.length - 2
    numeros = cnpj.substring(0, tamanho);
    digitos = cnpj.substring(tamanho);
    soma = 0;
    pos = tamanho - 7;
    for (i = tamanho; i >= 1; i--) {
      soma += numeros.charAt(tamanho - i) * pos--;
      if (pos < 2)
        pos = 9;
    }
    resultado = soma % 11 < 2 ? 0 : 11 - soma % 11;
    if (resultado != digitos.charAt(0))
      return false;

    tamanho = tamanho + 1;
    numeros = cnpj.substring(0, tamanho);
    soma = 0;
    pos = tamanho - 7;
    for (i = tamanho; i >= 1; i--) {
      soma += numeros.charAt(tamanho - i) * pos--;
      if (pos < 2)
        pos = 9;
    }
    resultado = soma % 11 < 2 ? 0 : 11 - soma % 11;
    if (resultado != digitos.charAt(1))
      return false; // LINHA 49

    return true; // LINHA 51
  };

  vm.validarCPF = function (strCPF) {
    var Soma;
    var Resto;
    Soma = 0;
    if (strCPF == "00000000000") return false;

    for (i = 1; i <= 9; i++) Soma = Soma + parseInt(strCPF.substring(i - 1, i)) * (11 - i);
    Resto = (Soma * 10) % 11;

    if ((Resto == 10) || (Resto == 11)) Resto = 0;
    if (Resto != parseInt(strCPF.substring(9, 10))) return false;

    Soma = 0;
    for (i = 1; i <= 10; i++) Soma = Soma + parseInt(strCPF.substring(i - 1, i)) * (12 - i);
    Resto = (Soma * 10) % 11;

    if ((Resto == 10) || (Resto == 11)) Resto = 0;
    if (Resto != parseInt(strCPF.substring(10, 11))) return false;
    return true;
  }

  vm.limparFiltro = function () {
    vm.filtro = {};
  }

  vm.getApi = function (id) {
    //const page = parseInt($location.search().page) || 1
    var url = `${consts.apiUrl}/apipeac/${id}`

    $http.get(url).then(function (resp) {
      vm.crms = resp.data
      vm.crm = {}
      tabs.show(vm, { tabList: true, tabCreate: true })
    }).catch(function (resp) {
      vm.addAlert(resp.data)
    })
  }

  vm.getPeac = function (add) {
    const page = parseInt($location.search().page) || 1
    var url = `${consts.apiUrl}/peac`
    msgs.addInfo('Aguarde consulta sendo realizada!')

    $http.get(url).then(function (resp) {
      vm.crms = resp.data
      if (!add) {
        vm.crm = {}
        tabs.show(vm, { tabList: true, tabCreate: true })
      }
    }).catch(function (resp) {
      //msgs.addError(resp.data)
      vm.addAlert(resp.data)
    })
  }

  vm.getLog = function (id) {
    var url = `${consts.apiUrl}/logpeac/${id}`
    $http.get(url).then(function (resp) {
      vm.mensagens = resp.data
    }).catch(function (resp) {
      vm.addAlert(resp.data)
    })
  }

  vm.create = function () {
    if (!vm.validaEntradas()) {
      const url = `${consts.apiUrl}/peac`;

      $http.post(url, vm.crm).then(function (resp) {
        console.log(resp.data)
        msgs.addSuccess('Operação realizada com sucesso!!')
        vm.crm = {}
        vm.getPeac()
      }).catch(function (resp) {
        //msgs.addError(resp.data)
        vm.addAlert(resp.data)
      })
    }
  }

  vm.createLog = function () {
    const url = `${consts.apiUrl}/logpeac`;
    $http.post(url, vm.log).then(function (response) {
      vm.getLog(vm.log.idpeac)
      vm.log = {}
    }).catch(function (resp) {
      vm.addAlert(resp.data)
    })
  }

  vm.cancel = function () {
    tabs.show(vm, { tabList: true, tabCreate: true })
    vm.alerts.splice(0, vm.alerts.length);
    vm.crm = {}
    vm.log = {}
    vm.mensagens = {}
    vm.initTabCreate()
  }

  vm.update = function () {
    vm.alerts.splice(0, vm.alerts.length);
    const url = `${consts.apiUrl}/peac/${vm.crm.id}`
    $http.patch(url, vm.crm).then(function (response) {
      //vm.crm = {}
      vm.getPeac('true')
      //tabs.show(vm, { tabList: true, tabCreate: true })
      msgs.addSuccess('Atualização realizada com sucesso!')
    }).catch(function (resp) {
      //msgs.addError(resp.data)
      vm.addAlert(resp.data)
    })
  }

  vm.delete = function () {
    vm.alerts.splice(0, vm.alerts.length);
    const url = `${consts.apiUrl}/peac/${vm.crm.id}`
    $http.delete(url, vm.crm).then(function (response) {
      vm.crm = {}
      vm.getPeac()
      tabs.show(vm, { tabList: true, tabCreate: true })
      msgs.addSuccess('Exclusão realizada com sucesso!')
    }).catch(function (resp) {
      //msgs.addError(resp.data)
      vm.addAlert(resp.data)
    })
  }

  vm.enviar = function () {
    if (!vm.validaEntradas()) {
      let urlToken = `${consts.apiUrl}/tokenpeac`
      msgs.addInfo('Aguarde consulta sendo realizada!')

      $http.get(urlToken).then(function (response) {
        let token = response.data.access_token;
        let url = `${consts.apiUrl}/enviarpeac/${vm.crm.id}/${token}`

        $http.post(url, vm.crm).then(function (response) {
          console.log(response.data)
          vm.crm.numeroReservaPreValidacao = response.data.numeroReservaPreValidacao
          vm.crm.valorTotalFinanciado = response.data.valorTotalFinanciado
          vm.crm.status = 'Enviado'

          const url = `${consts.apiUrl}/peac/${vm.crm.id}`
          $http.patch(url, vm.crm).then(function (response) {
            vm.log.idpeac = vm.crm.id
            vm.log.status = vm.crm.status
            vm.log.mensagem = "Envio realizado com sucesso!"
            vm.createLog();
            vm.crm = {}
            vm.getPeac()
            tabs.show(vm, { tabList: true, tabCreate: true })
            vm.initTabCreate()
            msgs.addSuccess('Envio realizado com sucesso!')
          }).catch(function (resp) {
            //msgs.addError(resp.data)
            vm.addAlert(resp.data)
            vm.log.idpeac = vm.crm.id
            vm.log.status = "Erro salvar retorno"
            vm.log.mensagem = resp.data
            vm.createLog();
          })

        }).catch(function (resp) {
          //msgs.addError(resp.data)
          vm.addAlert(resp.data)
          vm.log.idpeac = vm.crm.id
          vm.log.status = "Erro enviar Proname"
          vm.log.mensagem = resp.data
          vm.createLog();
        })

      }).catch(function (resp) {
        //msgs.addError(resp.data)
        vm.addAlert(resp.data)
        vm.log.idpeac = vm.crm.id
        vm.log.status = "Erro buscar Token"
        vm.log.mensagem = resp.data
        vm.createLog();
      })
    }
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
    vm.getLog(crm.id)
    tabs.show(vm, { tabUpdate: true, tabLista: true })
  }

  vm.showTabDelete = function (crm) {
    vm.crm = crm
    tabs.show(vm, { tabDelete: true })
  }

  vm.getPeac()
}

