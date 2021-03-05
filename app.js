fetch('https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/cyclist-data.json')
    .then(response => response.json())
    .then(data => {

        const width = 900,
            height = 400,
            marginWidth = 60,
            marginHeight = 50;

        let tooltip = d3
            .select('#app')
            .append('div')
            .attr('id', 'tooltip')
            .style('opacity', 0);

        let svgContainer = d3
            .select('#app')
            .append('svg')
            .attr('width', width + marginWidth)
            .attr('height', height + marginHeight)
            .attr('class', "svgContainer");

        let years = data.map(item => {
            return new Date(Date.UTC(item.Year, 0, 1, 0, 0, 0))
        }
        )
        let xScale = d3.scaleTime()
            .domain([d3.min(years), d3.max(years)])
            .range([0, width])

        let xAxis = d3.axisBottom().scale(xScale).tickFormat(d3.timeFormat('%Y'));
        svgContainer
            .append('g')
            .call(xAxis)
            .attr('id', 'x-axis')
            .attr('transform', 'translate(60, 400)');

        let timeUtc = data.map(d => new Date(Date.UTC(1970, 0, 1, 0, d.Time.split(":")[0], d.Time.split(":")[1])))
        let timeMin = d3.min(timeUtc)
        let timeMax = d3.max(timeUtc)
        let yScale = d3.scaleTime().domain([timeMax, timeMin]).range([0, height]);
        let yAxis = d3.axisLeft(yScale)
            .tickFormat(d3.timeFormat('%M:%S'))

        svgContainer
            .append('g')
            .call(yAxis)
            .attr('id', 'y-axis')
            .attr('transform', 'translate(60, 0)');

        svgContainer.selectAll("circle")
            .data(data)
            .enter()
            .append("circle")
            .attr("cx", (d) => marginWidth + xScale(new Date(Date.UTC(d.Year, 0, 1, 0, 0, 0))))
            .attr("cy", (d) => yScale(new Date(Date.UTC(1970, 0, 1, 0, d.Time.split(":")[0], d.Time.split(":")[1]))))
            .attr("r", 5)
            .attr("class", "dot")
            .attr("data-xvalue", (d) => new Date(Date.UTC(d.Year, 0, 1, 0, 0, 0)).getFullYear())
            .attr("data-yvalue", (d) => new Date(Date.UTC(1970, 0, 1, 0, d.Time.split(":")[0], d.Time.split(":")[1])).toISOString())
            .on('mouseover', (d, i) => {
                tooltip
                    .html("Year : " + i.Year + "<br/>" +
                        "Time : " + i.Time + "<br/>" +
                        "Place : " + i.Place + "<br/>" +
                        "Name : " + i.Name + "<br/>"
                    )
                    .attr('all', JSON.stringify(i))
                    .attr('data-year', d.srcElement.dataset.xvalue)
                    .style('left', d.clientX + 'px')
                    .style('top', height - 100 + 'px')
                    .style('transform', 'translateX(60px)')
                    .style('opacity', 0.9);
            })
            .on('mouseout', function () {
                tooltip.style('opacity', 0);
            });

    }
    );