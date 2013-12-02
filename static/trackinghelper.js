
// call this to make charts appear or disappear
function appearance(chartName, chartSvg, chartData, chartTitle, chartType) {
    if (chartSvg.classed("notAppearing")) {
        
        // delay the render
        setTimeout(function(){ 
            if(chartType === "line") {createChart(chartName, chartSvg, chartData, chartTitle);}
            else {createBarChart(chartName,chartSvg,chartData,chartTitle);} 
            ;}
        ,700)
        //createChart(chartName, chartSvg, chartData, chartTitle) 
        chartSvg.classed("notAppearing",false);
    } 
    else {
        chartSvg.selectAll("g").remove();
        chartSvg.selectAll("text").remove(); 
        chartSvg.classed("notAppearing",true);
    } 
}


function tblAppearance(tableSvg,tableData){
    if(tableSvg.classed("notAppearing")) {
        // delay the render
        setTimeout(function() {
            drawTblD(tableSvg,tableData)
        },700)
        tableSvg.classed("notAppearing",false)
    }
    else {
        tableSvg.selectAll("g").remove();
        tableSvg.selectAll("rect").remove();
        tableSvg.selectAll("text").remove();
        tableSvg.classed("notAppearing",true);
    }
}

// all purpose transform function (pass in the chart object and destination params)
function transformIt(chartObj,transX,transY,transScaleX,transScaleY) {
    // move it there and make appear any charts passed in
    if (chartObj.classed("zoomedOut")) {
        chartObj.transition().duration(700)
                .attr("transform","translate(" + transX + "," + transY + ")scale(" + transScaleX + "," + transScaleY + ")")
        chartObj.classed("zoomedOut",false)
    }
    // move it back
    else {
        chartObj.transition().duration(700)
                .attr("transform","translate(0,0)scale(1)")
        chartObj.classed("zoomedOut",true)
    }
}

function createChart(chartName, chartSvg, chartData, chartTitle) {
    
    // create chart title
    chartSvg.append("text").attr("x",190).attr("y",25)
        .text(chartTitle).style("font-family","Roboto, arial").style("font-size","30px")

    // create dimple chart
    chartName = new dimple.chart(chartSvg,chartData);
    chartName.setBounds(75,30,w/2,h/2*.8);
    chartName.defaultColors = [ new dimple.color("tan"), new dimple.color("orange")]
    x = chartName.addCategoryAxis("x","Year");
    //b2ChrtX.showCategory = false;
    y = chartName.addMeasureAxis("y","Score")//.tickFormat = "%".showGridlines = false
    y.tickFormat = "%";
    y.showGridlines = false;
    s = chartName.addSeries("Type", dimple.plot.line);
    s.lineMarkers = true;
    s.lineWeight = 5;
    //chartName.__tooltipGroup = null;
    chartName.draw();
    //b2ChrtX.titleShape.remove();
}

function createBarChart(chartName, chartSvg, chartData, chartTitle) {

    // create chart title
    chartSvg.append("text").attr("x",200).attr("y",20)
        .text(chartTitle).style("font-family","Roboto, arial").style("font-size","20px")

    //chartSvg.append("rect").attr("width",cw).attr("height",ch).attr("fill","none").attr("stroke","lightgrey")

    // create dimple chart
    chartName = new dimple.chart(chartSvg,chartData);
    chartName.setBounds(75,70,w*.8,h/2*.65);
    x = chartName.addCategoryAxis("x","Grade");
    y = chartName.addMeasureAxis("y","Score");
    chartName.defaultColors = [ new dimple.color("grey")]
    y.tickFormat = "%";
    y.showGridlines = false;
    s = chartName.addSeries(null, dimple.plot.bar);
    x.addOrderRule(["K","1","2","3","4","5","6"]);
    chartName.draw(1000);

}

