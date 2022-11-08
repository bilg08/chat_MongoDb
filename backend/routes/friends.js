const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/checkAccessToken");
const {friendRequest,getFriends, getFriendRequests,confirmFriendRequest} = require('../controller/friends')
router.route('/friendRequest').post(protect,friendRequest);
router.route('/allFriendRequests').get(protect,getFriendRequests)
router.route('/').get(protect,getFriends);
router.route('/confirmFriendRequest').post(protect,confirmFriendRequest)
module.exports = router