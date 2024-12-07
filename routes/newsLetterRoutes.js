const express = require("express");
const router = express.Router();
const newsletterController = require("../controllers/newsLetterController");

// Subscribe to the newsletter
router.post("/subscribe", newsletterController.subscribe);

// Get all subscribers
router.get("/subscribers", newsletterController.getAllSubscribers);

// Unsubscribe from the newsletter
router.delete("/unsubscribe/:email", newsletterController.unsubscribe);

module.exports = router;
