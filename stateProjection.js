const d3 = require('d3')
const iljson = require('./data/il-county.json')
const wijson = require('./data/wi-county.json')
const txjson = require('./data/tx-county.json')
const msjson = require('./data/ms-county.json')
const cajson = require('./data/ca-county.json')
const taxa_obj = require('./data/taxa_obj.js')
const state_lngs = require('./data/state_lngs.json')
const d3color = require('d3-scale-chromatic')


const stateDistributionChart = options => {
  const height = 800, width = 960
  let centered;
  const margin = {top: 50, bottom: 0, left: 50, right: 50}

  let statejson = 'IL'
  let rotation = 88

  switch (options.state) {
    case 'IL':
      statejson = iljson
      rotation = state_lngs['IL']
      break
    case 'WI':
      statejson = wijson
      rotation = state_lngs['WI']
      break
    case 'TX':
      statejson = txjson
      rotation = state_lngs['TX']
      break
    case 'MS':
      statejson = msjson
      rotation = state_lngs['MS']
      break
    case 'CA':
      statejson = cajson
      rotation = state_lngs['CA']
      break

    default:
      statejson = 'IL'
      break;
  }

  d3.select("svg").remove()

  /* Create a color function */

  const color = d3.scaleThreshold()
    .domain([1, 3, 5, 10, 15, 30])
    .range(d3color.schemeRdYlGn[7])

  /* Define a projection function */
  const albersProj = d3.geoAlbers()
    .center([0,40.08])
    .rotate([rotation, 0])
    .translate([width/2, height/2])
    .fitSize([width, height], statejson)

  /* Define a path function */
  const geoPath = d3.geoPath()
    .projection(albersProj)
    .pointRadius(5)

  const zoom = d3.zoom()
    .scaleExtent([1, 100])
    .on("zoom", zoomFn)


  /* Attach svg to page */
  var svg = d3.select( "body" )
    .append( "svg" )
    .attr('class', 'canvas')
    .attr( "width", width )
    .attr( "height", height );

  /* Attach group to svg */
  var g = svg.append( "g" )
      // .attr('transform', `translate(${margin.left},${margin.top})`)

  var x = d3.scaleLinear()
    .domain([0, 30])
    .rangeRound([700, 930])


  const legend = svg.append('g')
    .attr("class", "key")
    .attr("transform", "translate(0,"+(50)+")")

  legend.selectAll('rect')
    .data(color.range().map(d => {
      d = color.invertExtent(d)
      if (d[0] == null) d[0] = x.domain()[0]
      if (d[1] == null) d[1] = x.domain()[1]
      return d
    }))
    .enter().append('rect')
    .attr("height", 8)
    .attr("x", function(d) { return x(d[0]); })
    .attr("width", function(d) { return x(d[1]) - x(d[0]); })
    .attr("fill", function(d) { return color(d[0]); })

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

  /* Append path elements associated with json map */
  g.selectAll('path')
    .data(statejson.features)
    .enter().append('path')
    .attr('class', 'map il')
    .attr('fill', 'lightsteelblue')
    .attr('stroke', '#aaa')
    .attr('d', geoPath)
    .on('click', clicked)


  function zoomFn() {
    g.selectAll("path")
      .attr("d", geoPath)
      .attr('transform', 'translate(' + d3.event.transform.x + ',' + d3.event.transform.y + ') scale(' + d3.event.transform.k + ')')
    g.selectAll("circle")
      .attr("d", geoPath)
      .attr('transform', 'translate(' + d3.event.transform.x + ',' + d3.event.transform.y + ') scale(' + d3.event.transform.k + ')')
  }

  function clicked(d) {
    var x, y, k;

    if (d && centered !== d) {
      var centroid = geoPath.centroid(d);
      x = centroid[0];
      y = centroid[1];
      k = 4;
      centered = d;
    } else {
      x = width / 2;
      y = height / 2;
      k = 1;
      centered = null;
    }

    d3.select(this).classed('active', centered && function(d) { return d === centered; })

    g.transition()
        .duration(750)
        .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")scale(" + k + ")translate(" + -x + "," + -y + ")")
  }

  d3.select('g').call(zoom)
  const speciesName = normalizeName(options.species)

  /* Get eBird data */
  d3.json(`http://ebird.org/ws1.1/data/obs/region_spp/recent?rtype=subnational1&r=US-${options.state}&sci=${speciesName}&back=15&maxResults=500&locale=en_US&fmt=json&includeProvisional=true`)
    .get((err, data) => {
      if (!data.length) {
        alert(`No ${options.species} found in this area!`)
        return
      }

      const parseDate = d3.timeParse('%Y-%m-%d %I:%M')

      /* Manipulate it to be read as geojson */
      const sightingGeoArr = data.map(result => ({
        "geometry": {
          "type": "Point",
          "coordinates": [result.lng, result.lat]
        },
        "count": result.howMany,
        "daysAgo": milliToDays(Date.now() - parseDate(result.obsDt))
      }))

      const sightings = g.append('g').attr('class', 'sightings')

      const radius = options.byCount === 'true' ? (d => d.count) : 3

      sightings.selectAll('circle')
        .data(sightingGeoArr)
        .enter().append('circle')
        .attr('class', 'point')
        .attr('stroke', '#333')
        .attr('opacity', '0.7')
        .attr('fill', d => color(d.daysAgo))
        .attr('cx', d => albersProj(d.geometry.coordinates)[0])
        .attr('cy', d => albersProj(d.geometry.coordinates)[1])
        .attr('r', radius)
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

export default stateDistributionChart