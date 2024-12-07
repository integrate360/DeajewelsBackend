const Testimonial = require("../models/Testimonials");

const createTestimonial = async (req, res) => {
  try {
    const files = req.files;

    if (!files || files.length === 0) {
      return res
        .status(400)
        .json({ success: false, message: "Image files are required" });
    }

    const imageUrls = files.map((file) => `/uploads/${file.filename}`);

    const testimonial = new Testimonial({
      ...req.body,
      images: imageUrls,
    });

    await testimonial.save();
    res.status(201).json({ success: true, data: testimonial });
  } catch (error) {
    console.error("Error creating testimonial:", error);
    res.status(500).json({ success: false, error: error.message });
  }
};


const updateTestimonial = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = { ...req.body }; // Collect the product updates from the request body
    const files = req.files; // Check if image files are uploaded

    // If image files are provided, upload each and gather their URLs
    if (files && files.length > 0) {
      console.log("Image files found, uploading...");
      const imageUrls = files.map((file) => `/uploads/${file.filename}`); // Generate URLs based on the stored filenames
      updates.images = imageUrls; // Add the image URLs to the update object
    }

    // Find the Testimonial by ID and update its details
    const updatedProduct = await Testimonial.findByIdAndUpdate(id, updates, {
      new: true, // Return the updated Testimonial
    });

    if (!updatedProduct) {
      return res
        .status(404)
        .json({ success: false, message: "Testimonial not found" });
    }

    // Send the updated Testimonial in the response
    res.status(200).json({ success: true, data: updatedProduct });
  } catch (error) {
    console.error("Error updating Testimonial:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update Testimonial",
      error: error.message,
    });
  }
};


const getAllTestimonial = async (req, res) => {
  try {
    const categories = await Testimonial.find();
    res.status(200).json({ data: categories });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const deleteTestimonial = async (req, res) => {
  try {
    const { id } = req.params;

    // Find and delete the testimonial
    const deletedTestimonial = await Testimonial.findByIdAndDelete(id);

    if (!deletedTestimonial) {
      return res.status(404).json({ message: 'Testimonial not found' });
    }

    res.status(200).json({ message: 'Testimonial deleted successfully' });
  } catch (error) {
    console.error('Error deleting testimonial:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const getTestimonialById = async (req, res) => {
  try {
    const { id } = req.params;
    const testimonial = await Testimonial.findById(id);

    if (!testimonial) {
      return res.status(404).json({ message: "Testimonial not found" });
    }

    res.status(200).json(testimonial);
  } catch (err) {
    console.error("Error fetching testimonial:", err);
    res.status(500).json({ message: "Failed to fetch testimonial" });
  }
};
module.exports = {
  createTestimonial,
  getTestimonialById,
  getAllTestimonial,
  updateTestimonial,
  deleteTestimonial,
};
