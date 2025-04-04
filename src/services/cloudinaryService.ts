const uploadToCloudinary = async (file: File): Promise<string> => {
  try {
    // Validate file type
    const validTypes = ["image/jpeg", "image/png", "image/jpg"];
    if (!validTypes.includes(file.type)) {
      throw new Error(
        `Invalid file type. Only ${validTypes.join(", ")} are allowed.`
      );
    }

    // Create form data
    const formData = new FormData();
    formData.append("file", file);
    formData.append(
      "upload_preset",
      import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET
    );

    // Log for debugging
    console.log(
      "Uploading to Cloudinary with preset:",
      import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET
    );
    console.log("Cloud name:", import.meta.env.VITE_CLOUDINARY_CLOUD_NAME);

    // Upload to Cloudinary
    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${
        import.meta.env.VITE_CLOUDINARY_CLOUD_NAME
      }/image/upload`,
      {
        method: "POST",
        body: formData,
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Cloudinary error response:", errorData);
      throw new Error(
        `Failed to upload image to Cloudinary: ${
          errorData.error?.message || "Unknown error"
        }`
      );
    }

    const data = await response.json();
    console.log("Cloudinary upload successful:", data.secure_url);
    return data.secure_url;
  } catch (error) {
    console.error("Error uploading to Cloudinary:", error);
    throw error;
  }
};

export default uploadToCloudinary;
