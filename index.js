const d3 = require('d3')
const monthlyObsHisto = year => {


d3.json(`http://api.inaturalist.org/v1/observations/histogram?geo=true&year=${year}&date_field=observed&interval=month_of_year`)
  .get((err, data) => {
    const monthlyObservations = data.results.month_of_year
    const keys = Object.keys(monthlyObservations)
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

    const monthlyObservationsArr = keys.map((key, i) => {
      return {
        month: months[i],
        obs: monthlyObservations[key]
      }
    })
    console.log(monthlyObservationsArr)

    const canvas = d3.select('body').append('svg').attr('height', "500").attr('width', '800');
    const height = 300, width = 500
    const margin = {left:70, right: 50, top: 40, bottom: 0}
    const obsArr = monthlyObservationsArr.map(obsObj => obsObj.obs)

    const y = d3.scaleLinear()
      .domain([0, d3.max(obsArr)])
      .range([height, 0])

    const x = d3.scaleBand()
      .domain(months)
      .padding(0.1)
      .rangeRound([0, width])

    const yAxis = d3.axisLeft(y).ticks(2)
    const xAxis = d3.axisBottom(x)

    const chartGroup = canvas
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`)

    chartGroup.selectAll('.bar')
      .data(monthlyObservationsArr)
      .enter().append('rect')
      .attr('class', 'bar')
      .attr('x', d => x(d.month))
      .attr('y', d => y(d.obs))
      .attr('width', d => width/monthlyObservationsArr.length - 5)
      .attr('height', d => height - y(d.obs))


    chartGroup.append('g')
      .attr('class', 'axis y')
      .call(yAxis)

    chartGroup.append('g')
      .attr('class', 'axis x')
      .call(xAxis)
      .attr('transform', `translate(0, ${height})`)

  })

}

module.exports = monthlyObsHisto

