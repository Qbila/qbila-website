var DG = DG || {};

function DG_basemap(){

  // TODO : ERROR HANDLING IF RESULTS ARE NOT FOUND.
  DG.activeMap.old = {};

  var mapGeojson;
  var geojsonObject;
  var layers = [];
  var activeDataSet;
  var defaultStyle = {color: '#404040', fillColor: '#ffffff', fillOpacity: 1, weight: '1'};
  var highlightStyle = { weight: 2, color: '#ff0000', dashArray: '', fillOpacity: 1 };
  var resetHighlightStyle = { weight: 1, color: '#404040', dashArray: '1', fillOpacity: 1 };
  var dataBucket = [];

  DG.map = L.map('mapSpace', {
    scrollWheelZoom: true,
    doubleClickZoom: true,
    keyboardZoomOffset : 0.20,
    color: '#000',
    fillColor: '#fff',
    width: 1,
    clickable: true
    // zoomControl: false
  });

  var layerGroup;

  initMap();

  // CREATING CUSTOM EVENT OF MAP UPDATE THAT CAN BE LISTENED BY ANGULAR APPLICATION AS WELL
  var __event_newMapAdded = new CustomEvent('newMapAdded');

  function initMap(){
    layerGroup = L.layerGroup({});
    layerGroup.addTo(DG.map);
    DG.activeMap.controlPanel = buildControlPanel();
    addControlPanelGranularityOptions();
  }

  function generateUrl(){
    return '/geo/' + DG.activeMap.context.type + '/' + DG.activeMap.context.id + '/' + DG.activeMap.granularity
  }

  function fetchBaseMap(cbSuccess){
    var url = generateUrl();

    $.ajax({
      dataType: "json",
      url : url,
      beforeSend : function(){
        jqueryOperations.addLoadingOverlay();
      },
      success: function(data) {
        DG.activeMap.layers = DG.activeMap.layers || {};

        DG.activeMap.layers[url] = {
          place: data.place,
          layer: getLayerFromGeojson( data.geometry )
        };

        DG.activeMap.context = data.place;
        DG.activeMap.currentGranularityOptions = getGranularityOptionsForCurrentContext();

        // TODO : granularity for next step.
        addLayerToLayerGroup( DG.activeMap.layers[url].layer );
        // DG.activeMap.layers[url].layer.bringToFront();

        // dispatch event to be listened in presentationListing.js
        document.dispatchEvent(__event_newMapAdded);
        !_.isUndefined(cbSuccess) ? cbSuccess.call() : '' ;

        inMapInfo.update();
        hideLegend();
        jqueryOperations.removeLoadingOverlay();
      }
    }).error(function() {
      // TODO : some page level error alert

      // reset context to old one.
      DG.activeMap.context = DG.activeMap.old.context;
      DG.activeMap.granularity = DG.activeMap.old.granularity;

      jqueryOperations.removeLoadingOverlay();
    });
  }

  $(document).ready(function(){
    // fetch basemap
    fetchBaseMap();
  });


  DG.activeMap.onClickCallback = function(){
    // initialized
  };


  function removeStatFromBaseMap(){
    // remove stat from base map
  }


  function locallyStoreFetchedStatNCode(){
    //
  }


  function createLabelIcon(labelClass,labelText) {
    return L.divIcon({
      className: labelClass,
      html: labelText
    });
  }


  function getLayerFromGeojson(geojson) {
    var geojsonLayer = L.geoJson(geojson, {
      style : function(features) {
        // var centerPt = turf.center(features);
        // TODO : LABELS : leave em for now, but yeah, I got the hang of it babes.
        // L.marker(new L.LatLng(centerPt.geometry.coordinates[1], centerPt.geometry.coordinates[0]), {icon:createLabelIcon("textLabelclass",'<span style="display: inline-block; position: relative; ">'+features.properties.name+'</span>')}).addTo(DG.map);
        return defaultStyle;
      },
      onEachFeature: onEachFeature
    });

    return geojsonLayer;
  }


  function addLayerToLayerGroup(layer){
    layerGroup.clearLayers()
    layerGroup.addLayer(layer);
    DG.map.fitBounds( layer.getBounds() );
  }


  function highlightFeature(e) {
    var layer = e.target;

    layer.setStyle(highlightStyle);

    if (!L.Browser.ie && !L.Browser.opera) {
        layer.bringToFront();
    }

    inMapInfo.update(layer.feature.properties);
  }

  function resetHighlight(e) {
    var layer = e.target;
    layer.setStyle(resetHighlightStyle);
    inMapInfo.update();
  }


  function zoomToFeature(e) {
      DG.map.fitBounds(e.target.getBounds());
  }



  function onFeatureClick(e){
    var layer = e.target;
    // DG.activeMap.onClickCallback(e);

    granualarityLevelDeep(e)
    addControlPanelGranularityOptions();
    dataBucket.push(layer.feature.properties.id);
  }


  function onEachFeature(feature, layer) {
    layer.on({
      mouseover: highlightFeature,
      mouseout: resetHighlight,
      // click: zoomToFeature
      click: onFeatureClick
    });
  }

  function highlightFeatureByPropAnd(prop){
    DG.map.eachLayer(function(l){
      try {
        var flag = true;
        _.each(prop, function(val, key){
          flag &= (l.feature.properties[val] == key);
        });

        if(flag){
          l.setStyle(highlightFeatureStyles);
        }
      } catch (e) {}
    });
  }

  DG.highlightFeaturesInAlterColors = function(featuresArray){
    var availableColors = ['#a6cee3','#1f78b4','#b2df8a','#33a02c','#fb9a99','#e31a1c','#fdbf6f','#ff7f00','#cab2d6','#6a3d9a','#ffff99','#b15928'];

    _.each(featuresArray, function(val, key){
      var fillColorCode = key % availableColors.length+1;
      DG.highlightFeatureByPropOr(val, fillColorCode);
    });
  }

  DG.highlightFeatureByPropOr = function (prop, fillColor){
    // fillColor is string
    // fillColor is integer
    var availableColors = ['#a6cee3','#1f78b4','#b2df8a','#33a02c','#fb9a99','#e31a1c','#fdbf6f','#ff7f00','#cab2d6','#6a3d9a','#ffff99','#b15928'];

    console.log(fillColor);

    if( _.isNil(fillColor)) {
      fillColor = 1;
    }

    console.log(fillColor);

    if(_.isNumber(fillColor) ) {
      fillColor = availableColors[fillColor];
    }

    var layersSet = [];

    // for every layer
    DG.map.eachLayer(function(l){
      try {
        // for every feature in the layer
        _.each(prop, function(val, key){
          if(l.feature.properties[val] == key){
            layersSet.push(l);
          }
        });
      } catch (e) {}
    });

    _.each(layersSet, function(val, key){
      val.setStyle({fillColor: fillColor})
    });
  }

  DG.resetStyleAll = function() {
    DG.map.eachLayer(function(l){
      try {
        l.setStyle(defaultStyle);
      } catch (e) {}
    });
  }

  DG.granualarityLevelUp = function(){
    var contextLevel = getUpContextLevel( DG.activeMap.context.type );
    var upContext = DG.activeMap.pathFollowed[contextLevel.contextLevel -1] || contextLevel.levels[contextLevel.contextLevel][DG.activeMap.context.type].upDefaultContext;

    DG.activeMap.old.context = DG.activeMap.context;
    DG.activeMap.old.granularity = DG.activeMap.granularity;

    DG.activeMap.granularity = DG.activeMap.context.type;
    DG.activeMap.context = {
      type : upContext,
      id : DG.activeMap.context[upContext]
    };

    fetchBaseMap();

    addControlPanelGranularityOptions();
    // dataBucket.push(layer.feature.properties.id);
  }

  function getUpContextLevel(context){
    levels = contextsAndLevels(),
    presentContextLevel = _.findIndex(levels, context)

    return {
      contextLevel: parseInt(presentContextLevel),
      levels: levels
    };
  }

  function granualarityLevelDeep(e){
    DG.activeMap.old.context = DG.activeMap.context;
    DG.activeMap.old.granularity = DG.activeMap.granularity;

    DG.activeMap.context = {
      type : e.target.feature.properties.type,
      id : e.target.feature.properties.id,
      name : e.target.feature.properties.name
    };

    DG.activeMap.granularity = getNextGranularity().defaultgranularity;

    fetchBaseMap();
  }

  // DG.setGranularityMode = function(type, ele){
  //   $('.a-leafletMapControlPanel > li').removeClass('d-active');
  //   $(ele).addClass('d-active');
  //
  //   // console.log(ele);
  //
  //   if(type == 'up') {
  //     DG.activeMap.onClickCallback = granualarityLevelUp;
  //   }
  //   if(type == 'deep') {
  //     DG.activeMap.onClickCallback = granualarityLevelDeep;
  //   }
  // }


  function getGranularityOptionsForCurrentContext(){
    var levels = contextsAndLevels();
    var currentContext = DG.activeMap.context.type;
    var currentGranularity = DG.activeMap.granularity;
    var currentContextLevel = _.findIndex(levels, currentContext);
    var currentGranularityLevel = _.findIndex(levels, currentGranularity);

    return levels[currentContextLevel][currentContext].deepGranularityOptionsAvailable;
  }


  /*
    TODO :
    1. detect current level - DONE
    2. detect current granularity and level - DONE
    3. on granIn click, if more than one deeper level options, show drop down - DONE
    4. if drop down not opened, use default granularity option. granIn Activated - DONE
    5. when any feature in current granularity is clicked, we get valid one level deep of that granularity - DONE
    6. when fetching data for one level, get flag on availability of another level. -
       this will show whether we have maps for another level or not. and if available give types of those.
  */

  function getNextGranularity(){
    var currentContext = DG.activeMap.context.type,
        currentGranularity = DG.activeMap.granularity,  // based on what is available to be clicked
        levels = contextsAndLevels(),
        currentContextLevel = _.findIndex(levels, currentContext),
        currentGranularityLevel = _.findIndex(levels, currentGranularity);

    setOrUpdatePathFollowed(currentContextLevel)

    var nextGranularity = {
      defaultgranularity : levels[currentGranularityLevel][currentGranularity].deepDefaultGranularity,
      // options : levels[currentGranularityLevel][currentGranularity].deepGranularityOptions,
      nextLevelGranularityOptions : ( _.isUndefined(levels[currentGranularityLevel + 1]) || _.isEmpty(levels[currentGranularityLevel + 1]) ) ?
                                      '' : Object.keys(levels[currentGranularityLevel + 1]),
      previousLevelGranularityOptions : ( _.isUndefined(levels[currentContextLevel - 1]) || _.isEmpty(levels[currentContextLevel - 1]) ) ?
                                      '' : Object.keys(levels[currentContextLevel - 1]),
      // previousLevelDefaultGranularity : ( _.isUndefined(levels[currentContextLevel - 1]) || _.isEmpty(levels[currentContextLevel - 1]) ) ?
      //                                 '' : levels[currentContextLevel - 1]
    };

    return nextGranularity;
  }

  function setOrUpdatePathFollowed(currentContextLevel){
    // leave the trails to serve when needed to move back up.
    DG.activeMap.pathFollowed = DG.activeMap.pathFollowed || {};
    DG.activeMap.pathFollowed[currentContextLevel] = DG.activeMap.context.type;

    for(var i=currentContextLevel+1; i <= Object.keys(DG.activeMap.pathFollowed).length; i++){
      delete DG.activeMap.pathFollowed[i];
    }
  }


  function granularityFullFormAndDescription(){

  }


  function contextsAndLevels() {
    return DG.contextsAndLevels;
  }

  DG.changeGranularityTo = function(granularity){
    DG.activeMap.old.context = DG.activeMap.context;
    DG.activeMap.old.granularity = DG.activeMap.granularity;

    if(_.isElement(granularity)){
      DG.activeMap.granularity = $(granularity).text();
    } else if ( _.isString(granularity) ) {
      DG.activeMap.granularity = granularity;
    }

    fetchBaseMap(function(){
      $('#currentContextGranularityOption .a-inContextGranOptions ul li.d-active').removeClass('d-active');
      $('#currentContextGranularityOption .a-inContextGranOptions ul li.'+DG.activeMap.granularity+'').addClass('d-active');
    });
  };

  function addControlPanelGranularityOptions(){

    var deepGranularityOptions = getNextGranularity().nextLevelGranularityOptions;
    var upGranularityOptions = getNextGranularity().previousLevelGranularityOptions;
    var currentGranularityOptions = getGranularityOptionsForCurrentContext();

    // $('#granularityGoDeep .a-inGranOptions ul').html("");
    // $('#granularityGoUp .a-inGranOptions ul').html("");
    $('#currentContextGranularityOption .a-inContextGranOptions ul').html("");

    // _.each(deepGranularityOptions, function(val, key){
    //   $('#granularityGoDeep .a-inGranOptions ul').append("<li>" + val + "</li>")
    // });
    //
    // _.each(upGranularityOptions, function(val, key){
    //   $('#granularityGoUp .a-inGranOptions ul').append("<li>" + val + "</li>")
    // });

    _.each(currentGranularityOptions, function(val, key){
      var classString = val;
      if(val == DG.activeMap.granularity){classString += " d-active ";}
      $('#currentContextGranularityOption .a-inContextGranOptions ul').append("<li onclick='DG.changeGranularityTo(this)' class='"+classString+"'>" + val + "</li>")
    });
  }



  function buildControlPanel(){
    var controlPanel = L.control({position: 'topleft'});

    controlPanel.onAdd = function(map){
      var div = L.DomUtil.create('div', 'info control-panel'),
          labels = [];

      div.innerHTML = '<ul class="a-leafletMapControlPanel clearfix" style="">' +
                        '<li id="granularityGoUp" onclick="DG.granualarityLevelUp()" class="">' +
                          'Up' +
                          '<div class="a-inGranOptions">' +
                            '<ul class="clearfix">' +
                            '</ul>' +
                          '</div>' +
                        '</li>' +
                        // '<li id="granularityGoDeep" onclick="DG.setGranularityMode(\'deep\', this)" class="">' +
                        //   'Deep' +
                        //   '<div class="a-inGranOptions">' +
                        //     '<div class="d-arrow"></div>' +
                        //     '<ul class="clearfix">' +
                        //     '</ul>' +
                        //   '</div>' +
                        // '</li>' +
                      '</ul>' +
                      '<div id="currentContextGranularityOption" class="">' +
                        '<div class="a-inContextGranOptions">' +
                          '<div class="d-arrow"></div>' +
                          '<ul class="clearfix">' +
                          '</ul>' +
                        '</div>' +
                      '</div>';

      return div;
    }

    controlPanel.addTo(DG.map);

    return controlPanel;
  }


  var inMapInfo = L.control();

  inMapInfo.onAdd = function () {
      this._div = L.DomUtil.create('div', 'inMapInfo');
      this.update();
      return this._div;
  };

  // method that we will use to update the control based on feature properties passed
  inMapInfo.update = function (props) {
    var url = generateUrl();

    if( !_.isNil(DG.activeMap.layers) && !_.isNil(DG.activeMap.layers[url]) ){

      this._div.innerHTML = '<div><span style="font-size: 16px; font-weight: bold; color: #000000;">'+ DG.activeMap.layers[url].place.name +'</span> - <span style="font-size: 12px; color: #808080; font-weight: bold;">'+DG.activeMap.layers[url].place.type+'</span></div>' +  (props ?
          '<b style="font-size: 120%; text-decoration: underline;">' + props.name + '</b><br />' +
          '<b>Id: ' + props.id + '</b><br />' +
          '<b>Type: ' + props.type + '</b><br />' +
          '<b>Panchayat: ' + props.panchayat + '</b><br />' +
          '<b>block: ' + props.block + '</b><br />' +
          '<b>tehsil: ' + props.tehsil + '</b><br />' +
          '<b>district: ' + props.district + '</b><br />' +
          '<b>state: ' + props.state + '</b><br />' +
          '<b>country: ' + props.country + '</b><br />' +
          '<b>ac: ' + props.ac + '</b><br />' +
          '<b>pc: ' + props.pc + '</b><br />' +
          '<b>state: ' + props.state + '</b><br />' +
          '<b>census 2001: ' + props.census_2001_id + '</b><br />' +
          '<b>census 2011: ' + props.census_2011_id + '</b><br />'
          : 'Hover over a feature');
    }
  };
  inMapInfo.addTo(DG.map);


  var logo = L.control({position: 'bottomleft'});
  logo.onAdd = function(){
    var div = L.DomUtil.create('div', 'info logo');

    div.innerHTML = '<div>'+
                      '<div style="font-size: 10px; color: #909090; line-height: 1;">powered by</div>'+
                      '<div style="color: #808080; font-weight: bold; line-height: 1; font-size: 16px;" class="comfortaa">samagr</div>' +
                    '</div>'

    return div;
  }
  logo.addTo(DG.map);


  // TODO : when fetched, save the stat for possible future user. if stat exists,
  function fetchStats(presentation, successCallback) {
    var id = presentation.id;
    DG.activeMap.presentation = presentation;

    $.ajax({
      dataType: "json",
      url : '/presentation/'+id,
      success: function(data) {
        DG.plotStatOnBaseMap(data);
        successCallback.call();
      }
    }).error(function() {

    });
  }



  DG.plotKeyValueDataOnBaseMap = function(data){
    /* keyed by place context.
       {
          'data': {
              place_context: {'place_context': place_context, 'quantity_value': 'yyy'}
            },
            'meta': { 'title': '', 'quantity_type': quantity_type }
        }
    */

    DG.activeMap.dataSet = {};

    DG.activeMap.dataSet.data = data.data;
    DG.activeMap.dataSet.meta = data.meta;

    // TODO : make it a user input. based on the band size.
    colorsBandSize = 8;

    var quantity_type = data.meta.quantity_type;
    var range = getRangeArray(data.data, colorsBandSize);
    var colorsBand = bindColors_8(range);

    if(!_.isUndefined(DG.activeMap.legend) && _.isObject(DG.activeMap.legend)){
      DG.activeMap.legend.removeFrom(DG.map);
    }
    // if(!_.isUndefined(DG.activeMap.geojsonObject) && _.isObject(DG.activeMap.geojsonObject)){
    //   DG.activeMap.geojsonObject.removeFrom(DG.map);
    // }

    DG.activeMap.legend = buildAndAddLegend(colorsBand, range, quantity_type);
    update_inMapInfo(colorsBand);

    var layerGroupLayers = layerGroup.getLayers();
    // for the first and only active layer
    layerGroupLayers[0].eachLayer(function(feature) {
      try {
        var unit_quantity_value = !_.isUndefined(DG.activeMap.dataSet.data[feature.feature.properties.id]) ?
                                    DG.activeMap.dataSet.data[feature.feature.properties.id].quantity_value
                                  :
                                    null;

        var unitFillColor = ( _.isNil(unit_quantity_value) ) ? "#ffffff" : colorsBand(unit_quantity_value);

        feature.setStyle({fillColor: unitFillColor, weight: '1', fillOpacity: 1, color: tinycolor.mostReadable( unitFillColor, ["#ffffff", "#000000", "#808080"] ).toHexString(), dashArray: '1'});
      } catch(e) {
        console.log(feature.feature.properties.id)
        console.log(e);
      }
    });
  };



  DG.plotStatOnBaseMap = function(data) {
    DG.activeMap.dataSet = {};

    DG.activeMap.dataSet.data = _.keyBy(data, 'place_context');
    // TODO : make it a user input. based on the band size.
    colorsBandSize = 8;

    if (_.isArray(data)) { var dataKey = 0;}
    else if (_.isPlainObject) { var dataKey = Object.keys(data)[0];}
    else {
      return 'neither array nor plainObject'
    }

    var quantity_type = data[dataKey].quantity_type;
    var range = getRangeArray(data, colorsBandSize);
    var colorsBand = bindColors_8(range);

    if(!_.isUndefined(DG.activeMap.legend) && _.isObject(DG.activeMap.legend)){
      DG.activeMap.legend.removeFrom(DG.map);
    }
    // if(!_.isUndefined(DG.activeMap.geojsonObject) && _.isObject(DG.activeMap.geojsonObject)){
    //   DG.activeMap.geojsonObject.removeFrom(DG.map);
    // }

    DG.activeMap.legend = buildAndAddLegend(colorsBand, range, quantity_type);
    update_inMapInfo(colorsBand);

    var layerGroupLayers = layerGroup.getLayers();
    // for the first and only active layer
    layerGroupLayers[0].eachLayer(function(feature) {
      try {
        var unit_quantity_value = DG.activeMap.dataSet.data[feature.feature.properties.id].quantity_value;
        feature.setStyle({fillColor: colorsBand(unit_quantity_value), weight: '1', fillOpacity: 1, color: '#404040  ', dashArray: '1'});
      } catch(e) {
        console.log(e);
      }
    });

    // DG.activeMap.geojsonObject = geojsonObject;
    //
    // geojsonObject.addTo(DG.map);
  }

  function bindColors_8(range) {
    var color = 'blue';
    var colorRange = colorsBatch_lowToHigh_8(color);
    colorRange.reverse();
    range.reverse();

    return function(d){
      return !_.isUndefined(range[0]) && d > range[0] ? colorRange[0] :
             !_.isUndefined(range[1]) && d > range[1] ? colorRange[1] :
             !_.isUndefined(range[2]) && d > range[2] ? colorRange[2] :
             !_.isUndefined(range[3]) && d > range[3] ? colorRange[3] :
             !_.isUndefined(range[4]) && d > range[4] ? colorRange[4] :
             !_.isUndefined(range[5]) && d > range[5] ? colorRange[5] :
             !_.isUndefined(range[6]) && d > range[6] ? colorRange[6] :
                                                        colorRange[7];
    }
  }


  function colorsBatch_lowToHigh_8(color){
    switch(color) {
      case 'red':
        return ["#FFEDA0", "#FED976", "#FEB24C", "#FD8D3C", "#FC4E2A", "#E31A1C", "#BD0026", "#800026"];
      case 'blue':
        return ["#FFFFCC", "#C7E9B4", "#7FCDBB", "#41B6C4", "#1D91C0", "#225EA8", "#0C2C84", "#021448"];
      case 'green':
        return ['#EDF8FB', '#D7FAF4', '#CCECE6', '#66C2A4', '#41AE76', '#238B45', '#005824', '#033317'];
      case 'purple':
        return ['#F1E6F1', '#D8BBD8', '#CCA5CC', '#C08FC0', '#B379B3', '#A05AA0', '#8A4E8A', '#730973'];
    }
  }


  function colorsBatch_opposites_greenToRed(){
    return ['#1a9850', '#8cce8a', '#d2ecb4', '#fff2cc', '#fed6b0', '#f79272', '#d73027']
  }


  function colorsBatch_opposites_blueToRed(){
    return ['#0080ff', '#40a0ff', '#7fbfff', '#fff2cc', '#ffa6a6', '#ff7a7a', '#ff4d4d']
  }


  function update_inMapInfo(colorsBand){

    inMapInfo.update = function (props) {
      var url = generateUrl();

      if( !_.isUndefined( DG.activeMap.layers[url].place) && !_.isUndefined(props) ) {

        var quantity_value = !_.isUndefined(DG.activeMap.dataSet.data[props.id]) ? DG.activeMap.dataSet.data[props.id].quantity_value : null;
        var quantity_type = _.isNil(DG.activeMap.dataSet.meta.quantity_type) ?
                                ''
                              :
                                DG.activeMap.dataSet.meta.quantity_type;

        this._div.innerHTML = '<div>'+
              '<div style="font-size: 12px; color: #808080; font-weight: bold; text-transform: capitalize;">' + DG.activeMap.layers[url].place.name + '</div>'+
                '<span style="font-size: 14px; font-weight: bold; color: #000000;">' + DG.activeMap.dataSet.meta.title + '</span>'+
              '</div>' +
              (
                props ?
                  '<div style="font-size: 120%;  text-transform: capitalize; background: ' + ( ( _.isNil(quantity_value) ? '#ffffff' : colorsBand(quantity_value) ) ) + '; ' +
                              'color: ' + tinycolor.mostReadable( colorsBand(quantity_value), ["#ffffff", "#000000", "#808080"] ).toHexString() + '; ' +
                              'padding: 5px;">' +
                    '<b>' + props.name + ': </b> ' +
                    '<span style="display: inline-block;">' +
                      '<b>' + ( (quantity_type == 'rupee' && _.isNumber(quantity_value)) ? DG.utils.addCommasAsPerIndianNumberSystem(quantity_value) : quantity_value ) + '</b>' +
                      '<b style="text-transform: lowercase;"> ' + quantity_type + '</b><br />' +
                    '</span>' +
                  '</div>'
                :
                  'To see value, hover over the feature'
              );
      }

    };

    inMapInfo.update();
  }

  $('.legend.leaflet-control .a-alterRange').click(function(){

  });


  function getRangeArray(data, colorsBandSize) {
    var quantity_values = _.map(data, 'quantity_value');
    quantity_values = quantity_values.sort(function(a, b){return a-b});

    var minVal = quantity_values[0],
        maxVal = quantity_values[quantity_values.length - 1],
        range = maxVal - minVal,
        rangeSection = range/(colorsBandSize),   // TODO : 8 parts as of now, if more ranges included, to be taken as variable
        rangeSectionOrder = getMaxDecimalPlacePower(rangeSection);  // rangeSection is x. in the 10 raised to power x. for range section < 1 rangeSection will be negative.

    if(rangeSectionOrder < 0){
      var originalRangeSectionOrder = rangeSectionOrder;
      _.each(quantity_values, function(val, key){
        quantity_values[key] = val * Math.pow( 10, Math.abs(originalRangeSectionOrder) );
      })

      minVal = quantity_values[0],
      maxVal = quantity_values[quantity_values.length - 1],
      range = maxVal - minVal,
      rangeSection = range/(colorsBandSize),   // TODO : 8 parts as of now, if more ranges included, to be taken as variable
      rangeSectionOrder = getMaxDecimalPlacePower(rangeSection);

      var builtRange = buildRange();
      _.each(builtRange, function(val, key){
        builtRange[key] = _.round( val * Math.pow( 10, originalRangeSectionOrder), Math.abs(originalRangeSectionOrder) + 1 );
      });
      return builtRange;
    }

    return buildRange();

    function buildRange(){
      // var minValParts = splitNumberToParts(minVal)
      var rangeSectionParts = splitNumberToParts(rangeSection);
      rangeSectionParts = resetRangeSectionParts(rangeSectionParts, rangeSectionOrder);

      var minMaxAndRange = resetMinMaxValAndRangeSection(rangeSectionParts, colorsBandSize);

      return rangePoints(minMaxAndRange);
    }

    function rangePoints(minMaxAndRange){
      var returnArray = [];
      var rangeStart = minMaxAndRange.newMinVal;
      while(rangeStart <= minMaxAndRange.newMaxVal){
        returnArray.push(rangeStart);
        rangeStart += minMaxAndRange.rangeSection;
      }
      return returnArray;
    }

    // reset range section parts. the 2nd last digit is converted to 5 or 0 for smooth range. [0, 7, 1] to [0, 0, 2]
    function resetRangeSectionParts(rangeSectionParts, rangeSectionOrder){
      if(rangeSectionParts[rangeSectionOrder-1] > 5){
        rangeSectionParts[rangeSectionOrder-1] = 0; // and following
        if(rangeSectionParts[rangeSectionOrder] < 9) {
          rangeSectionParts[rangeSectionOrder] = rangeSectionParts[rangeSectionOrder] + 1
        } else {
          rangeSectionParts.push( 1 );
        }
      } else if (rangeSectionParts[rangeSectionOrder-1] <= 5 && rangeSectionParts[rangeSectionOrder-1] > 0) {
        rangeSectionParts[rangeSectionOrder-1] = 5;
      } else if (rangeSectionParts[rangeSectionOrder-1] == 0) {

      }
      _.each(rangeSectionParts, function(val, key){
        if(key < rangeSectionOrder-1){
          rangeSectionParts[key] = 0;
        }
      });

      return rangeSectionParts;
    };

    // rebuild number from parts. like [0, 7, 1] to 170
    function getRangeSectionFromParts(rangeSectionParts){
      var rangeSection = 0;
      _.each(rangeSectionParts, function(val, key){
        rangeSection += val*Math.pow(10,key);
      });
      return rangeSection;
    }

    //
    function resetMinMaxValAndRangeSection(rangeSectionParts, colorsBandSize){
      var rangeSection = getRangeSectionFromParts(rangeSectionParts);
      var newMinVal = parseInt(minVal) - parseInt(minVal)%rangeSection;
      var newMaxVal = ( parseInt(maxVal)%rangeSection == 0 )? parseInt(maxVal) : parseInt(maxVal) + rangeSection - parseInt(maxVal)%rangeSection;
      var newRange = newMaxVal - newMinVal;
      var newRangeSection = newRange/(colorsBandSize);
      var newRangeSectionOrder = getMaxDecimalPlacePower(newRangeSection);
      var newRangeSectionParts = splitNumberToParts(newRangeSection);

      newRangeSectionParts = resetRangeSectionParts(newRangeSectionParts, newRangeSectionOrder);
      newRangeSection = getRangeSectionFromParts(newRangeSectionParts);

      // To ensure that the minimum quantity value is less than the range's minimum value AND maxium quantity value is larger than the range maximum value.
      var eligbileNewMinVal = Math.ceil(newMinVal/newRangeSection) * newRangeSection;
      if (eligbileNewMinVal < quantity_values[0]) {
        newMinVal = eligbileNewMinVal + newRangeSection;
      }
      var eligibleNewMaxVal = ( parseInt(newMaxVal)%newRangeSection == 0 )? parseInt(newMaxVal) : parseInt(newMaxVal) + newRangeSection - parseInt(newMaxVal)%newRangeSection;
      if (quantity_values[quantity_values.length-1] < eligibleNewMaxVal) {
        newMaxVal = eligibleNewMaxVal - newRangeSection;
        if (quantity_values[quantity_values.length-1] < (newMaxVal - newRangeSection)) {
          newMaxVal = newMaxVal - newRangeSection;
        }
      }

      return {newMinVal: newMinVal, newMaxVal: newMaxVal, rangeSection: newRangeSection};
    }
  }


  function getMaxDecimalPlacePower(val){
    var parts = splitNumberToParts(val);
    return parts.length-1;
  }


  function splitNumberToParts(n) {
      var wholePart = Math.floor(n);
      // var decimalPart = n - wholePart;
      var parts = [];
      var multiplier = 1;

      while(wholePart > 0) {
          var result = wholePart % 10;

          parts.unshift(result);

          wholePart = Math.floor(wholePart / 10);
          multiplier *= 10;
      }

      return parts.reverse();
  }

  function buildAndAddLegend(colorsBand, grades, quantity_type){
    var legend = L.control({position: 'bottomright'});
    legend.onAdd = function () {
        var div = L.DomUtil.create('div', 'info legend'),
            labels = [];

        div.innerHTML += '<div class="a-quantityType" style="padding-bottom: 10px">(All values in ' + quantity_type + ')</div>';

        // loop through our density intervals and generate a label with a colored square for each interval
        div.innerHTML +=
            '<i style="background:' + colorsBand(grades[0] + 1) + '"></i> ' + ' > ' + DG.utils.addCommasAsPerIndianNumberSystem( grades[0] ) + '<br>';

        for (var i = 0; i < grades.length; i++) {
            div.innerHTML +=
                '<i style="background:' + colorsBand(grades[i]) + '"></i> ' + ' ' +
                (grades[i + 1] ? DG.utils.addCommasAsPerIndianNumberSystem( grades[i + 1] ) + ' &ndash; ' : ' < ') + DG.utils.addCommasAsPerIndianNumberSystem( grades[i] ) + '<br>';
        }
        // TODO : enable users to change range and
        div.innerHTML += '<div class="a-alterRange text-center" onclick="alterLegendRange();" style="padding-top: 10px"><a>Change Range</a></div>'
        return div;
    };

    legend.addTo(DG.map);

    return legend;
  }

  function hideLegend(){
    $('.info.legend').html('');
  }


  function alterLegendRange(){
    $('#alterRanges_modal').modal('show');
  }


};
