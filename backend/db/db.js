const mongoose = require("mongoose");
const MONGO_URI = process.env.MONGO_URI;

const dbConnection = async () => {
  try {
    const connection = await mongoose.connect(MONGO_URI);
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};

module.exports = dbConnection;
