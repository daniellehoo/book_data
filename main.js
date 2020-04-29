// function init(){
//     getData(function(response) {
//         let parsed_JSON = JSON.parse(response)
//     })
// }

// function getData (callback) {
//   let data = new XMLHttpRequest()
//   data.overrideMimeType('application/json')
//   data.open('GET', 'nyt2.json', true)
//   data.onreadystatechange = function () {
//     if (data.readyState == 4 && data.status == '200') {
//       // Required use of an anonymous callback as .open will NOT return a value but simply returns undefined in asynchronous mode
//       callback(data.responseText)
//       console.log(data.response)
//     }
//   }
//   data.send(null)
// }

// init()
