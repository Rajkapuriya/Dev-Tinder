const mongoose = require("mongoose");

const connectDB = async () => {
  await mongoose.connect("mongodb+srv://rajkapuriya03:Raj%4087587@cluster0.0b790up.mongodb.net/devtinder")
};

module.exports = connectDB;
