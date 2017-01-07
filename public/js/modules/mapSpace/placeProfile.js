(function(){

  var PlaceProfile = function($scope, $http){
    $scope.activeMap = DG.activeMap;

    $scope.administration = {};
    $scope.demographics = {};
    $scope.limit = 20
    $scope.offset = {
      ruralDevelopment: 0
    }

    $scope.getPlaceProfile = function(ids){
      $http.post(
        location.pathname,
        {
          'ids': ids,
          'context_id': $scope.activeMap.context.id,
          'context_type': $scope.activeMap.context.type
        }
      ).then(
        function(response){
          $scope.administration = response.data.adminStructure;
          $scope.census = response.data.census;

          $scope.plotDemographics();

          $scope.offset = {
            ruralDevelopment: 0
          }

          $scope.getRuralDevelopmentData()
        }
      );
    };


    $scope.getRuralDevelopmentData = function(){
      $http.post(
        '/placeProfile/ruralDevelopment',
        {
          'context_id': $scope.activeMap.context.id,
          'context_type': $scope.activeMap.context.type,
          'limit': $scope.limit,
          'offset': $scope.offset.ruralDevelopment,
          // 'sendPanchayatInfo': ($scope.limits.ruralDevelopement > 0)
        }
      ).then(
        function(response){
          $scope.activeData = $scope.activeData || {};

          // TODO : not to load these again and again if the place is the same
          $scope.activeData.panchayats = response.data.panchayats;
          $scope.activeData.scheme_categories = response.data.scheme_categories;

          response.data.schemes = _.keyBy(response.data.schemes, 'id')
          console.log($scope.activeData.schemes)
          $scope.activeData.schemes = _.merge(response.data.schemes, $scope.activeData.schemes);
          console.log($scope.activeData.schemes)

          $scope.offset.ruralDevelopment = $scope.limit + $scope.offset.ruralDevelopment

          $scope.buildDataUnits();
        }
      )
    }


    $scope.buildDataUnits = function(){

      var panchayats = $scope.activeData.panchayats;
      var schemes = $scope.activeData.schemes;
      var sch_cat = $scope.activeData.scheme_categories;
      var granularityDetails = $scope.activeData.region_granularity_details;

      // if details of the granularity of map are not their, take that as panchayat... works for case of villages as granularity (TODO: PLEASE CONFIRM this from backend logics).
      if(_.isNil(granularityDetails)) granularityDetails = panchayats;
      granularityDetails = _.keyBy(granularityDetails, 'id');
      $scope.granularityDetails = granularityDetails;   // make this available for other modules also... SHOULD THIS BE MADE AVAILABLE TO DG???

      // OBJECT; more values added; 'scheme' + scheme_head, scheme_sub_head, name, group_place_context;
      $scope.schemesDataEnhanced = $scope.enhanceSchemesData(panchayats, schemes, sch_cat);

      console.log($scope.schemesDataEnhanced);
    }


    $scope.orderDataBy = function(e, toOrder, orderBy){
      var reverseState = angular.element(e.target).attr('data-reverse-state');

      // !(!!( reverseState/1 ))/1 means (reverseState/1) to convert "0" to number 0. !!0 gives false. !false gives true. true/1 gives 1
      angular.element(e.target).attr('data-reverse-state', (!(!!(reverseState/1)))/1 );

      if( !(!!(reverseState/1)) ) {
        $scope[toOrder] = _.sortBy($scope[toOrder], orderBy).reverse()
        return;
      }
      $scope[toOrder] = _.sortBy($scope[toOrder], orderBy);
    }



    $scope.loadMoreRuralDevelopmentData = function(){

    }



    $scope.enhanceSchemesData = function(panchayats, schemes, sch_cat) {

      // TODO : Do it for other granularities as well.
      var panchayats = _.keyBy(panchayats, 'id');

      // group all schemes placewise.
      var schemes = _.groupBy(schemes, 'place_context');

      var sch_cat = _.keyBy(sch_cat, 'id');

      var schemesDataGroupedByPlaces = {};

      // console.log(panchayats);
      // console.log(sch_cat);
      // console.log(schemes);

      var i = 0;
      // for every place group.
      _.each(schemes, function(val, key){
        // based on the place_context and region_granularity, select operation on the values.
        // like, if place_context is panchayat and region_granularity is block, every value in the group should be added into super group of block.
        // this is done by redefining the key in the function. right now the key is panchayat. if granularity is block. key is block. that will give block's information.

        // for every scheme in place
        _.each(val, function(v, k) {
          // generate the data object
          schemesDataGroupedByPlaces[i] = v;

          try {
            schemesDataGroupedByPlaces[i].group_place_context = panchayats[key].id;
          } catch(e) {
            console.log(key);
          }

          schemesDataGroupedByPlaces[i].name = panchayats[key].name;

          try{
            schemesDataGroupedByPlaces[i].scheme_head = sch_cat[ sch_cat[ schemes[key][k].scheme_category_id ].major_head_id ].abbreviation;
          } catch(e){
            console.log(sch_cat[ schemes[key][k].scheme_category_id ].major_head_id);
          }
          schemesDataGroupedByPlaces[i].scheme_sub_head = sch_cat[ schemes[key][k].scheme_category_id ].title;

          i++;
        });
      });

      return schemesDataGroupedByPlaces;
    }



    $scope.plotDemographics = function(){
      DG.plotly.plotPieChart_demographics_gender_total($scope.census);
      DG.plotly.plotPieChart_demographics_gender_0_6($scope.census);
      DG.plotly.plotPieChart_demographics_gender_sc($scope.census);
      DG.plotly.plotPieChart_demographics_gender_st($scope.census);

      DG.plotly.plotPieChart_demographics_sc_st_gen($scope.census);

      DG.plotly.plotBarChart_demographics_all_populations($scope.census);
      DG.plotly.plotBarChart_education_all_populations($scope.census);

      DG.plotly.plotPieChart_literacy_total($scope.census);
      DG.plotly.plotPieChart_literacy_female($scope.census);
      DG.plotly.plotPieChart_literacy_male($scope.census);

      DG.plotly.plotBarChart_occupation_all_populations($scope.census);
      DG.plotly.plotPieChart_occupation_total($scope.census);

      DG.plotly.plotPieChart_gender_workers($scope.census);
      DG.plotly.plotPieChart_gender_main_workers($scope.census);
      DG.plotly.plotPieChart_gender_marginal_workers($scope.census);
      DG.plotly.plotPieChart_gender_non_workers($scope.census);
    }

    angular.element(document).on('newMapAdded', function(){
      $scope.activeMap = DG.activeMap;
      var ids = $scope.getAllIdsForContext()
      $scope.activeData = {};
      $scope.getPlaceProfile( ids );
    });

    $scope.getAllIdsForContext = function(){
      var regionsTypes = ['ac', 'pc', 'block', 'country', 'district', 'panchayat', 'state', 'tehsil']
      var ids = ''
      _.each(regionsTypes, function(val, key){
        if( !_.isNil( $scope.activeMap.context[val] ) ) {
          if(ids.length != 0) ids += ', '
          ids += $scope.activeMap.context[val];
        }
      });

      return ids;
    }

    $scope.onTabSwitch = function(e, ele){
      setTimeout(function(){
          $(window).resize();
          DG.map.invalidateSize();
        },
        10
      );
    };
  };

  geoInterface.controller("PlaceProfile", ["$scope", "$http", PlaceProfile]);

}());





[
  {
    "state":{
      "upDefaultContext":"",
      "deepDefaultGranularity":"district",
      "deepGranularityOptionsAvailable":["district"]
    }
  },
  {
    "district":{
      "upDefaultContext":"state",
      "deepDefaultGranularity":"block",
      "deepGranularityOptionsAvailable":["block","panchayat","village"]
    }
  },
  {
    "block":{
      "upDefaultContext":"district",
      "deepDefaultGranularity":"panchayat",
      "deepGranularityOptionsAvailable":["panchayat","village"]
    }
  },
  {
    "panchayat":{
      "upDefaultContext":"block",
      "deepDefaultGranularity":"panchayat",
      "deepGranularityOptionsAvailable":["panchayat","village"]
    }
  },
  {
    "village":{
      "upDefaultContext":"tehsil",
      "deepDefaultGranularity":"village",
      "deepGranularityOptionsAvailable":["village"]
    }
  }
]
