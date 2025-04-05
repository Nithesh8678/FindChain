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
  FiImage,
} from "react-icons/fi";
import {
  getFoundItems,
  FoundItem,
  submitFoundItem,
  getAllLostItems,
  LostItem,
} from "../services/itemService";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

// Move form state and logic to a custom hook
const useFoundItemForm = (navigate: ReturnType<typeof useNavigate>) => {
  const [formData, setFormData] = useState({
    name: "",
    category: "",
    description: "",
    location: "",
    image: null as File | null,
    contactInfo: {
      email: "",
      phone: "",
    },
    userId: "",
    createdAt: new Date(),
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      setError("Please sign in to report a found item");
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const itemData = {
        ...formData,
        userId: user.uid,
        createdAt: new Date(),
      };
      await submitFoundItem(user.uid, itemData);
      navigate("/dashboard");
    } catch (err) {
      console.error("Error submitting found item:", err);
      setError(err instanceof Error ? err.message : "Failed to submit item");
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
    isSubmitting,
    error,
    setError,
    loading,
    success,
    setSuccess,
    handleImageChange,
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
    isSubmitting,
    error,
    handleImageChange,
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
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
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
                <select
                  value={formData.category}
                  onChange={(e) =>
                    setFormData({ ...formData, category: e.target.value })
                  }
                  className="w-full px-4 py-2 bg-white/5 border border-white/20 rounded-lg text-white focus:border-[#03672A] transition-colors duration-300"
                  required
                >
                  <option value="">Select a category</option>
                  {categories.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
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
                  placeholder="Describe the item in detail"
                />
              </div>

              {/* Date and Time */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="text-white/80 mb-2 font-montserrat flex items-center">
                    <FiCalendar size={18} className="mr-2" />
                    Date Found
                  </label>
                  <input
                    type="date"
                    value={formData.createdAt.toISOString().split("T")[0]}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        createdAt: new Date(e.target.value),
                      })
                    }
                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:border-[#03672A] transition-colors duration-300 outline-none font-montserrat"
                  />
                </div>
                <div>
                  <label className="text-white/80 mb-2 font-montserrat flex items-center">
                    <FiClock size={18} className="mr-2" />
                    Time Found
                  </label>
                  <input
                    type="time"
                    value={
                      formData.createdAt
                        .toISOString()
                        .split("T")[1]
                        .split(".")[0]
                    }
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        createdAt: new Date(
                          formData.createdAt.toISOString().split("T")[0] +
                            "T" +
                            e.target.value
                        ),
                      })
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
                  value={formData.contactInfo.phone}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      contactInfo: {
                        ...formData.contactInfo,
                        phone: e.target.value,
                      },
                    })
                  }
                  className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:border-[#03672A] transition-colors duration-300 outline-none font-montserrat"
                  placeholder="Enter your phone number"
                />
              </div>

              <div>
                <label className="text-white/80 mb-2 font-montserrat flex items-center">
                  <FiMail size={18} className="mr-2" />
                  Email Address
                </label>
                <input
                  type="email"
                  value={formData.contactInfo.email}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      contactInfo: {
                        ...formData.contactInfo,
                        email: e.target.value,
                      },
                    })
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
            <span>{new Date(item.createdAt).toLocaleDateString()}</span>
          </div>
        </div>
        <div className="mt-3 flex items-center gap-1 text-[#03672A] font-montserrat text-sm">
          <span>Status: {item.status}</span>
        </div>
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

