const Newsletter = require("../models/newsLetter");

// Subscribe a new email
exports.subscribe = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Email is required." });
    }

    const newSubscription = new Newsletter({ email });
    await newSubscription.save();

    res
      .status(201)
      .json({ message: "Subscription successful.", data: newSubscription });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({ message: "Email already subscribed." });
    }
    res
      .status(500)
      .json({ message: "Something went wrong.", error: error.message });
  }
};

// Get all subscribers
exports.getAllSubscribers = async (req, res) => {
  try {
    const subscribers = await Newsletter.find();
    res.status(200).json({ data: subscribers });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to fetch subscribers.", error: error.message });
  }
};

// Unsubscribe an email
exports.unsubscribe = async (req, res) => {
  try {
    const { email } = req.params;

    const result = await Newsletter.findOneAndDelete({ email });
    if (!result) {
      return res.status(404).json({ message: "Email not found." });
    }

    res
      .status(200)
      .json({ message: "Unsubscribed successfully.", data: result });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to unsubscribe.", error: error.message });
  }
};
