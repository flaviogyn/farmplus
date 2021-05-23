projeto.component('comboBox', {
  bindings: {
      id: '@',
      label: '@',
      grid: '@',
      model: '=',
      lista: '=',
      readonly: '<'
  },
  controller: [
    'gridSystem',
    function(gridSystem) {
      //this.$onInit = () => this.gridClasses = gridSystem.toCssClasses(this.grid)

      this.$onInit = function() {
        this.gridClasses = gridSystem.toCssClasses(this.grid)
      }
    }
  ],
  template: `
    <div class="{{ $ctrl.gridClasses }}">
      <div class="form-group">
        <label id="{{ $ctrl.id }}">{{ $ctrl.label }}</label>
        <select ng-model="$ctrl.model" class="form-control" ng-readonly="$ctrl.readonly">
            <option value=""> Selecione </option>
            <option ng-repeat="item in $ctrl.lista" value="{{item.name}}">{{item.name}}</option>
        </select>
      </div>    
    </div>
  `
});
