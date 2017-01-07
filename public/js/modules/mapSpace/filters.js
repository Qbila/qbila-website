(function(){

  var Filters = function($scope, $http, $timeout){

    // filters displayed on map
    $scope.activeFilter = {
      sanctionDate : {
        to: moment(new Date()).format('YYYY-MM-DD 00:00:00.000'),
        from: moment(new Date()).subtract(1, 'year').format('YYYY-MM-DD 00:00:00.000'),
      },
      schemeStatus: 'sanctioned',
      financialYear: new Date().setFullYear(2015),
      schemeHead: {
        '70': {
      		"id": 70,
      		"abbr": "SDP",
      		"title": "Sectoral Decentralised Planning"
      	}
      },
      amountRange: {
        from: 0,
        to: 3000000
      },
      timeRange: 'year',
      regionGranularity: 'block',
      regionContext: {
        type: 'district',
        id: 3
      }
    };

    $scope.orderTableByField = '';
    $scope.reverseSort = false;

    // filters selected by the user
    $scope.selectedFilters = $scope.activeFilter;

    $scope.slider = {
      min: $scope.selectedFilters.amountRange.from,
      max: $scope.selectedFilters.amountRange.to,
      options: {
        floor: 0,
        ceil: $scope.selectedFilters.amountRange.to,
        step: 500
      }
    };

    $scope.currentContextGranularityOptions = [];
    $(document).on('newMapAdded', function(){
      $scope.activeMap = DG.activeMap;
      $scope.currentContextGranularityOptions = DG.activeMap.currentGranularityOptions;
      $scope.selectedFilters.regionGranularity = DG.activeMap.granularity;
      $scope.selectedFilters.regionContext = {
        type: DG.activeMap.context.type,
        id: DG.activeMap.context.id
      };
      $scope.updateFiltersState();

      $scope.fetchFilteredData();

    });

    $scope.timeRangeOptions = [
      'year', 'month'
    ];


    //
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


    //
    $scope.workStatuses = [
      {
        status: 'entered',
        description: 'schemes recently entered into system'
      },
      {
        status: 'pending approval',
        description: 'scheme pending approval of officials'
      },
      {
        status: 'sanctioned',
        description: 'scheme sanctioned and resources allocated'
      },
      {
        status: 'cancelled',
        description: 'scheme cancelled due to some reason(s)'
      },
      {
        status: 'in progress',
        description: 'scheme execution in progress'
      },
      {
        status: 'completed',
        description: 'scheme completed'
      }
    ];


    //
    $scope.today = function() {
      $scope.financialYear = new Date();
    };
    $scope.today();

    $scope.financialYearOptions = {
      datepickerMode: 'year',
      maxDate: new Date(),
      minDate: new Date().setFullYear(1977), // to take this option from the minimum value of the database
      minMode: 'year'
    }


    //
    $scope.sanctionDatesOptions = {
      from : {
        datepickerMode: 'month',
        maxDate: new Date(),
        minDate: new Date().setFullYear(1977), // to take this option from the minimum value of the database
      },
      to : {
        datepickerMode: 'month',
        maxDate: new Date(),
        minDate: $scope.selectedFilters.sanctionDate.from
      }
    }



    // set format to the financial year
    $scope.formatizeFinancialYear = function(time){
      if(time.length == 4) return time;
      var financialYear = moment(time).format('YYYY');
      financialYear += '-' + moment( moment(time).add(1, 'year') ).format('YY')

      return financialYear
    };



    // set format to the date.
    $scope.formatizeSanctionDate = function(time){
      var sanctionDate = moment(time).format('Do MMM YYYY');

      return sanctionDate
    };



    //
    $scope.fetchPlaceProfile = function(context_type, context_id, profileType){

    };


    //
    $scope.selectRegionGranularity = function(e, ele){
      $scope.selectedFilters.regionGranularity = ele.granularity;
      DG.changeGranularityTo($scope.selectedFilters.regionGranularity);
    }


    //
    $scope.selectTimeRange = function(e, ele){
      $scope.selectedFilters.timeRange = ele.timeRange;
    };


    //
    $scope.selectWorkStatus = function(e, ele){
      $scope.selectedFilters.schemeStatus = ele.ws.status;
      // fetch amount wrt this work status
      $scope.updateFiltersState();
    };



    // update the selected heads, order them by state of selection.
    $scope.selectSchemeHeads = function(e, ele){
      if( ele.sh.selected ) {
        $scope.selectedFilters.schemeHead[ele.sh.id] = ele.sh;
        $scope.schemeHeads = _.sortBy($scope.schemeHeads, function(o){
          return o['selected'] == false;
        });
      } else {
        delete $scope.selectedFilters.schemeHead[ele.sh.id];
      }
    };



    //
    $scope.updateFiltersState = function(){

      $http.post('/filters/2/6', {schemeStatus: $scope.selectedFilters.schemeStatus, contextType: DG.activeMap.context.type, contextId: DG.activeMap.context.id})
           .then(
             function(response) {
               $scope.schemeHeads = _.keyBy(response.data.schemeHeads, 'id');

               _.each($scope.schemeHeads, function(val, key){
                 $scope.schemeHeads[key]['selected'] = false;
               });

               var activeSchemeHeads = _.keys($scope.selectedFilters['schemeHead']);
               _.each(activeSchemeHeads, function(val, key){
                 $scope.schemeHeads[val]['selected'] = true;
               });

               $scope.schemeHeads = _.sortBy($scope.schemeHeads, 'abbr');
               $scope.schemeHeads = _.sortBy($scope.schemeHeads, function(o){
                 return o['selected'] == false;
               });

               $scope.slider = {
                 min: $scope.selectedFilters.amountRange.from,
                 max: $scope.selectedFilters.amountRange.to,
                 options: {
                   floor: 0,
                   ceil: response.data.amountRange,
                   step: 500
                 }
               };
             },
             function(response) {
              //  console.log(response);
             }
           );
    };


    $scope.groupQuantityUnitsByGranularity = function(){
      // group the places data by region_granularity
      //
    };


    $scope.enhanceSchemesData = function(panchayats, schemes, sch_cat){

      // TODO : Do it for other granularities as well.
      var panchayats = _.keyBy(panchayats, 'id');

      // group all schemes placewise.
      var schemes = _.groupBy(schemes, 'place_context');

      var sch_cat = _.keyBy(sch_cat, 'id');

      var schemesDataGroupedByPlaces = {};

      var i = 0;
      // for every place group.
      _.each(schemes, function(val, key){
        // based on the place_context and region_granularity, select operation on the values.
        // like, if place_context is panchayat and region_granularity is block, every value in the group should be added into super group of block.
        // this is done by redefining the key in the function. right now the key is panchayat. if granularity is block. key is block. that will give block's information.

        // for every scheme in place
        _.each(val, function(v, k) {
          // generate the data object
          if ($scope.selectedFilters.regionGranularity == 'panchayat' || $scope.selectedFilters.regionGranularity == 'village') {
            schemesDataGroupedByPlaces[i] = v;
            schemesDataGroupedByPlaces[i].group_place_context = panchayats[key].id;
            schemesDataGroupedByPlaces[i].name = panchayats[key].name;
          } else {
            schemesDataGroupedByPlaces[i] = v;
            try{
              schemesDataGroupedByPlaces[i].group_place_context = $scope.granularityDetails[ panchayats[key][$scope.selectedFilters.regionGranularity] ].id;
              schemesDataGroupedByPlaces[i].scheme_head = sch_cat[ sch_cat[ schemes[key][k].scheme_category_id ].major_head_id ].abbreviation;
              schemesDataGroupedByPlaces[i].name = $scope.granularityDetails[ panchayats[key][$scope.selectedFilters.regionGranularity] ].name;
              schemesDataGroupedByPlaces[i].scheme_sub_head = sch_cat[ schemes[key][k].scheme_category_id ].title;
            } catch(e) {
              console.log(panchayats[key][$scope.selectedFilters.regionGranularity]);
              console.log(key)
              console.log($scope.granularityDetails[ panchayats[key][$scope.selectedFilters.regionGranularity] ].id);
            }
          }
          i++;
        });
      });

      return schemesDataGroupedByPlaces;
    }

    $scope.groupSchemeDataByPlaces = function(){

    }


    $scope.groupDataIntoTreeFormat  = function(){
      var schemesDataGroupedByPlaces = _.defaults({}, $scope.schemesDataGroupedByPlacesAndGroupingContext);

      _.each(schemesDataGroupedByPlaces, function(val, key){
        var localSize = 0;
        localSize = _.size(schemesDataGroupedByPlaces[key]);
        schemesDataGroupedByPlaces[key] = _.groupBy(val, 'scheme_year');
        // schemesDataGroupedByPlaces[key].rowsInGroup = localSize;

        _.each(schemesDataGroupedByPlaces[key], function(v, k){
          if(k == 'rowsInGroup'){return;}
          var localSize = 0;
          localSize = _.size(schemesDataGroupedByPlaces[key][k]);
          schemesDataGroupedByPlaces[key][k] = _.groupBy(v, 'scheme_head');
          // schemesDataGroupedByPlaces[key][k].rowsInGroup = localSize;

          _.each(schemesDataGroupedByPlaces[key][k], function(data, index){
            if(index == 'rowsInGroup'){return;}
            var localSize = 0;
            localSize = _.size(schemesDataGroupedByPlaces[key][k][index]);
            schemesDataGroupedByPlaces[key][k][index] = _.groupBy(data, 'scheme_sub_head');
            // schemesDataGroupedByPlaces[key][k][index].rowsInGroup = localSize;

            _.each(schemesDataGroupedByPlaces[key][k][index], function(d, i){
              if(i == 'rowsInGroup'){return;}
              var localSize = 0;
              localSize = _.size(schemesDataGroupedByPlaces[key][k][index][i]);
              schemesDataGroupedByPlaces[key][k][index][i] = _.groupBy(d, 'status');
              // schemesDataGroupedByPlaces[key][k][index][i].rowsInGroup = localSize;
            });
          });
        });
      });

      return schemesDataGroupedByPlaces;
    }


    //
    function groupObjectBySomeKeyValueAndAddRowsInGroup(dataObject, keyValue){

    }



    // TODO : make this more efficient
    // NEEDS GRANULARITY DETAILS AS ARGUMENT. LIKE IF BLOCK IS GRANULARITY, NAME, ID etc ARE DETAILS OF GRANULARITY.
    $scope.buildDataUnits = function(){

      var panchayats = $scope.activeData.panchayats;
      var schemes = $scope.activeData.schemes;
      var sch_cat = $scope.activeData.scheme_categories;
      var granularityDetails = $scope.activeData.region_granularity_details;

      // if details of the granularity of map are not their, take that as panchayat... works for case of villages as granularity (TODO: PLEASE CONFIRM this from backend logics).
      if(_.isEmpty(granularityDetails)) granularityDetails = panchayats;
      granularityDetails = _.keyBy(granularityDetails, 'id');
      $scope.granularityDetails = granularityDetails;   // make this available for other modules also... SHOULD THIS BE MADE AVAILABLE TO DG???

      // OBJECT; more values added; 'scheme' + scheme_head, scheme_sub_head, name, group_place_context;
      $scope.schemesDataEnhanced = $scope.enhanceSchemesData(panchayats, schemes, sch_cat);

      // OBJECT; group_place_context_id as key; values from $scope.schemesDataEnhanced
      $scope.schemesDataGroupedByPlacesAndGroupingContext = _.groupBy($scope.schemesDataEnhanced, 'group_place_context');

      // OBJECT; DEEP NESTED OBJECT; group_place_context_id -> scheme_year -> scheme_head -> scheme_status -> data
      $scope.schemesDataTreeFormatRootByPlaces = $scope.groupDataIntoTreeFormat();

      $scope.schemesData_totalMoneyGroupedByGroupingContext = $scope.sumByVariableForDataGroupedByPlaces($scope.schemesDataGroupedByPlacesAndGroupingContext);

      // data units for graphs and maps
      // granularity, granularity details, value, value_details
      $scope.schemesData_totalMoneyGroupedByWorkType = $scope.sumByAmountSanctionedForDataGroupedByWorkCategories();

      $scope.schemesData_totalMoneyGroupedByExecutingAgency = $scope.sumByAmountSanctionedByExecutingAgency()
    };


    $scope.sumByAmountSanctionedByExecutingAgency = function() {
      var dataObject = _.groupBy($scope.schemesDataEnhanced, 'executing_agency');
      var returnObject = {};

      _.each(dataObject, function(val, key){
        returnObject[key] = {
          executing_agency: key,
          quantity_value: _.sumBy(val, 'amount_sanctioned')
        };
      });

      return returnObject;
    };


    $scope.sumByAmountSanctionedForDataGroupedByWorkCategories = function() {
      var dataObject = _.groupBy($scope.schemesDataEnhanced, 'scheme_sub_head');
      var returnObject = {};

      _.each(dataObject, function(val, key){
        returnObject[key] = {
          work_category: key,
          quantity_value: _.sumBy(val, 'amount_sanctioned')
        };
      });

      return returnObject;
    };


    $scope.sumByVariableForDataGroupedByPlaces = function(){
      var dataObject = _.defaults({}, $scope.schemesDataGroupedByPlacesAndGroupingContext);
      var returnObject = {};

      _.each(dataObject, function(val, key){
        returnObject[key] = {
          place_context: key,
          quantity_value: _.sumBy(val, 'amount_sanctioned')
        };
      });

      return returnObject;
    }


    // plot on the map, the total amount spent on the region as per the result from the filtered data.
    $scope.plotOnMap_totalAmountInRegions = function(){

      var data = {
        data: $scope.schemesData_totalMoneyGroupedByGroupingContext,
        meta: {
          'title': 'Amount Sanctioned in different regions',
          'quantity_type': 'rupee'
        }
      }

      DG.plotKeyValueDataOnBaseMap(data);

    };


    // Get the data corresponding to the filter variables.
    $scope.fetchFilteredData = function(){
      $scope.selectedFilters.amountRange = {
        from: $scope.slider.min,
        to: $scope.slider.max
      };
      $scope.selectedFilters.sanctionDate.from = moment($scope.selectedFilters.sanctionDate.from).format('YYYY-MM-DD 00:00:00.000');
      $scope.selectedFilters.sanctionDate.to = moment($scope.selectedFilters.sanctionDate.to).format('YYYY-MM-DD 00:00:00.000');
      $scope.selectedFilters.financialYear = moment($scope.selectedFilters.financialYear).format('YYYY');

      $http.post("/department/data/filter/2/6", $scope.selectedFilters)
           .then(
             function(response){
               // TODO : build upon the data. push the data to active data keyed by url or filters. also, TO UPDATE DATA ON MAP LOAD ONLY.

               $scope.activeData = {};
               $scope.activeData.panchayats = response.data.panchayats;
               $scope.activeData.schemes = response.data.schemes;
               $scope.activeData.scheme_categories = response.data.scheme_categories;
               $scope.activeData.region_granularity_details = response.data.region_granularity_details;

               $scope.buildDataUnits()
               $scope.plotOnMap_totalAmountInRegions(response.data.panchayats, response.data.schemes, response.data.scheme_categories);

               DG.plotly.plotPieChart($scope.schemesData_totalMoneyGroupedByGroupingContext, $scope.granularityDetails);
               DG.plotly.plotBarChart($scope.schemesData_totalMoneyGroupedByGroupingContext, $scope.granularityDetails);

               DG.plotly.plotPieChart_workCategories($scope.schemesData_totalMoneyGroupedByWorkType);
               DG.plotly.plotBarChart_workCategories($scope.schemesData_totalMoneyGroupedByWorkType);

               DG.plotly.plotPieChart_executingAgency($scope.schemesData_totalMoneyGroupedByExecutingAgency);
               DG.plotly.plotBarChart_executingAgency($scope.schemesData_totalMoneyGroupedByExecutingAgency);
             },
             function(response){
               $scope.selectedFilters = $scope.activeFilter;
              //  console.log(response);
             }
           )
    };


    $scope.generateFormattedDataForCharts = function(){
      var formattedData = {};

      // number of schemes
      _.each($scope.schemesDataGroupedByPlaces, function(key, value){

      })
      // formattedData.numberOfSchemes =
      // amount spent
    };


    $scope.chartOptions = {
      chart: {
        type: 'pieChart',
        margin : {
            top: 30,
            right: 0,
            bottom: 0,
            left: 0
        },
        x: function(d){console.log('yo yo yo'); return d.key;},
        y: function(d){return d.y;},
        showLabels: true,
        duration: 500,
        labelThreshold: 0.01,
        labelSunbeamLayout: true,
        showLegend: false
      }
    };





      /*
        GRIDSTER DASHBOARD : TODO : separate this to another directive or controller
      */



      $scope.gridsterOptions = {
    		margins: [20, 20],
    		columns: 4,
    		mobileModeEnabled: false,
    		draggable: {
    			handle: 'h3'
    		},
    		resizable: {
         enabled: true,
         handles: ['n', 'e', 's', 'w', 'ne', 'se', 'sw', 'nw'],

         // optional callback fired when resize is started
         start: function(event, $element, widget) {},

         // optional callback fired when item is resized,
         resize: function(event, $element, widget) {
          //  if (widget.chart.api) widget.chart.api.update();
         },

          // optional callback fired when item is finished resizing
         stop: function(event, $element, widget) {
           $timeout(function(){
            //  if (widget.chart.api) widget.chart.api.update();
           },400)
         }
        },
    	};


      $scope.dashboardOptions = {
        'amount_spent_per_scheme_head': {
          name: 'Percent Amount Spent By Scheme Heads',
          getChartOptions: function(){
            return {
              chart: {
                type: 'pieChart',
                margin : {
                    top: 30,
                    right: 0,
                    bottom: 0,
                    left: 0
                },
                x: function(d){console.log('yeahhh yu hoo :-|'); return d.place_context;},
                y: function(d){return d.quantity_value;},
                showLabels: true,
                duration: 500,
                labelThreshold: 0.01,
                labelSunbeamLayout: true,
                showLegend: false
              }
            }
          },
          getData: function(){
            console.log('is it there???')
            console.log($scope.schemesData_totalMoneyGroupedByGroupingContext);
            return $scope.schemesData_totalMoneyGroupedByGroupingContext;
          }
        }
      }


      $scope.dashboard = {
    		widgets: [
          {
      			col: 0,
      			row: 0,
      			sizeY: 1,
      			sizeX: 2,
      			name: $scope.dashboardOptions['amount_spent_per_scheme_head'].name,
            chartId: 'pie_1'
      			// chart: {
      			//   options: $scope.dashboardOptions['amount_spent_per_scheme_head'].getChartOptions(),
      			//   data: $scope.dashboardOptions['amount_spent_per_scheme_head'].getData()
      			// }
      		},
          {
      			col: 2,
      			row: 0,
      			sizeY: 1,
      			sizeX: 2,
      			name: $scope.dashboardOptions['amount_spent_per_scheme_head'].name,
            chartId: 'bar_1'
      		},
        ]
    	};

      $scope.events = {
        resize: function(e, scope){
          // $timeout(function(){
          //   scope.api.update()
          // },200)
        }
      };
      angular.element(window).on('resize', function(e){
        $scope.$broadcast('resize');
      });

      // We want to hide the charts until the grid will be created and all widths and heights will be defined.
      // So that use `visible` property in config attribute
      $scope.config = {
        visible: false
      };

      // $timeout(function(){
      //   $scope.config.visible = true;
      // }, 200);


  };

  geoInterface.controller("Filters", ["$scope", "$http", "$timeout", Filters]);

}());
