(function(){

  var Navigation = function($scope, $http){
    $scope.activeMap;
    $scope.breadCrumb = {};

    angular.element(document).ready(function(){
      if( !_.isNil(DG) ) {
        $scope.activeMap = DG.activeMap;
      }
      else {

      }
    });

    angular.element(document).on('newMapAdded', function(){
      $scope.activeMap = DG.activeMap;
      $scope.getRelatedContextsInfo();
    });

    $scope.buildBreadCrumb = function(contextDetails){
      $scope.breadCrumb = {};
      var pathFollowedIds = [];
      var pathFollowed = _.values($scope.activeMap.pathFollowed);
      pathFollowed.pop();

      _.each(pathFollowed, function(val, key){
        $scope.breadCrumb[key] = contextDetails[val];
      });
    };


    $scope.logout = function(){
      $http.get(
        '/logout'
      ).then(
        function(response){
          location.href="/login"
        }
      )
    }


    $scope.getRelatedContextsInfo = function(){
      var pathFollowedIds = [];
      var pathFollowed = _.values($scope.activeMap.pathFollowed);
      pathFollowed.pop();

      _.each(pathFollowed, function(val, key){
        if(!_.isNil($scope.activeMap.context[val])) {
          pathFollowedIds.push($scope.activeMap.context[val]);
        }
      });

      var pathFollowedIdsString = pathFollowedIds.join(', ');

      $http.post(
        '/relatedContexts',
        {
          context_id: $scope.activeMap.context.id,
          context_type: $scope.activeMap.context.type,
          query_contexts: pathFollowedIdsString
        }
      ).then(
        function(response){
          $scope.buildBreadCrumb(response.data);
        }
      );
    };
    
  };

  geoInterface.controller("Navigation", ["$scope", "$http", Navigation]);

}());
