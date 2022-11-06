const MyError = require('../utils/myError')
const asyncHandler = require('./asyncHandler');
const jwt = require('jsonwebtoken')
exports.protect = asyncHandler((req,res,next) => {
    if (!req.headers.authorization) {
        throw new MyError('ta erhgui baina')
    }
    const token = req.headers.authorization.split(" ")[1];
    console.log(req.headers.authorization, "req.headers.authorization");
    if (!token) {
        throw new MyError("ta erhgui baina");        
    }
    const user = jwt.verify(token, "hahahmongodb");
    console.log(user)
    next()
})