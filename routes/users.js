const express = require("express");
const User = require("../models/User");
require("dotenv").config();
const router = express.Router();
const path = require("path");
const ACC_SID = 'ACe4b568bf53d70388f87e5e303dca814f'
const ACC_TOKEN = 'f915f08b23844ca8e513f3d894f7e61a'
const client = require("twilio")(ACC_SID, ACC_TOKEN);


router.get("/register", (req, res) => {
  res.render('register', {
    extractScripts: true,
  });
});

router.get("/register/register_successful", (req, res) => {
  res.render('register_successful',{
    extractScripts:true
  });
});

// Adding a new user to DB
router.post("/adding_new_user", async (req, res) => {
  try {
    const { user, number, state ,city } = req.body;
    const new_user = await User.aggregate([{ $match: { number: number } }]);
    if (new_user.length != 0) {
      res.render('already_register',{
        extractScripts : true
      });
    } else {
      const sam = new User({
        user : user,
        number: number,
        state: state,
        city : city
      });
      const addedUser = await sam.save();
      client.messages
        .create({
          body:
            'Thank You For Registering. You will receive Corona-Virus updates everyday.\nTo Stop the service send "STOP" to +16677712090',
          from: '+16677712090',
          to: "+91" + req.body.number,
        })
        .then((msg) => {
          console.log(msg.sid);
          res.render('register_successful')
        });
    }
  } catch (error) {
    console.log(error);
    res.json({ message: error });
  }
});

// Deleting a user from DB
router.delete("/:number", async (req, res) => {
  try {
    const removedUser = await User.deleteOne({ number: req.params.number });
    res.json({ message: removedUser });
  } catch (error) {
    res.json({ message: error });
  }
});

module.exports = router;
