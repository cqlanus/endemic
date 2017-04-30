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
  const height = 700, width = 1200
  const margin = {top: 50, bottom: 0, left: 50, right: 50}

  console.log('am i removing?')
  d3.selectAll('svg').remove()

  const color = d3.scaleOrdinal().range(d3color.schemeSet3)

  const svg = d3.select('body')
    .append('svg')
    .attr('class', 'canvas')
    .attr( "width", width )
    .attr( "height", height )

  console.log('query', buildQuery(options))
  d3.json(buildQuery(options))
  .get((err, data) => {
    if (!data.results.length) {
        alert(`No data found!`)
        return
      }

    const builtTree = buildTree(data.results, startTree())


    const treemap = d3.treemap()
      .size([width - 2, height])
      .round(true)

    const treeRoot = d3.hierarchy(builtTree, d => d.children)
      .sum(d => d.taxon ? d.taxon.observations_count : 0)

    const d3Tree = treemap(treeRoot)

    const leaves = d3Tree.leaves().filter(leaf => {
      return leaf.data.taxon
    })
    // console.log(leaves)
    var cells = svg.selectAll(".cell")
      .data(leaves)
      .enter().append("g")
        .attr("class","cell")
        .attr("transform", function(d) { return "translate(" + d.x0 + "," + d.y0 + ")"; });

    cells.append("rect")
        .attr("width", function(d) { return d.x1 - d.x0; })
        .attr("height", function(d) { return d.y1 - d.y0; })
        .attr("fill", function(d) { return color(d.parent.data.name); })
        .attr('stroke', 'black')

    cells.append('text')
        .attr("x", 10)
        .attr("y", function(d, i) { return (d.y1 - d.y0)/2; })
        .text((d, i) => {
          const name = d.data.taxon ? d.data.taxon.preferred_common_name : null
          return d.children ? null : name
        })
        .attr('fill', 'black')

      cells.append('text')
        .attr("x", 10)
        .attr("y", function(d, i) { return (d.y1 - d.y0)/2 + 15; })
        .text((d, i) => {
          const count = d.data.taxon ? d.data.count : null
          return d.children ? null : `${count} sightings`
        })
        .attr('fill', 'black')
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
  const keys = Object.keys(options)
  let query = 'http://api.inaturalist.org/v1/observations/species_counts?per_page=100'

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