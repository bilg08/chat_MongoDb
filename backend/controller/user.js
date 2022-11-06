const User = require("../model/user");
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

exports.getUsers = asyncHandler(async(req,res,next) => {
  const Users = await User.find();
  res.status(200).json({
    success: true,
    data:Users,
  });
})
