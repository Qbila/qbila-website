(function(){

  geoInterface.controller('Form', ['$scope', '$http', '$timeout', function($scope, $http, $timeout){
    $scope.user = {}

    $scope.disableSubmitButton = function(formName){
      return $scope[formName].$invalid;
    };

    $scope.checkRegisteredEmail = function(){

    };

    $scope.getActiveForm = function(){
      switch($scope.otpMode){
        case 'request':
          return 'sendOTP'
          break;
        case 'confirm':
          return 'confirmOtp'
      }
    }

    // two modes: request, confirm
    $scope.otpMode = 'request';
    $scope.formAlerts = {
      sendOTP : {},
      confirmOTP : {},
    };

    $scope.sendConfirmOTP = function(){
      if($scope.otpMode == 'request') {
        $scope.requestOTP()
      }

      if($scope.otpMode == 'confirm') {
        console.log()
        $scope.verifyOTP();
      }
    };



    $scope.requestOTP = function(){
      var toSend = {
        countryCode: '+91',
        mobileNumber: _.trim($scope.user.mobileNumber)
      }

      $http.post("/login/otp/request", toSend)
           .then(
             function(response){
               if(response.data.statusCode == 200){
                 $scope.formAlerts[$scope.getActiveForm()] = {
                   message: response.data.message,
                   type: 'success'
                 };
                 $timeout(
                   function(){
                     $scope.otpMode = 'confirm';
                   },
                   1500
                 )
               }
             },
             function(response){
               $scope.formAlerts[$scope.getActiveForm()] = {
                 message: response.data.message,
                 type: 'danger'
               };
             }
           );
    };


    $scope.secretizeMobileNumber = function(){
      if(_.isNil($scope.user.mobileNumber)) return;

      var str = $scope.user.mobileNumber;
      str = str.toString();
      str = str.substring(6, 10);
      str = '******' + str;
      return str;
    }


    $scope.verifyOTP = function(){
      var toSend = {
        countryCode: '+91',
        mobileNumber: _.trim($scope.user.mobileNumber),
        otp: _.trim($scope.user.otp)
      };

      $http.post("/login/otp/confirm", toSend)
           .then(
             function(response){
               if(response.data.statusCode == 200){
                 // set temp login or permanent login and then
                 // redirect the user
                 $scope.formAlerts[$scope.getActiveForm()] = {
                   message: response.data.message,
                   type: 'success'
                 };
               }
             },
             function(response){
               // show message of invalid otp. show resend button. onlcick of resend
               $scope.formAlerts[$scope.getActiveForm()] = {
                 message: response.data.message,
                 type: 'danger'
               }
             }
           );
    };



    // $scope.postAuthorized = function(method, url, data, successCB, failedCB){
    //   if( _.isNil(localStorage.getItem('auth')) ) {
    //     // logout and redirect
    //     return;
    //   }
    //
    //   var auth = JSON.parse(localStorage.getItem('auth'));
    //   if( (auth.validTill - moment().unix()) < 0 ) {
    //     // logout an direct
    //     return;
    //   }
    //
    //   $http({
    //     method: method,
    //     url: url,
    //     data: data,
    //     headers: {
    //       'authorization': auth.key
    //     }
    //   })
    // }
    //


    $scope.submitLoginForm = function(){
      var toSend = {
        countryCode: '+91',
        mobileNumber: _.trim($scope.user.mobileNumber),
        password: _.trim($scope.user.password)
      };

      $http.post("/login", toSend)
           .then(
             function(response, status, headers){
               // login the user. save auth code to local storage
               // for next hit to the authorized pages, develop a function that takes in local storage value and makes the hit.
               document.cookie = "dva=" + response.headers('dva') + "; ";
               window.location = '/organisation';
             },
             function(response){
               // TODO : login error, share with the user.
               // Including too long to respond or no internet.
               console.log(response);
             }
           );
    };



    $scope.userLoggedIn = function(){
      // check if email verified -- send verification email
      // check if mobile verified -- send verification code
      // check if account created successfully -- tell the user, redirect to verification page.
    };



    $scope.submitSignupForm = function(){

      var toSend = {
        name: _.trim($scope.user.fullName),
        countryCode: '+91',
        email: _.trim($scope.user.email),
        mobileNumber: _.trim($scope.user.mobileNumber),
        password: _.trim($scope.user.newPassword)
      };

      $http.post("/signup", toSend)
           .then(
             function(response){
               console.log(response);
             },
             function(response){
               console.log(response);
             }
           )

    };



    $scope.newPasswordMatchesConfirmation = function(){
      var valid = ( !_.isUndefined($scope.user) && !_.isUndefined($scope.user.newPassword) && !_.isUndefined($scope.user.newPasswordConfirmation) && $scope.user.newPasswordConfirmation == $scope.user.newPassword )
      return valid;
    };



    $scope.checkPasswordStrength = function(){
      $http.post("/passStrength", $scope.user.password)
           .then(
             function(response){
               console.log(response);
             },
             function(response){
               console.log(response);
             }
           )
    };

  }]);

  geoInterface.directive('qbValidate', ['qbValidations', function(qbValidations){
    return {
      // restrict to an attribute type
      restrict: 'A',

      // element must have ng-model attribute
      require: 'ngModel',

      // scope = the parent scope, elem = the element the directive is on, attr = a dictionary of attributes on the element, ctrl = the controller for ngModel.
      link: function(scope, elem, attr, ctrl) {

        // get the validate type attribute
        var toValidate = attr.qbValidateType;

        // add a parser that will process each time the value is parsed into the model when the user updates it.
        ctrl.$parsers.unshift(function(value) {

          // remove error specifying classes from d-errorsWrapper
          angular.element(elem).parents('.d-errorsWrapper').attr("class", "").addClass("d-errorsWrapper");

          // test and set the validity after update.
          var validationResults = qbValidations[toValidate](value, scope, ctrl);
          var valid = true;

          // check on multiple criterion of validations returned as true or false. the key is taken as class name that refers to the error and message.
          _.each(validationResults, function(val, key){
            if(!val){
              angular.element(elem).parents('.d-errorsWrapper').addClass(key);
            }

            valid &= val;
          });

          ctrl.$setValidity('qbValidate', valid);

          // if it's valid, return the value to the model, otherwise return undefined.
          return valid ? value : undefined;
        });

        // add a formatter that will process each time the value is updated on the DOM element.
        ctrl.$formatters.unshift(function(value) {
          // validate.
          var validationResults = qbValidations[toValidate](value, scope, ctrl);
          var valid = true;
          _.each(validationResults, function(val, key){
            if(!val && !angular.element(elem).hasClass('ng-pristine')){
              angular.element(elem).parents('.d-errorsWrapper').addClass(key);
            }
            valid &= val;
          });

          ctrl.$setValidity('qbValidate', valid);

          // return the value or nothing will be written to the DOM.
          return value;
        });
      }
    }
  }]);

}());
