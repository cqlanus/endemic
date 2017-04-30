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
    .fitSize([height, height - margin.top], statejson)

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


  // g.call(d3.zoom().on('zoom', () => {
  //   g.attr('transform', d3.event.transform)
  // }))

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
/*
http://ebird.org/ws1.1/data/obs/region/recent?rtype=subnational1&r=US-NV&back=5&maxResults=500&locale=en_US&fmt=json&includeProvisional=true

*/


  /* Get eBird data */
  d3.json(`http://ebird.org/ws1.1/data/obs/region/recent?rtype=subnational1&r=US-${options.state}&back=30&maxResults=100&locale=en_US&fmt=json&includeProvisional=true`)
    .get((err, data) => {

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

const milliToDays = ms => {
  return Math.floor(ms/(1000*60*60*24))
}

export default stateDistributionChart