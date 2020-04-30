require("dotenv").config();
const fetch = require("node-fetch");
const User = require("../models/User");
const world_info = require('./world_info');

const ACC_SID = '????????????????????????'
const ACC_TOKEN = '????????????????????????'
const client = require("twilio")(ACC_SID, ACC_TOKEN);

const cron = require("node-cron");

const tasks = cron.schedule('30 3,14 * * *', () => {
  
  send_msg();
});

const send_msg = async () => {
  const users_num = await get_users();
  const cases_data = await get_data();
  const wd_cases = await world_info.samfunn();
  // Message For Gujarat Users
  const mh_msg = `COVID-19 Live Updates \nTotal Active cases in world: ${wd_cases.total_active_cases} \nTotal cases in World: ${wd_cases.total_cases} \nTotal New cases in world: ${wd_cases.total_new_cases_today} \nTotal Deaths in world: ${wd_cases.total_deaths} \nTotal Recovered in world:${wd_cases.total_rescovered} \n\nTotal Active cases in India: ${cases_data.active_total} \nTotal Cases In India: ${cases_data.total_cases} \nNew Cases In India: ${cases_data.total_new} \nTotal Deaths In India: ${cases_data.deaths_total} \nTotal Recovered In India: ${cases_data.rec_total} \n\nTotal Active cases in Maharashtra : ${cases_data.mh_active_total} \nTotal cases in Maharashtra : ${cases_data.mh_total} \nNew Cases in Maharashtra : ${cases_data.mh_new} \nTotal Deaths in Maharashtra : ${cases_data.mh_deaths_total} \nTotal Recovered in Maharashtra : ${cases_data.mh_rec_total} \nPrecautions : \n1.STAY Home🏠 \n2.KEEP a safe distance \n3.WASH hands often \n4.COVER your Mouth😷 \n5.SICK call the Helpline 📞011-23978046.` ;

  users_num.MH.forEach((user) => {
    console.log(user, mh_msg);
    client.messages
      .create({
        body: mh_msg,
        from: '+16677712090',
        to: "+91" + user
      })
      .then((msg) => console.log(msg.sid))
      .catch((err) => console.log(err));
  });
};

const get_users = async () => {
  
  numbers = {};
  const active_users = await User.find({
    active: true,
  });
 
  mh_users_num = active_users
    .filter((user) => user.state === "Maharashtra")
    .map((user) => user.number);

  numbers.MH = mh_users_num;
  numbers.GJ = guj_users_num;
  
  return numbers;

 
};

const get_data = async () => {
  
  cases = {};
  await fetch("https://api.covid19india.org/data.json")
    .then((res) => {
      return res.json();
    })
    .then((data) => {
      data_array = data.statewise;
      total_obj = data_array.filter((data) => data.state === "Total")[0];
      
      mh_obj = data_array.filter((data) => data.state === "Maharashtra")[0];

      cases.total_cases = total_obj.confirmed;
      cases.total_new = total_obj.deltaconfirmed;
      cases.deaths_total = total_obj.deaths;
      cases.active_total = total_obj.active;
      cases.rec_total = total_obj.recovered;

      cases.mh_total = mh_obj.confirmed;
      cases.mh_new = mh_obj.deltaconfirmed;
      cases.mh_deaths_total = mh_obj.deaths;
      cases.mh_active_total = mh_obj.active;
      cases.mh_rec_total = mh_obj.recovered;
    })
  return cases;
};
console.log(world_info.samfunn());

module.exports = {
  get_data,
  get_users,
  tasks,
  send_msg,
};
