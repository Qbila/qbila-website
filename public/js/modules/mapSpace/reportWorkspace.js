(function(){

  var ReportWorkSpace = function ($scope) {
    // tabs switch between map, table, filters, charts
    // scope for filters data
    //
    $scope.activateFiltration = function(e){
      $scope.active = 1;
      var dataFilterType;

      if( ! _.isUndefined(e) ){
        dataFilterType = angular.element(e.target).attr('data-filter-type');
      } else {
        dataFilterType = angular.element(angular.element('.a-reportIntro .d-editable')[0]).attr('data-filter-type');
      }

      angular.element('#workspace').addClass('a-filterationActive');
      angular.element('#workspace').attr('data-filter-type', dataFilterType);

      $(window).resize();
    };

    $scope.applyFilters = function(e){
      angular.element('#workspace').removeClass('a-filterationActive');
      angular.element('#workspace').attr('data-filter-type', '');
      $scope.onTabSwitch();
    };

    $scope.onTabSwitch = function(e, ele){
      setTimeout(function(){
          $(window).resize();
          DG.map.invalidateSize();
        },
        10
      );
    };

  };

  geoInterface.controller('ReportWorkSpace', ['$scope', ReportWorkSpace]);

}());
