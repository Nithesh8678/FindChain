import React, {
  useState,
  useEffect,
  useMemo,
  useCallback,
  useRef,
} from "react";
import { motion } from "framer-motion";
import {
  FiUpload,
  FiCalendar,
  FiClock,
  FiMapPin,
  FiPhone,
  FiMail,
  FiCheckCircle,
  FiSearch,
  FiX,
  FiTag,
} from "react-icons/fi";
import { FaEthereum } from "react-icons/fa";
import {
  getFoundItems,
  FoundItem,
  submitFoundItem,
} from "../services/itemService";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

// Move form state and logic to a custom hook
const useFoundItemForm = (navigate: ReturnType<typeof useNavigate>) => {
  const [formData, setFormData] = useState({
    itemName: "",
    category: "",
    description: "",
    dateFound: "",
    timeFound: "",
    location: "",
    contactPhone: "",
    contactEmail: "",
    rewardAmount: "",
    image: null as File | null,
  });
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [formStep, setFormStep] = useState(1);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const { user } = useAuth();

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
    if (value === "" || /^\d*\.?\d*$/.test(value)) {
      setFormData({ ...formData, rewardAmount: value });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) {
      setError("You must be logged in to report a found item");
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const itemData = {
        name: formData.itemName,
        description: formData.description,
        category: formData.category,
        location: formData.location,
        imageUrl: selectedImage || undefined,
        userId: user.uid,
        createdAt: new Date(),
      };

      await submitFoundItem(user.uid, itemData);

      // Reset form
      setFormData({
        itemName: "",
        category: "",
        description: "",
        dateFound: "",
        timeFound: "",
        location: "",
        contactPhone: "",
        contactEmail: "",
        rewardAmount: "",
        image: null,
      });
      setSelectedImage(null);

      // Show success message
      setSuccess("Item reported successfully!");

      // Redirect to dashboard after a delay
      setTimeout(() => {
        navigate("/dashboard");
      }, 2000);
    } catch (err) {
      console.error("Error submitting found item:", err);
      setError("Failed to submit item. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return {
    formData,
    setFormData,
    selectedImage,
    setSelectedImage,
    formStep,
    setFormStep,
    error,
    setError,
    loading,
    success,
    setSuccess,
    handleImageChange,
    handleRewardChange,
    handleSubmit,
  };
};

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

const ReportForm: React.FC<{
  onClose: () => void;
  formState: ReturnType<typeof useFoundItemForm>;
}> = React.memo(({ onClose, formState }) => {
  const {
    formData,
    setFormData,
    selectedImage,
    formStep,
    setFormStep,
    error,
    handleImageChange,
    handleRewardChange,
    handleSubmit,
  } = formState;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 20 }}
        className="bg-[#030502] border border-[#03672A]/30 rounded-xl p-6 mt-20 max-w-4xl w-full max-h-[80vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-start mb-6">
          <h2 className="text-2xl font-nasalization text-white">
            Report Found Item
          </h2>
          <button
            onClick={onClose}
            className="text-white/60 hover:text-white transition-colors"
          >
            <FiX className="w-6 h-6" />
          </button>
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
                    Date Found
                  </label>
                  <input
                    type="date"
                    value={formData.dateFound}
                    onChange={(e) =>
                      setFormData({ ...formData, dateFound: e.target.value })
                    }
                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:border-[#03672A] transition-colors duration-300 outline-none font-montserrat"
                  />
                </div>
                <div>
                  <label className=" text-white/80 mb-2 font-montserrat flex items-center">
                    <FiClock size={18} className="mr-2" />
                    Time Found
                  </label>
                  <input
                    type="time"
                    value={formData.timeFound}
                    onChange={(e) =>
                      setFormData({ ...formData, timeFound: e.target.value })
                    }
                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:border-[#03672A] transition-colors duration-300 outline-none font-montserrat"
                  />
                </div>
              </div>

              {/* Location */}
              <div>
                <label className="text-white/80 mb-2 font-montserrat flex items-center">
                  <FiMapPin size={18} className="mr-2" />
                  Location Found
                </label>
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) =>
                    setFormData({ ...formData, location: e.target.value })
                  }
                  className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:border-[#03672A] transition-colors duration-300 outline-none font-montserrat"
                  placeholder="Enter location where item was found"
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
                  className="px-8 py-3 bg-gradient-to-r from-[#03672A] to-[#046A29] text-white rounded-xl font-montserrat hover:from-[#046A29] hover:to-[#03672A] transition-all duration-300 transform hover:scale-105 hover:shadow-lg flex items-center"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Submit Report
                  <FiCheckCircle className="ml-2" />
                </motion.button>
              </div>
            </motion.div>
          )}
          {error && (
            <p className="text-red-500 text-center font-montserrat">{error}</p>
          )}
        </form>
      </motion.div>
    </motion.div>
  );
});

