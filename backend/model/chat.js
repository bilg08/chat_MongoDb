const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const ChatSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, "ХЭРЭГЛЭГЧИЙН EMAIL ОРУУЛНА УУ"],
    unique: true,
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      "БУРУУ EMAIL БАЙНА",
    ],
  },
  message:{
    type: String,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = ChatSchema