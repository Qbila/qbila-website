var geoInterface = angular.module("geoInterface", ['rzModule', 'ui.bootstrap']);

geoInterface.config(['$interpolateProvider', function($interpolateProvider) {
  $interpolateProvider.startSymbol('<%');
  $interpolateProvider.endSymbol('%>');
}]);

geoInterface.controller("Common", ['$scope', '$http', function($scope, $http){

  $scope.utils = DG.utils;

  // console.log($scope.utils);

}]);
