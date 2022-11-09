const  mongoose = require('mongoose');
const ChatSchema = require('../model/chat');
const UserScheme = require('../model/user');
exports.friendRequest = async(req,res) => {
    const userId = req.user.id;
    const receiverId = req.body.receiver;
    if (userId && receiverId) {
    const sender = await UserScheme.findById(userId);
    const receiver = await UserScheme.findById(receiverId);
    const receiverPendingFriendRequest = receiver.pendingFriendRequest;
    if (!receiver.pendingFriendRequest.includes(userId)) {
      await UserScheme.findByIdAndUpdate(receiverId, {
        pendingFriendRequest: [...receiverPendingFriendRequest, userId],
      });
    } else {
      return;
    }
    res.status(200).json({
      status: true,
      receiver,
    });    
    }
    
}

exports.getFriendRequests = async(req,res) => {
    const userId = req.user.id;
    const user = await UserScheme.findById(userId);
    res.status(200).json({
        data:user.pendingFriendRequest
    })
}

exports.confirmFriendRequest = async(req,res) => {
   const personWhoTookFr = await UserScheme.findById(req.user.id);
   const personWhoRequestedFr = await UserScheme.findById(req.body.receiver);
   const personWhoTookFrPendingRequest = personWhoTookFr.pendingFriendRequest;
   const personWhoTookFrFriends = personWhoTookFr.friends;
    const personWhoRequestedFrFriends = personWhoTookFr.friends;
    const personWhoRequestedFrChatRooms = personWhoRequestedFr.chatRooms;
    const personWhoTookFrChatRooms = personWhoTookFr.chatRooms;



   if(personWhoTookFr.pendingFriendRequest.includes(req.body.receiver)&&!personWhoTookFr.friends.includes(req.body.receiver)
   &&(!personWhoRequestedFr.friends.includes(req.user.id))
   ) {
    const chatRoomName = `chatRoom_${req.user.id}_${req.body.receiver}`;
     const index = personWhoTookFrPendingRequest.indexOf(req.body.receiver);
    await UserScheme.findByIdAndUpdate(req.user.id, {
      pendingFriendRequest: personWhoTookFrPendingRequest.filter(
        (user) => user !== req.body.receiver
      ),
    });
    await UserScheme.findByIdAndUpdate(req.user.id, {
      friends: [
        ...personWhoTookFrFriends,
        { friend: req.body.receiver, chatRoomName },
      ],
    });
       await UserScheme.findByIdAndUpdate(req.body.receiver, { friends: [...personWhoRequestedFrFriends, {friend:req.user.id,chatRoomName}] });
       await UserScheme.findByIdAndUpdate(req.body.receiver, {
         chatRooms: [...personWhoTookFrChatRooms, chatRoomName],
       });
       await UserScheme.findByIdAndUpdate(req.user.id, {
         chatRooms: [...personWhoRequestedFrChatRooms, chatRoomName],
       });

    const chatRoom = await mongoose.model(chatRoomName, ChatSchema);
  }
}

exports.getFriends = async (req, res) => {
    const userId = req.user.id;
  const user = await UserScheme.findById(userId);
    res.status(200).json({
      data:user.friends
    });
}


exports.getChats = async (req, res) => {

    const { chatRoomName } = req.params;
    const chatRoomInMongoDb = await mongoose.model(chatRoomName, ChatSchema);
    const messages = await chatRoomInMongoDb.find();
    res.status(200).json({
        data:messages
    })

    
}

exports.sendMessage = async(req, res) => {
    const { chatroom } = req.params;
    const { message } = req.body;
    const sender = req.user.id;
    const chatRoomInMongoDb = await mongoose.model(chatroom, ChatSchema);

    
            chatRoomInMongoDb.create({
            id: sender,
            message: message,
            });
}