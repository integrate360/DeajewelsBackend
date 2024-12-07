const express = require("express");
const router = express.Router();
const multer = require("multer");


const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); 
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`); 
  }
});

const upload = multer({ storage: storage });


const productController = require("../controllers/productController");

// Route for creating a new product
router.post("/createProduct", upload.array("images"), productController.createProduct);

// Route for fetching all products
router.get("/getAllProducts", productController.getAllProducts);

// Route for deleting a product image by index
router.delete("/products/:productId/:imageIndex", productController.deleteProductImageByIndex);

// Route for fetching a product by its ID
router.get("/getProductById/:id", productController.getProductById);

// Route for fetching products by category ID
router.get("/category/:categoryId", productController.getProductsByCategory);

// Route for deleting a product variant by its ID
router.delete("/product/:productId/variant/:variantId", productController.deleteProductVariantById);

// Route for updating a product variant by its ID
router.put("/updateProductVariant/:productId/:variantId", productController.updateProductVariantById);

// Route for searching products
router.get("/search", productController.searchProducts);

// Route for updating a product (with image uploads)
router.put("/updateProduct/:id", upload.array("images"), productController.updateProduct);

// Route for deleting a product by its ID
router.delete("/deleteProduct/:id", productController.deleteProduct);

module.exports = router;
