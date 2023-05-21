var express = require("express");
var router = express.Router();

// create Register, Login, Logout routes
router.post("/register", function (req, res) {
  res.send("Register");
});

router.get("/login", function (req, res) {
  res.send("Login");
});

router.get("/logout", function (req, res) {
  res.send("Logout");
});

module.exports = router;
