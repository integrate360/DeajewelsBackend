const mongoose = require("mongoose");

const TestimonialSchema = new mongoose.Schema({
  title: {
    type: String, 
    required: true,
  },
  images: {
    type: [String], 
  },
  desc: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
    required: true,
  },
});

const Testimonial = mongoose.model(
  "Testimonial",
  TestimonialSchema
);

module.exports = Testimonial;