function drawTblD(tableSvg,tableData){
    // margins
    var m = 25

    // conditional formatting the cell color based on benchmarks met
    var benchmarks = [.5,.5,.5,.5,.5]
    var bIdxStart = 2

    // out with the old data
    tableSvg.selectAll("g").data([]).exit().remove()

    // rectangle portion
    var cellHeight = 40
    var rows = tableSvg.selectAll("g")
                .data(tableData)
                .enter()
                    .append("g")
                    .attr("transform",function(d,i){
                        return "translate("+m+", " + (cellHeight*i) + ")";
                    })
    // rectangles/cells
    var col1Width = (tblw-(m*2))/8*2 //first column width
    var colnWidth = (tblw-(m*2))/8 // other columns
    var cells = rows.selectAll("rect")
                    .data(function(d){return d;})
                    .enter()
                        .append("rect")
                        .attr("width",function(d,i){if(i===0){return col1Width;}else{return colnWidth;}})
                        .attr("height",cellHeight)
                        .attr("fill",function(d,i,j){return colorMeBaddTblD(d,i,j,benchmarks,bIdxStart)})
                        .attr("x",function(d,i){if(i===0){return 0}else{return i * colnWidth + colnWidth;}})
                        .attr("fill-opacity","0")
                        //.attr("stroke-width","1")
                        .attr("stroke","none")
                        //.on("dblclick",animate)
                        //.on("mouseover",function(d,i,j){if(i === 0 && j !== 0){d3.select(this).attr("fill","lightgrey")}})
                        //.on("mouseout",function(d,i,j){if(i === 0 && j !== 0){d3.select(this).attr("fill","white")}});

    // text     
    var formatter = d3.format(".1%")
    var text = rows.selectAll("text")
                    .data(function(d){return d;})
                    .enter()
                        .append("text")
                        .attr("x",function(d,i){if(i===0){return 10;}else{return i * colnWidth + 150;}})
                        .attr("y",cellHeight*.65)
                        .text(function(d,i,j){if(i>1 && j !== 0){return formatter(d);}else{return d;}})
                        .style("font-family","Roboto,arial,helvetica,sans-serif")
                        .attr("fill",function(d,i,j){if(j!==0&&i>1){return "white";}else{return "black";}})
                        .style("font-weight",function(d,i,j){if (i !== 0 && j !== 0){return "normal";}else{return "900";}})
                        .style("text-anchor",function(d,i){if(i!==0){return "middle";}else{return "right";}})
                        .style("font-size", function(d,i,j){if (i !== 0 && j !== 0){return "16px";}else{return "18px";}})
                        .attr("fill-opacity","0")
    
    cells.transition().duration(700).attr("fill-opacity","1")
    text.transition().duration(700).attr("fill-opacity","1")

        };

function colorMeBaddTblD(d,i,j,benchmarkArr,bIdxStart){
    // we don't worry about the first row or the first 2 columns
    if(j!==0 && i>1){
        if(d >= benchmarkArr[i-bIdxStart]){return "limegreen";}else{return "black";}
    }
    // color header row
    else if(j===0){return "#FFFFFF";}
    else if(j>0 && j%2===0 && i<2){return "#E6E6E6";}
    else {return "#F9F9F9";}
}

function drawTblA(tableSvg,tableData,svgHeight,svgWidth){
    // margins & dimensions
    m = 0
    tw = svgWidth
    th = svgHeight

    // conditional formatting the cell color based on benchmarks met
    var benchmarks = [.5,.5,.5]
    var bIdxStart = 1

    // out with the old data
    tableSvg.selectAll("g").data([]).exit().remove()

    // rows
    var cellHeight = 100
    var rows = tableSvg.selectAll("g")
                .data(tableData)
                .enter()
                    .append("g")
                    .attr("transform",function(d,i){
                        return "translate("+0+40+", " + (cellHeight*i+70) + ")";
                    })
    // cells
    var col1Width = tw/4*.9 //first column width
    var colnWidth = tw/4*.9 // other columns
    var cells = rows.selectAll("rect")
                    .data(function(d){return d;})
                    .enter()
                        .append("rect")
                        .attr("width",function(d,i){if(i===0){return col1Width;}else{return colnWidth;}})
                        .attr("height",cellHeight)
                        .attr("fill",function(d,i,j){return colorMeBaddTblA(d,i,j,benchmarks,bIdxStart)})
                        .attr("x",function(d,i){if(i===0){return 0}else{return i * colnWidth;}})
                        //.attr("fill-opacity","0")
                        .attr("stroke","white")
                        .attr("stroke-width",2)
                        //.on("dblclick",animate)
                        //.on("mouseover",function(d,i,j){if(i === 0 && j !== 0){d3.select(this).attr("fill","lightgrey")}})
                        //.on("mouseout",function(d,i,j){if(i === 0 && j !== 0){d3.select(this).attr("fill","white")}});

    // text     
    var formatter = d3.format(".1%")
    var text = rows.selectAll("text")
                    .data(function(d){return d;})
                    .enter()
                        .append("text")
                        .attr("x",function(d,i){if(i===0){return i * colnWidth + 80;}else{return i * colnWidth + 80;}})
                        .attr("y",cellHeight*.65)
                        .text(function(d,i,j){if(i>bIdxStart-1 && j !== 0){return formatter(d);}else{return d;}})
                        .style("font-family","Roboto,arial,helvetica,sans-serif")
                        .attr("fill",function(d,i,j){if(j!==0&&i>bIdxStart-1){return "white";}else if(j===0&&i===3){return "limegreen";}else{return "grey";}})
                        .style("font-weight",function(d,i,j){if (i !== 0 && j !== 0){return "normal";}else{return "900";}})
                        .style("text-anchor","middle")
                        .style("font-size", function(d,i,j){if (i !== 0 && j !== 0){return "30px";}else{return "35px";}})
                        //.attr("fill-opacity","0")

    //tableSvg.transition().duration(1000).attr("fill-opacity","1")
    
        };

