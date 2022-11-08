const mongoose = require('mongoose');
const connectDb = async () => {
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }).then(async() => {
      const a = await mongoose.connection.db.listCollections().toArray();
      module.exports.Collection = a;
    });
}
module.exports = connectDb;