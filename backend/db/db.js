const mongoose = require("mongoose");
const MONGO_URI =
  "mongodb+srv://admin:mongoadmin@cluster0.y4lzznd.mongodb.net/finalProjectRicebook?retryWrites=true&w=majority";

const dbConnection = async () => {
  try {
    const connection = await mongoose.connect(MONGO_URI);
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};

module.exports = dbConnection;
