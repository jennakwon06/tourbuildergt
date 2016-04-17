var path;
var projection;

drawMap();

function drawMap() {
    var width = 960,
        height = 600;

    projection = d3.geo.albersUsa()
        .scale(1000)
        .translate([width / 2, height / 2]);

    var path = d3.geo.path()
        .projection(projection);

    var radius = d3.scale.sqrt()
        .domain([0, 1e6])
        .range([0, 15]);

    var svg = d3.select("#usMap").append("svg")
        .attr("width", width)
        .attr("height", height)
        .attr("class", "mySvg");

    d3.json("/us-10m.json", function(error, us) {


        //https://bl.ocks.org/mbostock/9943478
        if (error) throw error;

        svg.insert("path", ".graticule")
            .datum(topojson.feature(us, us.objects.land))
            .attr("class", "land")
            .attr("d", path);

        svg.insert("path", ".graticule")
            .datum(topojson.mesh(us, us.objects.states, function(a, b) { return a !== b; }))
            .attr("class", "border border--state")
            .attr("d", path);

        svg.insert("g")
            .attr("class", "bubble")
            .selectAll("circle")
            .data(topojson.feature(us, us.objects.counties).features)
            .enter().append("circle")
            .attr("r", function(d) { return 2;});

    });
}

function drawBubblesOnMap(results) {

    d3.select(".bubble").remove();

    var arrayOfLocations = [];

    var radius = d3.scale.sqrt()
        .domain([0, 1e6])
        .range([0, 15]);

    var cValue = function(d) { return d.address;},
        color = d3.scale.category10();

    //svg.append("g")
    //    .attr("class", "bubble")
    //    .selectAll("circle")
    //    .data(topojson.feature(us, us.objects.counties).features
    //        .sort(function(a, b) { return b.properties.population - a.properties.population; }))
    //    .enter().append("circle")
    //    .attr("transform", function(d) { return "translate(" + path.centroid(d) + ")"; })
    //    .attr("r", function(d) { return radius(d.properties.population); });


    d3.csv('/data/cityd_latlong.csv', function (data) {

        console.log("whats the count")
        console.log($("#sliderCount"))
        d3.select(".mySvg").append("g")
            .attr("class", "bubble")
            .selectAll("circle")
            .data(data)
            .enter()
            .append("circle")
            .filter(function(d) {
                if (d.Artist.toUpperCase() === results.toUpperCase()){
                    return d;
                }
            })
            .attr("class", "mapCircle")
            .attr("transform", function (d) {
                return "translate(" + projection([d.longitude, d.latitude]) + ")";
            })
            .attr("r", function (d) {
                return (radius(d.Rank) * 250);
            })
            .style("fill", function (d) {
                return color(cValue(d));
            })
            .on("click", function (d) {
            });
    });
}

//function zoomed() {
//    d3.select(".mapSvg g").attr("transform", "translate(" + d3.event.translate + ")scale(" + d3.event.scale + ")")
//}

d3.select(self.frameElement).style("height", height + "px");
