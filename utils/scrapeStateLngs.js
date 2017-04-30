const scrapeIt = require('scrape-it')
const fs = require('fs')

const state_hash =  {
    'AL': 'Alabama',
    'AK': 'Alaska',
    'AZ': 'Arizona',
    'AR': 'Arkansas',
    'CA': 'California',
    'CO': 'Colorado',
    'CT': 'Connecticut',
    'DE': 'Delaware',
    'DC': 'District Of Columbia',
    'FL': 'Florida',
    'GA': 'Georgia',
    'HI': 'Hawaii',
    'ID': 'Idaho',
    'IL': 'Illinois',
    'IN': 'Indiana',
    'IA': 'Iowa',
    'KS': 'Kansas',
    'KY': 'Kentucky',
    'LA': 'Louisiana',
    'ME': 'Maine',
    'MD': 'Maryland',
    'MA': 'Massachusetts',
    'MI': 'Michigan',
    'MN': 'Minnesota',
    'MS': 'Mississippi',
    'MO': 'Missouri',
    'MT': 'Montana',
    'NE': 'Nebraska',
    'NV': 'Nevada',
    'NH': 'New Hampshire',
    'NJ': 'New Jersey',
    'NM': 'New Mexico',
    'NY': 'New York',
    'NC': 'North Carolina',
    'ND': 'North Dakota',
    'OH': 'Ohio',
    'OK': 'Oklahoma',
    'OR': 'Oregon',
    'PA': 'Pennsylvania',
    'RI': 'Rhode Island',
    'SC': 'South Carolina',
    'SD': 'South Dakota',
    'TN': 'Tennessee',
    'TX': 'Texas',
    'UT': 'Utah',
    'VT': 'Vermont',
    'VA': 'Virginia',
    'WA': 'Washington',
    'WV': 'West Virginia',
    'WI': 'Wisconsin',
    'WY': 'Wyoming'
  };

scrapeIt('https://inkplant.com/code/state-latitudes-longitudes',{
  tableHead: 'thead',
  tableRow: 'tr'

})
  .then(obj => {
    const modified = obj.tableRow.split('-')
    const onlyLngs = modified.map(row => parseFloat(row)).slice(1)
    const stateKeys = Object.keys(state_hash)
    stateKeys.forEach((key, i) => {
      state_hash[key] = Math.floor(onlyLngs[i])
    })

    const stringifiedHash = JSON.stringify(state_hash)

    fs.writeFile('./state_lngs.json', stringifiedHash, (err) => {
      if (err) throw err
      console.log('File has been written!')
    })
  })

  .catch(console.log)