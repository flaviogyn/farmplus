projeto.constant('consts', {
  appName: 'FarmPlus',
  version: '1.0',
  owner: 'Hackton Zenvia',
  author: 'Flávio Lourenço da Silva',
  year: '2021',
  site: '',
  urlBase: '',
  apiUrl: 'http://localhost:21102/api/v1',
  oapiUrl: 'http://localhost:21102/api/v1',
  // apiUrl: 'http://192.168.99.226:21102/api/v1',
  // oapiUrl: 'http://192.168.99.226:21102/api/v1',
  userKey: '_primeira_app_user'
})

projeto.run(['$rootScope', 'consts', function ($rootScope, consts) {
  $rootScope.consts = consts
}])

