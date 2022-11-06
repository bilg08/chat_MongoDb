const express = require('express');
const app = express();
const dotenv = require('dotenv');
const connectDb = require('./db')
const userRouter = require('./routes/user');
const errorHandler = require('./middleware/error');
const cors = require('cors');
const http = require("http").Server(app);
app.use(cors())

const socketIO = require("socket.io")(http, {
  cors: {
    origin: "http://localhost:3000",
  },
});

socketIO.on("connection", (socket) => {
  socket.on("chat message", (msg) => {
    socketIO.emit("chat message", msg);
  });
  socket.on("disconnect", (socket) => {
    console.log("userDisconnected");
  });
});















dotenv.config({ path: './.env' })
connectDb();
app.use(express.json())
app.use('/users', userRouter)
app.use(errorHandler)
http.listen(process.env.PORT, () => {
    console.log(process.env.PORT + "listening");
})