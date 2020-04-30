let request = require('request');
let axios = require('axios');
let fetch = require('node-fetch')
let url = 'https://thevirustracker.com/free-api?global=stats'
const samfunn =async () => {
    wotld_cases={}
    await fetch(url)
     .then(res => {
         return res.json();
     })

     .then(data_res => {
         data_array = data_res.results[0];
         //console.log(data_array)
         c1 = data_array.total_cases;
         r1 = data_array.total_recovered;
         d1= data_array.total_deaths;
         a1= data_array.total_active_cases;
         n1= data_array.total_new_cases_today;
         //console.log(c1,r1,d1);

         wotld_cases.total_cases = c1;
         wotld_cases.total_rescovered = r1;
         wotld_cases.total_deaths = d1;
         wotld_cases.total_active_cases = a1;
         wotld_cases.total_new_cases_today = n1;
     })
     console.log(wotld_cases);

     return wotld_cases
}

module.exports.samfunn = samfunn;