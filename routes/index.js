var express = require("express");
var router = express.Router();

router.get("/", async (req, res) => {
  res.send("check readme");
});

module.exports = router;

