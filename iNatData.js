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
  const height = 800, width = 1200
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


    const treemap = d3.treemap()
      .size([width - 2, height-50])
      .padding(2)
      .round(true)

    const treeRoot = d3.hierarchy(builtTree, d => d.children)
      .sum(d => d.taxon ? d.taxon.observations_count : 0)

    const d3Tree = treemap(treeRoot)
    // console.log(d3Tree)

    const leaves = d3Tree.leaves().filter(leaf => {
      return leaf.data.taxon
    })

    var cells = svg.selectAll(".cell")
      .data(leaves)
      .enter().append("g")
        .attr("class","cell")
        .attr("transform", function(d) { return "translate(" + d.x0 + "," + d.y0 + ")"; });

    const colors = {}

    cells.append("rect")
        .attr("width", function(d) { return d.x1 - d.x0; })
        .attr("height", function(d) { return d.y1 - d.y0; })
        .attr("fill", function(d) {
          let cellColor = color(d.parent.data.name)
          if (!colors[cellColor]) { colors[d.parent.data.name] = cellColor }
          return cellColor;
        })
        .attr('stroke', 'white')

      const legend = svg.selectAll('.legend')
        .data(Object.keys(colors))
        .enter().append('g')
        .attr('class', 'legend')
        // .attr("transform", (d, i) => "translate(0,"+ i * 20 +")" )

      legend.append('rect')
        .attr('x', (d, i) => {
          return ((width/Object.keys(colors).length) * i+1) + 10
        })
        .attr('y', d => height - 40)
        .attr('width', 18)
        .attr('height', 18)
        .attr('fill', d => colors[d])
        .attr('stroke', 'black')

      legend.append('text')
        .attr('x', (d, i) => {
          return ((width/Object.keys(colors).length) * i+1) + 40
        })
        .attr('y', d => height - 30)
        .text(d => d)

      const divTooltip = d3.select("body").append("div").attr("class", "toolTip")
      cells
        .on("mousemove", function(d){
            divTooltip.style("left", d3.event.pageX+10+"px");
            divTooltip.style("top", d3.event.pageY-25+"px");
            divTooltip.style("display", "inline-block");
            var x = d3.event.pageX, y = d3.event.pageY
            var elements = document.querySelectorAll(':hover');
            var l = elements.length
            l = l-1
            var elementData = elements[l].__data__
            // console.log(elementData)
            divTooltip.html( elementData.data.taxon.preferred_common_name + "<br>" + elementData.data.taxon.observations_count + ' sightings');
        });
      cells
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
