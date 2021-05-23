projeto.component('field', {
  bindings: {
    id: '@',
    label: '@',
    type: '@',
    grid: '@',
    model: '=',
    placeholder: '@',
    mask: '@',
    readonly: '<',
    param: '=',
  },
  controller: [
    '$scope',
    'msgs',
    'gridSystem',
    'LocalizacaoService',
    function($scope, msgs, gridSystem, LocalizacaoService) {
      this.$onInit = () => this.gridClasses = gridSystem.toCssClasses(this.grid)

      this.DateTime = function(arg){
        if(arg == "Data"){
          this.model = new Date()
        } else {
          var hora = new Date()  
          this.model = hora.format("isoTime")
        }
      }

      this.getLocation = function(end) {
        //console.log('comp end: ' + JSON.stringify(endereco))
        //console.log('comp data: ' + JSON.stringify(resp.data))
        //console.log('comp location: ' + JSON.stringify($scope.location))
        //console.log('comp location: ' + $scope.location[0].geometry.location.lat + ', ' + $scope.location[0].geometry.location.lng)
        
        msgs.addInfo('Relizando consulta das coordenadas...')
        var endereco = end.logradouro + ',' + end.complemento + ',' + end.bairro + ',' + end.cidade + ',' + end.estado + ',' + end.cep
        LocalizacaoService.get(endereco).then(function(resp) {
          $scope.location = resp.data.results
          if($scope.location.length > 0 ){
            this.model = $scope.location[0].geometry.location.lat + ', ' + $scope.location[0].geometry.location.lng
          } else {
            msgs.addWarning('Coordenadas não foram localizadas verifique o endereço e refaça a consulta.')
          }
        })
      }


    } //end - function
  ],
  template: `
   <div class="{{ $ctrl.gridClasses }}">
     <div class="form-group">
       <label for="{{ $ctrl.id }}">{{ $ctrl.label }}</label>
            <div ng-if="$ctrl.mask == null ? true : false">
              <input ng-model="$ctrl.model" id="{{ $ctrl.id }}" class="form-control"
                     type="{{ $ctrl.type }}" placeholder="{{ $ctrl.placeholder }}"
                     ng-readonly="$ctrl.readonly" />
            </div>

            <div ng-if="$ctrl.mask == 'cep' ? true : false">
              <input ng-model="$ctrl.model" id="{{ $ctrl.id }}" class="form-control"
                     type="{{ $ctrl.type }}" placeholder="{{ $ctrl.placeholder }}"
                     ng-readonly="$ctrl.readonly" ng-cep-validator ui-br-cep-mask />
            </div>
            
            <div ng-if="$ctrl.mask == 'cpf' ? true : false">
              <input ng-model="$ctrl.model" id="{{ $ctrl.id }}" class="form-control"
                     type="{{ $ctrl.type }}" placeholder="{{ $ctrl.placeholder }}"
                     ng-readonly="$ctrl.readonly" ui-br-cpf-mask />
            </div>

            <div ng-if="$ctrl.mask == 'cpfcnpj' ? true : false">
              <input ng-model="$ctrl.model" id="{{ $ctrl.id }}" class="form-control"
                     type="{{ $ctrl.type }}" placeholder="{{ $ctrl.placeholder }}"
                     ng-readonly="$ctrl.readonly" ui-br-cpfcnpj-mask />
            </div>

            <div ng-if="$ctrl.mask == 'telefone' ? true : false">
              <input ng-model="$ctrl.model" id="{{ $ctrl.id }}" class="form-control"
                     type="{{ $ctrl.type }}" placeholder="{{ $ctrl.placeholder }}"
                     ng-readonly="$ctrl.readonly" ui-br-phone-number />
            </div>

            <div ng-if="$ctrl.mask == 'numero' ? true : false">
              <input ng-model="$ctrl.model" id="{{ $ctrl.id }}" class="form-control"
                     type="{{ $ctrl.type }}" placeholder="{{ $ctrl.placeholder }}"
                     ng-readonly="$ctrl.readonly" ui-number-mask="2" />
            </div>

            <div ng-if="$ctrl.mask == 'inteiro' ? true : false">
              <input ng-model="$ctrl.model" id="{{ $ctrl.id }}" class="form-control"
                     type="{{ $ctrl.type }}" placeholder="{{ $ctrl.placeholder }}"
                     ng-readonly="$ctrl.readonly" ui-number-mask="0" />
            </div>

            <div ng-if="$ctrl.mask == 'perc' ? true : false">
              <input ng-model="$ctrl.model" id="{{ $ctrl.id }}" class="form-control"
                     type="{{ $ctrl.type }}" placeholder="{{ $ctrl.placeholder }}"
                     ng-readonly="$ctrl.readonly" ui-percentage-mask="4" />
            </div>

            <div ng-if="$ctrl.mask == 'data' ? true : false">
              <div class="input-group">
                <div class="input-group-addon">
                  <i class="fa fa-calendar" ng-click="$ctrl.DateTime('Data');"></i>
                </div>
                <input ng-model="$ctrl.model" id="{{ $ctrl.id }}" class="form-control pull-right"
                     type="{{ $ctrl.type }}" placeholder="{{ $ctrl.placeholder }}"
                     ng-readonly="$ctrl.readonly" ui-date-mask="DD/MM/YYYY" />
              </div>
            </div>

            <div ng-if="$ctrl.mask == 'time' ? true : false">
              <div class="input-group">
                <div class="input-group-addon">
                  <i class="fa fa-clock-o" ng-click="$ctrl.DateTime('Time');"></i>
                </div>
                <input ng-model="$ctrl.model" id="{{ $ctrl.id }}" class="form-control pull-right"
                     type="{{ $ctrl.type }}" placeholder="{{ $ctrl.placeholder }}"
                     ng-readonly="$ctrl.readonly" ui-time-mask />
              </div>
            </div>

            <div ng-if="$ctrl.mask == 'data2' ? true : false">
              <input ng-model="$ctrl.model" id="{{ $ctrl.id }}" class="form-control"
                     type="{{ $ctrl.type }}" placeholder="{{ $ctrl.placeholder }}"
                     ng-readonly="$ctrl.readonly" ui-date-mask="DD-MM-YYYY" />
            </div>

            <div ng-if="$ctrl.mask == 'time2' ? true : false">
              <input ng-model="$ctrl.model" id="{{ $ctrl.id }}" class="form-control"
                     type="{{ $ctrl.type }}" placeholder="{{ $ctrl.placeholder }}"
                     ng-readonly="$ctrl.readonly" ui-time-mask="short" />
            </div>

            <div ng-if="$ctrl.mask == 'location' ? true : false">
              <div class="input-group">
                <div class="input-group-addon">
                  <i class="fa fa-search" ng-click="$ctrl.getLocation($ctrl.param)"></i>
                </div>
                <input ng-model="$ctrl.model" id="{{ $ctrl.id }}" class="form-control pull-right"
                       type="{{ $ctrl.type }}" placeholder="{{ $ctrl.placeholder }}" ng-readonly="$ctrl.readonly" />
              </div>
            </div>


     </div>
   </div>
  `
});


/*
  REFATORAR COM SWITCH

  template: `
   <div class="{{ $ctrl.gridClasses }}">
     <div class="form-group">
       <label for="{{ $ctrl.id }}">{{ $ctrl.label }}</label>
       <input ng-model="$ctrl.model" id="{{ $ctrl.id }}" class="form-control"
          type="{{ $ctrl.type }}" placeholder="{{ $ctrl.placeholder }}"
          ng-readonly="$ctrl.readonly" {{$ctrl.mask}}="" />
     </div>
   </div>
  `
*/