## Tests and Error handling
- early return if fetch(url) not ok

To Do:
- if newest date is older than three days: Throw error
- check if file name has format '01-22-2020.csv'
- check if corona.text contains 'Country/Region', 'Confirmed', 'Deaths', 'Recovered'



## Netlify
- get date
- Github Repo: get all names, sort for newest date
- get csv of this dates_name
- load csv
- provide latest csv

## Datawrapper
- use Url
- make chart
- update chart regularily
- provide embed url for wdr

## Links
Get China and Others and without china and other
[].contains('')

China:
https://covid-19-data.netlify.com/.netlify/functions/get_data_corona?china=true

without china:
https://covid-19-data.netlify.com/.netlify/functions/get_data_corona?china=false
