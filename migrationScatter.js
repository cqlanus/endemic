// import d3 from 'd3'
const d3 = require('d3')
const d3color = require('d3-scale-chromatic')
const taxa_obj = require('./data/taxa_obj.js')

const migrationScatter = (options) => {
  const height = 600, width = 900
  const margin = {top: 50, bottom: 0, left: 50, right: 50}


  d3.select("svg").remove()

  const color = d3.scaleLinear()
  .domain([1, 5, 9, 13, 17, 21, 25, 29])
  .range(d3color.schemeRdYlGn[9])

  /* Attach svg to page */
  var svg = d3.select( "body" )
    .append( "svg" )
    .attr('class', 'canvas')
    .attr( "width", width+100 )
    .attr( "height", height+100 );

  /* Attach group to svg */
  var g = svg.append( "g" )
    .attr('transform', `translate(${margin.left},${margin.top})`);

  var x = d3.scaleLinear()
    .domain([0, 30])
    .rangeRound([700, 930])

  const legend = svg.append('g')
    .attr("class", "key")
    .attr("transform", "translate(0,"+(30)+")")

  legend.selectAll('rect')
    .data(color.domain())
    .enter().append('rect')
    .attr("height", 8)
    .attr("x", function(d) {
      return x(d); })
    .attr("width", (d, i) => (i) ? x(d) - x(color.domain()[i-1]) : 31)
    .attr("fill", function(d) { return color(d); })

    legend.append("text")
      .attr("class", "caption")
      .attr("x", x.range()[0])
      .attr("y", -6)
      .attr("fill", "#000")
      .attr("text-anchor", "start")
      .attr("font-weight", "bold")
      .text("Days ago");

    legend.call(d3.axisBottom(x)
        .tickSize(13)
        .tickValues(color.domain()))
      .select(".domain")
        .remove();

  const normalName = normalizeName(options.bird)

  /* Get eBird data */
  d3.json(`https://ebird.org/ws1.1/data/obs/region_spp/recent?rtype=country&r=US&sci=${normalName}&back=30&maxResults=3000&locale=en_US&fmt=json&includeProvisional=true`)
  .get((err, data) => {
    if (!data.length) {
        alert(`No ${options.species} found in this area!`)
        return
      }

    const parseDate = d3.timeParse('%Y-%m-%d %I:%M')

    const birdData = data.map(entry => ({
      lat: entry.lat,
      lng: entry.lng,
      date: entry.obsDt,
      howMany: entry.howMany,
      daysAgo: milliToDays(Date.now() - parseDate(entry.obsDt))
    }))

    /*const maxLat = birdData.map(entry => entry.lat)
    const maxLng = birdData.map(entry => entry.lng)*/
    const y = d3.scaleLinear()
      .domain([ 23, 49])
      .range([height, 0])


    const timeDomain = d3.extent(birdData.map(entry => parseDate(entry.date)))

    const xTime = d3.scaleTime()
      .domain(timeDomain)
      .range([0, width])

    const xLng = d3.scaleLinear()
      .domain([-126, -65])
      .range([0, width])

    const yaxis = d3.axisLeft(y)
    const xaxis = d3.axisBottom( options.byTime ? xTime : xLng)

    const xPosition = options.byTime === 'true' ? (d => xTime(parseDate(d.date))) : (d => xLng(d.lng))

    const radius = options.byCount === 'true' ? (d => d.howMany) : 3

    g.selectAll('circle')
      .data(birdData)
      .enter().append('circle')
      .attr('class', 'dots')
      .attr('fill', d => color(d.daysAgo))
      .attr('stroke', 'black')
      .attr('opacity', '0.7')
      .attr('cx', xPosition)
      .attr('cy', d => y(d.lat))
      .attr('r', radius)

    g.append('g')
      .attr('class', 'axis y')
      .call(yaxis)

    g.append('g')
      .attr('class', 'axis x')
      .call(xaxis)
      .attr('transform', `translate(0, ${height})`)

    const divTooltip = d3.select("body").append("div").attr("class", "toolTip")
      g.on("mousemove", function(d){
        divTooltip.style("left", d3.event.pageX+10+"px");
        divTooltip.style("top", d3.event.pageY-25+"px");
        divTooltip.style("display", "inline-block");
        var x = d3.event.pageX, y = d3.event.pageY
        var elements = document.querySelectorAll(':hover');
        var l = elements.length
        l = l-1
        var elementData = elements[l].__data__
        divTooltip.html(`
          ${elementData.howMany} ${elementData.howMany > 1 ? 'birds' : 'bird'} <br>
          ${elementData.daysAgo} ${elementData.daysAgo > 1 ? 'days' : 'day'} ago

        `);
        });
      g.on("mouseout", function(d){
        divTooltip.style("display", "none");
        })
  })
}

const normalizeName = commonName => {
  const name = commonName.trim()
  const sciName = taxa_obj[name]
  if (!sciName) {
    alert(`${name} is not recognized as a species. Try again.`)
    return
  }
  const normalName = sciName.split(' ').join('%20')
  return normalName
}

const milliToDays = ms => {
  return Math.floor(ms/(1000*60*60*24))
}

// migrationScatter('Mniotilta varia')
export default migrationScatter
