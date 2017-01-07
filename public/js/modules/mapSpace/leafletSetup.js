var map = L.map('mapSpace', {
  scrollWheelZoom: true,
  doubleClickZoom: true,
  keyboardZoomOffset : 0.20,
  color: '#000',
  fillColor: '#ffffff',
  width: 1,
  clickable: true
});

var mapGeojson;
var geojsonObject;
var layers = [];
var activeDataSet;

// create a layers group
// get layer and add to the map
// identify the layers
// get the current status of the map, i.e. which layer is active in it

// fetch basemap.
$.ajax({
  dataType: "json",
  // url: "/xmlToDb/kangraVillages",
  // url : '/returnGeoJson/india/districts',
  // url : '/geo/{type}/{context}/{granularity}' // /geo/state/2/district
  // url : '/returnGeoJson/india',
  url : '/geo/block/39/village',
  // url : '/geo/tehsil/15/village',
  success: function(data) {
    mapGeojson = data;
    addGeoJsonToMap(data);
    // censusPopulationCoropleth();
  }
}).error(function() {

});


function addGeoJsonToMap(geoJson) {
  geojsonObject = L.geoJson(geoJson, {
    style : function(features){
      console.log(features);
      return {color: '#000000', weight: '1'};
    },
    onEachFeature: onEachFeature
  })
  // console.log(geojsonObject);
  geojsonObject.addTo(map);
  map.fitBounds( geojsonObject.getBounds() );
};

//
// var max = 0;
// function censusPopulationCoropleth(){
//   var populationDen = 0;
//
//   fetchData(function(activeDataSet){
//     geojsonObject = L.geoJson(mapGeojson, {
//       style : function(features){
//         populationDen =  ( activeDataSet[features._id].properties.tot_p / turf.area(features) ) * 1000000;
//         if(populationDen > max) {
//           max = populationDen;
//         }
//         activeDataSet[features._id].properties.populationDen = populationDen;
//         return {fillColor: getColor(populationDen), weight: '1', fillOpacity: 0.8, color: '#000000', dashArray: '3'};
//       },
//       onEachFeature: onEachFeature
//     });
//     geojsonObject.addTo(map);
//   });
//
// };
//
// function getColor_reds(d){
//   return d > 2000 ? '#800026' :
//          d > 1000  ? '#BD0026' :
//          d > 500  ? '#E31A1C' :
//          d > 300  ? '#FC4E2A' :
//          d > 100   ? '#FD8D3C' :
//          d > 50   ? '#FEB24C' :
//          d > 10   ? '#FED976' :
//                     '#FFEDA0';
// }
//
// function getColor(d){
//   return d > 3000 ? '#021448' :
//          d > 2000  ? '#0C2C84' :
//          d > 1000  ? '#225EA8' :
//          d > 600  ? '#1D91C0' :
//          d > 300   ? '#41B6C4' :
//          d > 100   ? '#7FCDBB' :
//          d > 50   ? '#C7E9B4' :
//                     '#FFFFCC';
// }
//
// function fetchData(callback){
//   $.ajax({
//     dataType: "json",
//     url: "/tehsilCensusData",
//     success: function(data) {
//       activeDataSet = _.keyBy(data, '_id');
//       callback(activeDataSet);
//     }
//   }).error(function() {
//
//   });
// }

function highlightFeature(e) {
    var layer = e.target;

    layer.setStyle({
        weight: 2,
        color: '#ff0000',
        dashArray: '',
        fillOpacity: 0.7
    });

    if (!L.Browser.ie && !L.Browser.opera) {
        layer.bringToFront();
    }

    // console.log(layer);
    // console.log(activeDataSet);
    // inMapInfo.update(activeDataSet[layer.feature._id].properties);
    // inMapInfo.update(layer.feature.properties);
}

function resetHighlight(e) {
    geojsonObject.resetStyle(e.target);
    inMapInfo.update();
}
//
function zoomToFeature(e) {
    map.fitBounds(e.target.getBounds());
}

function onEachFeature(feature, layer) {
    layer.on({
        mouseover: highlightFeature,
        mouseout: resetHighlight,
        click: zoomToFeature
    });
}
//
var inMapInfo = L.control();

inMapInfo.onAdd = function (map) {
    this._div = L.DomUtil.create('div', 'inMapInfo'); // create a div with a class "info"
    this.update();
    return this._div;
};

// method that we will use to update the control based on feature properties passed
inMapInfo.update = function (props) {
  // console.log(props)
  this._div.innerHTML = '<h4>Palampur Villages Population Density</h4>' +  (props ?
      '<b>' + props.vt_name + '</b><br />' + props.populationDen + ' people / km<sup>2</sup>'
      : 'Hover over a state');
};

inMapInfo.addTo(map);

// var legend = L.control({position: 'bottomright'});
// legend.onAdd = function (map) {
//     var div = L.DomUtil.create('div', 'info legend'),
//         grades = [0, 50, 100, 300, 600, 1000, 2000, 3000],
//         labels = [];
//
//     // loop through our density intervals and generate a label with a colored square for each interval
//     for (var i = 0; i < grades.length; i++) {
//         div.innerHTML +=
//             '<i style="background:' + getColor(grades[i] + 1) + '"></i> ' +
//             grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');
//     }
//     return div;
// };
//
// legend.addTo(map);

var logo = L.control({position: 'bottomleft'});
logo.onAdd = function(map){
  var div = L.DomUtil.create('div', 'info logo');

  div.innerHTML = '<div>'+
                    '<div style="font-size: 10px; color: #909090; line-height: 1;">powered by</div>'+
                    '<div style="color: #808080; font-weight: bold; line-height: 1; font-size: 16px;" class="comfortaa">samagr</div>' +
                  '</div>'

  return div;
}
logo.addTo(map);

// map.on('contextmenu', function(e) {
//   alert(e.latlng);
// });

// L.Icon.Default.imagePath = 'packages/bevanhunt_leaflet/images';
