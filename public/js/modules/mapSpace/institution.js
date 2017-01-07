(function(){

  var Institution = function($scope, $http){
    $scope.active = 0;
    $scope.activeMap = window.activeMap;

    $(document).on('newMapAdded', function(){
      $scope.fetchInstitution(activeMap.context.type, activeMap.context.id, 'administration');
    });

    $scope.fetchInstitution = function(context_type, context_id, profileType){

      $http.get('/institution/' + context_type + '/' + context_id + '/' + profileType)
           .then(function(response){
             }
           );
    }
  }

  geoInterface.controller("Institution", ["$scope", "$http" , Institution]);

}());
