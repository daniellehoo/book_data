// USE LO - DASH! https://lodash.com/

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
  var diameter = 960,
    format = d3.format(',d'),
    color = d3.scaleOrdinal(d3.schemeCategory20c)

  var bubble = d3
    .pack()
    .size([diameter, diameter])
    .padding(1.5)

  var svg = d3
    .select('body')
    .append('svg')
    .attr('width', diameter)
    .attr('height', diameter)
    .attr('class', 'bubble')

  d3.json(parsed_JSON, function (data, error) {
    if (error) throw error

    var root = d3
      .hierarchy(classes(data))
      .sum(function (d) {
        return d.value
      })
      .sort(function (a, b) {
        return b.value - a.value
      })

    bubble(root)

    console.log(root)
    var node = svg
      .selectAll('.node')
      .data(root)
      .enter()
      .append('g')
      .attr('class', 'node')
      .attr('transform', function (d) {
        return 'translate(' + d.x + ',' + d.y + ')'
      })

    node.append('title').text(function (d) {
      return d.data.className + ': ' + format(d.value)
    })

    node
      .append('circle')
      .attr('r', function (d) {
        return d.r
      })
      .style('fill', function (d) {
        return color(d.data.packageName)
      })

    node
      .append('text')
      .attr('dy', '.3em')
      .style('text-anchor', 'middle')
      .text(function (d) {
        console.log(d)
        return d.data.className.substring(0, d.r / 3)
      })
  })

  // Returns a flattened hierarchy containing all leaf nodes under the root.
  function classes (root) {
    console.log(root)
    var classes = []

    function recurse (node) {
      console.log(node)
      if (node)
        node.forEach(function (child) {
          recurse(node, child)
        })
      else
        classes.push({
          packageName: node,
          className: node.word,
          value: node.count
        })
    }

    recurse(null, root)
    return { children: classes }
  }

  d3.select(self.frameElement).style('height', diameter + 'px')
}

init()
