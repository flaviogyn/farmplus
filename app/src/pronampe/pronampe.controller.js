projeto.controller('crmCtrl', [
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
  crmController
])

function crmController($scope, $http, $location, $rootScope, auth, listas, msgs, tabs, consts, CidadesService) {

  //Init
  $scope.initTabCreate = () => {
    var dt = new Date()
    var dt2 = new Date()
    dt2.setMonth(dt2.getMonth() + 37)
    // Conforme MPO, o prazo são 1095 dias (aceitando intervalos entre 1093 e 1098)

    $scope.crm.dtCadastro = dt.toISOString()
    $scope.crm.idApi = 1
    $scope.crm.codigoFundoGarantidor = 2
    $scope.crm.codigoTipoPessoa = 2
    $scope.crm.numeroAgenciaContratanteOperacao = 15
    $scope.crm.estado = 'GO'
    $scope.crm.percentualGarantiaOperacaoCredito = 100
    $scope.crm.codigoTipoModalidadeCredito = 1
    $scope.crm.codigoTipoFonteRecurso = 11
    $scope.crm.codigoTipoProgramaCredito = 39
    $scope.crm.codigoTipoCronogramaAmortizacao = 1
    $scope.crm.codigoTipoCondicaoEspecial = 1
    $scope.crm.codigoTipoFormalizacao = 1
    $scope.crm.codigoTipoFinalidadeCredito = 2
    $scope.crm.dataFormalizacaoOperacao = dt.toISOString()
    $scope.crm.dataVencimentoOperacao = dt2.getDate().toString().padStart(2, '0') + "/" + dt2.getMonth().toString().padStart(2, '0') + "/" + dt2.getFullYear()
  }

  $scope.isCollapsed = true;
  $scope.filtro = {};
  $scope.log = {};

  // pronampe
  $scope.estados = listas.getEstados();
  $scope.linhaCredito = listas.getLinhaCredito();
  $scope.tipoPessoa = listas.getCodigoTipoPessoa();
  $scope.fundoGarantidor = listas.getCodigoFundoGarantidor();
  $scope.tipoPublicoAlvo = listas.getCodigoTipoPublicoAlvo();
  $scope.tipoModalidadeCredito = listas.getCodigoTipoModalidadeCredito();
  $scope.tipoFinalidadeCredito = listas.getCodigoTipoFinalidadeCredito();
  $scope.tipoFonteRecurso = listas.getCodigoTipoFonteRecurso();
  $scope.tipoProgramaCredito = listas.getCodigoTipoProgramaCredito();
  $scope.tipoCronogramaAmortizacao = listas.getCodigoTipoCronogramaAmortizacao();
  $scope.tipoCondicaoEspecial = listas.getCodigoTipoCondicaoEspecial();
  $scope.tipoFormalizacao = listas.getCodigoTipoFormalizacao();

  $scope.getId = (list, id) => {
    for (var i = 0; i < list.length; i++) {
      if (list[i].id == id) {
        return list[i].name;
        break;
      }
    }
    // angular.forEach($scope.linhaCredito, function (item, index) {
    //   if (item.id == id) {
    //     return item.name
    //   }
    // })
  }

  /*
  var jsonVar = {
          text: "example",
          number: 1,
          obj: {
              "more text": "another example"
          },
          obj2: {
              "yet more text": "yet another example"
          }
      }, // THE RAW OBJECT
      jsonStr = JSON.stringify(jsonVar),  // THE OBJECT STRINGIFIED
      regeStr = '', // A EMPTY STRING TO EVENTUALLY HOLD THE FORMATTED STRINGIFIED OBJECT
      f = {
              brace: 0
          }; // AN OBJECT FOR TRACKING INCREMENTS/DECREMENTS,
            // IN PARTICULAR CURLY BRACES (OTHER PROPERTIES COULD BE ADDED)

  regeStr = jsonStr.replace(/({|}[,]*|[^{}:]+:[^{}:,]*[,{]*)/g, function (m, p1) {
  var rtnFn = function() {
          return '<div style="text-indent: ' + (f['brace'] * 20) + 'px;">' + p1 + '</div>';
      },
      rtnStr = 0;
      if (p1.lastIndexOf('{') === (p1.length - 1)) {
          rtnStr = rtnFn();
          f['brace'] += 1;
      } else if (p1.indexOf('}') === 0) {
          f['brace'] -= 1;
          rtnStr = rtnFn();
      } else {
          rtnStr = rtnFn();
      }
      return rtnStr;
  });

  document.body.innerHTML += regeStr; // appends the result to the body of the HTML document
  */

  //Busca por cidades
  //http://educacao.dadosabertosbr.com/api/cidades/go
  /*
    $scope.cidades = [
      { name: 'Goiânia' },
      { name: 'Aparecida de Goiânia' },
      { name: 'Águas Lindas de Goiás' },
      { name: 'Valparaiso' },
      { name: 'Santo Antônio de Goiás' },
      { name: 'Santo Antônio do Descoberto' },
      { name: 'Trindade' },
      { name: 'Senador Canedo' },
      { name: 'Brasília' },
      { name: 'Morrinhos' },
      { name: 'Hidrolândia' }
    ]
  */

  //Escuta alteração do estado 
  $scope.$watch("crm.estado", function (value) {
    if (value) {
      //console.log('entrei atualiza cidades')
      $scope.getCidades()
    }
  })

  $scope.$watch("crm.cidade", function (value) {
    if (value && value != "null") {
      CidadesService.getNome(value).then(function (resp) {
        if (resp.data.length > 0) {
          let CodigoIBGE = resp.data[0].CodigoIBGE
          $scope.crm.codigoIbgeMunicipioAgencia = CodigoIBGE.toString().substring(0, CodigoIBGE.length - 1);
        } else {
          msgs.addWarning('Código IBGE não localizado')
        }
      })
    }
  })

  //Busca de cidades
  $scope.getCidades = function () {
    if ($scope.crm.estado == undefined) {
      $scope.crm.estado = 'GO'
    }
    CidadesService.get($scope.crm.estado).then(function (resp) {
      //console.log('controller cidades: ' +  JSON.stringify(resp.data))
      if (resp.data.length > 0) {
        $scope.cidades = resp.data
      } else {
        msgs.addWarning('Cidades não foram localizadas.')
      }
    })
  }

  $scope.getCidade = function (nome) {
    CidadesService.getNome(nome).then(function (resp) {
      if (resp.data.length > 0) {
        $scope.CodigoIBGE = resp.data[0].CodigoIBGE
      } else {
        msgs.addWarning('Código IBGE não localizado')
        $scope.CodigoIBGE = null
      }
    })
  }

  $scope.getCpfCnpj = (id) => {
    if(id) {
      var url = `${consts.apiUrl}/cpfcnpj/${id}`
      msgs.addInfo('Aguarde consultando cliente!');
      $http.get(url).then(function (resp) {
        $scope.crm.contrato = resp.data[0].CONTRATO
        $scope.crm.cliente = resp.data[0].CLIENTE
      }).catch(function (resp) {
        msgs.addWarning('Contrato e Cliente não localizado!')
      })
    }
  }

  //CEP
  $rootScope.$on('cep', function (event, data) {
    //console.log('controller cep: ' +  JSON.stringify(data))
    //$scope.crm.complemento = data.complemento
    if (data) {
      if ($scope.crm.logradouro == undefined) {
        $scope.crm.logradouro = data.logradouro
      }
      if ($scope.crm.bairro == undefined) {
        $scope.crm.bairro = data.bairro;
      }
      $scope.crm.estado = data.estado;
      $scope.crm.cidade = data.cidade;
    }
  });

  /*
  for (var i = 0, len = $scope.usuarios.length; i < len; i++) {
    if ($scope.usuarios[i].nome == usuario) {
      return $scope.usuarios[i].equipe
      break;
    }
  }

  angular.forEach($scope.usuarios, function(item,index){
    console.log(item.nome)
    if(flag) {
      if(item.nome == usuario){
        console.log('>>' + item.equipe)
        flag = false        
        return item.equipe
      } 
    }
    //console.log(item,index)
  })

  var array = ['foo', 'bar', 'yay'];
  $.each(array, function(index, element){
      if (element === 'foo') {
          return true; // continue
      }
      console.log(this);
      if (element === 'bar') {
          return false; // break
      }
  });

  //Example for some:
  var ary = ["JavaScript", "Java", "CoffeeScript", "TypeScript"];

  ary.some(function (value, index, _ary) {
      console.log(index + ": " + value);
      return value === "JavaScript";
  });
  
  //Example for every:
  var ary = ["JavaScript", "Java", "CoffeeScript", "TypeScript"];

  ary.every(function(value, index, _ary) {
      console.log(index + ": " + value);
      return value.indexOf("Script") > -1;
  });
  */

  $scope.alerts = [
    // { type: 'danger', msg: 'Oh snap! Change a few things up and try submitting again.' },
    // { type: 'success', msg: 'Well done! You successfully read this important alert message.' }
  ];

  $scope.addAlert = function (mensagem) {
    $scope.alerts.push({ msg: JSON.stringify(mensagem) });
    //jsonStr.replace("","/({|}[,]*|[^{}:]+:[^{}:,]*[,{]*)/g")
  };

  $scope.addAlertValidade = function (mensagem) {
    $scope.alerts.push({ type: 'warning', msg: mensagem });
  };

  $scope.closeAlert = function (index) {
    $scope.alerts.splice(index, 1);
  };

  $scope.validarCNPJ = function (cnpj) {
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

  $scope.validarCPF = function (strCPF) {
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

  $scope.limparFiltro = function () {
    $scope.filtro = {};
    $scope.filtro.cadInicial = null;
    $scope.filtro.cadFinal = null;
    $scope.filtro.cpf = null;
  }

  $scope.getApi = function (id) {
    //const page = parseInt($location.search().page) || 1
    var url = `${consts.apiUrl}/apipronampe/${id}`

    $http.get(url).then(function (resp) {
      $scope.crms = resp.data
      $scope.crm = {}
      tabs.show($scope, { tabList: true, tabCreate: true })
    }).catch(function (resp) {
      $scope.addAlert(resp.data)
    })
  }

  $scope.getPronampe = function (add) {
    const page = parseInt($location.search().page) || 1
    var url = `${consts.apiUrl}/pronampe`
    msgs.addInfo('Aguarde consulta sendo realizada!')

    $http.get(url).then(function (resp) {
      $scope.crms = resp.data
      if (!add) {
        $scope.crm = {}
        tabs.show($scope, { tabList: true, tabCreate: true })
      }
    }).catch(function (resp) {
      //msgs.addError(resp.data)
      $scope.addAlert(resp.data)
    })
  }

  $scope.getLog = function (id) {
    var url = `${consts.apiUrl}/logpronampe/${id}`
    $http.get(url).then(function (resp) {
      $scope.mensagens = resp.data
    }).catch(function (resp) {
      $scope.addAlert(resp.data)
    })
  }

  $scope.create = function () {
    if (!$scope.validaEntradas()) {
      const url = `${consts.apiUrl}/pronampe`;

      $http.post(url, $scope.crm).then(function (resp) {
        console.log(resp.data)
        msgs.addSuccess('Operação realizada com sucesso!!')
        $scope.crm = {}
        $scope.getPronampe()
      }).catch(function (resp) {
        //msgs.addError(resp.data)
        $scope.addAlert(resp.data)
      })
    }
  }

  $scope.createLog = function () {
    const url = `${consts.apiUrl}/logpronampe`;
    $http.post(url, $scope.log).then(function (response) {
      $scope.getLog($scope.log.idPronampe)
      $scope.log = {}
    }).catch(function (resp) {
      $scope.addAlert(resp.data)
    })
  }

  $scope.enviar = function () {
    if (!$scope.validaEntradas()) {
      let urlToken = `${consts.apiUrl}/token`
      msgs.addInfo('Aguarde consulta sendo realizada!')

      $http.get(urlToken).then(function (response) {
        let token = response.data.access_token;
        let url = `${consts.apiUrl}/enviar/${$scope.crm.id}/${token}`

        $http.post(url, $scope.crm).then(function (response) {
          console.log(response.data)
          $scope.crm.numeroReservaPreValidacao = response.data.numeroReservaPreValidacao
          $scope.crm.valorTotalFinanciado = response.data.valorTotalFinanciado
          $scope.crm.status = 'Enviado'

          const url = `${consts.apiUrl}/pronampe/${$scope.crm.id}`
          $http.patch(url, $scope.crm).then(function (response) {
            $scope.log.idPronampe = $scope.crm.id
            $scope.log.status = $scope.crm.status
            $scope.log.mensagem = "Envio realizado com sucesso!"
            $scope.createLog();
            $scope.crm = {}
            $scope.getPronampe()
            tabs.show($scope, { tabList: true, tabCreate: true })
            $scope.initTabCreate()
            msgs.addSuccess('Envio realizado com sucesso!')
          }).catch(function (resp) {
            //msgs.addError(resp.data)
            $scope.addAlert(resp.data)
            $scope.log.idPronampe = $scope.crm.id
            $scope.log.status = "Erro salvar retorno"
            $scope.log.mensagem = resp.data
            $scope.createLog();
          })

        }).catch(function (resp) {
          //msgs.addError(resp.data)
          $scope.addAlert(resp.data)
          $scope.log.idPronampe = $scope.crm.id
          $scope.log.status = "Erro enviar Proname"
          $scope.log.mensagem = resp.data
          $scope.createLog();
        })

      }).catch(function (resp) {
        //msgs.addError(resp.data)
        $scope.addAlert(resp.data)
        $scope.log.idPronampe = $scope.crm.id
        $scope.log.status = "Erro buscar Token"
        $scope.log.mensagem = resp.data
        $scope.createLog();
      })
    }
  }

  $scope.validaEntradas = function () {
    let ret = false
    // for (var i = 0; i < $scope.alerts.length; i++) {
    //   $scope.alerts.splice(i, 1);
    // }
    $scope.alerts.splice(0, $scope.alerts.length);

    if ($scope.crm.dtCadastro == undefined) {
      var dt = new Date()
      $scope.crm.dtCadastro = dt.toISOString()
    }
    if (!Number.isInteger($scope.crm.idApi)) {
      $scope.addAlertValidade('Selecione a API!')
      ret = true
    }
    if (!Number.isInteger($scope.crm.codigoFundoGarantidor)) {
      $scope.crm.codigoFundoGarantidor = 2
    }
    if (!Number.isInteger($scope.crm.numeroAgenciaContratanteOperacao)) {
      $scope.crm.numeroAgenciaContratanteOperacao = 15
    }
    if ($scope.crm.codigoIbgeMunicipioAgencia == undefined || $scope.crm.codigoIbgeMunicipioAgencia == '') {
      $scope.addAlertValidade('Código IBGE sem preencher!')
      ret = true
    }
    if (!Number.isInteger($scope.crm.codigoTipoPessoa)) {
      $scope.addAlertValidade('Selecione Tipo de pessoa!')
      ret = true
    }
    if ($scope.crm.codigoIdentificadorSrf == undefined) {
      $scope.addAlertValidade('CNPJ/CPF sem preencher!')
      ret = true
    }
    /*if ($scope.crm.codigoIdentificadorSrf != undefined) {
      if ($scope.crm.codigoIdentificadorSrf.length > 12) {
        if ($scope.validarCNPJ($scope.crm.codigoIdentificadorSrf)) {
          $scope.addAlertValidade('CNPJ Inválido!')
          ret = true
        }
      } else {
        if ($scope.validarCPF($scope.crm.codigoIdentificadorSrf)) {
          $scope.addAlertValidade('CPF Inválido!')
          ret = true
        }
      }
    }*/
    if (!Number.isInteger($scope.crm.codigoTipoPublicoAlvo)) {
      $scope.addAlertValidade('Selecione o Tipo de Público Alvo!')
      ret = true
    }
    if ($scope.crm.valorFaturamentoBrutoAnual == undefined) {
      $scope.addAlertValidade('Faturamento Bruto Anual sem preencher!')
      ret = true
    }
    if ($scope.crm.valorOperacaoCredito == undefined || $scope.crm.valorOperacaoCredito == '') {
      $scope.addAlertValidade('Valor da Operação de Crédito sem preencher!')
      ret = true
    }
    if ($scope.crm.percentualGarantiaOperacaoCredito == undefined || $scope.crm.percentualGarantiaOperacaoCredito == '') {
      $scope.addAlertValidade('% Garantia Operação Crédito sem preencher!')
      ret = true
    }
    if (!Number.isInteger($scope.crm.codigoTipoModalidadeCredito)) {
      $scope.addAlertValidade('Selecione Código Tipo Modalidade Crédito!')
      ret = true
    }
    if (!Number.isInteger($scope.crm.codigoTipoFinalidadeCredito)) {
      $scope.addAlertValidade('Selecione Código Tipo Finalidade Crédito!')
      ret = true
    }
    if (!Number.isInteger($scope.crm.codigoTipoFonteRecurso)) {
      $scope.addAlertValidade('Selecione Código Tipo Fonte Recurso!')
      ret = true
    }
    if (!Number.isInteger($scope.crm.codigoTipoProgramaCredito)) {
      $scope.addAlertValidade('Selecione Código Tipo Programa Crédito!')
      ret = true
    }
    if ($scope.crm.dataFormalizacaoOperacao == undefined || $scope.crm.dataFormalizacaoOperacao == '') {
      var dt = new Date()
      $scope.crm.dataFormalizacaoOperacao = dt.toISOString()
    }
    if ($scope.crm.dataVencimentoOperacao == undefined || $scope.crm.dataVencimentoOperacao == '') {
      $scope.addAlertValidade('Data de Vencimento Operação sem preencher!')
      ret = true
    }
    if (!Number.isInteger($scope.crm.codigoTipoCronogramaAmortizacao)) {
      $scope.addAlertValidade('Selecione Código Tipo Cronograma Amortizacao!')
      ret = true
    }
    if (!Number.isInteger($scope.crm.codigoTipoCondicaoEspecial)) {
      $scope.addAlertValidade('Selecione Código Tipo Condição Especial!')
      ret = true
    }
    if (!Number.isInteger($scope.crm.codigoTipoFormalizacao)) {
      $scope.addAlertValidade('Selecione Código Tipo Formalização!')
      ret = true
    }

    // regras de negócio
    if (Number.isInteger($scope.crm.codigoTipoPublicoAlvo) && ($scope.crm.valorFaturamentoBrutoAnual != undefined || $scope.crm.valorFaturamentoBrutoAnual != '')) {
      if ($scope.crm.codigoTipoPublicoAlvo == 1 && $scope.crm.valorFaturamentoBrutoAnual > 360000) {
        $scope.addAlert('Para a opção Micro Empresa o faturamento Anual Bruto não pode exeder a R$ 360.000,00!')
        ret = true
      }
    }

    // regra data vencimento
    return ret
  }

  $scope.showTabUpdate = function (crm) {
    $scope.crm = crm
    $scope.getLog(crm.id)
    tabs.show($scope, { tabUpdate: true, tabLista: true })
  }

  $scope.showTabDelete = function (crm) {
    $scope.crm = crm
    tabs.show($scope, { tabDelete: true })
  }

  $scope.cancel = function () {
    tabs.show($scope, { tabList: true, tabCreate: true })
    $scope.alerts.splice(0, $scope.alerts.length);
    $scope.crm = {}
    $scope.log = {}
    $scope.mensagens = {}
    $scope.initTabCreate()
  }

  $scope.update = function () {
    $scope.alerts.splice(0, $scope.alerts.length);
    const url = `${consts.apiUrl}/pronampe/${$scope.crm.id}`
    $http.patch(url, $scope.crm).then(function (response) {
      //$scope.crm = {}
      $scope.getPronampe('true')
      //tabs.show($scope, { tabList: true, tabCreate: true })
      msgs.addSuccess('Atualização realizada com sucesso!')
    }).catch(function (resp) {
      //msgs.addError(resp.data)
      $scope.addAlert(resp.data)
    })
  }

  $scope.delete = function () {
    $scope.alerts.splice(0, $scope.alerts.length);
    const url = `${consts.apiUrl}/pronampe/${$scope.crm.id}`
    $http.delete(url, $scope.crm).then(function (response) {
      $scope.crm = {}
      $scope.getPronampe()
      tabs.show($scope, { tabList: true, tabCreate: true })
      msgs.addSuccess('Exclusão realizada com sucesso!')
    }).catch(function (resp) {
      //msgs.addError(resp.data)
      $scope.addAlert(resp.data)
    })
  }

  $scope.getPronampe()
}

