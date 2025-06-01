const mongoose = require("mongoose");
require("colors");

const connectDB = async () => {
    try{
        const url = process.env.MONGO_URI;
        const conn = await mongoose.connect(url, {
        useUnifiedTopology: true,
        useNewUrlParser: true,
        // useCreateIndex: true,
    });
    console.log(
      `Mongodb DataBase Connected on URL "mongodb+srv://yogeshverma:yogesh@cluster0.owpdira.mongodb.net/test"!`.bgCyan.white
      // ${conn.connection.host}
    );
    }catch (error) {
        console.log(`error: ${error.message}`.bgRed.white);
      }
};

module.exports = connectDB;