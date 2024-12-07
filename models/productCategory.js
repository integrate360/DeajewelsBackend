const mongoose = require("mongoose");

const productCategorySchema = new mongoose.Schema({
  title: {
    type: String, 
    required: true,
  },
  images: {
    type: [String], 
  },

  metaDescription: {
    type: String, 
    required: true,
  },
  metaKeywords: {
    type: [String], 
    required: true,
  },
  metaTitle: {
    type: String, 
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
    required: true,
  },
});

const ProductCategory = mongoose.model(
  "ProductCategory",
  productCategorySchema
);

module.exports = ProductCategory;
