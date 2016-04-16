Template.Home.rendered = function() {
    $.getScript("/usmap.js");
    $.getScript("/userInput.js");

};

Template.Home.events({

    'click #getRequest': function(e) {
        console.log("getting request?");
        var xmlHttp = new XMLHttpRequest();
        xmlHttp.open( "GET", "http://ec2-52-90-21-18.compute-1.amazonaws.com/", false ); // false for synchronous request
        xmlHttp.send( null );
        console.log(xmlHttp.responseText);
    },

    'click #sortByRankingButton': function(e) {
        //fillTable(globalFilter.top(Infinity).reverse())
    },

    'click #sortByCityButton': function(e) {
        //fillTable(globalFilter.top(Infinity).sort(function(a,b) {
        //    return a.industry.localeCompare(b.industry);
        //}))

    },

    'click #sortByPopularityButton': function(e) {
        //fillTable(globalFilter.top(Infinity).sort(function(a,b) {
        //    return a.sector.localeCompare(b.sector);
        //}))
    },

    'click #sortByRevenueButton': function(e) {
        //fillTable(globalFilter.top(Infinity).sort(function(a,b) {
        //    return a.country.localeCompare(b.country);
        //}))
    }

});

var fillTable = function(results){
    var table = $(".resultsTable");

    //clear table
    $('.resultsTable > tbody').empty();

    for (var i = 0; i <= results.length - 1; i++) {
        var tr = document.createElement('tr');

        tr.className += "clickableRow";
        tr.id += results[i].Name;
        tr.setAttribute("data-toggle", "modal");
        tr.setAttribute("data-target", "#myModal");

        var td1 = document.createElement('td');
        var td2 = document.createElement('td');
        var td3 = document.createElement('td');
        var td4 = document.createElement('td');

        td1.appendChild(document.createTextNode(results[i].Name));
        td2.appendChild(document.createTextNode(results[i].industry));
        td3.appendChild(document.createTextNode(results[i].sector));
        td4.appendChild(document.createTextNode(results[i].country));

        tr.appendChild(td1);
        tr.appendChild(td2);
        tr.appendChild(td3);
        tr.appendChild(td4);
        //tr.data(results[i]);
        table.append(tr);
    }
};

Template.Home.helpers({
	
});
