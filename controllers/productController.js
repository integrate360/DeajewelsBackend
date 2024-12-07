const Product = require("../models/Product");

const createProduct = async (req, res) => {
  try {
    const files = req.files;
    console.log(files.length)

    if (!files || files.length === 0) {
      return res
        .status(400)
        .json({ success: false, message: "Image files are required" });
    }

    // Generate the image URLs
    const imageUrls = files.map((file) => `/uploads/${file.filename}`);

    const product = new Product({
      ...req.body,
      images: imageUrls,
    });

    await product.save();
    res.status(201).json({ success: true, data: product });
  } catch (error) {
    console.error("Error creating product:", error);
    res.status(500).json({ success: false, error: error.message });
  }
};

const updateProduct = async (req, res) => {
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

    // Find the product by ID and update its details
    const updatedProduct = await Product.findByIdAndUpdate(id, updates, {
      new: true, // Return the updated product
    }).populate("productCategoryId");

    if (!updatedProduct) {
      return res
        .status(404)
        .json({ success: false, message: "Product not found" });
    }

    // Send the updated product in the response
    res.status(200).json({ success: true, data: updatedProduct });
  } catch (error) {
    console.error("Error updating product:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update product",
      error: error.message,
    });
  }
};

const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    console.log("updatedProduct -- id", id);
    const deletedProduct = await Product.findByIdAndDelete(id);

    if (!deletedProduct) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.status(200).json({ message: "Product deleted successfully" });
  } catch (err) {
    console.error("Error deleting product:", err);
    res.status(500).json({ message: "Failed to delete product" });
  }
};

const getProductById = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findById(id).populate("productCategoryId");

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.status(200).json(product);
  } catch (err) {
    console.error("Error fetching product:", err);
    res.status(500).json({ message: "Failed to fetch product" });
  }
};

const searchProducts = async (req, res) => {
  try {
    const { searchQuery, minPrice, maxPrice, category, sortBy, sortOrder } =
      req.query;
    let filters = {};

    if (searchQuery) {
      filters.name = new RegExp(searchQuery, "i");
    }

    if (minPrice) {
      filters.price = { ...filters.price, $gte: minPrice };
    }

    if (maxPrice) {
      filters.price = { ...filters.price, $lte: maxPrice };
    }

    if (category) {
      filters.productCategoryId = category;
    }

    let sortOptions = {};
    if (sortBy) {
      sortOptions[sortBy] = sortOrder === "desc" ? -1 : 1;
    }

    const products = await Product.find(filters).sort(sortOptions);
    res.status(200).json(products);
  } catch (err) {
    console.error("Error fetching products:", err);
    res.status(500).json({ message: "Failed to fetch products" });
  }
};

const getProductsByCategory = async (req, res) => {
  try {
    const { categoryId } = req.params;
    const products = await Product.find({
      productCategoryId: categoryId,
    }).populate("productCategoryId");

    if (!products.length) {
      return res
        .status(404)
        .json({ message: "No products found for this category" });
    }

    res.status(200).json(products);
  } catch (err) {
    console.error("Error fetching products by category:", err);
    res.status(500).json({ message: "Failed to fetch products by category" });
  }
};

const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find().populate("productCategoryId");
    res.status(200).json(products);
  } catch (err) {
    console.error("Error fetching products:", err);
    res.status(500).json({ message: "Failed to fetch products" });
  }
};

const deleteProductVariantById = async (req, res) => {
  const { productId, variantId } = req.params;

  try {
    // Find the product and remove the variant with the specified variant ID
    const updatedProduct = await Product.findByIdAndUpdate(
      productId,
      {
        $pull: { variants: { _id: variantId } },
      },
      { new: true } // Return the updated product
    );

    if (!updatedProduct) {
      return res.status(404).json({ message: "Product or variant not found" });
    }

    res.status(200).json({
      message: "Variant deleted successfully",
      product: updatedProduct,
    });
  } catch (error) {
    console.error("Error deleting variant:", error);
    res.status(500).json({ message: "Error deleting variant", error });
  }
};

const updateProductVariantById = async (req, res) => {
  const { productId, variantId } = req.params;
  const variantUpdates = req.body; // New data to update the variant

  try {
    // Find the product by ID and update the specific variant
    const updatedProduct = await Product.findOneAndUpdate(
      { _id: productId, "variants._id": variantId },
      {
        $set: {
          "variants.$": variantUpdates, // Update the specific variant data
        },
      }
    );

    if (!updatedProduct) {
      return res.status(404).json({ message: "Product or variant not found" });
    }

    res.status(200).json({
      message: "Variant updated successfully",
      product: updatedProduct,
    });
  } catch (error) {
    console.error("Error updating variant:", error);
    res.status(500).json({ message: "Error updating variant", error });
  }
};

const deleteProductImageByIndex = async (req, res) => {
  try {
    const { productId, imageIndex } = req.params;
    const product = await Product.findById(productId);
    if (!product) {
      return res
        .status(404)
        .json({ success: false, message: "Product not found" });
    }
    const imageUrls = product.images;
    if (imageIndex < 0 || imageIndex >= imageUrls.length) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid image index" });
    }
    const imagePath = imageUrls[imageIndex].replace("/uploads/", "");
    const fullPath = path.join(__dirname, "..", "uploads", imagePath);
    fs.unlink(fullPath, (err) => {
      if (err) {
        console.error("Error deleting file:", err);
        return res
          .status(500)
          .json({
            success: false,
            message: "Failed to delete image from server",
          });
      }
      product.images.splice(imageIndex, 1);
      product
        .save()
        .then((updatedProduct) => {
          res
            .status(200)
            .json({
              success: true,
              message: "Image deleted successfully",
              data: updatedProduct,
            });
        })
        .catch((error) => {
          console.error("Error saving updated product:", error);
          res
            .status(500)
            .json({
              success: false,
              message: "Failed to update product",
              error: error.message,
            });
        });
    });
  } catch (error) {
    console.error("Error deleting product image:", error);
    res
      .status(500)
      .json({ success: false, message: "Server error", error: error.message });
  }
};

module.exports = {
  getAllProducts,
  searchProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  getProductsByCategory,
  deleteProductVariantById,
  updateProductVariantById,
  deleteProductImageByIndex,
};
