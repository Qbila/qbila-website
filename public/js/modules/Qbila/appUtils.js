Qbila.utils.displayError = function(){
  return true;
};

Qbila.utils.validateName = function(name){
  if( validator.isNull( name ) ) {
    event.target.value = "";
    Qbila.utils.displayError("What is your name?", event.target.id, 'RED');
    return false;
  }

  var returnVal = true;

  _.each(name.split(' '), function(value, key, list){
    returnVal &= validator.isAlpha(value);
  });

  return returnVal;
};

Qbila.utils.validateEmail = function(email){
  return validator.isEmail(email);
};

/*
Qbila.utils.passwordStrengthScore = function(password){
  return ( zxcvbn(password).score );
};
*/

Qbila.utils.handleInvalidPassword = function(passwordElement){
  $(passwordElement)
    .parents('.a-passwordElement')
    .removeClass('isaok has-error has-success a-passwordStrength-0 a-passwordStrength-1 a-passwordStrength-2 a-passwordStrength-3 a-passwordStrength-4 invalid');

  if (passwordElement.value.length < 6){
    $(passwordElement).parents('.a-passwordElement').addClass('invalid has-error');
    return false;
  }

  Meteor.call('passwordStrengthScore', passwordElement.value, function(error, result){
    var score = result;

    $(passwordElement).parents('.a-passwordElement').addClass('a-passwordStrength-'+score);

    if (score == 0){
      $(passwordElement).parents('.a-passwordElement').removeClass('isaok');
      $(passwordElement).parents('.a-passwordElement').addClass('has-error');
      return false;
    }
  });

  $(passwordElement).parents('.a-passwordElement').addClass('isaok');
  return true;
};

Qbila.utils.handleInvalidConfirmPassword = function(confirmPasswordElement, passwordElement){
  var confirmResetPassword = confirmPasswordElement.value;
  var resetPassword = passwordElement.value;

  $(confirmPasswordElement)
    .parents('.a-passwordElement')
    .removeClass('isaok has-error has-success noMatch invalid');


  if (resetPassword === confirmResetPassword) {
    $(confirmPasswordElement).parents('.a-passwordElement').addClass('isaok');
    return true;
  }
  $(confirmPasswordElement).parents('.a-passwordElement').addClass('noMatch has-error');
  return false;
};

Qbila.utils.handleInvalidName = function(nameElement) {
  var name = Qbila.utils.validateName(nameElement.value);

  $(nameElement).parents('.a-nameElement').removeClass('invalid has-error isaok');

  if(!name){
    $(nameElement).parents('.a-nameElement').addClass('invalid has-error');
    return false;
  }

  $(nameElement).parents('.a-nameElement').addClass('isaok');
  return true;
};

Qbila.utils.handleInvalidEmail = function(emailElement){
  var validEmail = Qbila.utils.validateEmail(emailElement.value);

  $(emailElement).parents('.a-emailElement').removeClass('notTakenEmail invalid has-error takenEmail isaok');

  if( validEmail ){

    Meteor.call('emailRegisteredOrNot', emailElement.value, function(error, result){
      if (result) {
        $(emailElement).parents('.a-emailElement').removeClass('isaok');
        $(emailElement).parents('.a-emailElement').addClass('takenEmail has-error');
      }
    });

    $(emailElement).parents('.a-emailElement').addClass('isaok');
    return true;

  } else {
    $(emailElement).parents('.a-emailElement').addClass('invalid has-error');
    return false;
  }
};

// renders error messages in modal
Qbila.utils.modalMessages = function(message, type, timeout){
  // append modal code the dom
  if( _.isEmpty( document.getElementById( 'modalMessages' ) ) ) {
    $("body")
      .append('<div class="modal fade a-modalMessages" id="modalMessages" tabindex="-1" role="dialog" aria-labelledby="modalMessagesLabel">'+
                '<div class="modal-dialog">'+
                  '<div class="modal-content">'+
                  '</div>'+
                '</div>'+
              '</div>');
  }

  // change the content
  $("#modalMessages .modal-content").html("<div class='alert alert-" + type + "'>" + message + "</div>");

  $('#modalMessages').modal();

  if (!!timeout){
    setTimeout(function(){
      $('#modalMessages').modal('hide');
    }, timeout);
  }
  // render
};

Qbila.utils.goHome = function(){
  // if registered with all essential data done, go home
  // else, go userStatus
  FlowRouter.go('userStatus');
};

Qbila.utils.logOutUser = function(e) {
  e.stopPropagation();

  Meteor.logout(function(err){
    if (err) {
      throw new Meteor.Error("Logout failed");
    }
  });
};
