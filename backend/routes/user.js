const express = require("express");
const router = express.Router();
const { register,login, getUsers} = require('../controller/user');
const { protect } = require("../middleware/checkAccessToken");
router.route('/register').post(register);
router.route('/login').post(login);
router.route('/').get(protect,getUsers)
module.exports = router