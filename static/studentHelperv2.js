
// check which checkboxes are checked
function checkItOut(){
    checkedOnes = [] // global variable
    $('input[type="checkbox"]').each(function(){
        if (this.checked){
          checkedOnes.push(this.value)
        }   
    });
    return checkedOnes;
};

// draw chart - set x Axis (2011,2012,2013 - ordinal scale) - initial draw
// function drawLineChart(chartHeight,chartWidth,chartYDomain,yAxisTickCount,dataObj,chartName,margins,yScale,xScale,yAxis,xAxis,line) {
function drawLineChart(obj) {
    
    // range vs. student
    var student = true
    if(obj.History.length>1){var student = false}

    // y scale only (X is same for all series)
    obj.yScale = d3.scale.linear().domain(obj.yDomain).range([height-margins.bottom,margins.top]) // inverted range

    // line generator
    obj.line = d3.svg.line()
        .x(function(d){return xScale(d.x);}) // set up as list of dictionaries
        .y(function(d){return obj.yScale(d.y);})    
        .interpolate("monotone")

    // draw lines
    obj.lines = motherShip.selectAll(obj.lineName)
        .data(obj.History)
        .enter()
        .append("g");

    // tooltip for the peer distribution
    var tip = d3.tip()
        .attr('class', 'd3-tip')
        .offset([-10, 0])
        .html(function(d) {
        return "# of Peers: " + d.p + "<br>" + d.q + ": "+ d.y;console.log("showed")
    });

    obj.lines.call(tip)

    obj.lines.append("path")
        //.attr("class",obj.lineName)
        .attr("d",function(d){return obj.line(d);})
        .attr("transform","translate("+(margins.left,width-margins.right)/6+",0)")
        .style("stroke-dasharray",function(d){if(!student){return ("6,3");}})
        .attr("fill","none")
        .attr("stroke",function(d){return obj.color;})
        .attr("stroke-width","3px")


    var circles = obj.lines.selectAll("circle")
            .data(function(d){return d;})
            .enter().append("svg:circle")
                .attr("cx",function(d,i,j){return xScale(d.x);})
                .attr("cy",function(d,i,j){return obj.yScale(d.y);})
                .attr("r","6px")
                .attr("fill",function(d){if(student){return "white";}else{return obj.color;}})
                .attr("stroke",function(d){return obj.color;})
                .attr("stroke-width",function(d){if(student){return "3px";}else{return "0px";}})
                .attr("transform","translate("+(margins.left,width-margins.right)/6+",0)")

    if(student){
        obj.lines.selectAll("text")
                .data(function(d){return d;})
                .enter().append("svg:text")
                    .attr("class","myText")
                    .attr("x",function(d,i,j){if(j===0){return xScale(d.x);}})
                    .attr("y",function(d,i,j){if(j===0){return obj.yScale(d.y);}})
                    .text(function(d){return d.y;})
                    .style("text-anchor","middle")
                    .attr("transform","translate("+((margins.left,width-margins.right)/6)+",-15)")
    } else {
        circles.on("mouseover.tooltip",tip.show)
        circles.on("mouseout.tooltip",tip.hide)

    }
}

