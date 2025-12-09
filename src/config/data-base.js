const mongoose = require("mongoose");

const ConnectDB = async () => {
  await mongoose.connect(
    `${process.env.MONGOOSE_CONNECTION_SECRET_URL}/project10`
  );
};

module.exports = ConnectDB;
