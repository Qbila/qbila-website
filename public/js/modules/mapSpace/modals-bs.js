(function(){

  var Modal = function ($scope, $uibModal, $log) {

    $scope.animationsEnabled = true;

    $scope.instances = {
      filters : ''
    }

    $scope.open = function (modalController, modalTemplate) {

      var modalInstance = $uibModal.open({
        animation: $scope.animationsEnabled,
        templateUrl: "filterModal.html",
        controller: 'FiltersModal',
        size: 'lg'
      });

      modalInstance.result.then(function (selectedItem) {
        $scope.selected = selectedItem;
      }, function () {
        $log.info('Modal dismissed at: ' + new Date());
      });
    };

    $scope.toggleAnimation = function () {
      $scope.animationsEnabled = !$scope.animationsEnabled;
    };

  };

  geoInterface.controller('Modal', Modal);

}());
