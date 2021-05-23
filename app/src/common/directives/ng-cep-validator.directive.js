projeto.directive('ngCepValidator', function (CepService, $rootScope, msgs) {
    return {
        restrict: 'A',
        require: 'ngModel',
        link: function ($scope, $element, $attrs, ngModel) {
            $scope.$watch($attrs.ngModel, function (value) {
                if (value) {
                    if (value.match(/^[0-9]{5}-[0-9]{3}$/)) {
                        msgs.addInfo('Relizando consulta do CEP...')
                        CepService.get(value).then(function (response) {
                            if (response) {
                                $rootScope.$broadcast('cep', response.data);
                            }
                        });
                        ngModel.$setValidity($attrs.ngModel, true);
                    }
                    else {
                        ngModel.$setValidity($attrs.ngModel, false);
                    }
                }
                else {
                    ngModel.$setValidity($attrs.ngModel, false);
                }
            });
        }
    }
});
