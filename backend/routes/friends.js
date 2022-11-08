const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/checkAccessToken");
const {friendRequest,getFriends, getFriendRequests,confirmFriendRequest, getChats, sendMessage} = require('../controller/friends')
router.route('/friendRequest').post(protect,friendRequest);
router.route('/allFriendRequests').get(protect, getFriendRequests);
router.route('/').get(protect, getFriends);
router.route('/:chatRoomName/chats').get(protect, getChats);
router.route('/confirmFriendRequest').post(protect, confirmFriendRequest);
router.route("/:chatroom/sendMessage").post(protect,sendMessage);
module.exports = router;