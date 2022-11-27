var Mongoose = require('mongoose').Mongoose;

const mongoose1 = new Mongoose()

require('dotenv').config()
// mongodb connection for user collection
mongoose1.connect(process.env.MONGOUDSURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});
const connection1 = mongoose1.connection;
// const dsiCol = connection1.collection(process.env.DSICOLLECTION)
const orgCol = connection1.collection(process.env.ORGCOLLECTION)
const userCol = connection1.collection(process.env.USERCOLLECTION)  
connection1.once("open", function() {
  console.log(`MongoDB 1 database connection established successfully`);
});


const mongoose2 = new Mongoose()
mongoose2.connect(process.env.MONGODSIURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
const connection2 = mongoose2.connection
const schemaCol = connection2.collection(process.env.SCHEMASCOLLECTION)
const hdataCol = connection2.collection(process.env.HDATACOLLECTION)

connection2.once("open", function() {
  console.log(`MongoDB 2 database connection established successfully`);
});

module.exports = { userCol, orgCol, schemaCol, hdataCol}