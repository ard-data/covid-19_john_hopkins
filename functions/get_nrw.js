
const scraper = require('table-scraper');

const getData = async (total) => {
   scraper
  .get('https://www.mags.nrw/coronavirus-fallzahlen-nrw')
  .then(function(tableData) {
    console.log(tableData);
  });
}

exports.handler = async (event) => {
    const csv = await getData();
    return {
        statusCode: 200,
        body: csv
    };
}
