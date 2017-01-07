( function (module) {

  var oauth = function(){

    var login = function(mobile, password){

      var data = {
        mobile : mobile,
        password : password,
        grant_type : "password"
      }

      return $http.post('/login', data);

    };

    return {
      login : login
    }

  }

  module.factory("oauth", oauth);

} ( angular.module('common') ) );
