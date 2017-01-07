(function(){

  geoInterface.factory('qbValidations', ['$http', function($http) {
    var validate = {}

    // the names of variables are used in opposite way. In case of error, these will be used in the html as class names to depict error.
    validate.name = function(name, scope, ctrl){
      var resObject = {}

      if( _.isUndefined(name) || _.isEmpty(name) ) {
        resObject.blank = false;
      } else {
        var validNameBool = true;
        name = name.replace(/\s+/g, ' ').trim();

        _.each(name.split(' '), function(value, key, list){
          validNameBool &= validator.isAlpha(value);
        });

        resObject.notAlpha = validNameBool;
      }

      return resObject;
    };



    validate.mobileNumber = function(mobileNumber, scope, ctrl) {
      var resObject = {};

      if(_.isUndefined(mobileNumber) || _.isEmpty(mobileNumber)){
        resObject.blank = false;
        return resObject;
      }

      resObject.invalid = validator.isMobilePhone(mobileNumber, 'en-IN');

      return resObject;
    }



    // the names of variables are used in opposite way. like for valid email, invalid is true. In case of error, these will be used in the html as class names to depict error.
    validate.email = function(email, scope, ctrl){
      var resObject = {};

      if( _.isUndefined(email) || _.isEmpty(email) ) {
        resObject.blank = false;
        return resObject;
      }

      resObject.invalid = validator.isEmail(email);

      // if the email is valid, check if the email is not already registered.
      if(resObject.invalid){
        // $http.post("/emailRegistered", {email: email})
        //      .then(
        //        function(response){
        //          console.log(response);
        //          resObject.registered = !response.data
        //          console.log(resObject)
        //          return resObject;
        //        },
        //        function(response){
        //          console.log(response);
        //        }
        //      )
      } else {
        return resObject;
      }
    };



    validate.password = function(password, scope, ctrl){
      var regex = new RegExp("^(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*\)\(\-_\+\=])(?=.{8,})");
      return {invalid: regex.test(password)};
    }



    // the name needs to be 'newPassword' and 'newPasswordConfirmation'
    validate.confirmPassword = function(confirmPassword, scope, ctrl){
      var valid = ( !_.isUndefined(scope.user) && !_.isUndefined(scope.user.newPassword) && confirmPassword == scope.user.newPassword )
      return {passwordsMatch: valid}
    }

    // TODO : implement the password validation with password strength meter.
    // validate.password = function(password){
    //
    //   if (password.length < 6){
    //     // $(passwordElement).parents('.a-passwordElement').addClass('invalid has-error');
    //     return false;
    //   }
    //
    //   // Meteor.call('passwordStrengthScore', password, function(error, result){
    //     // var score = result;
    //     var score = 4;
    //
    //     // $(passwordElement).parents('.a-passwordElement').addClass('a-passwordStrength-'+score);
    //
    //     if (score == 0){
    //       // $(passwordElement).parents('.a-passwordElement').removeClass('isaok');
    //       // $(passwordElement).parents('.a-passwordElement').addClass('has-error');
    //       return false;
    //     }
    //   // });
    //
    // }

    return validate;
  }]);

}());
