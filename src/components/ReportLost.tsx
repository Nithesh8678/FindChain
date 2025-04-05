import React, {
  useState,
  useEffect,
  useMemo,
  useCallback,
  useRef,
} from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiUpload,
  FiCalendar,
  FiClock,
  FiMapPin,
  FiPhone,
  FiMail,
  FiCheckCircle,
  FiSearch,
  FiPlus,
  FiX,
  FiTag,
  FiChevronRight,
} from "react-icons/fi";
import { FaEthereum } from "react-icons/fa";
import {
  getLostItems,
  LostItem,
  submitLostItem,
} from "../services/itemService";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

// Move form state and logic to a custom hook
const useLostItemForm = (navigate: ReturnType<typeof useNavigate>) => {
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
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [formStep, setFormStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
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
      setError("You must be logged in to report a lost item");
      return;
    }

    try {
      setIsSubmitting(true);
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

      await submitLostItem(user.uid, itemData);

      // Reset form
      setFormData({
        itemName: "",
        category: "",
        description: "",
        dateLost: "",
        timeLost: "",
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
      console.error("Error submitting lost item:", err);
      setError("Failed to submit item. Please try again.");
    } finally {
      setLoading(false);
      setIsSubmitting(false);
    }
  };

  return {
    formData,
    setFormData,
    selectedImage,
    setSelectedImage,
    formStep,
    setFormStep,
    isSubmitting,
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
  formState: ReturnType<typeof useLostItemForm>;
}> = React.memo(({ onClose, formState }) => {
  const {
    formData,
    setFormData,
    selectedImage,
    formStep,
    setFormStep,
    isSubmitting,
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
            Report Lost Item
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
          {error && (
            <p className="text-red-500 text-center font-montserrat">{error}</p>
          )}
        </form>
      </motion.div>
    </motion.div>
  );
});

const LostItemCard = React.memo(({ item }: { item: LostItem }) => (
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
            <span>{new Date(item.dateLost).toLocaleDateString()}</span>
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

// AI-powered search suggestions
const generateSearchSuggestions = (searchTerm: string): string[] => {
  if (!searchTerm || searchTerm.length < 2) return [];

  const term = searchTerm.toLowerCase();

  // Define related terms for common categories
  const relatedTerms: Record<string, string[]> = {
    phone: [
      "mobile",
      "cellphone",
      "smartphone",
      "iphone",
      "android",
      "samsung",
      "huawei",
      "xiaomi",
    ],
    laptop: ["computer", "notebook", "macbook", "dell", "hp", "lenovo", "asus"],
    wallet: ["purse", "cardholder", "billfold", "money clip", "pocketbook"],
    keys: ["keychain", "keyring", "key fob", "house keys", "car keys"],
    watch: [
      "timepiece",
      "wristwatch",
      "smartwatch",
      "apple watch",
      "rolex",
      "casio",
    ],
    glasses: [
      "sunglasses",
      "eyewear",
      "spectacles",
      "reading glasses",
      "contact lenses",
    ],
    bag: [
      "backpack",
      "handbag",
      "tote",
      "shoulder bag",
      "messenger bag",
      "purse",
    ],
    jewelry: ["necklace", "bracelet", "ring", "earrings", "pendant", "chain"],
    documents: [
      "id",
      "passport",
      "driver's license",
      "credit card",
      "debit card",
      "student id",
    ],
    clothing: [
      "shirt",
      "pants",
      "jacket",
      "coat",
      "sweater",
      "dress",
      "shoes",
      "hat",
    ],
  };

  // Check if the search term matches any category
  for (const [category, terms] of Object.entries(relatedTerms)) {
    if (category.includes(term) || terms.some((t) => t.includes(term))) {
      return [category, ...terms.filter((t) => t.includes(term))];
    }
  }

  // If no direct match, try to find partial matches
  const suggestions: string[] = [];
  for (const [category, terms] of Object.entries(relatedTerms)) {
    if (category.includes(term)) {
      suggestions.push(category);
    }
    terms.forEach((t) => {
      if (t.includes(term)) {
        suggestions.push(t);
      }
    });
  }

  return suggestions;
};

const ReportLost: React.FC = () => {
  const navigate = useNavigate();
  const [showForm, setShowForm] = useState(false);
  const [lostItems, setLostItems] = useState<LostItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [relatedItems, setRelatedItems] = useState<LostItem[]>([]);
  const [isLoadingRelated, setIsLoadingRelated] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const formState = useLostItemForm(navigate);

  useEffect(() => {
    const fetchLostItems = async () => {
      try {
        setLoading(true);
        const response = await getLostItems();
        setLostItems(response.items);
      } catch (err) {
        formState.setError(
          err instanceof Error ? err.message : "Failed to fetch lost items"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchLostItems();
  }, []);

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchRef.current &&
        !searchRef.current.contains(event.target as Node)
      ) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Generate suggestions when search term changes
  useEffect(() => {
    if (searchTerm.length >= 2) {
      const newSuggestions = generateSearchSuggestions(searchTerm);
      setSuggestions(newSuggestions);
      setShowSuggestions(true);

      // Fetch related items based on suggestions
      fetchRelatedItems(newSuggestions);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
      setRelatedItems([]);
    }
  }, [searchTerm]);

  // Fetch related items from the database
  const fetchRelatedItems = async (terms: string[]) => {
    if (terms.length === 0) return;

    setIsLoadingRelated(true);
    try {
      // Fetch all lost items
      const response = await getLostItems();

      // Filter items that match any of the suggested terms
      const related = response.items.filter((item) => {
        const itemText =
          `${item.name} ${item.description} ${item.category}`.toLowerCase();
        return terms.some((term) => itemText.includes(term.toLowerCase()));
      });

      setRelatedItems(related);
    } catch (err) {
      console.error("Error fetching related items:", err);
    } finally {
      setIsLoadingRelated(false);
    }
  };

  const filteredItems = useMemo(() => {
    return lostItems.filter(
      (item) =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.category.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [lostItems, searchTerm]);

  const handleSearchChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setSearchTerm(e.target.value);
    },
    []
  );

  const handleSuggestionClick = (suggestion: string) => {
    setSearchTerm(suggestion);
    setShowSuggestions(false);
  };

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
            Lost Items
          </h1>
          <div className="relative w-full md:w-96" ref={searchRef}>
            <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40" />
            <input
              type="text"
              placeholder="Search lost items..."
              value={searchTerm}
              onChange={handleSearchChange}
              onFocus={() => searchTerm.length >= 2 && setShowSuggestions(true)}
              className="w-full pl-12 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/40 focus:border-[#03672A] transition-colors duration-300 font-montserrat backdrop-blur-sm"
            />

            {/* AI-powered search suggestions */}
            <AnimatePresence>
              {showSuggestions &&
                (suggestions.length > 0 || relatedItems.length > 0) && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="absolute z-10 w-full mt-2 bg-[#030502]/95 backdrop-blur-md border border-[#03672A]/30 rounded-xl overflow-hidden shadow-xl"
                  >
                    {suggestions.length > 0 && (
                      <>
                        <div className="p-2 text-white/60 text-sm font-montserrat border-b border-white/10">
                          AI Suggestions
                        </div>
                        <ul className="max-h-60 overflow-y-auto">
                          {suggestions.map((suggestion, index) => (
                            <motion.li
                              key={index}
                              initial={{ opacity: 0, x: -10 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: index * 0.05 }}
                              className="flex items-center px-4 py-3 hover:bg-[#03672A]/20 cursor-pointer transition-colors duration-200"
                              onClick={() => handleSuggestionClick(suggestion)}
                            >
                              <FiSearch className="mr-3 text-[#03672A]" />
                              <span className="font-montserrat text-white/80">
                                {suggestion}
                              </span>
                              <FiChevronRight className="ml-auto text-white/40" />
                            </motion.li>
                          ))}
                        </ul>
                      </>
                    )}

                    {relatedItems.length > 0 && (
                      <>
                        <div className="p-2 text-white/60 text-sm font-montserrat border-b border-white/10">
                          Related Items
                        </div>
                        <ul className="max-h-60 overflow-y-auto">
                          {isLoadingRelated ? (
                            <li className="px-4 py-3 text-white/60 font-montserrat">
                              Loading related items...
                            </li>
                          ) : (
                            relatedItems.map((item, index) => (
                              <motion.li
                                key={item.id}
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: index * 0.05 }}
                                className="flex items-center px-4 py-3 hover:bg-[#03672A]/20 cursor-pointer transition-colors duration-200"
                                onClick={() => {
                                  setSearchTerm(item.name);
                                  setShowSuggestions(false);
                                }}
                              >
                                {item.imageUrl ? (
                                  <img
                                    src={item.imageUrl}
                                    alt={item.name}
                                    className="w-10 h-10 rounded-md object-cover mr-3"
                                  />
                                ) : (
                                  <div className="w-10 h-10 rounded-md bg-white/10 flex items-center justify-center mr-3">
                                    <FiTag className="text-[#03672A]" />
                                  </div>
                                )}
                                <div className="flex-1">
                                  <div className="font-montserrat text-white/80">
                                    {item.name}
                                  </div>
                                  <div className="text-xs text-white/40 font-montserrat">
                                    {item.category}
                                  </div>
                                </div>
                                <FiChevronRight className="text-white/40" />
                              </motion.li>
                            ))
                          )}
                        </ul>
                      </>
                    )}
                  </motion.div>
                )}
            </AnimatePresence>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredItems.map((item) => (
            <LostItemCard key={item.id} item={item} />
          ))}
        </div>

        {filteredItems.length === 0 && (
          <div className="text-center py-12">
            <p className="text-white/60 font-montserrat text-lg">
              No lost items found. Try adjusting your search or report a new
              item.
            </p>
          </div>
        )}

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowForm(true)}
          className="fixed bottom-8 right-8 w-16 h-16 bg-gradient-to-r from-[#03672A] to-[#046A29] hover:from-[#046A29] hover:to-[#03672A] rounded-full flex items-center justify-center text-white shadow-lg transition-all duration-300"
        >
          <FiPlus className="w-8 h-8" />
        </motion.button>

        <AnimatePresence>
          {showForm && (
            <ReportForm
              onClose={() => setShowForm(false)}
              formState={formState}
            />
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default ReportLost;
