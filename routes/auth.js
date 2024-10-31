const express = require("express");
const { register, login, logOut, oAuth } = require("../controllers/auth");
const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/oauth", oAuth);
router.post("/log-out", logOut);

module.exports = router;