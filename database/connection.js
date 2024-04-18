const mongoose = require("mongoose");
require('dotenv').config();

const connectDatabase = () => {
    var url = process.env.MongoURL;
    mongoose
        .connect(url, { useNewUrlParser: true, useUnifiedTopology: true })
        .then(() => console.log('MongoDB connected'))
        .catch((err) => console.log(err));
}
module.exports = connectDatabase;