const express = require("express");
const router = express.Router();
const raterLimit = require("express-rate-limit");
const limiter = raterLimit({
  windowMs: 4 * 60 * 1000,
  max: 30,
});
const userCtrl = require("../controllers/user");

router.post("/signup", userCtrl.signup);
router.post("/login", limiter, userCtrl.login);

module.exports = router;