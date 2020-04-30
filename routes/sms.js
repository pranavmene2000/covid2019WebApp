const express = require("express");
const router = express.Router();
const MessagingResponse = require("twilio").twiml.MessagingResponse;
const User = require("../models/User");

router.post("/", async (req, res) => {
  const twiml = new MessagingResponse();
  phn_number = req.body.From.slice(3);

  if (req.body.Body === "STOP") {
    await User.update(
      { number: phn_number },
      {
        $set: {
          active: false,
        },
      }
    );
    twiml.message("You will not receive updates any more. \n Thank You.");
  } else if (req.body.Body === "START") {
    await User.update(
      { number: phn_number },
      {
        $set: {
          active: true,
        },
      }
    );
    twiml.message("Thank you for your interest. You will now receive updates.");
  } else {
    twiml.message("Sorry, you've send an invalid response.");
  }

  res.writeHead(200, { "Content-Type": "text/xml" });
  res.end(twiml.toString());
});

module.exports = router;
