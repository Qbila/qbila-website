(function(){

  var MACsys = angular.module("MACsys", []);

  var loginController = function(oauth, currentUser, alerting){
    var model = this;

    model.mobile = "";
    model.password = "";
    model.user = currentUser.profile;

    model.login = function(form){
      if(form.$valid){
        oauth.login(model.mobile, model.password)
             .catch(alerting.errorHandling('Login Failed'));

        model.password = model.mobile = "";
        form.$setUntouched();
      }
    }
  };

  MACsys.controller('loginController', loginController);

}());
