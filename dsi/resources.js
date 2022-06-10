const mongoose = require('mongoose')
require('dotenv').config()
// mongodb connection for user collection
mongoose.connect(process.env.MONGODSIURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});
const connection = mongoose.connection;
const dsiCol = connection.collection(process.env.DSICOLLECTION)
const userCol = connection.collection(process.env.USERCOLLECTION)  
connection.once("open", function() {
  console.log(`MongoDB database connection established successfully`);
});


module.exports = { dsiCol, userCol }