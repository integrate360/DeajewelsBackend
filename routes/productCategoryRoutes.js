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

const productCategoryController = require("../controllers/productCategoryController");

router.post("/category", upload.array("images"), productCategoryController.createProductCategory);

router.get("/category", productCategoryController.getAllProductCategories);

router.put("/category/:id",upload.array("images"),  productCategoryController.updateProductCategory);

router.get("/getProductCategoryById/:id", productCategoryController.getProductCategoryById);

router.delete("/category/:id", productCategoryController.deleteProductCategory);

module.exports = router;
