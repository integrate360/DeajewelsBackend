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

const TestimonialController = require("../controllers/TestimonialController");

router.post("/testimonial", upload.array("images"), TestimonialController.createTestimonial);

router.get("/testimonial", TestimonialController.getAllTestimonial);

router.put("/testimonial/:id",upload.array("images"),  TestimonialController.updateTestimonial);

router.get("/gettestimonialById/:id", TestimonialController.getTestimonialById);

router.delete("/testimonial/:id", TestimonialController.deleteTestimonial);

module.exports = router;











