const data = require('../data/ebird-simple.json')
const fs = require('fs')

const convertToObj = arr => {
  const obj = {}
  for (let i = 0; i < arr.length; i++) {
    obj[arr[i].comName.toLowerCase()] = arr[i].sciName.toLowerCase()
  }

  return JSON.stringify(obj)
}

const taxa_obj = convertToObj(data)

fs.writeFile('./taxa_obj.js', taxa_obj, (err) => {
  if (err) throw err
  console.log('File written successfully!')
})