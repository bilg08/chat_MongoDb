const User = require("../model/user");
const mongoose = require('mongoose');
const ChatSchema = require('../model/chat')
const asyncHandler = require('../middleware/asyncHandler')
exports.register = asyncHandler(async (req, res, next) => {
  const user = await User.create(req.body);
  const token = user.getJsonWebToken();
  res.status(200).json({
    success: user,
    token,
  });
});
exports.login = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    throw MyError("EMAIL NUUTS UGEE ORUULNA UU", 400);
  }
  const user = await User.findOne({ email }).select("+password");
  if (!user) {
    throw MyError("EMAIL NUUTS UG BURUU BAINA", 400);
  }
  const ok = await user.checkPassword(password);
  if (!ok) {
    throw MyError("EMAIL NUUTS UG BURUU BAINA", 400);
  }
  res.status(200).json({
    success: true,
    token: user.getJsonWebToken(),
    user,
  });
})

exports.getFriends = asyncHandler(async(req,res,next) => {
  const user = await User.findById({_id:req.user.id});
  res.status(200).json({
    success: true,
    data:user.friends
  });
})


exports.getUsers = asyncHandler(async(req,res,next) => {

  const AllUsers = await User.find();
  const requested_User = await User.findById(req.user.id);
  const userFriends = requested_User.friends;
  const users_except_requestedUser = AllUsers.filter(user => user._id.toString() !== req.user.id);
  let users_except_userFriends = [];


  for (let i = 0; i < AllUsers.length; i++) {
    //data[i]._id.toString()  a user id
    for (let j = 0; j < userFriends.length; j++) {
        userFriends[j].friend !== users_except_requestedUser[i]._id.toString()?users_except_userFriends.push(
          users_except_requestedUser[i]._id.toString()
      ) : ""
      // if (
      //   userFriends[j].friend !== users_except_requestedUser[i]._id.toString()
      // ) {
        // users_except_userFriends.push(
        //   users_except_requestedUser[i]._id.toString()
        // );
      // }
    }
  }
  
  res.status(200).json({
    success: true,
    data:users_except_userFriends,
  });
})
