(function(){

  var Schemes = function($scope, $http){
    // $scope.activeMap = DG.activeMap;

    $scope.enteredScheme = {
      scheme : "",
      schemesCategories: {}
    };

    $scope.schemesCategories = [
      {
        tag: 'soil conservation',
        description: ''
      },
      {
        tag: 'repair and restoration',
        description: ''
      },
      {
        tag: 'water supply',
        description: ''
      },
      {
        tag: 'primary education',
        description: ''
      },
      {
        tag: 'agriculture',
        description: ''
      },
      {
        tag: 'horticulture',
        description: ''
      },
      {
        tag: 'health',
        description: ''
      },
      {
        tag: 'paths',
        description: ''
      },
      {
        tag: 'construction',
        description: ''
      },
      {
        tag: 'high school',
        description: ''
      },
      {
        tag: 'sanitation',
        description: ''
      },
      {
        tag: 'roads',
        description: ''
      },
      {
        tag: 'community development',
        description: ''
      },
      {
        tag: 'forest',
        description: ''
      },
      {
        tag: 'animal husbandry',
        description: ''
      },
      {
        tag: 'alopathy',
        description: ''
      },
      {
        tag: 'hand pump',
        description: ''
      },
      {
        tag: 'industry',
        description: ''
      },
      {
        tag: 'disaster response',
        description: ''
      },
      {
        tag: 'transport',
        description: ''
      },
      {
        tag: 'subsidy',
        description: ''
      }
    ];
    _.each($scope.schemesCategories, function(val, key){
      $scope.schemesCategories[key]['selected'] = false;
    });

    $scope.selectSchemeCategory = function(e, ele){
      console.log('yo yo yo');
    };

    // functions to trigger on tab switch. trigger refresh the dom
    $scope.onTabSwitch = function(e, ele){
      setTimeout(function(){
        $(window).resize();
        },
        10
      );
    };

    // fetch max and ceil from
     // options.ceil: the amount for which > 20% have more sanctioned
    $scope.slider = {
      // min: 0,
      min: 0, // the median amount.
      options: {
        floor: 0,
        ceil: 200000,
        step: 500,
        showSelectionBar: true
      }
    };


    $scope.amountMoreThanSliderCeil = false;
    $scope.setEstimatedAmountToMaximum = function(){
      // $scope.slider.min = 200000;
    };


  };

  geoInterface.controller("Schemes", ["$scope", "$http", Schemes]);

}());