const FoundItemCard = React.memo(({ item }: { item: FoundItem }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    whileHover={{ y: -5, boxShadow: "0 10px 25px -5px rgba(3, 103, 42, 0.3)" }}
    className="bg-white/10 backdrop-blur-md rounded-xl overflow-hidden border border-white/20 hover:border-[#03672A]/50 transition-all duration-300 h-full flex flex-col"
  >
    <div className="flex flex-col h-full">
      {item.imageUrl ? (
        <div className="relative h-48 overflow-hidden group">
          <img
            src={item.imageUrl}
            alt={item.name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        </div>
      ) : (
        <div className="h-48 bg-gradient-to-br from-[#03672A]/30 to-[#046A29]/30 flex items-center justify-center">
          <FiTag className="w-12 h-12 text-white/40" />
        </div>
      )}
      <div className="p-4 flex-1 flex flex-col">
        <h3 className="text-xl font-nasalization text-white mb-2">
          {item.name}
        </h3>
        <div className="flex items-center gap-2 mb-2">
          <span className="px-2 py-1 bg-[#03672A]/20 text-[#03672A] rounded-md text-xs font-montserrat">
            {item.category}
          </span>
        </div>
        <p className="text-white/70 font-montserrat text-sm mb-4 line-clamp-2">
          {item.description}
        </p>
        <div className="mt-auto grid grid-cols-2 gap-2 text-xs text-white/50 font-montserrat">
          <div className="flex items-center gap-1">
            <FiMapPin className="text-[#03672A]" />
            <span>{item.location}</span>
          </div>
          <div className="flex items-center gap-1">
            <FiCalendar className="text-[#03672A]" />
            <span>{new Date(item.dateFound).toLocaleDateString()}</span>
          </div>
        </div>
        {item.reward && (
          <div className="mt-3 flex items-center gap-1 text-[#03672A] font-montserrat text-sm">
            <FaEthereum />
            <span>{item.reward} ETH Reward</span>
          </div>
        )}
      </div>
    </div>
  </motion.div>
));

const ReportFound: React.FC = () => {
  const navigate = useNavigate();
  const [foundItems, setFoundItems] = useState<FoundItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const searchRef = useRef<HTMLDivElement>(null);
  const formState = useFoundItemForm(navigate);

  useEffect(() => {
    const fetchFoundItems = async () => {
      try {
        setLoading(true);
        const response = await getFoundItems();
        setFoundItems(response.items);
      } catch (err) {
        formState.setError(
          err instanceof Error ? err.message : "Failed to fetch found items"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchFoundItems();
  }, []);

  const filteredItems = useMemo(() => {
    return foundItems.filter(
      (item) =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.category.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [foundItems, searchTerm]);

  const handleSearchChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setSearchTerm(e.target.value);
    },
    []
  );

  if (loading) {
    return (
      <div className="min-h-screen pt-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        {/* Animated background with gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#030502] via-[#03672A] to-[#046A29] opacity-90 z-0"></div>

        {/* Animated background pattern */}
        <div className="absolute inset-0 z-0 opacity-10">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
              animation: "pulse 15s infinite linear",
            }}
          ></div>
        </div>

        {/* Floating particles */}
        <div className="absolute inset-0 z-0 overflow-hidden">
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 rounded-full bg-white/20"
              initial={{
                x: Math.random() * window.innerWidth,
                y: Math.random() * window.innerHeight,
                scale: Math.random() * 0.5 + 0.5,
              }}
              animate={{
                y: [null, Math.random() * -100],
                opacity: [0.2, 0.8, 0.2],
              }}
              transition={{
                duration: Math.random() * 10 + 10,
                repeat: Infinity,
                ease: "linear",
              }}
            />
          ))}
        </div>

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="flex items-center justify-center h-[60vh]">
            <motion.div
              animate={{
                scale: [1, 1.2, 1],
                rotate: [0, 360],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="w-16 h-16 border-4 border-[#03672A] border-t-transparent rounded-full"
            />
          </div>
        </div>
      </div>
    );
  }

  if (formState.error) {
    return (
      <div className="min-h-screen pt-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-[#030502] to-[#03672A]/20">
        <div className="max-w-7xl mx-auto">
          <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-6 text-red-500">
            <h2 className="text-xl font-nasalization mb-2">Error</h2>
            <p className="font-montserrat">{formState.error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Animated background with gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#030502] via-[#03672A] to-[#046A29] opacity-90 z-0"></div>

      {/* Animated background pattern */}
      <div className="absolute inset-0 z-0 opacity-10">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            animation: "pulse 15s infinite linear",
          }}
        ></div>
      </div>

      {/* Floating particles */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 rounded-full bg-white/20"
            initial={{
              x: Math.random() * window.innerWidth,
              y: Math.random() * window.innerHeight,
              scale: Math.random() * 0.5 + 0.5,
            }}
            animate={{
              y: [null, Math.random() * -100],
              opacity: [0.2, 0.8, 0.2],
            }}
            transition={{
              duration: Math.random() * 10 + 10,
              repeat: Infinity,
              ease: "linear",
            }}
          />
        ))}
      </div>

      <div className="max-w-7xl mx-auto mt-10 relative z-10">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 mb-8">
          <h1 className="text-4xl font-nasalization text-white drop-shadow-lg">
            Found Items
          </h1>
          <div className="relative w-full md:w-96" ref={searchRef}>
            <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40" />
            <input
              type="text"
              placeholder="Search found items..."
              value={searchTerm}
              onChange={handleSearchChange}
              className="w-full pl-12 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/40 focus:border-[#03672A] transition-colors duration-300 font-montserrat backdrop-blur-sm"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredItems.map((item) => (
            <FoundItemCard key={item.id} item={item} />
          ))}
        </div>

        {filteredItems.length === 0 && (
          <div className="text-center py-12">
            <p className="text-white/60 font-montserrat text-lg">
              No found items found. Try adjusting your search or report a new
              item.
            </p>
          </div>
        )}

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => formState.setFormStep(1)}
          className="fixed bottom-8 right-8 w-16 h-16 bg-gradient-to-r from-[#03672A] to-[#046A29] hover:from-[#046A29] hover:to-[#03672A] rounded-full flex items-center justify-center text-white shadow-lg transition-all duration-300"
        >
          <FiUpload className="w-8 h-8" />
        </motion.button>

        {formState.formStep > 0 && (
          <ReportForm
            onClose={() => formState.setFormStep(0)}
            formState={formState}
          />
        )}
      </div>
    </div>
  );
};

export default ReportFound;
