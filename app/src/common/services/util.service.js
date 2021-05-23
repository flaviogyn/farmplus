projeto.service('utilService', function ($http, consts) {
    this.getClientes = function (Id) {
        return $http.get("/crm/", { params: { id: Id } });
    };

    this.getUsuarios = function (Id) {
        return $http.get("/usuarios/", { params: { id: Id } });
    };

});