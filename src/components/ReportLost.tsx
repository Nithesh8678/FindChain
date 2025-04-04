import React, { useState, FormEvent } from "react";
import { motion } from "framer-motion";
import {
  FiUpload,
  FiCalendar,
  FiClock,
  FiMapPin,
  FiPhone,
  FiMail,
} from "react-icons/fi";

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
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [formStep, setFormStep] = useState(1);
  const [formData, setFormData] = useState({
    itemName: "",
    category: "",
    description: "",
    dateLost: "",
    timeLost: "",
    location: "",
    contactPhone: "",
    contactEmail: "",
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

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Handle form submission here
    console.log(formData);
  };

  return (
    <div className="min-h-screen pt-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl shadow-2xl p-8"
        >
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
                    <label className="block text-white/80 mb-2 font-montserrat flex items-center">
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
                    <label className="block text-white/80 mb-2 font-montserrat flex items-center">
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
                  <label className="block text-white/80 mb-2 font-montserrat flex items-center">
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
                  <label className="block text-white/80 mb-2 font-montserrat flex items-center">
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
                  <label className="block text-white/80 mb-2 font-montserrat flex items-center">
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
                  <button
                    type="submit"
                    className="px-8 py-3 bg-gradient-to-r from-[#03672A] to-[#046A29] text-white rounded-xl font-montserrat hover:from-[#046A29] hover:to-[#03672A] transition-all duration-300 transform hover:scale-105 hover:shadow-lg"
                  >
                    Submit Report
                  </button>
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
