const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
    },
    firstName: {
      type: String,
    },
    lastName: {
      type: String,
    },
    // age: {
    //   type: Number,
    // },
    // gender: {
    //   type: String,
    //   enum: ["Male", "Female"],
    // },
    // pincode: {
    //   type: Number,
    // },
    phoneNumber: {
      type: String,
    },
    password: {
      type: String,
    },
    // image: {
    //   type: String,
    // },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
