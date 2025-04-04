import React, { useState, FormEvent } from "react";
import { motion } from "framer-motion";
import {
  FiUpload,
  FiCalendar,
  FiClock,
  FiMapPin,
  FiPhone,
  FiMail,
  FiCheckCircle,
  FiAlertCircle,
} from "react-icons/fi";
import { FaEthereum } from "react-icons/fa";
import { reportLostItem } from "../services/itemService";
import { useNavigate } from "react-router-dom";

const categories = [
  "Electronics",
  "Jewelry",
  "Documents",
  "Accessories",
  "Bags & Wallets",
  "Keys",
  "Clothing",
  "Others",
];

const ReportLost: React.FC = () => {
  const navigate = useNavigate();
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [formStep, setFormStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    itemName: "",
    category: "",
    description: "",
    dateLost: "",
    timeLost: "",
    location: "",
    contactPhone: "",
    contactEmail: "",
    rewardAmount: "",
    image: null as File | null,
  });

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData({ ...formData, image: file });
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRewardChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // Allow only numbers and decimals
    if (value === "" || /^\d*\.?\d*$/.test(value)) {
      setFormData({ ...formData, rewardAmount: value });
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      // Validate form
      if (
        !formData.itemName ||
        !formData.category ||
        !formData.description ||
        !formData.dateLost ||
        !formData.timeLost ||
        !formData.location ||
        !formData.contactPhone ||
        !formData.contactEmail
      ) {
        throw new Error("Please fill in all required fields");
      }

      // Validate image if provided
      if (formData.image) {
        const validTypes = ["image/jpeg", "image/png", "image/jpg"];
        if (!validTypes.includes(formData.image.type)) {
          throw new Error(
            `Invalid image type. Only ${validTypes.join(", ")} are allowed.`
          );
        }

        // Check file size (max 5MB)
        if (formData.image.size > 5 * 1024 * 1024) {
          throw new Error("Image size too large. Maximum size is 5MB.");
        }
      }

      // Get temporary userId (replace this with actual user authentication)
      const tempUserId = "temp-" + Date.now();

      // Create a clean data object without the image
      const { image, ...cleanData } = formData;

      // Submit to Firebase
      await reportLostItem(cleanData, image, tempUserId);

      // Show success message and redirect
      navigate("/dashboard", {
        state: {
          message:
            "Item reported successfully! We'll notify you if someone finds it.",
        },
      });
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "An error occurred while submitting the report"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen pt-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-[#030502] to-[#03672A]/20">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl shadow-2xl p-8 relative overflow-hidden"
        >
          {/* Decorative Elements */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#03672A]/10 rounded-full filter blur-3xl -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#046A29]/10 rounded-full filter blur-3xl translate-y-1/2 -translate-x-1/2" />

          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-500 flex items-center"
            >
              <FiAlertCircle className="mr-2" />
              {error}
            </motion.div>
          )}

          <h1 className="font-nasalization text-4xl text-white mb-8 tracking-wider text-center">
            Report Lost Item
          </h1>

          <div className="mb-8">
            <div className="flex justify-between items-center">
              {[1, 2].map((step) => (
                <div
                  key={step}
                  className={`flex-1 relative ${step === 1 ? "pr-2" : "pl-2"}`}
                >
                  <div
                    className={`h-1 rounded-full transition-all duration-300 ${
                      formStep >= step ? "bg-[#03672A]" : "bg-white/20"
                    }`}
                  />
                  <div
                    className={`absolute top-1/2 -translate-y-1/2 ${
                      step === 1 ? "left-0" : "right-0"
                    } w-4 h-4 rounded-full border-2 transition-all duration-300 ${
                      formStep >= step
                        ? "border-[#03672A] bg-[#03672A]"
                        : "border-white/20 bg-transparent"
                    }`}
                  />
                </div>
              ))}
            </div>
            <div className="flex justify-between mt-2">
              <span className="text-white/60 text-sm">Basic Details</span>
              <span className="text-white/60 text-sm">Contact Information</span>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {formStep === 1 ? (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                {/* Item Name */}
                <div>
                  <label className="block text-white/80 mb-2 font-montserrat">
                    Item Name
                  </label>
                  <input
                    type="text"
                    value={formData.itemName}
                    onChange={(e) =>
                      setFormData({ ...formData, itemName: e.target.value })
                    }
                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:border-[#03672A] transition-colors duration-300 outline-none font-montserrat"
                    placeholder="Enter item name"
                  />
                </div>

                {/* Category */}
                <div>
                  <label className="block text-white/80 mb-2 font-montserrat">
                    Category
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    {categories.map((category) => (
                      <button
                        key={category}
                        type="button"
                        onClick={() => setFormData({ ...formData, category })}
                        className={`px-4 py-2 rounded-xl border transition-all duration-300 font-montserrat text-sm
                          ${
                            formData.category === category
                              ? "border-[#03672A] bg-[#03672A]/20 text-white"
                              : "border-white/10 bg-white/5 text-white/70 hover:bg-white/10"
                          }
                        `}
                      >
                        {category}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Description */}
                <div>
                  <label className="block text-white/80 mb-2 font-montserrat">
                    Description
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:border-[#03672A] transition-colors duration-300 outline-none font-montserrat min-h-[100px]"
                    placeholder="Describe your item in detail"
                  />
                </div>

                {/* Date and Time */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label className=" text-white/80 mb-2 font-montserrat flex items-center">
                      <FiCalendar size={18} className="mr-2" />
                      Date Lost
                    </label>
                    <input
                      type="date"
                      value={formData.dateLost}
                      onChange={(e) =>
                        setFormData({ ...formData, dateLost: e.target.value })
                      }
                      className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:border-[#03672A] transition-colors duration-300 outline-none font-montserrat"
                    />
                  </div>
                  <div>
                    <label className=" text-white/80 mb-2 font-montserrat flex items-center">
                      <FiClock size={18} className="mr-2" />
                      Time Lost
                    </label>
                    <input
                      type="time"
                      value={formData.timeLost}
                      onChange={(e) =>
                        setFormData({ ...formData, timeLost: e.target.value })
                      }
                      className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:border-[#03672A] transition-colors duration-300 outline-none font-montserrat"
                    />
                  </div>
                </div>

                {/* Location */}
                <div>
                  <label className="text-white/80 mb-2 font-montserrat flex items-center">
                    <FiMapPin size={18} className="mr-2" />
                    Location Lost
                  </label>
                  <input
                    type="text"
                    value={formData.location}
                    onChange={(e) =>
                      setFormData({ ...formData, location: e.target.value })
                    }
                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:border-[#03672A] transition-colors duration-300 outline-none font-montserrat"
                    placeholder="Enter location where item was lost"
                  />
                </div>

                {/* Reward Amount */}
                <div>
                  <label className="text-white/80 mb-2 font-montserrat flex items-center">
                    <FaEthereum size={18} className="mr-2" />
                    Reward Amount (ETH)
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={formData.rewardAmount}
                      onChange={handleRewardChange}
                      className="w-full px-4 py-3 pl-12 rounded-xl bg-white/5 border border-white/10 text-white focus:border-[#03672A] transition-colors duration-300 outline-none font-montserrat"
                      placeholder="0.00"
                      step="0.01"
                    />
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <FaEthereum className="text-white/60" size={16} />
                    </div>
                    {formData.rewardAmount && (
                      <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
                        <span className="text-white/60 text-sm">ETH</span>
                      </div>
                    )}
                  </div>
                  <p className="mt-1 text-white/40 text-xs font-montserrat">
                    Enter the reward amount in ETH you're willing to offer
                  </p>
                </div>

                {/* Image Upload */}
                <div>
                  <label className="block text-white/80 mb-2 font-montserrat">
                    Upload Image
                  </label>
                  <div className="relative border-2 border-dashed border-white/20 rounded-xl p-8 text-center hover:border-[#03672A] transition-colors duration-300">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />
                    {selectedImage ? (
                      <img
                        src={selectedImage}
                        alt="Preview"
                        className="max-h-48 mx-auto rounded-lg"
                      />
                    ) : (
                      <div className="text-white/60">
                        <FiUpload size={48} className="mx-auto mb-4" />
                        <p className="font-montserrat">
                          Drag and drop an image, or click to select
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={() => setFormStep(2)}
                    className="px-8 py-3 bg-gradient-to-r from-[#03672A] to-[#046A29] text-white rounded-xl font-montserrat hover:from-[#046A29] hover:to-[#03672A] transition-all duration-300 transform hover:scale-105 hover:shadow-lg"
                  >
                    Next Step
                  </button>
                </div>
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                {/* Contact Information */}
                <div>
                  <label className="text-white/80 mb-2 font-montserrat flex items-center">
                    <FiPhone size={18} className="mr-2" />
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    value={formData.contactPhone}
                    onChange={(e) =>
                      setFormData({ ...formData, contactPhone: e.target.value })
                    }
                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:border-[#03672A] transition-colors duration-300 outline-none font-montserrat"
                    placeholder="Enter your phone number"
                  />
                </div>

                <div>
                  <label className=" text-white/80 mb-2 font-montserrat flex items-center">
                    <FiMail size={18} className="mr-2" />
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={formData.contactEmail}
                    onChange={(e) =>
                      setFormData({ ...formData, contactEmail: e.target.value })
                    }
                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:border-[#03672A] transition-colors duration-300 outline-none font-montserrat"
                    placeholder="Enter your email address"
                  />
                </div>

                <div className="flex justify-between">
                  <button
                    type="button"
                    onClick={() => setFormStep(1)}
                    className="px-8 py-3 bg-white/5 text-white rounded-xl font-montserrat hover:bg-white/10 transition-all duration-300"
                  >
                    Back
                  </button>
                  <motion.button
                    type="submit"
                    disabled={isSubmitting}
                    className={`px-8 py-3 bg-gradient-to-r from-[#03672A] to-[#046A29] text-white rounded-xl font-montserrat 
                      ${
                        isSubmitting
                          ? "opacity-75 cursor-not-allowed"
                          : "hover:from-[#046A29] hover:to-[#03672A] transition-all duration-300 transform hover:scale-105 hover:shadow-lg"
                      } flex items-center`}
                    whileHover={!isSubmitting ? { scale: 1.05 } : {}}
                    whileTap={!isSubmitting ? { scale: 0.95 } : {}}
                  >
                    {isSubmitting ? (
                      <>
                        <svg
                          className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          ></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          ></path>
                        </svg>
                        Submitting...
                      </>
                    ) : (
                      <>
                        Submit Report
                        <FiCheckCircle className="ml-2" />
                      </>
                    )}
                  </motion.button>
                </div>
              </motion.div>
            )}
          </form>
        </motion.div>
      </div>
    </div>
  );
};

export default ReportLost;
