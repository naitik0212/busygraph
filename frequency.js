function showDiv() {
    document.getElementById('tips').style.display = "block"
    document.getElementById('a').classList.add('hide');
    ;
}


var margin = {top: 50, right: 20, bottom: 30, left: 100},
    width = 1350 - margin.left - margin.right,
    height = 540 - margin.top - margin.bottom;

var x = d3.scale.ordinal()
    .rangeRoundBands([0, width], .1);

var y = d3.scale.linear()
    .range([height, 0]);

var xAxis = d3.svg.axis()
    .scale(x)
    .orient("bottom");

var yAxis = d3.svg.axis()
    .scale(y)
    .orient("left")
    .tickFormat(d3.format(".0%"));

var pointer = d3.tip()
    .attr('class', 'd3-tip')
    .offset([-10, 0])
    .html(function (d) {
        return "<span style='color:yellow'>" + d3.format(".2%")(d.frequency) + "</span>";
    });

var svg = d3.select("body").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

svg.call(pointer);

d3.csv("frequency.csv", type, function (error, data) {
    x.domain(data.map(function (d) {
        return d.stat;
    }));
    y.domain([0, d3.max(data, function (d) {
        return d.frequency;
    })]);

    svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis);

    svg.append("g")
        .attr("class", "y axis")
        .call(yAxis)
        .append("text")
        .attr("transform", "rotate(-90)")
        .attr("dy", ".71em")
        .attr("y", 6)
        .style("text-anchor", "end")
        .text("Busy Hours in restaurant");

    svg.selectAll(".bardiagram")
        .data(data)
        .attr("id", "bardiagram")
        .enter().append("rect")
        .attr("class", "bardiagram")
        .attr("x", function (d) {
            return x(d.stat);
        })
        .attr("width", x.rangeBand())
        .attr("y", function (d) {
            return y(d.frequency);
        })
        .attr("height", function (d) {
            return height - y(d.frequency);
        })
        // .on('mouseover', pointer.show)
        .on('mouseout', pointer.hide)
        // .on("click", function (d) {
        //     update(d.frequency, d.stat);
        // })
    .on("mouseover", function(d) {
        d3.select(this).style("cursor", "pointer");
        update.call(this, d.frequency,d.stat);
        pointer.show.call(this, d);
    });

});



function update(freq, stat) {
    var a = d3.select("#acs")
    a.selectAll("*").remove();

    var updated = d3.format(".2%")(freq);

    console.log(updated);
    var svg = d3.select("#acs")
        .append("text")
        .attr("id", "acs")
        .attr("x", 580)
        .attr("y", 30)
        .attr('font-weight', 'bold')
        .style("font-size", "18px")
        .attr("class", "title")
        .attr("text-anchor", "middle")
        .text("The Restaurant at " + stat + " will be busy about " + updated + " compared to whole day!")
    ;
}

function type(d) {
    d.frequency = +d.frequency;
    return d;
}