var path;
var projection;

drawMap();

function drawMap() {
    var width = 960,
        height = 600;

    var projection = d3.geo.albersUsa()
        .scale(1000)
        .translate([width / 2, height / 2]);

    var path = d3.geo.path()
        .projection(projection);

    var radius = d3.scale.sqrt()
        .domain([0, 1e6])
        .range([0, 15]);

    var svg = d3.select("#usMap").append("svg")
        .attr("width", width)
        .attr("height", height);

    d3.json("/us-10m.json", function(error, us) {

        console.log(us);

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

    for (var i = 0; i < results.length; i++) {
        var temp = {
            "address": "",
            "count": 0,
            "latitude": 0,
            "longitude": 0,
            "companies": []
        };

        temp.address = results[i].address;
        temp.latitude = results[i].latitude;
        temp.longitude = results[i].longitude;
        temp.count = 1;
        temp.companies.push(results[i]);
        arrayOfLocations.push(temp);
    }

    arrayOfLocations.sort(function(a,b) {
        return (a.address > b.address) ? 1 : ((b.address > a.address) ? -1 : 0);} ); //SORT BY ADDRESS

    for (i = arrayOfLocations.length - 1; i > 0; i--) {
        if (arrayOfLocations[i - 1].address == arrayOfLocations[i].address) {
            arrayOfLocations[i - 1].count += arrayOfLocations[i].count;
            arrayOfLocations[i - 1].companies.push.apply(arrayOfLocations[i - 1].companies, arrayOfLocations[i].companies);
            arrayOfLocations[i] = null;
        }
    }

    arrayOfLocations = arrayOfLocations.filter(Boolean);

    console.log("is null filtered?");
    console.log(arrayOfLocations);

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

    d3.select(".mapSvg g").append("g")
        .attr("class", "bubble")
        .selectAll("circle")
        .data(arrayOfLocations)
        .sort(function(a,b) {
            return b.count - a.count;}) //@SORT BUBBLES BY SIZE
        .enter() //A LOT OF EMPTY CIRCLE TAGS ARE GENERATED - CA THIS BE BETTER ?
        .append("circle")
        .attr("data-toggle", "modal")
        .attr("data-target", "#myModal")
        .attr("class", "mapCircle")
        .attr("locationName", function(d) {
            return d.address;
        })
        .attr("transform", function(d) {
            return "translate(" + projection([d.longitude, d.latitude]) + ")"; })
        .attr("r", function(d) {
            return (radius(d.count) * 150);
        })
        .style("fill", function(d) {
            return color(cValue(d));})
        .on("click", function(d) {
            // clear prev resuits

            d3.select(".list-group")
                .append("li")
                .attr("class", "modal-list-item list-group-item")
                .attr("value", 10)
                .attr("id", 10);
        });
}

//function zoomed() {
//    d3.select(".mapSvg g").attr("transform", "translate(" + d3.event.translate + ")scale(" + d3.event.scale + ")")
//}

d3.select(self.frameElement).style("height", height + "px");
