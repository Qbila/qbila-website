(function(){

  var Development = function($scope, $http){
    $scope.activeMap = window.activeMap;
    $scope.priceSlider = 150;

    $(document).on('newMapAdded', function(){
      $scope.fetchPlaceProfile(activeMap.context.type, activeMap.context.id, 'administration');
    });

    $scope.fetchPlaceProfile = function(context_type, context_id, profileType){

      // $http.get('/placeProfile/' + context_type + '/' + context_id + '/' + profileType)
      //      .then(function(response){
      //
      //        }
      //      );

    }
  }

  geoInterface.controller("Development", ["$scope", "$http" , Development]);

}());
