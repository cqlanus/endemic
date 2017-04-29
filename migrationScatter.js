// import d3 from 'd3'
const d3 = require('d3')

const migrationScatter = (speciesName) => {
  const height = 600, width = 900
  const margin = {top: 50, bottom: 0, left: 50, right: 50}


  d3.select("svg").remove()

  /* Attach svg to page */
  var svg = d3.select( "body" )
    .append( "svg" )
    .attr( "width", width+100 )
    .attr( "height", height+100 );

  /* Attach group to svg */
  var g = svg.append( "g" )
    .attr('transform', `translate(${margin.left},${margin.top})`);

  const normalName = normalizeName(speciesName)

  /* Get eBird data */
  d3.json(`http://ebird.org/ws1.1/data/obs/region_spp/recent?rtype=country&r=US&sci=${normalName}&back=30&maxResults=3000&locale=en_US&fmt=json&includeProvisional=true`)
  .get((err, data) => {
    // console.log(data.length)

    const birdData = data.map(entry => ({
      lat: entry.lat,
      lng: entry.lng,
      date: entry.obsDt,
      howMany: entry.howMany
    }))

    const maxLat = birdData.map(entry => entry.lat)
    const maxLng = birdData.map(entry => entry.lng)
    const y = d3.scaleLinear()
      .domain([/*Math.floor(Math.min(...maxLat))*/ 25, 49/*Math.max(...maxLat)*/])
      .range([height, 0])
    // console.log(Math.max(...maxLat))

    const parseDate = d3.timeParse('%Y-%m-%d %I:%M')
    const timeDomain = d3.extent(birdData.map(entry => parseDate(entry.date)))

    // const x = d3.scaleTime()
    //   .domain(timeDomain)
    //   .range([0, width])

    const x = d3.scaleLinear()
      .domain([-126, -65])
      .range([0, width])

    const yaxis = d3.axisLeft(y)
    const xaxis = d3.axisBottom(x)

    g.selectAll('circle')
      .data(birdData)
      .enter().append('circle')
      .attr('class', 'dots')
      .attr('fill', 'steelblue')
      .attr('cx', d => x(d.lng))
      .attr('cy', d => y(d.lat))
      .attr('r', 3)

    g.append('g')
      .attr('class', 'axis y')
      .call(yaxis)

    g.append('g')
      .attr('class', 'axis x')
      .call(xaxis)
      .attr('transform', `translate(0, ${height})`)
  })
}

const normalizeName = (latinName) => {
  return latinName.split(' ').join('%20')
}

// migrationScatter('Mniotilta varia')
export default migrationScatter