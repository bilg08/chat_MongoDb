const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const UserScheme = new mongoose.Schema({
  email: {
    type: String,
    required: [true, "ХЭРЭГЛЭГЧИЙН EMAIL ОРУУЛНА УУ"],
    unique: true,
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      "БУРУУ EMAIL БАЙНА",
    ],
  },
  friends: {
    type: Array,
    required: true,
    default:[]
  },
  chatRooms: {
    type: Array,
    required: true,
    default:[]
  },
  password: {
    type: String,
    minLength: 4,
    required: [true, "НУУЦ ҮГЭЭ ОРУУЛНА УУ"],
    select: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});
UserScheme.pre("save", async function () {
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

UserScheme.methods.getJsonWebToken = function () {
  const token = jwt.sign(
    { id: this._id },
    "hahahmongodb",
    { expiresIn: "1d" }
  );
  return token;
};
UserScheme.methods.checkPassword = async function (password) {
  const ok = await bcrypt.compare(password, this.password);
  return ok;
};


module.exports = mongoose.model("User", UserScheme);
