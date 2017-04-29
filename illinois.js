const height = 960, width = 960

/* Create a color function */

/* Define a projection function */
const albersProj = d3.geoAlbers()
  .rotate([90, 0])
  .fitSize([900, 900], iljson)

/* Define a path function */
const geoPath = d3.geoPath()
  .projection(albersProj)
  .pointRadius(5)

/* Attach svg to page */
var svg = d3.select( "body" )
  .append( "svg" )
  .attr( "width", width )
  .attr( "height", height );

/* Attach group to svg */
var g = svg.append( "g" );

/* Append path elements associated with json map */
g.selectAll('path')
  .data(iljson.features)
  .enter().append('path')
  .attr('class', 'map il')
  .attr('fill', 'steelblue')
  .attr('stroke', '#aaa')
  .attr('d', geoPath)

/* Get iNaturalist data */
d3.json('http://ebird.org/ws1.1/data/obs/region_spp/recent?rtype=subnational1&r=US-IL&sci=Setophaga%20coronata&back=15&maxResults=500&locale=en_US&fmt=json&includeProvisional=true')
  .get((err, data) => {
    console.log(data.length)

    /* Manipulate it to be read as geojson */
    const sightingGeoArr = data.map(result => ({
      "geometry": {
        "type": "Point",
        "coordinates": [result.lat, result.lng]
      }
    }))

    const sightings = svg.append('g').attr('class', 'sightings')

    sightings.selectAll('path')
      .data(sightingGeoArr)
      .enter().append('path')
      .attr('fill', '#000')
      .attr('d', geoPath)
  })