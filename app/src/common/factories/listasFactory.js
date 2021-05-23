projeto.factory('listas', [
	'$http',
	'$q',
	'$rootScope',
	'auth',
	'consts',
	ListasFactory
])

function ListasFactory($http, $q, $rootScope, auth, consts) {

	/*
		Hortaliças: almeirão, aspargo, cebola, alho, couve, espinhafre, feijão, ervilha, cenoura, alface, abobrinha, cebolinha.
		Frutas: uvas, manga, maçãs, laranjas, pêra, banana, kiwi, tomate, ameixa.
		Galináceos: galinhas, ovos.
		Suínos: carne de porco
		Apicultura: mel, favo de mel, geléia real.
	*/

	const categoriaProduto = [
		{ id: 1, name: 'Hortaliças' },
		{ id: 2, name: 'Frutas' },
		{ id: 3, name: 'Galináceos' } ,
		{ id: 4, name: 'Suínos' } ,
		{ id: 5, name: 'Apicultura' } ,
		{ id: 6, name: 'Outro' }
	]

	const status = [
		{ id: 1, name: 'Não Enviado' },
		{ id: 2, name: 'Verifique Log' },
		{ id: 3, name: 'Enviado' }
	]

	const linhaCredito = [
		{ id: 1, name: 'Pré-Validar FORMALIZAÇÃO de Crédito COM Reserva' },
		{ id: 2, name: 'Pré-Validar FORMALIZAÇÃO de Crédito SEM Reserva' },
		{ id: 3, name: 'CANCELAR Reserva de Pré-validação' }
	]

	const codigoFundoGarantidor = [
		{ id: 1, name: 'FGO Original' },
		{ id: 2, name: 'FGO PRONAMPE' }
	]

	const codigoTipoPessoa = [
		{ id: 1, name: 'Pessoa física' },
		{ id: 2, name: 'Pessoa jurídica' }
	]

	const codigoTipoPublicoAlvo = [
		{ id: 1, name: 'Micro empresa' },
		{ id: 2, name: 'Micro empreendedor individual' },
		{ id: 3, name: 'Autônomo transportador rodoviário de cargas' },
		{ id: 4, name: 'Pequena empresa' }
	]

	/* info
	valorOperacaoCredito*	number($float)
	example: 50000
	Valor da operação:
	- Se crédito fixo, informe o valor financiado;
	- Se crédito rotativo, informe o limite de crédito contratado.
	*/

	const codigoTipoModalidadeCredito = [
		{ id: 1, name: 'Crédito fixo' },
		{ id: 2, name: 'Crédito rotativo' }
	]

	const codigoTipoFinalidadeCredito = [
		{ id: 1, name: 'Investimento' },
		{ id: 2, name: 'Capital de giro' }
	]

	const codigoTipoFonteRecurso = [
		{ id: 1, name: 'Fundo de Amparo ao Trabalhador' },
		{ id: 2, name: 'Programa de Formação do Patrimônio Setor Público' },
		{ id: 3, name: 'Conta Própria BB + PASEP' },
		{ id: 4, name: 'Conta Própria BB' },
		{ id: 5, name: 'BNDES' },
		{ id: 6, name: 'Conta Própria AGE-RIO' },
		{ id: 7, name: 'PIS CAIXA' },
		{ id: 8, name: 'Conta própria CAIXA' },
		{ id: 9, name: 'FINEP' },
		{ id: 10, name: 'Desenvolve SP (DSP)' },
		{ id: 11, name: 'Recurso próprio' }
	]

	const codigoTipoProgramaCredito = [
		{ id: 1, name: 'Proger Urbano Empresarial' },
		{ id: 2, name: 'Proger Turismo Investimento' },
		{ id: 3, name: 'BB Capital de Giro Mix PASEP' },
		{ id: 4, name: 'BB Giro Rápido PASEP/Conta Própria - Crédito Fixo' },
		{ id: 5, name: 'BB Giro APL' },
		{ id: 6, name: 'BB Giro Décimo Terceiro Salário' },
		{ id: 7, name: 'BB Giro Saúde Mix PASEP' },
		{ id: 8, name: 'BB Giro Empresa Flex' },
		{ id: 9, name: 'BB Giro Empresa Flex - Liberações Estruturadas' },
		{ id: 10, name: 'BB Giro Rápido' },
		{ id: 11, name: 'BB Crédito Empresa' },
		{ id: 12, name: 'BNDES Automático PER' },
		{ id: 13, name: 'Reescalonamento de Dívidas MPE' },
		{ id: 14, name: 'BB Giro Cartões' },
		{ id: 15, name: 'ASSUNÇÃO DE DÍVIDA DE MPE TESTE' },
		{ id: 16, name: 'BB Crédito Parcelado PJ' },
		{ id: 17, name: 'FAT Turismo Capital de Giro' },
		{ id: 18, name: 'AGERIO APL LICENCIAMENTO AMBIENTAL SELIC' },
		{ id: 19, name: 'DSP INVESTIMENTO' },
		{ id: 20, name: 'DSP MAQUINAS E EQUIPAMENTOS' },
		{ id: 21, name: 'DSP INOVACAO' },
		{ id: 22, name: 'FINEP INOVACAO' },
		{ id: 23, name: 'AGE-RIO APL LICENCIAMENTO AMBIENTAL SELIC' },
		{ id: 24, name: 'AGE-RIO ECOEFICIENCIA' },
		{ id: 25, name: 'AGE-RIO GIRO EMERGENCIAL' },
		{ id: 26, name: 'AGE-RIO GIRO FACIL' },
		{ id: 27, name: 'AGE-RIO GIRO SELIC' },
		{ id: 28, name: 'AGE-RIO INVESTIMENTO FIXO SELIC' },
		{ id: 29, name: 'AGE-RIO LOCADORAS DE VEICULOS' },
		{ id: 30, name: 'AGE-RIO TURISMO - HOTEIS' },
		{ id: 31, name: 'AGE-RIO FRANQUIAS' },
		{ id: 32, name: 'FAT TURISMO INVESTIMENTO' },
		{ id: 33, name: 'RENEGOCIACAO MASSIFICADA PF/PJ' },
		{ id: 34, name: 'RENEGOCIACAO ESPECIAL' },
		{ id: 35, name: 'CARTAO BNDES' },
		{ id: 36, name: 'CAIXA CREDITO PARCELADO PJ' },
		{ id: 37, name: 'CAIXA INVESTIMENTO PJ' },
		{ id: 38, name: 'CAIXA CREDITO ESPECIAL EMPRESA' },
		{ id: 39, name: 'PRONAMPE' }
	]

	const codigoTipoCronogramaAmortizacao = [
		{ id: 1, name: 'Cronogramas unificados' },
		{ id: 2, name: 'Cronogramas independentes' }
	]

	const codigoTipoCondicaoEspecial = [
		{ id: 1, name: 'Sem condição especial' },
		{ id: 2, name: 'BNDES/PER - Programa Emergencial de Recuperação' },
		{ id: 3, name: 'Micro empreendedor individual com deficiência' }
	]

	const codigoTipoFormalizacao = [
		{ id: 1, name: 'Ordinária' },
		{ id: 2, name: 'Novação de dívida(s)' }
	]

	const perfis = [
		{ name: 'Comprar' },
		{ name: 'Vender' },
		{ name: 'Alugar' },
		{ name: 'Investir' }
	]

	const cores = [
		{ name: 'blue' },
		{ name: 'yellow' },
		{ name: 'orange' },
		{ name: 'grey' },
		{ name: 'green' },
		{ name: 'white' }
	]

	const atendimentos = [
		{ name: 'Informação', icon: 'fa fa-info-circle bg-green' },
		{ name: 'Telefonei', icon: 'fa fa-phone bg-green' },
		{ name: 'Enviei SMS', icon: 'glyphicon glyphicon-send bg-green' },
		{ name: 'Enviei Email', icon: 'fa fa-envelope-o bg-green' },
		{ name: 'Enviei WhatsApp', icon: 'fa fa-whatsapp bg-green' },
		{ name: 'Agendei Visita', icon: 'fa fa-car bg-green' },
		{ name: 'Cliente Ligou', icon: 'fa fa-phone bg-green' },
		{ name: 'Cliente foi ao Stand', icon: 'fa fa-home bg-green' },
		{ name: 'Recebi Visita do Cliente', icon: 'fa fa-home bg-green' },
		{ name: 'Skype', icon: 'fa fa-skype bg-green' }
	]

	const tarefas = [
		{ name: 'Agendar Visita', icon: 'fa fa-car bg-red' },
		{ name: 'Enviar Email', icon: 'fa fa-envelope-o bg-red' },
		{ name: 'Enviar SMS', icon: 'glyphicon glyphicon-send bg-red' },
		{ name: 'Follow Up', icon: 'fa fa-briefcase bg-red' },
		{ name: 'Ligação', icon: 'fa fa-phone bg-red' },
		{ name: 'Visita', icon: 'fa fa-car bg-red' },
		{ name: 'Treinamento', icon: 'fa fa-calendar bg-red' }
	]

	const prioridades = [
		{ name: 'Urgente' },
		{ name: 'Alta' },
		{ name: 'Normal' }
	]

	const statusTarefas = [
		{ name: 'Pendente' },
		{ name: 'Finalizada' },
		{ name: 'Cancelada' },
		{ name: 'Suspensa' }
	]

	const equipes = [
		{ name: 'Portal do Lote' },
		{ name: 'Interna' }
	]

	const canais = [
		{ name: 'Administração de Carteira' },
		{ name: 'Aprovação de Loteamento' },
		{ name: 'Buscamos o que você precisa' },
		{ name: 'Cadastro Manual' },
		{ name: 'Chat On-line' },
		{ name: 'Carteira do Corretor' },
		{ name: 'Compra de Carteira' },
		{ name: 'Compramos seu Lote/Área' },
		{ name: 'Email' },
		{ name: 'Empreendimento' },
		{ name: 'Fale Conosco' },
		{ name: 'Futuros Lançamentos' },
		{ name: 'Investidores no Exterior' },
		{ name: 'Leads do Facebook' },
		{ name: 'Ligamos para você' },
		{ name: 'Newslleter' },
		{ name: 'Securitização de Carteira' },
		{ name: 'Stand de Vendas' },
		{ name: 'Telefone' }
	]

	const origens = [
		{ name: 'Site' },
		{ name: 'CMS' },
		{ name: 'WhatsApp' },
		{ name: 'Facebook' },
		{ name: 'OLX' },
		{ name: 'Viva Real' }
	]

	const midias = [
		{ name: 'Site' },
		{ name: 'Google' },
		{ name: 'Facebook' },
		{ name: 'Youtube' },
		{ name: 'Placa/Outdoor' },
		{ name: 'Indicação' },
		{ name: 'Jornal' },
		{ name: 'TV' },
		{ name: 'Internet' },
		{ name: 'Faixa' },
		{ name: 'Rádio' },
		{ name: 'Planfleto' },
		{ name: 'Plantão' }
	]

	const etapas = [
		{ name: 'Prospeção' },
		{ name: 'Negociação' },
		{ name: 'Visita' },
		{ name: 'Proposta' },
		{ name: 'Venda' },
		{ name: 'Cancelada' }
	]

	const regioes = [
		{ name: 'Norte' },
		{ name: 'Nordeste' },
		{ name: 'Noroeste' },
		{ name: 'Sul' },
		{ name: 'Sudeste' },
		{ name: 'Sudoeste' },
		{ name: 'Leste' },
		{ name: 'Oeste' }
	]

	const estados = [
		{ estado: 'Acre', sigla: 'AC' },
		{ estado: 'Alagoas', sigla: 'AL' },
		{ estado: 'Amapá', sigla: 'AP' },
		{ estado: 'Amazonas', sigla: 'AM' },
		{ estado: 'Bahia', sigla: 'BA' },
		{ estado: 'Ceará', sigla: 'CE' },
		{ estado: 'Distrito Federal', sigla: 'DF' },
		{ estado: 'Espírito Santo', sigla: 'ES' },
		{ estado: 'Goiás', sigla: 'GO' },
		{ estado: 'Maranhão', sigla: 'MA' },
		{ estado: 'Mato Grosso', sigla: 'MT' },
		{ estado: 'Mato Grosso do Sul', sigla: 'MS' },
		{ estado: 'Minas Gerais', sigla: 'MG' },
		{ estado: 'Pará', sigla: 'PA' },
		{ estado: 'Paraíba', sigla: 'PB' },
		{ estado: 'Paraná', sigla: 'PR' },
		{ estado: 'Pernambuco', sigla: 'PE' },
		{ estado: 'Piauí', sigla: 'PI' },
		{ estado: 'Rio de Janeiro', sigla: 'RJ' },
		{ estado: 'Rio Grande do Norte', sigla: 'RN' },
		{ estado: 'Rio Grande do Sul', sigla: 'RS' },
		{ estado: 'Rondônia', sigla: 'RO' },
		{ estado: 'Roraima', sigla: 'RR' },
		{ estado: 'Santa Catarina', sigla: 'SC' },
		{ estado: 'São Paulo', sigla: 'SP' },
		{ estado: 'Sergipe', sigla: 'SE' },
		{ estado: 'Tocantins', sigla: 'TO' }
	]

	const perfilUsuarios = [
		{ name: 'Admin' },
		{ name: 'Atendente' },
		{ name: 'Corretor' },
		{ name: 'Gestor' }
	]

	const finalidades = [
		{ name: 'Investimento' },
		{ name: 'Lazer' },
		{ name: 'Moradia' },
		{ name: 'Aluguel' },
		{ name: 'Uso da Família' }
	]

	function produtos() {
		return $http.get(`${consts.apiUrl}/produtos?select=_id%20produto`);
	}

	return {
		all: function () {
			return users;
		},

		primeiro: function () {
			return users[0];
		},

		getPerfis: function () {
			return perfis;
		},

		getCores: function () {
			return cores;
		},

		getLinhaCredito: () => {
			return linhaCredito;
		},

		getCodigoFundoGarantidor: () => {
			return codigoFundoGarantidor;
		},

		getCodigoTipoPessoa: () => {
			return codigoTipoPessoa;
		},

		getCodigoTipoPublicoAlvo: () => {
			return codigoTipoPublicoAlvo;
		},

		getCodigoTipoModalidadeCredito: () => {
			return codigoTipoModalidadeCredito;
		},

		getCodigoTipoFinalidadeCredito: () => {
			return codigoTipoFinalidadeCredito;
		},

		getCodigoTipoFonteRecurso: () => {
			return codigoTipoFonteRecurso;
		},

		getCodigoTipoProgramaCredito: () => {
			return codigoTipoProgramaCredito;
		},

		getCodigoTipoCronogramaAmortizacao: () => {
			return codigoTipoCronogramaAmortizacao;
		},

		getCodigoTipoCondicaoEspecial: () => {
			return codigoTipoCondicaoEspecial;
		},

		getCodigoTipoFormalizacao: () => {
			return codigoTipoFormalizacao;
		},

		getAtendimentos: function () {
			return atendimentos;
		},

		getTarefas: function () {
			return tarefas;
		},

		getPrioridades: function () {
			return prioridades;
		},

		getStatusTarefas: function () {
			return statusTarefas;
		},

		getEquipes: function () {
			return equipes;
		},

		getCanais: function () {
			return canais;
		},

		getMidias: function () {
			return midias;
		},

		getEtapas: function () {
			return etapas;
		},

		getEstados: function () {
			return estados;
		},

		getRegioes: function () {
			return regioes;
		},

		getOrigens: function () {
			return origens;
		},

		getPerfilUsuarios: function () {
			return perfilUsuarios;
		},

		getCategoriaProduto: function() {
			return categoriaProduto;
		},

		getProdutos: function () {
			return $http.get(`${consts.apiUrl}/produtos?select=_id%20produto`).catch(function (resp) {
				msgs.addError(resp.data)
			});
		},

		getProdutosAll: function () {
			return $http.get(`${consts.apiUrl}/produtos`).catch(function (resp) {
				msgs.addError(resp.data)
			});
		},

		getClientes: function () {
			const id = auth.getUser()._id
			var url = `${consts.apiUrl}/crm?usuario=${id}&select=_id%20cliente`

			if (auth.getUser().perfilUsuario == 'Gestor') {
				url = `${consts.apiUrl}/crm?select=_id%20cliente`
			}

			return $http.get(url).catch(function (resp) {
				msgs.addError(resp.data)
			});
		},

		getCrm: function (id) {
			if (id == undefined) {
				return [];
			} else {
				var url = `${consts.apiUrl}/crm?cliente=${id}`

				return $http.get(url).catch(function (resp) {
					msgs.addError(resp.data)
				});
			}
		},

		//descobrir como puxa apenas os dados dos sub-documentos
		getContatos: function (id) {
			if (id == undefined) {
				return null;
			} else {
				var url = `${consts.apiUrl}/crm?cliente=${id}&crm[0].contatos`

				return $http.get(url).catch(function (resp) {
					msgs.addError(resp.data)
				});
			}
		},

		//descobrir como puxa apenas os dados dos sub-documentos
		getReferencias: function (id) {
			if (id == undefined) {
				return null;
			} else {
				var url = `${consts.apiUrl}/crm?cliente=${id}&select=crm.referencias`

				return $http.get(url).catch(function (resp) {
					msgs.addError(resp.data)
				});
			}
		},

		getEmails: function (canal, produto) {
			const id = auth.getUser()._id
			var url = `${consts.apiUrl}/crm?select=cliente%20email%20sexo%20canal%20produto&usuario=${id}`

			if (auth.getUser().perfilUsuario == 'Gestor') {
				url = `${consts.apiUrl}/crm?select=cliente%20email%20sexo%20canal%20produto`
			}

			if (canal && produto) {
				url = url + `&canal=${canal}&produto=${produto}`
			} else if (canal) {
				url = url + `&canal=${canal}`
			} else if (produto) {
				url = url + `&produto=${produto}`
			}

			console.log('url: ' + url)

			return $http.get(url).catch(function (resp) {
				msgs.addError(resp.data)
			});

		},

		getUsuario: function (Id) {
			return $http.get(`${consts.apiUrl}/usuarios/`, { params: { id: Id } }).catch(function (resp) {
				msgs.addError(resp.data)
			});
		},

		getUsuarios: function () {
			const id = auth.getUser()._id
			var url = `${consts.apiUrl}/usuarios?_id=${id}&select=_id%20nome`

			if (auth.getUser().perfilUsuario == 'Gestor') {
				url = `${consts.apiUrl}/usuarios?ativo=true&select=_id%20nome`
			}
			return $http.get(url).catch(function (resp) {
				msgs.addError(resp.data)
			});
		},

		getUsuariosAll: function () {
			return $http.get(`${consts.apiUrl}/usuarios`).catch(function (resp) {
				msgs.addError(resp.data)
			});
		},

		getEmpresasAll: function () {
			return $http.get(`${consts.apiUrl}/empresas`).catch(function (resp) {
				msgs.addError(resp.data)
			});
		},

		getFinalidades: function () {
			return finalidades;
		},

		getUserLogado: function () {
			return auth.getUser()._id;
		}


	}//fim return espondo os métodos
}