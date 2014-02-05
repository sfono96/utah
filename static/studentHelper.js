
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

    // canvas
    obj.chartName = motherShip.append("svg").attr("height",obj.chartHeight).attr("width",obj.chartWidth).append("g").attr("transform","translate(0,"+obj.yPos+")")//.on("click",click)
    // var cframe = canvas.append("rect").attr("height",height).attr("width",width).attr("fill","none").attr("stroke","black")

    // scales
    obj.xScale = d3.scale.ordinal().domain([2011,2012,2013]).rangeBands([obj.margins.left,obj.chartWidth-obj.margins.right])
    obj.yScale = d3.scale.linear().domain(obj.yDomain).range([obj.chartHeight-obj.margins.bottom,obj.margins.top]) // inverted range

    // axis
    obj.xAxis = d3.svg.axis().scale(obj.xScale).orient("bottom")
    obj.yAxis = d3.svg.axis().scale(obj.yScale).orient("left").ticks(obj.yAxisTickCount)

    // line generator
    obj.line = d3.svg.line()
        .x(function(d){return obj.xScale(d.x);}) // set up as list of dictionaries
        .y(function(d){return obj.yScale(d.y);})    
        .interpolate("monotone")

    // draw the chart
    //obj.chartName.append("g").attr("class","x axis").attr("transform","translate(0,"+(obj.chartHeight-obj.margins.bottom)+")").call(obj.xAxis); 

    obj.chartName.append("g").attr("class","y axis").attr("transform","translate("+obj.margins.right+",0)").call(obj.yAxis);

    obj.lines = obj.chartName.selectAll("g.line")
        .data(obj.dataObj)
        .enter()
        .append("g");

    obj.lines.append("path")
        //.attr("classed","line")
        .attr("class",function(d,i,j){if(i===0){return "line";}else{return "distribution";}})
        .attr("d",function(d,i){return obj.line(d);})
        .attr("transform","translate("+(obj.margins.left,obj.chartWidth-obj.margins.right)/6+",0)")

    obj.lines.selectAll("circle")
        .data(function(d){return d;})
        .enter().append("svg:circle")
            .attr("cx",function(d,i,j){if(j===0){return obj.xScale(d.x);}})
            .attr("cy",function(d,i,j){if(j===0){return obj.yScale(d.y);}})
            .attr("r",function(d,i,j){if(j===0){return "4px";}})
            .attr("fill",function(d,i,j){if(j===0){return "lightblue";}})
            .attr("stroke","steelblue")
            .attr("stroke-width","2px")
            .attr("transform","translate("+(obj.margins.left,obj.chartWidth-obj.margins.right)/6+",0)")
}

// returns the y position of a chart depending on order (index), how many other visible charts (n) and the height of the total charts canvas (motherShip)
function whatIsMyChartYPos(index,n,motherShipHeight) {
    motherShipHeight/n*index
}

// who is leaving between old and new lists
function getOut(oldList,newList){
    var outList = []
    for(i=0;i<oldList.length;i++){
        var found = 0
        for(j=0;j<newList.length;j++){
            if(oldList[i]===newList[j]){found = 1;}
        }
        if(found===0){outList.push(oldList[i])}
    }
    return outList
};

// who is transitioning between old and new lists
function scootOver(oldList,newList){
    var transitionList = []
    for(i=0;i<oldList.length;i++){
        var found = 0
        for(j=0;j<newList.length;j++){
            if(oldList[i]===newList[j]){found = 1;}
        }
        if(found===1){transitionList.push(oldList[i])}
    }
    return transitionList
};

// who is new
function getIn(oldList,newList){
    var newKids = []
    for(i=0;i<newList.length;i++){
        var found = 0
        for(j=0;j<oldList.length;j++){
            if(newList[i]===oldList[j]){found=1;}
        }
        if(found===0){newKids.push(newList[i])}
    }
    return newKids
};

// now that we know who is leaving we kick them outList
function kickingThemOut(outList){
    var temp = {"ualpa":ualpa,"crtla":crtla,"crtma":crtma,"grades":grades,"attendance":attendance}
    for(i=0;i<outList.length;i++){  
        if(temp[outList[i]]){
            temp[outList[i]].chartName.selectAll("g").remove();
        }
    }
};

// transition to new spot but leave the space for new ones
function scootingThemOver(transitionList,currentAll){
    if(transitionList.length>0){ // do only if transitions
        var temp = {"ualpa":ualpa,"crtla":crtla,"crtma":crtma,"grades":grades,"attendance":attendance}
        var incr = height/currentAll.length // new height of each chart
        for(i=0;i<transitionList.length;i++){
            var chart = temp[transitionList[i]] // relevant chart object
            chart.chartName.attr("height",incr)
            chart.chartName.attr("transform","translate(0,"+(i*incr)+")") // figure out and give new chart Y Pos
            chart.yScale.range([height/currentAll.length-chart.margins.bottom/currentAll.length,chart.margins.top/currentAll.length]) // figure out and give new Y Axis scale
            // move them    
            // set the transition of the mother svg and (with associated "g" variable)
            var t = chart.chartName.transition().duration(700);   
            
            // handle the axis and line redraws
            t.select(".y.axis").call(chart.yAxis)
           //t.select(".x.axis").attr("transform","translate(0,"+(incr*i)+")").call(chart.xAxis);
            t.select(".line").attr("d",function(d,i){return chart.line(d);})
            t.selectAll(".distribution").attr("d",function(d,i){return chart.line(d);})
            t.selectAll("circle").attr("cx",function(d,i,j){if(j===0){return chart.xScale(d.x);}}).attr("cy",function(d,i,j){if(j===0){return chart.yScale(d.y);}})       
        }
    }
}