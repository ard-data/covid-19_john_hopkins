const fetch = require('node-fetch');
const parse = require('csv-parse/lib/sync');
const stringify = require('csv-stringify/lib/sync');


const url = `https://api.github.com/repos/CSSEGISandData/COVID-19/contents/csse_covid_19_data/csse_covid_19_daily_reports`

const getData = async (total) => {
    const resp = await fetch(url);
    if (!resp.ok) {
        console.log('Cannot fetch repo files:', resp.status, await resp.text());
        return
    }

    const data = await resp.json();
    const files = data.filter(file => file.name.endsWith('.csv'));
    files.sort((a, b) => {
        const ap = a.name.replace('.csv', '').split('-');
        const aValue = parseInt(`${ap[2]}${ap[0]}${ap[1]}`)
        const bp = b.name.replace('.csv', '').split('-');
        const bValue = parseInt(`${bp[2]}${bp[0]}${bp[1]}`);
        return aValue - bValue
    })
    const file = files.pop();
    console.log(file.name);
    const corona = await fetch(file.download_url);
    if (!corona.ok) {
        console.log('Cannot download csv:', corona.status, await corona.text());
        return
    }
    const records = parse(await corona.text(), {
        columns: true,
        skip_empty_lines: true
    })
    const groupedByCountry = {};
    for (let rec of records) {
        const country = rec['Country/Region'];
        const agg = groupedByCountry[country] || {
            confirmed: 0,
            deaths: 0,
            recovered: 0
        }
        agg.confirmed += parseInt(rec.Confirmed);
        agg.deaths += parseInt(rec.Deaths);
        agg.recovered += parseInt(rec.Recovered);
        groupedByCountry[country] = agg;
    }
    const lines = Object.entries(groupedByCountry).map(([key, value]) => ({
        country: key,
        ...value
    }));

    lines.push({
        country: 'Total',
        confirmed: 0,
        deaths: 0,
        recovered: 0
    });

    lines[lines.length - 1].confirmed = lines.map(line => line.confirmed).reduce((prev, next) => prev + next);
    lines[lines.length - 1].deaths = lines.map(line => line.deaths).reduce((prev, next) => prev + next);
    lines[lines.length - 1].recovered = lines.map(line => line.recovered).reduce((prev, next) => prev + next);


    if ( !total) {
        let filtered = lines;
        const output = stringify(filtered, {
            header: true
        });
        return output;

    } else {
        let excludedCountries = ['Total', 'Mainland China', 'Germany'];
        filtered = lines.filter(line => excludedCountries.includes(line.country) == total);
        const output = stringify(filtered, {
            header: true
        });
        return output;
    }

}

exports.handler = async (event) => {
    const total = event.queryStringParameters.total === 'true';
    const csv = await getData(total);
    return {
        statusCode: 200,
        body: csv
    };
}

// Look at the data
async function run() {
    const checkData = await getData(true);
    console.log(checkData);
}

run();
