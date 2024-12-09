const ProductCategory = require("../models/productCategory");

const createProductCategory = async (req, res) => {
  try {
    const files = req.files;

    if (!files || files.length === 0) {
      return res
        .status(400)
        .json({ success: false, message: "Image files are required" });
    }

    const imageUrls = files.map((file) => `/uploads/${file.filename}`);

    const productCategory = new ProductCategory({
      ...req.body,
      images: imageUrls,
    });

    await productCategory.save();
    res.status(201).json({ success: true, data: productCategory });
  } catch (error) {
    console.error("Error creating productCategory:", error);
    res.status(500).json({ success: false, error: error.message });
  }
};

const updateProductCategory = async (req, res) => {
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

    // Find the ProductCategory by ID and update its details
    const updatedProduct = await ProductCategory.findByIdAndUpdate(
      id,
      updates,
      {
        new: true, // Return the updated ProductCategory
      }
    );

    if (!updatedProduct) {
      return res
        .status(404)
        .json({ success: false, message: "ProductCategory not found" });
    }

    // Send the updated ProductCategory in the response
    res.status(200).json({ success: true, data: updatedProduct });
  } catch (error) {
    console.error("Error updating ProductCategory:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update ProductCategory",
      error: error.message,
    });
  }
};

// const updateProductCategory = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const updates = { ...req.body }; // Collect the productCategory updates from the request body
//     const file = req.file; // Check if an image file is uploaded

//     // If an image file is provided, upload and update the image
//     if (file) {
//       console.log("Image file found, uploading...");
//       const imageUrl = await uploadImage(file); // Upload the image and get the URL
//       updates.image = imageUrl; // Add the image URL to the update object
//     }

//     // Find the productCategory by ID and update its details
//     const updateProductCategory = await ProductCategory.findByIdAndUpdate(id, updates, {
//       new: true,
//     });

//     if (!updateProductCategory) {
//       return res.status(404).json({ message: "ProductCategory not found" });
//     }

//     res.status(200).json({ success: true, data: updateProductCategory });
//   } catch (error) {
//     console.error("Error updating productCategory:", error);
//     res
//       .status(500)
//       .json({
//         success: false,
//         message: "Failed to update productCategory",
//         error: error.message,
//       });
//   }
// };

const getAllProductCategories = async (req, res) => {
  try {
    const categories = await ProductCategory.find();
    res.status(200).json({ data: categories });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const deleteProductCategory = async (req, res) => {
  try {
    const { id } = req.params;
    await ProductCategory.findByIdAndDelete(id);
    res
      .status(200)
      .json({ message: "ProductCategory category deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getProductCategoryById = async (req, res) => {
  try {
    const { id } = req.params;
    const productCategory = await ProductCategory.findById(id);

    if (!productCategory) {
      return res.status(404).json({ message: "ProductCategory not found" });
    }

    res.status(200).json(productCategory);
  } catch (err) {
    console.error("Error fetching productCategory:", err);
    res.status(500).json({ message: "Failed to fetch productCategory" });
  }
};
module.exports = {
  createProductCategory,
  getProductCategoryById,
  getAllProductCategories,
  updateProductCategory,
  deleteProductCategory,
};