function colorMeBaddTblA(d,i,j,benchmarkArr,bIdxStart){
    // we don't worry about the first row or the first 2 columns
    // if(j!==0 && i>bIdxStart-1){
    //     if(d >= benchmarkArr[i-bIdxStart]){return "limegreen";}else{return "black";} 
    // }
    // else {return "white"}


     if (i !== 0) { // don't color the first column
        if (j === 1) {          //first AMAO
            if (d >= .45) {
                return "limegreen";
            }
            else {
                return "black";
            }
        }
        else if (j === 2) {     // second AMAO
            if(d>=.332) {
                return "limegreen";
            }
            else {
                return "black";
            }
        }
        else if (j === 3) {                  // third AMAO
            if (d >= .52) { 
                return "limegreen";
            }
            else {
                return "black";
            }
        }
        else {return "white"}
    }
    else { return "white";}
};


// average function for json data aggregation
function average(array){
    var sum = 0
    len = array.length
    for(i = 0; i < len; i ++){
        sum += array[i];
    }
    return sum/len;
};

// filtering data function
function filter(json,district){
    // return a 2D array (3 x 3) 1 row for each AMAO (3) & 1 column for each year (3)
    var dataset = []

    // temp arrays for each year / amao combin
    tmp12a1 = []
    tmp13a1 = []
    tmp14a1 = []
    tmp12a2 = []
    tmp13a2 = []
    tmp14a2 = []
    tmp12a3 = []
    tmp13a3 = []
    tmp14a3 = []

    // flag variable - used if there is a filtering district
    tag = 0

    // if no district then set up 3 arrays 1 for each year and toss in each AMAO 
    for (i = 0; i < json.length; i++) {

        // tag if the district is relevant (1 is yes 0 is no)
        if (!district) {tag = 1}
        else if (json[i]["properties"]["NAME"] === district) {tag = 1}
        else {tag = 0}

        if(tag === 1){

            // add each of the scores to each array
            tmp12a1.push(json[i]["properties"]["2012"]["K-12"]["AMAO #1"])
            tmp13a1.push(json[i]["properties"]["2013"]["K-12"]["AMAO #1"])
            tmp14a1.push(json[i]["properties"]["2014"]["K-12"]["AMAO #1"])
            tmp12a2.push(json[i]["properties"]["2012"]["K-12"]["AMAO #2"])
            tmp13a2.push(json[i]["properties"]["2013"]["K-12"]["AMAO #2"])
            tmp14a2.push(json[i]["properties"]["2014"]["K-12"]["AMAO #2"])
            tmp12a3.push(json[i]["properties"]["2012"]["K-12"]["AMAO #3"])
            tmp13a3.push(json[i]["properties"]["2013"]["K-12"]["AMAO #3"])
            tmp14a3.push(json[i]["properties"]["2014"]["K-12"]["AMAO #3"])
        }
    }

    // average the arrays and put them into 3, 3 item arrays
    tmp1 = []
    tmp2 = []
    tmp3 = []

    
    // AMAO column
    tmp1.push(1)
    tmp2.push(2)
    tmp3.push(3)
    
    // average scores
    tmp1.push(average(tmp12a1))
    tmp1.push(average(tmp13a1))
    tmp1.push(average(tmp14a1))
    tmp2.push(average(tmp12a2))
    tmp2.push(average(tmp13a2))
    tmp2.push(average(tmp14a2))
    tmp3.push(average(tmp12a3))
    tmp3.push(average(tmp13a3))
    tmp3.push(average(tmp14a3))

    // add tmp1 - tmp3 to the dataset array and return
    dataset.push(["AMAO","2012","2013","2014"])
    dataset.push(tmp1)
    dataset.push(tmp2)
    dataset.push(tmp3)

    return dataset;
};
