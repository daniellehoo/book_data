function init () {
  getData(function (response) {
    let parsed_JSON = JSON.parse(response)
    console.log(parsed_JSON)
    buildD3(parsed_JSON)
  })
}

function getData (callback) {
  let data = new XMLHttpRequest()
  data.overrideMimeType('application/json')
  data.open('GET', 'd3_ready.json', true)
  data.onreadystatechange = function () {
    if (data.readyState == 4 && data.status == '200') {
      // Required use of an anonymous callback as .open will NOT return a value but simply returns undefined in asynchronous mode
      callback(data.responseText)
    }
  }
  data.send(null)
}

function buildD3 (parsed_JSON) {
  // set the dimensions and margins of the graph
  var width = window.innerWidth
  var height = window.innerHeight

  // decalare globals
  let diameter = 600
  let color = d3.scaleOrdinal(d3.schemeCategory20)
  let bubble = d3
    .pack(parsed_JSON)
    .size([width, height])
    .padding(1.5)

  // append the svg object to the body of the page
  var svg = d3
    .select('body')
    .append('svg')
    .attr('width', width)
    .attr('height', height)
    .attr('class', 'bubble')

  // create dummy data -> just one element per circle
  // var data = [
  //   { name: 'A' },
  //   { name: 'B' },
  //   { name: 'C' },
  //   { name: 'D' },
  //   { name: 'E' },
  //   { name: 'F' },
  //   { name: 'G' },
  //   { name: 'H' }
  // ]

  let nodes = d3.hierarchy(parsed_JSON).sum(function (d) {
    return d.count
  })

  // Initialize the circle: all located at the center of the svg area
  var node = svg
    .selectAll('.node')
    .data(bubble(nodes).descendants())
    .enter()
    .filter(function (d) {
      return !d.children
    })
    .append('g')
    .attr('class', 'node')
    .attr('transform', function (d) {
      return 'translate(' + d.x + ',' + d.y + ')'
    })

  node.append('title').text(function (d) {
    return d.data.word + ': ' + d.data.count
  })

  node
    .append('circle')
    .attr('r', function (d) {
      return d.r
    })
    .style('fill', function (d, i) {
      return color(i)
    })

  node
    .append('text')
    .attr('dy', '.2em')
    .style('text-anchor', 'middle')
    .text(function (d) {
      return d.data.word.substring(0, d.r / 3)
    })
    .attr('font-family', 'sans-serif')
    .attr('font-size', function (d) {
      return d.r / 5
    })
    .attr('fill', 'white')

  node
    .append('text')
    .attr('dy', '1.3em')
    .style('text-anchor', 'middle')
    .text(function (d) {
      return d.data.count
    })
    .attr('font-family', 'Gill Sans', 'Gill Sans MT')
    .attr('font-size', function (d) {
      return d.r / 5
    })
    .attr('fill', 'white')

  node.call(
    d3
      .drag() // call specific function when circle is dragged
      .on('start', dragstarted)
      .on('drag', dragged)
      .on('end', dragended)
  )

  d3.select(self.frameElement).style('height', diameter + 'px')

  // var node = svg
  //   .selectAll('.node')
  //   .data(bubble(nodes).descendents())
  //   .append('g')
  //   .enter()
  //   .append('circle')
  //   .attr('r', 25)
  //   .attr('cx', width / 2)
  //   .attr('cy', height / 2)
  //   .style('fill', '#19d3a2')
  //   .style('fill-opacity', 0.3)
  //   .attr('stroke', '#b3a2c8')
  //   .style('stroke-width', 4)
  //   .call(
  //     d3
  //       .drag() // call specific function when circle is dragged
  //       .on('start', dragstarted)
  //       .on('drag', dragged)
  //       .on('end', dragended)
  //   )

  // Features of the forces applied to the nodes:
  var simulation = d3
    .forceSimulation()
    .force(
      'center',
      d3
        .forceCenter()
        .x(width / 2)
        .y(height / 2)
    ) // Attraction to the center of the svg area
    .force('charge', d3.forceManyBody().strength(1)) // Nodes are attracted one each other of value is > 0
    .force(
      'collide',
      d3
        .forceCollide()
        .strength(0.1)
        .radius(30)
        .iterations(1)
    ) // Force that avoids circle overlapping

  // Apply these forces to the nodes and update their positions.
  // Once the force algorithm is happy with positions ('alpha' value is low enough), simulations will stop.
  simulation.nodes(parsed_JSON).on('tick', function (d) {
    node
      .attr('cx', function (d) {
        return d.x
      })
      .attr('cy', function (d) {
        return d.y
      })
  })

  // What happens when a circle is dragged?
  function dragstarted (d) {
    if (!d3.event.active) simulation.alphaTarget(0.03).restart()
    d.fx = d.x
    d.fy = d.y
  }
  function dragged (d) {
    d.fx = d3.event.x
    d.fy = d3.event.y
  }
  function dragended (d) {
    if (!d3.event.active) simulation.alphaTarget(0.03)
    d.fx = null
    d.fy = null
  }
}

// var diameter = 600
// var color = d3.scaleOrdinal(d3.schemeCategory20)

// var bubble = d3
//   .pack(parsed_JSON)
//   .size([diameter, diameter])
//   .padding(1.5)

// var svg = d3
//   .select('body')
//   .append('svg')
//   .attr('width', diameter)
//   .attr('height', diameter)
//   .attr('class', 'bubble')

// var nodes = d3.hierarchy(parsed_JSON).sum(function (d) {
//   return d.Count
// })

// var node = svg
//   .selectAll('.node')
//   .data(bubble(nodes).descendants())
//   .enter()
//   .filter(function (d) {
//     console.log(d)
//     return !d.children
//   })
//   .append('g')
//   .attr('class', 'node')
//   .attr('transform', function (d) {
//     return 'translate(' + d.parent.x + ',' + d.parent.y + ')'
//   })

// node.append('title').text(function (d) {
//   return d.word + ': ' + d.count
// })

// node
//   .append('circle')
//   .attr('r', function (d) {
//     return d.r
//   })
//   .style('fill', function (d, i) {
//     return color(i)
//   })

// node
//   .append('text')
//   .attr('dy', '.2em')
//   .style('text-anchor', 'middle')
//   .text(function (d) {
//     return d.data.Name.substring(0, d.r / 3)
//   })
//   .attr('font-family', 'sans-serif')
//   .attr('font-size', function (d) {
//     return d.r / 5
//   })
//   .attr('fill', 'white')

// node
//   .append('text')
//   .attr('dy', '1.3em')
//   .style('text-anchor', 'middle')
//   .text(function (d) {
//     return d.data.Count
//   })
//   .attr('font-family', 'Gill Sans', 'Gill Sans MT')
//   .attr('font-size', function (d) {
//     return d.r / 5
//   })
//   .attr('fill', 'white')

// d3.select(self.frameElement).style('height', diameter + 'px')

// }

init()
