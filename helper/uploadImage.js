const fs = require("fs");
const path = require("path");

const uploadImage = async (file) => {
  try {
    const uploadDir = path.join(__dirname, "uploads");
    const fileName = `${Date.now()}-${file.originalname}`;
    const filePath = path.join(uploadDir, fileName);

    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    fs.writeFileSync(filePath, file.buffer);
    
    console.log("File uploaded successfully:", filePath);

    // Return the public URL of the file
    return `/uploads/${fileName}`;
  } catch (error) {
    console.error("Error uploading file:", error);
    throw new Error("File upload failed");
  }
};


// Function to delete an image from the "uploads" folder
const deleteImage = async (imagePath) => {
  try {
    if (fs.existsSync(imagePath)) {
      fs.unlinkSync(imagePath);
      console.log("File deleted:", imagePath);
    } else {
      console.warn("File not found:", imagePath);
    }
  } catch (error) {
    console.error("Error deleting file:", error);
  }
};

module.exports = { uploadImage, deleteImage };
