const mongoose = require("mongoose");

const conectToMongoDb = () => {
  mongoose
    .connect("mongodb://127.0.0.1:27017/testThapa", {
      useNewUrlParser: true,
      useUnifiedTopology: true,
   
    })
    .then(() => {
      console.log("connected to mongoDb");
    })
    .catch((err) => {
      console.log("error in connecting to mongoDb", err);
    });
};
module.exports = conectToMongoDb;
