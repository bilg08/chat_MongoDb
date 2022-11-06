const mongoose = require('mongoose');

const connectDb = async () => {
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log(conn.connection.host)
}
module.exports = connectDb;