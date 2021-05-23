projeto.config([
    '$stateProvider',
    '$urlRouterProvider',
    '$locationProvider',
    '$httpProvider',
    '$qProvider',
    function ($stateProvider, $urlRouterProvider, $locationProvider, $httpProvider, $qProvider) {

        $qProvider.errorOnUnhandledRejections(false);

        $stateProvider
            .state('dashboard', {
                url: "/dashboard",
                templateUrl: "src/dashboard/dashboard.html",
                controller: 'dashCtrl'
            })
            .state('produto', {
                url: '/produto?page',
                templateUrl: 'src/produto/produto.html',
                controller: 'crmCtrl'
            })
            .state('parceiro', {
                url: '/parceiro?page',
                templateUrl: 'src/parceiro/parceiro.html',
                controller: 'crmCtrl'
            })

        $urlRouterProvider.otherwise('/dashboard')
    }
])