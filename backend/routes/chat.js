const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/checkAccessToken");
const {getChats, requestToChat} = require('../controller/chat')
router.route('/').post(protect,getChats)
router.route('/friendRequest').post(protect,requestToChat)
module.exports = router