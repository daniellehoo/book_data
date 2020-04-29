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
  let globalData = parsed_JSON
  let titleArray = []
  parsed_JSON.map((item, index) => {
    titleArray.indexOf(item.title) == -1 ? titleArray.push(item.title) : null
  })

//   console.log(titleArray)

//   const map = titleArray.reduce(
//     (acc, e) => acc.set(e, (acc.get(e) || 0) + 1),
//     new Map()
//   )
//   console.info([...map.keys()])
//   console.info([...map.values()])
//   console.info([...map.entries()])


const counts = titleArray.reduce(
  (acc, value) => ({
    ...acc,
    [value]: (acc[value] || 0) + 1
  }),
  {}
)


console.log(counts)

}

init()

// to do:
// separate each word in the title into a string and push that to a new array