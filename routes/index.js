const express = require("express");
const router = express.Router();
const path = require("path");

router.get("/", (req, res) => {
  res.render(path.join(path.dirname(__dirname), "views/index"), {
    extractScripts: true,
  });
});

module.exports = router;
