function init () {
  getData(function (response) {
    let parsed_JSON = JSON.parse(response)
    getTitles(parsed_JSON)
  })
}

function getData (callback) {
  let data = new XMLHttpRequest()
  data.overrideMimeType('application/json')
  data.open('GET', 'nyTimesData.json', true)
  data.onreadystatechange = function () {
    if (data.readyState == 4 && data.status == '200') {
      // Required use of an anonymous callback as .open will NOT return a value but simply returns undefined in asynchronous mode
      callback(data.responseText)
    }
  }
  data.send(null)
}

// get all titles from JSON object
// push titles to new array and filter out duplicates
// convert each individual word to a string and push it to a new array
function getTitles (parsed_JSON) {
  let titleArray = []
  let uniqueWords = []
  parsed_JSON.map((item, index) => {
    titleArray.indexOf(item.title) == -1 ? titleArray.push(item.title) : null
  })
  let splitTextArr = titleArray.join(" ").split(" ")
  splitTextArr.map((word, index) => {
    let removePunctuation = word.replace(/[^a-zA-Z0-9']/g, '')
    uniqueWords.push(removePunctuation)
  })
  console.log(uniqueWords)
  

//   const map = splitText.reduce(
//     (acc, e) => acc.set(e, (acc.get(e) || 0) + 1),
//     new Map()
//   )
//   console.info([...map.keys()])
//   console.info([...map.values()])
//   console.info([...map.entries()])


const counts = uniqueWords.reduce(
  (acc, value) => ({
    ...acc,
    [value]: (acc[value] || 0) + 1
  }),
  {}
)

console.log(counts)

let jsonData = JSON.stringify(counts)

let newNewArray = []
// counts.map(item => {
// let newItem = item.JSON.stringify(item)
// newItem.push(newNewArray)
// })


// console.log(newNewArray)



// var diameter = 960,
//   format = d3.format(',d'),
//   color = d3.scaleOrdinal(d3.schemeCategory20c)

// var bubble = d3
//   .pack()
//   .size([diameter, diameter])
//   .padding(1.5)

// var svg = d3
//   .select('body')
//   .append('svg')
//   .attr('width', diameter)
//   .attr('height', diameter)
//   .attr('class', 'bubble')

// d3.json(jsonData, function (data) {
//   // if (error) throw error

//   var root = d3
//     .hierarchy(classes(data))
//     .sum(function (d) {
//       return d.value
//     })
//     .sort(function (a, b) {
//       return b.value - a.value
//     })

//   bubble(root)
//   var node = svg
//     .selectAll('.node')
//     .data(root.children)
//     .enter()
//     .append('g')
//     .attr('class', 'node')
//     .attr('transform', function (d) {
//       return 'translate(' + d.x + ',' + d.y + ')'
//     })

//   node.append('title').text(function (d) {
//     return d.data.className + ': ' + format(d.value)
//   })

//   node
//     .append('circle')
//     .attr('r', function (d) {
//       return d.r
//     })
//     .style('fill', function (d) {
//       return color(d.data.packageName)
//     })

//   node
//     .append('text')
//     .attr('dy', '.3em')
//     .style('text-anchor', 'middle')
//     .text(function (d) {
//       return d.data.className.substring(0, d.r / 3)
//     })
// })

// // Returns a flattened hierarchy containing all leaf nodes under the root.
// function classes (root) {
//   var classes = []

//   function recurse (name, node) {
//     if (node.children)
//       node.children.forEach(function (child) {
//         recurse(node.name, child)
//       })
//     else
//       classes.push({
//         packageName: name,
//         className: node.name,
//         value: node.size
//       })
//   }

//   recurse(null, root)
//   return { children: classes }
// }

// d3.select(self.frameElement).style('height', diameter + 'px')
}

init()

// to do:
// 1. remove punctuation
// 2. remove articles (?)
