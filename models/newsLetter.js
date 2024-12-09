const mongoose = require("mongoose");

const newsLetterSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    trim: true,
    lowercase: true,
    unique: true, 
  },
  subject: {
    type: String,
    required: true,
  },
  body: {
    type: String,
    required: true,
  },
  recipients: [
    {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },
  ],
}, { timestamps: true }); 

module.exports = mongoose.model("Newsletter", newsLetterSchema);
