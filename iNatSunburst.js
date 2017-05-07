const d3 = require('d3')
const d3color = require('d3-scale-chromatic')

const startTree = () => ({
  name: "Life",
  children: [
      {
        name: "Animalia", children: [{
            name: "Aves", children: []
        },{
            name: "Mammalia", children: []
        },{
            name: "Insecta", children: []
        },{
            name: "Reptilia", children: []
        },{
            name: "Actinopterygii", children: []
        },{
            name: "Amphibia", children: []
        },{
            name: "Arachnida", children: []
        },{
            name: "Mollusca", children: []
        }]
      },
      {
          name: "Plantae", children: []
      },
      {
          name: "Fungi", children: []
      },
  ]
})

const iNaturalistTreemap = options => {
  const height = 700, width = 1200, radius = Math.min(width, height)/2
  const margin = {top: 50, bottom: 0, left: 50, right: 50}

  d3.selectAll('svg').remove()

  const color = d3.scaleOrdinal().range(d3color.schemeSet3)

  const svg = d3.select('body')
    .append('svg')
    .attr('class', 'canvas')
    .attr( "width", width )
    .attr( "height", height )

  d3.json(buildQuery(options))
  .get((err, data) => {
    if (!data.results.length) {
      alert(`No data found!`)
      return
    }

  const builtTree = buildTree(data.results, startTree())
  const treeRoot = d3.hierarchy(builtTree, d => d.children)
      .sum(d => d.taxon ? d.taxon.observations_count : 0)
  // console.log('tree', builtTree)

  const partition = d3.partition().size([360, radius]).padding(0)

  console.log('partition', partition(treeRoot))

  const g = svg.selectAll('g')
    .data(partition(treeRoot).descendants())
    .enter().append('g')
    .attr('transform', 'translate(' + width/2 + ',' + height/2 + ')')

  // console.log('g', g)
  const x = d3.scaleLinear()
    .domain([0, radius])
    .range([0, 2*Math.PI])
    .clamp(true)

  const y = d3.scaleLinear()
    .range([0, radius])

  console.log('how does x work', x(0), x(0.6335))
  console.log('how does y work', y(0.5), y(0.75))

  const arc = d3.arc()
    .startAngle(d => x(d.x0))
    .endAngle(d => x(d.x1))
    .innerRadius(d => d.y0)
    .outerRadius(d => d.y1)

  g.append('path')
    .attr('d', arc)
    .attr("fill", function(d) {
          let cellColor = d.parent ? color(d.data.name) : 'white'
          // if (!colors[cellColor]) { colors[d.parent.data.name] = cellColor }
          return cellColor;
        })
    .attr('stroke', 'white')


  const divTooltip = d3.select("body").append("div").attr("class", "toolTip")
    g
      .on("mousemove", function(d){
          divTooltip.style("left", d3.event.pageX+10+"px");
          divTooltip.style("top", d3.event.pageY-25+"px");
          divTooltip.style("display", "inline-block");
          var x = d3.event.pageX, y = d3.event.pageY
          var elements = document.querySelectorAll(':hover');
          var l = elements.length
          l = l-1
          var elementData = elements[l].__data__
          const text = elementData.height >= 1 ? elementData.data.name : (elementData.data.taxon.preferred_common_name + "<br>" + elementData.data.taxon.observations_count + ' sightings')

          divTooltip.html(text);
      });
    g
      .on("mouseout", function(d){
          divTooltip.style("display", "none");
      })

  })
}

const addToTree = (node, tree) => {

    const taxon = node.taxon.iconic_taxon_name
    if (taxon === tree.name) {
        tree.children.push(node)
        return tree
    }
    tree.children ? tree.children.forEach(child => {
        addToTree(node, child)
    }) : null
}

const buildTree = (nodeList, tree) => {
    nodeList.forEach(node => {
        addToTree(node, tree)
    })
    return tree
}

const buildQuery = (options) => {
  const keys = Object.keys(options).filter(key => key !== 'mapType')
  let query = 'https://api.inaturalist.org/v1/observations/species_counts?per_page=100'

  keys.forEach(key => {
    if (options[key].length) {
      if (key === 'filterBy') {
        query += `&${options[key]}=true`
      } else {
        query += `&${key}=${options[key]}`
      }
    }
  })
  return query

}

export default iNaturalistTreemap
