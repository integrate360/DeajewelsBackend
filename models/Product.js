
const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  images: {
    type: [String], 
  },
  sku: {
    type: String, 
    required: true,
  },
  goldWeight: {
    type: String, 
    required: true,
  },
  whiteD: {
    type: String,
    required: true,
  },
  fancyD: {
    type: String, 
    required: true,
  },
  labour: {
    type: String, 
    required: true,
  },
  price: {
    type: String, 
    required: true,
  },
  b2bLabourCharge: {
    type: String,
    required: true,
  },
  relatedProductid: [{
    type: mongoose.Schema.Types.ObjectId, 
    ref: "Product", 
  }],
  productCategoryId: [{
    type: mongoose.Schema.Types.ObjectId, 
    ref: "ProductCategory", 
  }],

}, { timestamps: true });

module.exports = mongoose.model("Product", productSchema);
