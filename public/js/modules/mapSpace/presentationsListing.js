(function(){

  var PresentationsListing = function($scope, $http){

    $scope.loadedFiles = {};
    $scope.activeMap = {};

    angular.element(document).ready(function(){
      $scope.activeMap = DG.activeMap;
    });

    angular.element(document).on('newMapAdded', function(){
      $scope.activeMap = DG.activeMap;
      $scope.fetchPresentationSets($scope.activeMap.context.type, $scope.activeMap.context.id, $scope.activeMap.granularity);
    });

    $scope.fetchPresentationSets = function(context_type, context_id, granularity){
      // TODO : integrate context and granularity in the presentation sets query
      // $http.get('/presentationsets')

      $http.get('/presentations/' + context_type + '/' + context_id  + '/' + granularity)
           .then(function(response){
             $scope.presentationSets = _.keyBy( response.data, 'presentation_id' );

             // for every object in pres array
             _.each($scope.presentationSets, function(val, key){
               // for every value in the element
               _.each(val, function(v, k){
                 // see if there is any anchor in the value
                   v = $scope.resolveAnchors(v);
                   $scope.presentationSets[key][k] = v
                 });
               })

               $scope.presentationSets = $scope.resolveAnchors( $scope.presentationSets );
              //  console.log( $scope.presentationSets );
             }
           );
    }


    /**
    *  replace ***anchor*** with value
    **/
    $scope.resolveAnchors = function(v, additionalAnchorContext){
      var splitString = _.isString(v) ? v.split('***') : '';
      // if there are anchors, find them
      if( splitString.length > 1 ) {
        for(var i=1; i < splitString.length; i=i+2){
          // convert context__name to context.name
          // split on __
          var anchors = splitString[i].split('__');
          // get the map context
          var anchorContext = _.merge($scope.activeMap, additionalAnchorContext);
          // console.log(anchorContext);
          // context, name
          _.each(anchors, function(anc, ind){
            // anchorContext = $scope.activeMap[context]
            // in next iteration, anchorContext = $scope.activeMap[context][name]...
            // converting object to string
            anchorContext = anchorContext[anc];
          })
          v = v.replace('***'+splitString[i]+'***', anchorContext);
        }
      }

      return v;
    };

    $scope.fetchPresentationsData = function(event, elementContext){

      $http.get(
            '/presentationsData/' +
            elementContext.presentationSet.presentation_id + '/' +
            $scope.activeMap.context.type + '/' +
            $scope.activeMap.context.id  + '/' +
            $scope.activeMap.granularity
        )
         .then(function(response){
           var res = _.groupBy(response.data.presentations, function(val, key){
             // group the results as per the group_by value. e.g. group_by 'duration_value' will group annual rainfall by 2012, 2014, 2013 etc.
             return val[response.data.group_by];
           });

          //  console.log(elementContext.presentationSet);
          // $scope.resolveAnchors(res);

          _.each(res, function(val, key){
            var additionalAnchorContext = {};

            additionalAnchorContext[response.data.group_by] = key;
            res[key] = {
              presentationData : val,
              title: $scope.resolveAnchors(response.data.title_query, additionalAnchorContext),
              description: $scope.resolveAnchors(response.data.description_query, additionalAnchorContext)
            }
          });

           elementContext.presentationSet.presentations = res;
         });

    };

    var onPresentationSetsRecievedCallback = function(response){
      $scope.presentationSets = response.data;
    };

    $scope.fetchDataAndScripts = function(event, elementContext) {

      // console.log(elementContext.presentation);
      DG.plotStatOnBaseMap(elementContext.presentation.presentationData);
      angular.element('.a-dataUnit.d-active').removeClass('d-active');

      if (! angular.element(event.target).hasClass('a-dataUnit')) {
        angular.element(event.target).parents('.a-dataUnit').addClass('d-active');
      } else {
        angular.element(event.target).addClass('d-active');
      }
      // fetchStats(
      //   elementContext.presentation,
      //   function(){
            //   }
      // );
    }

    // $scope.init();
  };

  geoInterface.controller("PresentationsListing", ["$scope", "$http" , PresentationsListing]);

}());

// onclick, load related js using requirejs. Once loaded, use the standard names and function calls to display data on the basemaps.
