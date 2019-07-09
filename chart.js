var graphData, allValues
var drow_chart = (data_, linetype) => {
    var data = data_
    graphData = data_
    d3.select("svg").remove();
    var width = screen.width - 550;
    var height = screen.height - 300;
    var margin = 80;
    var duration = 250;
    
    var lineOpacity = "0.7";
    var otherLinesOpacityHover = "0.1";
    
    var circleOpacity = '0.85';
    var circleRadius = 3;
    
    
    allValues = data.reduce(( fullArr, d) => fullArr.concat(d.sieverts), [])
   /* Scale */
    var xScale = d3.scaleTime()
        .domain([d3.min(allValues.map(v => v.date)), d3.max(allValues.map(v => v.date))])
        .range([0, (width-margin) - 200]);

    var yScale = d3.scaleLinear()
        .domain([d3.min(allValues.map(v => v.sievert)), d3.max(allValues.map(v => v.sievert))])
        .range([0, height-margin]);
    
    var color = d3.scaleOrdinal(d3.schemeCategory10);
    
    /* Add SVG */
    var svg = d3.select("#chart").append("svg")
        .attr("width", (width+margin)+"px")
        .attr("height", (height+margin)+"px")
        .append('g')
        .attr("transform", `translate(${150}, ${margin})`);
    
    
    // /* Add sieverts into SVG */
    
    var line = d3.line()
        // .curve(d3.curveCatmullRom.alpha(1))
        // .curve(d3.curveBasis)
        .curve(linetype == 'step' ? d3.curveStep : d3.curveBasis)
        .x(d => xScale(d.date))
        .y(d => yScale(d.sievert));
    
    let lines = svg.append('g').attr('class', 'lines');
    
    lines.selectAll('.line-group')
        .data(data).enter()
        .append('g')
        .attr('class', 'line-group')  
        .append('path')
            .attr('class', 'line')  
            .attr('d', d => line(d.sieverts))
            .style('stroke', (d, i) => color(i))
            .style('opacity', lineOpacity)
            .style('stroke-width', 1.5)
            .style('stroke-linecap', "round")
            .style('fill', "none")
   
    let linesHov = svg.append('g').attr('class', 'lines-hov');

    linesHov.selectAll('.line-hov-group')
        .data(data).enter()
        .append('g')
        .attr('class', 'line-group')  
        .append('path')
            .attr('class', 'line-hov')  
            .attr('d', d => line(d.sieverts))
            .style('opacity', 0)
            .style('stroke-width', 6)
            .style('fill', "none")
            .style('stroke', (d, i) => color(i))
            .on("mouseover", (d) => hover(d))
            .on("mouseout", (d) => out(d));

    let labels = svg.append('g').attr('class', 'labels');

    labels.selectAll('.labels')
        .data(data).enter()
        .append('g')    
            .append("text")
            .attr("class", "label-text")
            .attr("height", 30)
            .attr("width", 200)
            .style("fill", (d, i) => color(i))        
            .text(d => d.name)
            // .attr("text-anchor", "middle")
            .attr("y", (d, i) => 30 * i )
            .attr("x", width - 180)
            .on("mouseover", (d) => hover(d))
            .on("mouseout", (d) => out(d));
        
    let circles = svg.append('g')
            .attr('class', 'circles');

    // /* Add circles in the line */
    circles.selectAll("circles")
        .data(data).enter()
        .append("g")
        .attr("class", "circle")
        .style("fill", (d, i) => color(i))
        .selectAll("circle")
        .data(d => d.sieverts).enter()
        .append("g")
        .append("circle")
        .attr("cx", d => xScale(d.date))
        .attr("cy", d => yScale(d.sievert))
        .attr("r", circleRadius)
        .attr('sievert-name', d => d.name)
        .style('opacity', circleOpacity)
    
    
    
    // /* Add Axis into SVG */
    var xAxis = d3.axisBottom(xScale).ticks(5);
    var yAxis = d3.axisLeft(yScale).ticks(5);
    
    svg.append("g")
        .attr("class", "x axis")
        .attr("transform", `translate(0, ${height-margin})`)
        .call(xAxis)
        .selectAll('text')
            .attr("transform", "translate(-10,10)rotate(-45)")
            .style("text-anchor", "end")
            .style("font-size", 20)
            .style("fill", "rgb(76, 77, 77)");
    
    // svg.append("g")
    //     .attr("class", "y axis")
    //     .call(yAxis)
        
}


     
var hover = (d) => {
    d3.selectAll('.line').filter(line => line.name != d.name)
                    .style('opacity', .1);
    d3.selectAll('.label-text').filter(line => line.name != d.name)
                .style('opacity', .1);
    d3.selectAll('.circle').filter(line => line.name != d.name)
                .style('opacity', .1);
}
var out = (d) => {
    d3.selectAll(".line").style('opacity', .9);
    d3.selectAll(".label-text").style('opacity', .9);
    d3.selectAll(".circle").style('opacity', .9);
}