const ReportFound: React.FC = () => {
  const navigate = useNavigate();
  const [showForm, setShowForm] = useState(false);
  const [foundItems, setFoundItems] = useState<FoundItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [relatedItems, setRelatedItems] = useState<FoundItem[]>([]);
  const [isLoadingRelated, setIsLoadingRelated] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const formState = useFoundItemForm(navigate);
  const [allLostItems, setAllLostItems] = useState<LostItem[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

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

  useEffect(() => {
    const fetchLostItems = async () => {
      try {
        const items = await getAllLostItems();
        setAllLostItems(items);
      } catch (err) {
        console.error("Error fetching lost items:", err);
        formState.setError(
          "Failed to load lost items. Please try again later."
        );
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
      // Fetch all found items
      const response = await getFoundItems();

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

  const handleSuggestionClick = (suggestion: string) => {
    setSearchTerm(suggestion);
    setShowSuggestions(false);
  };

  const filteredLostItems = allLostItems.filter((item) => {
    const matchesSearch =
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.location.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory =
      selectedCategory === "all" || item.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  const categories = Array.from(
    new Set(allLostItems.map((item) => item.category))
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

        <div className="max-w-7xl mx-auto relative z-10">
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
      {/* Animated background */}
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

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Report Found Form */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20"
          >
            <h2 className="text-2xl font-nasalization text-white mb-6">
              Report Found Item
            </h2>
            <form onSubmit={formState.handleSubmit} className="space-y-4">
              {/* ... existing form fields ... */}

              <div>
                <label className="block text-white/80 font-montserrat mb-2">
                  Category
                </label>
                <select
                  value={formState.formData.category}
                  onChange={(e) =>
                    formState.setFormData({
                      ...formState.formData,
                      category: e.target.value,
                    })
                  }
                  className="w-full px-4 py-2 bg-white/5 border border-white/20 rounded-lg text-white focus:border-[#03672A] transition-colors duration-300"
                  required
                >
                  <option value="">Select a category</option>
                  {categories.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>

              {/* ... rest of the form fields ... */}
            </form>
          </motion.div>

          {/* Lost Items List */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20"
          >
            <h2 className="text-2xl font-nasalization text-white mb-6">
              Recently Lost Items
            </h2>

            {/* Search and Filter */}
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              <div className="flex-1 relative">
                <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40" />
                <input
                  type="text"
                  placeholder="Search lost items..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-4 py-2 bg-white/5 border border-white/20 rounded-lg text-white placeholder-white/40 focus:border-[#03672A] transition-colors duration-300"
                />
              </div>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-4 py-2 bg-white/5 border border-white/20 rounded-lg text-white focus:border-[#03672A] transition-colors duration-300"
              >
                <option value="all">All Categories</option>
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>

            {/* Lost Items Grid */}
            <div className="grid gap-4 max-h-[600px] overflow-y-auto pr-2">
              {filteredLostItems.map((item) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white/5 rounded-lg p-4 border border-white/10 hover:border-[#03672A]/50 transition-colors duration-300"
                >
                  <div className="flex items-start gap-4">
                    {item.imageUrl ? (
                      <img
                        src={item.imageUrl}
                        alt={item.name}
                        className="w-20 h-20 object-cover rounded-lg"
                      />
                    ) : (
                      <div className="w-20 h-20 bg-gradient-to-br from-[#03672A]/30 to-[#046A29]/30 rounded-lg flex items-center justify-center">
                        <FiImage className="w-8 h-8 text-white/40" />
                      </div>
                    )}
                    <div className="flex-1">
                      <h3 className="text-lg font-nasalization text-white mb-1">
                        {item.name}
                      </h3>
                      <div className="flex items-center gap-2 text-white/60 mb-2">
                        <span className="px-2 py-1 bg-[#03672A]/20 text-[#03672A] rounded-md text-xs font-montserrat">
                          {item.category}
                        </span>
                      </div>
                      <p className="text-white/80 font-montserrat text-sm mb-2 line-clamp-2">
                        {item.description}
                      </p>
                      <div className="flex flex-wrap gap-4 text-white/60 text-sm">
                        <div className="flex items-center gap-1">
                          <FiMapPin className="text-[#03672A]" />
                          <span className="font-montserrat">
                            {item.location}
                          </span>
                        </div>
                        <div className="flex items-center gap-1">
                          <FiCalendar className="text-[#03672A]" />
                          <span className="font-montserrat">
                            {new Date(item.dateLost).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default ReportFound;
