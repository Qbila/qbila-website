var width = 960,
    height = 760;

var svg = d3.select("#mapSpace")
            .attr("width", width)
            .attr("height", height);

console.log(topojson);


d3.json("/geo/pollingBooths", function(err, data) {
  console.log(data.arcs);
  if (err) return console.error(err);
  svg.append('path')
     .datum(topojson.feature(data, data.objects.subunits))
     .attr("d", d3.geo.path().projection(d3.geo.mercator()));
});


// d3.json("https://bost.ocks.org/mike/map/uk.json", function(err, data) {
//   console.log(data);
//   if (err) return console.error(err);
//   svg.append('path')
//      .datum(topojson.feature(data, data.objects.subunits))
//      .attr("d", d3.geo.path().projection(d3.geo.mercator()));
// });
