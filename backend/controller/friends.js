const express = require('express');
const { default: mongoose } = require('mongoose');
const ChatSchema = require('../model/chat');
const UserScheme = require('../model/user')
exports.friendRequest = async(req,res) => {
    const userId = req.user.id;
    const receiverId = req.body.receiver;
    const sender = await UserScheme.findById(userId);
    const receiver = await UserScheme.findById(receiverId);
    const receiverPendingFriendRequest = receiver.pendingFriendRequest;
    if(!receiver.pendingFriendRequest.includes(userId)){
        await UserScheme.findByIdAndUpdate(receiverId,{pendingFriendRequest:[...receiverPendingFriendRequest,userId]})
    }else{
        return
    }
    res.status(200).json({
        status:true,
        receiver
    })
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
   if(personWhoTookFr.pendingFriendRequest.includes(req.body.receiver)&&!personWhoTookFr.friends.includes(req.body.receiver)
   &&(!personWhoRequestedFr.friends.includes(req.user.id))
   ){
    const index = personWhoTookFrPendingRequest.indexOf(req.body.receiver)
    await UserScheme.findByIdAndUpdate(req.user.id,{pendingFriendRequest:personWhoTookFrPendingRequest.splice(index,1)});
    await UserScheme.findByIdAndUpdate(req.user.id,{friends:[...personWhoTookFrFriends,req.body.receiver]});
    await UserScheme.findByIdAndUpdate(req.body.receiver,{friends:[...personWhoRequestedFrFriends,req.user.id]});
    const chatRoom = await mongoose.model(`chatRoom_${req.user.id}_${req.body.receiver}`,ChatSchema)
    console.log(await UserScheme.findById(req.user.id))
  }
}

exports.getFriends = async(req,res) => {
    const userId = req.user.id;
    const user = await UserScheme.findById(userId);
    const userFriends = user.friends.filter(user=>user!==userId);
    res.status(200).json({
        data:userFriends
    })
}