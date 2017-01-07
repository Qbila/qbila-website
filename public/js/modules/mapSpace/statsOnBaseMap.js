// // TODO : when fetched, save the stat for possible future user. if stat exists,
// function fetchStats(presentation, successCallback) {
//   var id = presentation.id;
//   activeMap.presentation = presentation;
//
//   $.ajax({
//     dataType: "json",
//     url : '/presentation/'+id,
//     success: function(data) {
//       plotStatOnBaseMap(data);
//       successCallback.call();
//     }
//   }).error(function() {
//
//   });
// }
//
// function plotStatOnBaseMap(data) {
//   activeMap.dataSet = _.keyBy(data, 'place_context');
//   colorsBandSize = 8; // TODO : make it a user input. based on the band size.
//   var quantity_type = data[0].quantity_type;
//   var range = getRangeArray(data, colorsBandSize);
//   var colorsBand = bindColors_8(range);
//
//   if(!_.isUndefined(activeMap.legend) && _.isObject(activeMap.legend)){
//     activeMap.legend.removeFrom(map);
//   }
//   // if(!_.isUndefined(activeMap.geojsonObject) && _.isObject(activeMap.geojsonObject)){
//   //   activeMap.geojsonObject.removeFrom(map);
//   // }
//
//   activeMap.legend = buildAndAddLegend(colorsBand, range, quantity_type);
//   update_inMapInfo(colorsBand);
//
//   var layerGroupLayers = layerGroup.getLayers();
//   // for the first and only active layer
//   layerGroupLayers[0].eachLayer(function(feature) {
//     try {
//       var unit_quantity_value = activeMap.dataSet[feature.feature.properties.id].quantity_value;
//       feature.setStyle({fillColor: colorsBand(unit_quantity_value), weight: '1', fillOpacity: 1, color: '#404040  ', dashArray: '1'});
//     } catch(e) {
//       console.log(e);
//     }
//   });
//
//   // activeMap.geojsonObject = geojsonObject;
//   //
//   // geojsonObject.addTo(map);
// }
//
// function bindColors_8(range) {
//   var color = 'blue';
//   var colorRange = colorsBatch_lowToHigh_8(color);
//   colorRange.reverse();
//   range.reverse();
//
//   return function(d){
//     return !_.isUndefined(range[0]) && d > range[0] ? colorRange[0] :
//            !_.isUndefined(range[1]) && d > range[1] ? colorRange[1] :
//            !_.isUndefined(range[2]) && d > range[2] ? colorRange[2] :
//            !_.isUndefined(range[3]) && d > range[3] ? colorRange[3] :
//            !_.isUndefined(range[4]) && d > range[4] ? colorRange[4] :
//            !_.isUndefined(range[5]) && d > range[5] ? colorRange[5] :
//            !_.isUndefined(range[6]) && d > range[6] ? colorRange[6] :
//                                                       colorRange[7];
//   }
// }
//
//
// function colorsBatch_lowToHigh_8(color){
//   switch(color) {
//     case 'red':
//       return ["#FFEDA0", "#FED976", "#FEB24C", "#FD8D3C", "#FC4E2A", "#E31A1C", "#BD0026", "#800026"];
//     case 'blue':
//       return ["#FFFFCC", "#C7E9B4", "#7FCDBB", "#41B6C4", "#1D91C0", "#225EA8", "#0C2C84", "#021448"];
//     case 'green':
//       return ['#EDF8FB', '#D7FAF4', '#CCECE6', '#66C2A4', '#41AE76', '#238B45', '#005824', '#033317'];
//     case 'purple':
//       return ['#F1E6F1', '#D8BBD8', '#CCA5CC', '#C08FC0', '#B379B3', '#A05AA0', '#8A4E8A', '#730973'];
//   }
// }
//
// function colorsBatch_opposites_greenToRed(){
//   return ['#1a9850', '#8cce8a', '#d2ecb4', '#fff2cc', '#fed6b0', '#f79272', '#d73027']
// }
//
// function colorsBatch_opposites_blueToRed(){
//   return ['#0080ff', '#40a0ff', '#7fbfff', '#fff2cc', '#ffa6a6', '#ff7a7a', '#ff4d4d']
// }
//
// function update_inMapInfo(colorsBand){
//   inMapInfo.update = function (props) {
//     if(!_.isUndefined(mapGeojson)){
//
//       this._div.innerHTML = '<div>'+
//             '<div style="font-size: 12px; color: #808080; font-weight: bold;">'+mapGeojson.place.name+'</div>'+
//             '<span style="font-size: 20px; font-weight: bold; color: #000000;">' + activeMap.presentation.title + '</span>'+
//           '</div>' +  (props ?
//           '<div style="font-size: 120%; background: ' + colorsBand(activeMap.dataSet[props.id].quantity_value) + '; ' +
//                       'color: ' + tinycolor.mostReadable( colorsBand(activeMap.dataSet[props.id].quantity_value), ["#ffffff", "#000000", "#808080"] ).toHexString() + '; ' +
//                       'padding: 5px;">' +
//             '<b>' + props.name + ': </b> ' +
//             '<span style="display: inline-block;">' +
//               '<b>' + activeMap.dataSet[props.id].quantity_value + '</b>' +
//               '<b style="text-transform: lowercase;">' + activeMap.dataSet[props.id].quantity_type + '</b><br />' +
//             '</span>' +
//           '</div>'
//           // '<b>Type: ' + props.type + '</b><br />' +
//           // '<b>country: ' + props.country + '</b><br />' +
//           // '<b>state: ' + props.state + '</b><br />' +
//           // '<b>census 2001: ' + props.census_2001_id + '</b><br />' +
//           // '<b>census 2011: ' + props.census_2011_id + '</b><br />'
//           : 'To see value, hover over the feature');
//     }
//   };
//   inMapInfo.update()
// }
//
// $('.legend.leaflet-control .a-alterRange').click(function(){
//
// });
//
//
// function getRangeArray(data, colorsBandSize) {
//   var quantity_values = _.map(data, 'quantity_value');
//   quantity_values = quantity_values.sort(function(a, b){return a-b});
//
//   var minVal = quantity_values[0],
//       maxVal = quantity_values[quantity_values.length - 1],
//       range = maxVal - minVal,
//       rangeSection = range/(colorsBandSize),   // TODO : 8 parts as of now, if more ranges included, to be taken as variable
//       rangeSectionOrder = getMaxDecimalPlacePower(rangeSection);  // rangeSection is x. in the 10 raised to power x. for range section < 1 rangeSection will be negative.
//
//   if(rangeSectionOrder < 0){
//     var originalRangeSectionOrder = rangeSectionOrder;
//     _.each(quantity_values, function(val, key){
//       quantity_values[key] = val * Math.pow( 10, Math.abs(originalRangeSectionOrder) );
//     })
//
//     minVal = quantity_values[0],
//     maxVal = quantity_values[quantity_values.length - 1],
//     range = maxVal - minVal,
//     rangeSection = range/(colorsBandSize),   // TODO : 8 parts as of now, if more ranges included, to be taken as variable
//     rangeSectionOrder = getMaxDecimalPlacePower(rangeSection);
//
//     var builtRange = buildRange();
//     _.each(builtRange, function(val, key){
//       builtRange[key] = _.round( val * Math.pow( 10, originalRangeSectionOrder), Math.abs(originalRangeSectionOrder) + 1 );
//     });
//     return builtRange;
//   }
//
//   return buildRange();
//
//   function buildRange(){
//     // var minValParts = splitNumberToParts(minVal)
//     var rangeSectionParts = splitNumberToParts(rangeSection);
//     rangeSectionParts = resetRangeSectionParts(rangeSectionParts, rangeSectionOrder);
//
//     var minMaxAndRange = resetMinMaxValAndRangeSection(rangeSectionParts, colorsBandSize);
//
//     return rangePoints(minMaxAndRange);
//   }
//
//   function rangePoints(minMaxAndRange){
//     var returnArray = [];
//     var rangeStart = minMaxAndRange.newMinVal;
//     while(rangeStart <= minMaxAndRange.newMaxVal){
//       returnArray.push(rangeStart);
//       rangeStart += minMaxAndRange.rangeSection;
//     }
//     return returnArray;
//   }
//
//   // reset range section parts. the 2nd last digit is converted to 5 or 0 for smooth range. [0, 7, 1] to [0, 0, 2]
//   function resetRangeSectionParts(rangeSectionParts, rangeSectionOrder){
//     if(rangeSectionParts[rangeSectionOrder-1] > 5){
//       rangeSectionParts[rangeSectionOrder-1] = 0; // and following
//       if(rangeSectionParts[rangeSectionOrder] < 9) {
//         rangeSectionParts[rangeSectionOrder] = rangeSectionParts[rangeSectionOrder] + 1
//       } else {
//         rangeSectionParts.push( 1 );
//       }
//     } else if (rangeSectionParts[rangeSectionOrder-1] <= 5 && rangeSectionParts[rangeSectionOrder-1] > 0) {
//       rangeSectionParts[rangeSectionOrder-1] = 5;
//     } else if (rangeSectionParts[rangeSectionOrder-1] == 0) {
//
//     }
//     _.each(rangeSectionParts, function(val, key){
//       if(key < rangeSectionOrder-1){
//         rangeSectionParts[key] = 0;
//       }
//     });
//
//     return rangeSectionParts;
//   };
//
//   // rebuild number from parts. like [0, 7, 1] to 170
//   function getRangeSectionFromParts(rangeSectionParts){
//     var rangeSection = 0;
//     _.each(rangeSectionParts, function(val, key){
//       rangeSection += val*Math.pow(10,key);
//     });
//     return rangeSection;
//   }
//
//   //
//   function resetMinMaxValAndRangeSection(rangeSectionParts, colorsBandSize){
//     var rangeSection = getRangeSectionFromParts(rangeSectionParts);
//     var newMinVal = parseInt(minVal) - parseInt(minVal)%rangeSection;
//     var newMaxVal = ( parseInt(maxVal)%rangeSection == 0 )? parseInt(maxVal) : parseInt(maxVal) + rangeSection - parseInt(maxVal)%rangeSection;
//     var newRange = newMaxVal - newMinVal;
//     var newRangeSection = newRange/(colorsBandSize);
//     var newRangeSectionOrder = getMaxDecimalPlacePower(newRangeSection);
//     var newRangeSectionParts = splitNumberToParts(newRangeSection);
//
//     newRangeSectionParts = resetRangeSectionParts(newRangeSectionParts, newRangeSectionOrder);
//     newRangeSection = getRangeSectionFromParts(newRangeSectionParts);
//
//     // To ensure that the minimum quantity value is less than the range's minimum value AND maxium quantity value is larger than the range maximum value.
//     var eligbileNewMinVal = Math.ceil(newMinVal/newRangeSection) * newRangeSection;
//     if (eligbileNewMinVal < quantity_values[0]) {
//       newMinVal = eligbileNewMinVal + newRangeSection;
//     }
//     var eligibleNewMaxVal = ( parseInt(newMaxVal)%newRangeSection == 0 )? parseInt(newMaxVal) : parseInt(newMaxVal) + newRangeSection - parseInt(newMaxVal)%newRangeSection;
//     if (quantity_values[quantity_values.length-1] < eligibleNewMaxVal) {
//       newMaxVal = eligibleNewMaxVal - newRangeSection;
//       if (quantity_values[quantity_values.length-1] < (newMaxVal - newRangeSection)) {
//         newMaxVal = newMaxVal - newRangeSection;
//       }
//     }
//
//     return {newMinVal: newMinVal, newMaxVal: newMaxVal, rangeSection: newRangeSection};
//   }
// }
//
//
// function getMaxDecimalPlacePower(val){
//   var parts = splitNumberToParts(val);
//   return parts.length-1;
// }
//
//
// function splitNumberToParts(n) {
//     var wholePart = Math.floor(n);
//     // var decimalPart = n - wholePart;
//     var parts = [];
//     var multiplier = 1;
//
//     while(wholePart > 0) {
//         var result = wholePart % 10;
//
//         parts.unshift(result);
//
//         wholePart = Math.floor(wholePart / 10);
//         multiplier *= 10;
//     }
//
//     return parts.reverse();
// }
//
// function buildAndAddLegend(colorsBand, grades, quantity_type){
//   var legend = L.control({position: 'bottomright'});
//   legend.onAdd = function (map) {
//       var div = L.DomUtil.create('div', 'info legend'),
//           labels = [];
//
//       div.innerHTML += '<div class="a-quantityType" style="padding-bottom: 10px">(All values in ' + quantity_type + ')</div>';
//
//       // loop through our density intervals and generate a label with a colored square for each interval
//       div.innerHTML +=
//           '<i style="background:' + colorsBand(grades[0] + 1) + '"></i> ' + ' > ' + grades[0] + '<br>';
//
//       for (var i = 0; i < grades.length; i++) {
//           div.innerHTML +=
//               '<i style="background:' + colorsBand(grades[i]) + '"></i> ' + ' ' +
//               (grades[i + 1] ? grades[i + 1] + ' &ndash; ' : ' < ') + grades[i] + '<br>';
//       }
//       // TODO : enable users to change range and
//       div.innerHTML += '<div class="a-alterRange text-center" onclick="alterLegendRange();" style="padding-top: 10px"><a>Change Range</a></div>'
//       return div;
//   };
//
//   legend.addTo(map);
//
//   return legend;
// }
//
// function hideLegend(){
//   $('.info.legend').html('');
// }
//
//
// function alterLegendRange(){
//   $('#alterRanges_modal').modal('show');
// }
