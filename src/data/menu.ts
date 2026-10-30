import type { MenuItem } from "@/types"

export interface StallInfo {
  id: string
  name: string
  subtitle: string
  emoji: string
  gradient: string
  coverImage: string
  rating: number
  prepTime: string
  categories: string[]
  is_popular?: boolean
}

export const STALLS: StallInfo[] = [
  {
    id: "nani-tiffins",
    name: "Nani's Tiffins",
    subtitle: "South Indian comfort, served fresh.",
    emoji: "🫕",
    gradient: "from-orange-600 to-red-700",
    coverImage: "https://images.unsplash.com/photo-1630383249896-424e482df921?w=600&q=80",
    rating: 4.7,
    prepTime: "10–15 min",
    categories: ["Idly", "Wada", "Mysore Bajji", "Puri", "Dosa"],
    is_popular: true,
  },
  {
    id: "tea-time",
    name: "Tea Time",
    subtitle: "Refreshing drinks, shakes and quick bites.",
    emoji: "☕",
    gradient: "from-amber-600 to-yellow-700",
    coverImage: "https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=600&q=80",
    rating: 4.6,
    prepTime: "5–10 min",
    categories: ["Coolers", "Milkshakes", "Flavoured Milk", "Snacks", "Featured Items"],
  },
  {
    id: "juice-corner",
    name: "Juice Corner",
    subtitle: "Freshness in every pour.",
    emoji: "🧃",
    gradient: "from-green-600 to-emerald-700",
    coverImage: "https://images.unsplash.com/photo-1613478223719-2ab802602423?w=600&q=80",
    rating: 4.5,
    prepTime: "5–10 min",
    categories: ["Fresh Juices", "Vegetable Juices", "Smoothie", "Seasonal"],
    is_popular: true,
  },
  {
    id: "talks-tonic",
    name: "Talks & Tonic",
    subtitle: "Street favourites, made to crave.",
    emoji: "🌶️",
    gradient: "from-pink-600 to-rose-700",
    coverImage: "https://images.unsplash.com/photo-1601050690597-df0568f70950?w=600&q=80",
    rating: 4.8,
    prepTime: "10–12 min",
    categories: ["Chat", "Pav Bhaji", "Fresh Fruit"],
  },
  {
    id: "dills-dlite",
    name: "Dilli's D'Lite",
    subtitle: "Delight in Every Bite.",
    emoji: "🍛",
    gradient: "from-red-600 to-orange-700",
    coverImage: "https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=600&q=80",
    rating: 4.4,
    prepTime: "15 min",
    categories: [
      "Dhaba Style Parathas",
      "Chef Special Tandoori Parathas",
      "Omelettes",
      "Poori",
      "Kathi Rolls — Veg",
      "Kathi Rolls — Non-Veg",
      "Starters — Veg",
      "Starters — Non-Veg",
      "Main Course — Veg",
      "Main Course — Non-Veg",
      "Roti / Naan",
      "Rice Bowls",
      "Veg Combo Rice",
      "Non-Veg Combo Rice",
      "Beverages",
    ],
    is_popular: true,
  },
  {
    id: "aroma-biryani",
    name: "Aroma Biryani & Pulao",
    subtitle: "Slow-cooked. Fragrant. Unforgettable.",
    emoji: "🍚",
    gradient: "from-yellow-600 to-amber-700",
    coverImage: "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=600&q=80",
    rating: 4.9,
    prepTime: "15–20 min",
    categories: ["Chicken", "Mutton", "Fish"],
    is_popular: true,
  },
  {
    id: "cool-point",
    name: "Dostana Cool Point",
    subtitle: "End your meal on a sweeter note.",
    emoji: "🍦",
    gradient: "from-blue-600 to-cyan-700",
    coverImage: "https://images.unsplash.com/photo-1488900128323-21503983a07e?w=600&q=80",
    rating: 4.7,
    prepTime: "5 min",
    categories: ["Ice Cream", "Stone Ice Cream", "Special Milk Shakes", "Thick Shakes"],
  },
]

export const GLOBAL_DISCOVERY_CATEGORIES = [
  { id: "all", label: "All Items", emoji: "🍽️" },
  { id: "breakfast", label: "Breakfast", emoji: "🫕" },
  { id: "south-indian", label: "South Indian", emoji: "🥞" },
  { id: "biryani", label: "Biryani & Pulao", emoji: "🍚" },
  { id: "north-indian", label: "North Indian", emoji: "🍛" },
  { id: "chats", label: "Chats & Pav Bhaji", emoji: "🌶️" },
  { id: "juices", label: "Fresh Juices", emoji: "🧃" },
  { id: "shakes", label: "Shakes & Coolers", emoji: "🥤" },
  { id: "desserts", label: "Desserts & Ice Cream", emoji: "🍦" },
  { id: "snack", label: "Quick Snacks", emoji: "☕" },
]

export const ALL_MENU_ITEMS: MenuItem[] = [
  /* ─────────────────────────────────────────────────────────────
     STALL 1: NANI'S TIFFINS
  ───────────────────────────────────────────────────────────── */
  // Category: Idly
  { id: "nt-idly-1", stall_id: "nani-tiffins", category_name: "Idly", name: "Idly / Sambar Idly", price: 60, is_veg: true, is_available: true, is_bestseller: true, image: "https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=400&q=80" },
  { id: "nt-idly-2", stall_id: "nani-tiffins", category_name: "Idly", name: "Single Idly (2 pieces)", price: 30, is_veg: true, is_available: true },
  { id: "nt-idly-3", stall_id: "nani-tiffins", category_name: "Idly", name: "Sambar Idly (single)", price: 30, is_veg: true, is_available: true },
  { id: "nt-idly-4", stall_id: "nani-tiffins", category_name: "Idly", name: "Ghee Karam Idly", price: 90, is_veg: true, is_available: true, is_popular: true },
  { id: "nt-idly-5", stall_id: "nani-tiffins", category_name: "Idly", name: "Ghee Sambar Idly", price: 90, is_veg: true, is_available: true },
  { id: "nt-idly-6", stall_id: "nani-tiffins", category_name: "Idly", name: "Butter Idly", price: 80, is_veg: true, is_available: true },
  { id: "nt-idly-7", stall_id: "nani-tiffins", category_name: "Idly", name: "Cream Idly", price: 100, is_veg: true, is_available: true },
  { id: "nt-idly-8", stall_id: "nani-tiffins", category_name: "Idly", name: "Tawa Idly (Cheese Cream)", price: 140, is_veg: true, is_available: true },
  { id: "nt-idly-9", stall_id: "nani-tiffins", category_name: "Idly", name: "Tawa Idly (Paneer Cream)", price: 140, is_veg: true, is_available: true },

  // Category: Wada
  { id: "nt-wada-1", stall_id: "nani-tiffins", category_name: "Wada", name: "Wada / Wada Sambar", price: 60, is_veg: true, is_available: true, is_bestseller: true },
  { id: "nt-wada-2", stall_id: "nani-tiffins", category_name: "Wada", name: "Single Wada (2 pieces)", price: 30, is_veg: true, is_available: true },
  { id: "nt-wada-3", stall_id: "nani-tiffins", category_name: "Wada", name: "Single Wada Sambar (2 pieces)", price: 30, is_veg: true, is_available: true },
  { id: "nt-wada-4", stall_id: "nani-tiffins", category_name: "Wada", name: "Tawa Wada (Cheese Cream)", price: 140, is_veg: true, is_available: true },
  { id: "nt-wada-5", stall_id: "nani-tiffins", category_name: "Wada", name: "Tawa Wada (Paneer Cream)", price: 140, is_veg: true, is_available: true },

  // Category: Mysore Bajji
  { id: "nt-mb-1", stall_id: "nani-tiffins", category_name: "Mysore Bajji", name: "Mysore Bajji", price: 60, is_veg: true, is_available: true },
  { id: "nt-mb-2", stall_id: "nani-tiffins", category_name: "Mysore Bajji", name: "Single Mysore Bajji (2 pieces)", price: 30, is_veg: true, is_available: true },
  { id: "nt-mb-3", stall_id: "nani-tiffins", category_name: "Mysore Bajji", name: "Tawa Mysore Bajji (Paneer Cream)", price: 140, is_veg: true, is_available: true },
  { id: "nt-mb-4", stall_id: "nani-tiffins", category_name: "Mysore Bajji", name: "Tawa Mysore Bajji (Cheese Cream)", price: 140, is_veg: true, is_available: true },

  // Category: Puri
  { id: "nt-puri-1", stall_id: "nani-tiffins", category_name: "Puri", name: "Puri", price: 70, is_veg: true, is_available: true },

  // Category: Dosa (with subcategories)
  // Regular Dosa's
  { id: "nt-dosa-1", stall_id: "nani-tiffins", category_name: "Dosa", subcategory: "Regular Dosa's", name: "Plain Dosa", price: 50, is_veg: true, is_available: true },
  { id: "nt-dosa-2", stall_id: "nani-tiffins", category_name: "Dosa", subcategory: "Regular Dosa's", name: "Onion Dosa", price: 60, is_veg: true, is_available: true },
  { id: "nt-dosa-3", stall_id: "nani-tiffins", category_name: "Dosa", subcategory: "Regular Dosa's", name: "Masala Dosa", price: 60, is_veg: true, is_available: true, is_bestseller: true, image: "https://images.unsplash.com/photo-1630383249896-424e482df921?w=400&q=80" },
  { id: "nt-dosa-4", stall_id: "nani-tiffins", category_name: "Dosa", subcategory: "Regular Dosa's", name: "Ghee Karam Dosa", price: 100, is_veg: true, is_available: true, is_popular: true },

  // Butter Dosa's
  { id: "nt-dosa-5", stall_id: "nani-tiffins", category_name: "Dosa", subcategory: "Butter Dosa's", name: "Butter Masala Dosa", price: 90, is_veg: true, is_available: true },
  { id: "nt-dosa-6", stall_id: "nani-tiffins", category_name: "Dosa", subcategory: "Butter Dosa's", name: "Butter Paneer Dosa", price: 120, is_veg: true, is_available: true },
  { id: "nt-dosa-7", stall_id: "nani-tiffins", category_name: "Dosa", subcategory: "Butter Dosa's", name: "Butter Cream Dosa", price: 120, is_veg: true, is_available: true },
  { id: "nt-dosa-8", stall_id: "nani-tiffins", category_name: "Dosa", subcategory: "Butter Dosa's", name: "Butter Cheese Dosa", price: 120, is_veg: true, is_available: true },
  { id: "nt-dosa-9", stall_id: "nani-tiffins", category_name: "Dosa", subcategory: "Butter Dosa's", name: "Butter Cheese Cream Dosa", price: 140, is_veg: true, is_available: true },
  { id: "nt-dosa-10", stall_id: "nani-tiffins", category_name: "Dosa", subcategory: "Butter Dosa's", name: "Butter Double Cheese Cream Dosa", price: 140, is_veg: true, is_available: true },
  { id: "nt-dosa-11", stall_id: "nani-tiffins", category_name: "Dosa", subcategory: "Butter Dosa's", name: "Butter Double Cheese Dosa", price: 140, is_veg: true, is_available: true },
  { id: "nt-dosa-12", stall_id: "nani-tiffins", category_name: "Dosa", subcategory: "Butter Dosa's", name: "Pizza Dosa", price: 160, is_veg: true, is_available: true, is_popular: true },
  { id: "nt-dosa-13", stall_id: "nani-tiffins", category_name: "Dosa", subcategory: "Butter Dosa's", name: "Butter Double Cheese Cream Dosa (Special)", price: 160, is_veg: true, is_available: true },

  // Ghee / Butter Garlic Dosa's
  { id: "nt-dosa-14", stall_id: "nani-tiffins", category_name: "Dosa", subcategory: "Ghee / Butter Garlic Dosa's", name: "Ghee / Butter Garlic Dosa", price: 100, is_veg: true, is_available: true },
  { id: "nt-dosa-15", stall_id: "nani-tiffins", category_name: "Dosa", subcategory: "Ghee / Butter Garlic Dosa's", name: "Ghee / Butter Garlic Paneer Dosa", price: 120, is_veg: true, is_available: true },
  { id: "nt-dosa-16", stall_id: "nani-tiffins", category_name: "Dosa", subcategory: "Ghee / Butter Garlic Dosa's", name: "Ghee / Butter Garlic Cheese Dosa", price: 120, is_veg: true, is_available: true },
  { id: "nt-dosa-17", stall_id: "nani-tiffins", category_name: "Dosa", subcategory: "Ghee / Butter Garlic Dosa's", name: "Ghee / Butter Garlic Cream Dosa", price: 120, is_veg: true, is_available: true },
  { id: "nt-dosa-18", stall_id: "nani-tiffins", category_name: "Dosa", subcategory: "Ghee / Butter Garlic Dosa's", name: "Ghee / Butter Garlic Cheese Cream Dosa", price: 140, is_veg: true, is_available: true },
  { id: "nt-dosa-19", stall_id: "nani-tiffins", category_name: "Dosa", subcategory: "Ghee / Butter Garlic Dosa's", name: "Ghee / Butter Garlic Panner Cream Dosa", price: 140, is_veg: true, is_available: true },
  { id: "nt-dosa-20", stall_id: "nani-tiffins", category_name: "Dosa", subcategory: "Ghee / Butter Garlic Dosa's", name: "Ghee / Butter Garlic Pizza Dosa", price: 160, is_veg: true, is_available: true },

  // Schezwan & Paneer Dosa's
  { id: "nt-dosa-21", stall_id: "nani-tiffins", category_name: "Dosa", subcategory: "Schezwan & Paneer Dosa's", name: "Schezwan Butter Dosa", price: 100, is_veg: true, is_available: true },
  { id: "nt-dosa-22", stall_id: "nani-tiffins", category_name: "Dosa", subcategory: "Schezwan & Paneer Dosa's", name: "Schezwan Panner Dosa", price: 120, is_veg: true, is_available: true },
  { id: "nt-dosa-23", stall_id: "nani-tiffins", category_name: "Dosa", subcategory: "Schezwan & Paneer Dosa's", name: "Schezwan Cream Dosa", price: 120, is_veg: true, is_available: true },
  { id: "nt-dosa-24", stall_id: "nani-tiffins", category_name: "Dosa", subcategory: "Schezwan & Paneer Dosa's", name: "Schezwan Cheese Dosa", price: 120, is_veg: true, is_available: true },
  { id: "nt-dosa-25", stall_id: "nani-tiffins", category_name: "Dosa", subcategory: "Schezwan & Paneer Dosa's", name: "Schezwan Cheese Cream Dosa", price: 140, is_veg: true, is_available: true },
  { id: "nt-dosa-26", stall_id: "nani-tiffins", category_name: "Dosa", subcategory: "Schezwan & Paneer Dosa's", name: "Schezwan Panner Cheese Cream Dosa", price: 140, is_veg: true, is_available: true },

  /* ─────────────────────────────────────────────────────────────
     STALL 2: TEA TIME
  ───────────────────────────────────────────────────────────── */
  // Coolers
  { id: "tt-c-1", stall_id: "tea-time", category_name: "Coolers", name: "Lime Mint Cooler", price: 50, is_veg: true, is_available: true },
  { id: "tt-c-2", stall_id: "tea-time", category_name: "Coolers", name: "Butter Milk", price: 40, is_veg: true, is_available: true },
  { id: "tt-c-3", stall_id: "tea-time", category_name: "Coolers", name: "Ginger Lemon Ice Tea", price: 50, is_veg: true, is_available: true },
  { id: "tt-c-4", stall_id: "tea-time", category_name: "Coolers", name: "Boost Lassi", price: 60, is_veg: true, is_available: true },
  { id: "tt-c-5", stall_id: "tea-time", category_name: "Coolers", name: "Horlicks Lassi", price: 60, is_veg: true, is_available: true },
  { id: "tt-c-6", stall_id: "tea-time", category_name: "Coolers", name: "Fizzy Mojito", price: 70, is_veg: true, is_available: true },
  { id: "tt-c-7", stall_id: "tea-time", category_name: "Coolers", name: "Blue Mojito", price: 70, is_veg: true, is_available: true },

  // Milkshakes
  { id: "tt-m-1", stall_id: "tea-time", category_name: "Milkshakes", name: "Chocolate Shake", price: 99, is_veg: true, is_available: true, is_bestseller: true, image: "https://images.unsplash.com/photo-1572490122747-3968b75cc699?w=400&q=80" },
  { id: "tt-m-2", stall_id: "tea-time", category_name: "Milkshakes", name: "Strawberry Shake", price: 90, is_veg: true, is_available: true },
  { id: "tt-m-3", stall_id: "tea-time", category_name: "Milkshakes", name: "Vanilla Shake", price: 90, is_veg: true, is_available: true },
  { id: "tt-m-4", stall_id: "tea-time", category_name: "Milkshakes", name: "Oreo Milkshake", price: 90, is_veg: true, is_available: true, is_popular: true },
  { id: "tt-m-5", stall_id: "tea-time", category_name: "Milkshakes", name: "Mango Milkshake", price: 99, is_veg: true, is_available: true },

  // Flavoured Milk
  { id: "tt-f-1", stall_id: "tea-time", category_name: "Flavoured Milk", name: "Rose Milk", price: 60, is_veg: true, is_available: true },
  { id: "tt-f-2", stall_id: "tea-time", category_name: "Flavoured Milk", name: "Rose Milk with Ice Cream", price: 90, is_veg: true, is_available: true },
  { id: "tt-f-3", stall_id: "tea-time", category_name: "Flavoured Milk", name: "Chilled Badam Milk", price: 60, is_veg: true, is_available: true },

  // Snacks
  { id: "tt-s-1", stall_id: "tea-time", category_name: "Snacks", name: "Osmania Biscuit", price: 7, is_veg: true, is_available: true },
  { id: "tt-s-2", stall_id: "tea-time", category_name: "Snacks", name: "Alu Samosa", price: 20, is_veg: true, is_available: true },
  { id: "tt-s-3", stall_id: "tea-time", category_name: "Snacks", name: "Onion Samosa (3 pcs)", price: 20, is_veg: true, is_available: true },
  { id: "tt-s-4", stall_id: "tea-time", category_name: "Snacks", name: "Fine Biscuit", price: 20, is_veg: true, is_available: true },
  { id: "tt-s-5", stall_id: "tea-time", category_name: "Snacks", name: "Chicken Puff", price: 30, is_veg: false, is_available: true },
  { id: "tt-s-6", stall_id: "tea-time", category_name: "Snacks", name: "Egg Puff", price: 20, is_veg: false, is_available: true },
  { id: "tt-s-7", stall_id: "tea-time", category_name: "Snacks", name: "Curry Puff", price: 20, is_veg: true, is_available: true },

  // Featured Items
  { id: "tt-feat-1", stall_id: "tea-time", category_name: "Featured Items", name: "Cold Coffee", price: 75, is_veg: true, is_available: true, is_bestseller: true, image: "https://images.unsplash.com/photo-1517701604599-bb29b565090c?w=400&q=80" },
  { id: "tt-feat-2", stall_id: "tea-time", category_name: "Featured Items", name: "Matka Lassi", price: 55, is_veg: true, is_available: true, is_popular: true },

  /* ─────────────────────────────────────────────────────────────
     STALL 3: JUICE CORNER
  ───────────────────────────────────────────────────────────── */
  // Fresh Juices
  { id: "jc-fj-1", stall_id: "juice-corner", category_name: "Fresh Juices", name: "Watermelon", price: 65, is_veg: true, is_available: true, image: "https://images.unsplash.com/photo-1589733955941-5eeaf752f6dd?w=400&q=80" },
  { id: "jc-fj-2", stall_id: "juice-corner", category_name: "Fresh Juices", name: "Banana", price: 65, is_veg: true, is_available: true },
  { id: "jc-fj-3", stall_id: "juice-corner", category_name: "Fresh Juices", name: "Mosambi", price: 85, is_veg: true, is_available: true },
  { id: "jc-fj-4", stall_id: "juice-corner", category_name: "Fresh Juices", name: "Pineapple", price: 85, is_veg: true, is_available: true },
  { id: "jc-fj-5", stall_id: "juice-corner", category_name: "Fresh Juices", name: "Grape", price: 85, is_veg: true, is_available: true },
  { id: "jc-fj-6", stall_id: "juice-corner", category_name: "Fresh Juices", name: "Papaya", price: 85, is_veg: true, is_available: true },
  { id: "jc-fj-7", stall_id: "juice-corner", category_name: "Fresh Juices", name: "Guava", price: 85, is_veg: true, is_available: true },
  { id: "jc-fj-8", stall_id: "juice-corner", category_name: "Fresh Juices", name: "Sapota", price: 85, is_veg: true, is_available: true },
  { id: "jc-fj-9", stall_id: "juice-corner", category_name: "Fresh Juices", name: "Muskmelon", price: 85, is_veg: true, is_available: true },
  { id: "jc-fj-10", stall_id: "juice-corner", category_name: "Fresh Juices", name: "Kiwi", price: 85, is_veg: true, is_available: true },
  { id: "jc-fj-11", stall_id: "juice-corner", category_name: "Fresh Juices", name: "Orange", price: 95, is_veg: true, is_available: true, is_bestseller: true },
  { id: "jc-fj-12", stall_id: "juice-corner", category_name: "Fresh Juices", name: "Apple", price: 95, is_veg: true, is_available: true },
  { id: "jc-fj-13", stall_id: "juice-corner", category_name: "Fresh Juices", name: "Cocktail Juice", price: 95, is_veg: true, is_available: true, is_popular: true },
  { id: "jc-fj-14", stall_id: "juice-corner", category_name: "Fresh Juices", name: "Anar", price: 105, is_veg: true, is_available: true },
  { id: "jc-fj-15", stall_id: "juice-corner", category_name: "Fresh Juices", name: "Dragon Fruit", price: 105, is_veg: true, is_available: true },
  { id: "jc-fj-16", stall_id: "juice-corner", category_name: "Fresh Juices", name: "Avocado", price: 155, is_veg: true, is_available: true },

  // Vegetable Juices
  { id: "jc-vj-1", stall_id: "juice-corner", category_name: "Vegetable Juices", name: "Lemon", price: 35, is_veg: true, is_available: true },
  { id: "jc-vj-2", stall_id: "juice-corner", category_name: "Vegetable Juices", name: "Carrot", price: 75, is_veg: true, is_available: true },
  { id: "jc-vj-3", stall_id: "juice-corner", category_name: "Vegetable Juices", name: "Beetroot", price: 75, is_veg: true, is_available: true },
  { id: "jc-vj-4", stall_id: "juice-corner", category_name: "Vegetable Juices", name: "Carrot + Beetroot", price: 85, is_veg: true, is_available: true },
  { id: "jc-vj-5", stall_id: "juice-corner", category_name: "Vegetable Juices", name: "ABC Juice", price: 125, is_veg: true, is_available: true, is_popular: true },

  // Smoothie
  { id: "jc-sm-1", stall_id: "juice-corner", category_name: "Smoothie", name: "Banana Smoothie", price: 85, is_veg: true, is_available: true },
  { id: "jc-sm-2", stall_id: "juice-corner", category_name: "Smoothie", name: "Sapota Smoothie", price: 125, is_veg: true, is_available: true },
  { id: "jc-sm-3", stall_id: "juice-corner", category_name: "Smoothie", name: "Anjeer Smoothie", price: 125, is_veg: true, is_available: true },
  { id: "jc-sm-4", stall_id: "juice-corner", category_name: "Smoothie", name: "Grape Smoothie", price: 125, is_veg: true, is_available: true },
  { id: "jc-sm-5", stall_id: "juice-corner", category_name: "Smoothie", name: "Muskmelon Smoothie", price: 125, is_veg: true, is_available: true },
  { id: "jc-sm-6", stall_id: "juice-corner", category_name: "Smoothie", name: "Apple Smoothie", price: 125, is_veg: true, is_available: true },
  { id: "jc-sm-7", stall_id: "juice-corner", category_name: "Smoothie", name: "Strawberry Smoothie", price: 145, is_veg: true, is_available: true, is_bestseller: true },
  { id: "jc-sm-8", stall_id: "juice-corner", category_name: "Smoothie", name: "Avocado Smoothie", price: 175, is_veg: true, is_available: true },

  // Seasonal
  { id: "jc-sea-1", stall_id: "juice-corner", category_name: "Seasonal", name: "Sugarcane", price: 50, is_veg: true, is_available: true },
  { id: "jc-sea-2", stall_id: "juice-corner", category_name: "Seasonal", name: "Buttermilk", price: 50, is_veg: true, is_available: true },
  { id: "jc-sea-3", stall_id: "juice-corner", category_name: "Seasonal", name: "Mango Juice", price: 90, is_veg: true, is_available: true, is_popular: true },
  { id: "jc-sea-4", stall_id: "juice-corner", category_name: "Seasonal", name: "Custard Apple Juice", price: 100, is_veg: true, is_available: true },
  { id: "jc-sea-5", stall_id: "juice-corner", category_name: "Seasonal", name: "Strawberry Juice", price: 100, is_veg: true, is_available: true },
  { id: "jc-sea-6", stall_id: "juice-corner", category_name: "Seasonal", name: "Lassi", price: 70, is_veg: true, is_available: true },
  { id: "jc-sea-7", stall_id: "juice-corner", category_name: "Seasonal", name: "Mango Lassi", price: 90, is_veg: true, is_available: true, is_bestseller: true },
  { id: "jc-sea-8", stall_id: "juice-corner", category_name: "Seasonal", name: "Lassi (Dry Fruit)", price: 110, is_veg: true, is_available: true },

  /* ─────────────────────────────────────────────────────────────
     STALL 4: TALKS & TONIC
  ───────────────────────────────────────────────────────────── */
  // Chat
  { id: "tnt-chat-1", stall_id: "talks-tonic", category_name: "Chat", name: "Samosa Chat", price: 55, is_veg: true, is_available: true },
  { id: "tnt-chat-2", stall_id: "talks-tonic", category_name: "Chat", name: "Kachori Chat", price: 55, is_veg: true, is_available: true },
  { id: "tnt-chat-3", stall_id: "talks-tonic", category_name: "Chat", name: "Papdi Chat", price: 55, is_veg: true, is_available: true },
  { id: "tnt-chat-4", stall_id: "talks-tonic", category_name: "Chat", name: "Aloo Chat", price: 55, is_veg: true, is_available: true },
  { id: "tnt-chat-5", stall_id: "talks-tonic", category_name: "Chat", name: "Pani Puri", price: 35, is_veg: true, is_available: true, is_bestseller: true, image: "https://images.unsplash.com/photo-1601050690597-df0568f70950?w=400&q=80" },
  { id: "tnt-chat-6", stall_id: "talks-tonic", category_name: "Chat", name: "Dhai Puri", price: 55, is_veg: true, is_available: true },
  { id: "tnt-chat-7", stall_id: "talks-tonic", category_name: "Chat", name: "Dhai Samosa", price: 55, is_veg: true, is_available: true },
  { id: "tnt-chat-8", stall_id: "talks-tonic", category_name: "Chat", name: "Dhai Kachori", price: 55, is_veg: true, is_available: true },
  { id: "tnt-chat-9", stall_id: "talks-tonic", category_name: "Chat", name: "Dhai Papdi", price: 55, is_veg: true, is_available: true },
  { id: "tnt-chat-10", stall_id: "talks-tonic", category_name: "Chat", name: "Bhel Puri", price: 55, is_veg: true, is_available: true },
  { id: "tnt-chat-11", stall_id: "talks-tonic", category_name: "Chat", name: "Aloo Toast", price: 55, is_veg: true, is_available: true },

  // Pav Bhaji
  { id: "tnt-pb-1", stall_id: "talks-tonic", category_name: "Pav Bhaji", name: "Vada Pav", price: 65, is_veg: true, is_available: true, is_bestseller: true },
  { id: "tnt-pb-2", stall_id: "talks-tonic", category_name: "Pav Bhaji", name: "Pav Bhaji", price: 85, is_veg: true, is_available: true, is_bestseller: true, image: "https://images.unsplash.com/photo-1606755962773-d324e0a13086?w=400&q=80" },
  { id: "tnt-pb-3", stall_id: "talks-tonic", category_name: "Pav Bhaji", name: "Masala Pav Bhaji", price: 105, is_veg: true, is_available: true },
  { id: "tnt-pb-4", stall_id: "talks-tonic", category_name: "Pav Bhaji", name: "Cheese Pav Bhaji", price: 105, is_veg: true, is_available: true },
  { id: "tnt-pb-5", stall_id: "talks-tonic", category_name: "Pav Bhaji", name: "Paneer Pav Bhaji", price: 105, is_veg: true, is_available: true },
  { id: "tnt-pb-6", stall_id: "talks-tonic", category_name: "Pav Bhaji", name: "Special Masala Pav Bhaji", price: 120, is_veg: true, is_available: true, is_popular: true },
  { id: "tnt-pb-7", stall_id: "talks-tonic", category_name: "Pav Bhaji", name: "Extra Cheese / Butter", price: 20, is_veg: true, is_available: true },

  // Fresh Fruit
  { id: "tnt-ff-1", stall_id: "talks-tonic", category_name: "Fresh Fruit", name: "Fruit Bowl", price: 75, subtitle: "Freshly cut seasonal fruit.", is_veg: true, is_available: true },
  { id: "tnt-ff-2", stall_id: "talks-tonic", category_name: "Fresh Fruit", name: "Fruit Salad (Custard)", price: 95, subtitle: "Fresh fruit salad served with sweet, creamy custard.", is_veg: true, is_available: true },
  { id: "tnt-ff-3", stall_id: "talks-tonic", category_name: "Fresh Fruit", name: "Fruit Salad (Custard & Dry Fruits)", price: 135, subtitle: "Fresh fruit bowl topped with smooth custard and dry fruits.", is_veg: true, is_available: true },
  { id: "tnt-ff-4", stall_id: "talks-tonic", category_name: "Fresh Fruit", name: "Fruit Salad (Custard & Ice Cream)", price: 135, subtitle: "Fresh fruit bowl topped with smooth custard and ice cream.", is_veg: true, is_available: true },
  { id: "tnt-ff-5", stall_id: "talks-tonic", category_name: "Fresh Fruit", name: "Fruit Salad (Deluxe Combo)", price: 165, subtitle: "Fruit salad mixed with custard, dry fruit and creamy ice cream.", is_veg: true, is_available: true, is_bestseller: true },

  /* ─────────────────────────────────────────────────────────────
     STALL 5: DILLI'S D'LITE
  ───────────────────────────────────────────────────────────── */
  // Dhaba Style Parathas
  { id: "dd-dp-1", stall_id: "dills-dlite", category_name: "Dhaba Style Parathas", name: "Aloo Paratha", price: 110, subtitle: "Served with Curd & Pickles", is_veg: true, is_available: true, is_bestseller: true, image: "https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=400&q=80" },
  { id: "dd-dp-2", stall_id: "dills-dlite", category_name: "Dhaba Style Parathas", name: "Aloo Onion Paratha", price: 120, subtitle: "Served with Curd & Pickles", is_veg: true, is_available: true },
  { id: "dd-dp-3", stall_id: "dills-dlite", category_name: "Dhaba Style Parathas", name: "Gobi Paratha", price: 120, subtitle: "Served with Curd & Pickles", is_veg: true, is_available: true },
  { id: "dd-dp-4", stall_id: "dills-dlite", category_name: "Dhaba Style Parathas", name: "Paneer Paratha", price: 135, subtitle: "Served with Curd & Pickles", is_veg: true, is_available: true, is_popular: true },
  { id: "dd-dp-5", stall_id: "dills-dlite", category_name: "Dhaba Style Parathas", name: "Mix Paratha", price: 150, subtitle: "Served with Curd & Pickles", is_veg: true, is_available: true },
  { id: "dd-dp-6", stall_id: "dills-dlite", category_name: "Dhaba Style Parathas", name: "Shakkar Paratha", price: 60, subtitle: "Served with Curd & Pickles", is_veg: true, is_available: true },

  // Chef Special Tandoori Parathas
  { id: "dd-tp-1", stall_id: "dills-dlite", category_name: "Chef Special Tandoori Parathas", name: "ABC Paratha", price: 180, subtitle: "Served with Curd & Pickles", is_veg: true, is_available: true },
  { id: "dd-tp-2", stall_id: "dills-dlite", category_name: "Chef Special Tandoori Parathas", name: "Hara Bhara Paratha", price: 180, subtitle: "Served with Curd & Pickles", is_veg: true, is_available: true },
  { id: "dd-tp-3", stall_id: "dills-dlite", category_name: "Chef Special Tandoori Parathas", name: "Chilli Milli Paratha", price: 180, subtitle: "Served with Curd & Pickles", is_veg: true, is_available: true },
  { id: "dd-tp-4", stall_id: "dills-dlite", category_name: "Chef Special Tandoori Parathas", name: "Phadi Paratha", price: 180, subtitle: "Served with Curd & Pickles", is_veg: true, is_available: true },
  { id: "dd-tp-5", stall_id: "dills-dlite", category_name: "Chef Special Tandoori Parathas", name: "Peri Peri Paneer Paratha", price: 200, subtitle: "Served with Curd & Pickles", is_veg: true, is_available: true, is_bestseller: true },

  // Omelettes
  { id: "dd-om-1", stall_id: "dills-dlite", category_name: "Omelettes", name: "Masala Omelette with Bread", price: 60, is_veg: false, is_available: true },
  { id: "dd-om-2", stall_id: "dills-dlite", category_name: "Omelettes", name: "Ginger and Garlic Omelette with Bread", price: 80, is_veg: false, is_available: true },
  { id: "dd-om-3", stall_id: "dills-dlite", category_name: "Omelettes", name: "Plain Paratha with Omelette", price: 100, is_veg: false, is_available: true },
  { id: "dd-om-4", stall_id: "dills-dlite", category_name: "Omelettes", name: "Laccha Paratha with Omelette", price: 120, is_veg: false, is_available: true },
  { id: "dd-om-5", stall_id: "dills-dlite", category_name: "Omelettes", name: "Cheese Omelette", price: 140, is_veg: false, is_available: true },
  { id: "dd-om-6", stall_id: "dills-dlite", category_name: "Omelettes", name: "Egg Burji", price: 80, is_veg: false, is_available: true },

  // Poori
  { id: "dd-poori-1", stall_id: "dills-dlite", category_name: "Poori", name: "Aloo Poori", price: 80, is_veg: true, is_available: true },
  { id: "dd-poori-2", stall_id: "dills-dlite", category_name: "Poori", name: "Chole Poori", price: 100, is_veg: true, is_available: true },
  { id: "dd-poori-3", stall_id: "dills-dlite", category_name: "Poori", name: "Chole Bhature", price: 150, is_veg: true, is_available: true, is_bestseller: true },
  { id: "dd-poori-4", stall_id: "dills-dlite", category_name: "Poori", name: "Chicken Poori", price: 150, is_veg: false, is_available: true },
  { id: "dd-poori-5", stall_id: "dills-dlite", category_name: "Poori", name: "Extra Poori", price: 10, is_veg: true, is_available: true },

  // Kathi Rolls — Veg
  { id: "dd-krv-1", stall_id: "dills-dlite", category_name: "Kathi Rolls — Veg", name: "Paneer Roll", price: 160, is_veg: true, is_available: true },
  { id: "dd-krv-2", stall_id: "dills-dlite", category_name: "Kathi Rolls — Veg", name: "Paneer Tikka Roll", price: 160, is_veg: true, is_available: true },
  { id: "dd-krv-3", stall_id: "dills-dlite", category_name: "Kathi Rolls — Veg", name: "Peri Peri Paneer Roll", price: 160, is_veg: true, is_available: true },
  { id: "dd-krv-4", stall_id: "dills-dlite", category_name: "Kathi Rolls — Veg", name: "Masala Soya Chaap Roll", price: 170, is_veg: true, is_available: true },
  { id: "dd-krv-5", stall_id: "dills-dlite", category_name: "Kathi Rolls — Veg", name: "Peri Peri Soya Chaap Roll", price: 180, is_veg: true, is_available: true },

  // Kathi Rolls — Non-Veg
  { id: "dd-krn-1", stall_id: "dills-dlite", category_name: "Kathi Rolls — Non-Veg", name: "Chicken 65 Roll", price: 160, is_veg: false, is_available: true, is_bestseller: true, image: "https://images.unsplash.com/photo-1631515243349-e0cb75fb8d3a?w=400&q=80" },
  { id: "dd-krn-2", stall_id: "dills-dlite", category_name: "Kathi Rolls — Non-Veg", name: "Peri Peri Chicken Roll", price: 170, is_veg: false, is_available: true },
  { id: "dd-krn-3", stall_id: "dills-dlite", category_name: "Kathi Rolls — Non-Veg", name: "Afghani Chicken Roll", price: 180, is_veg: false, is_available: true },
  { id: "dd-krn-4", stall_id: "dills-dlite", category_name: "Kathi Rolls — Non-Veg", name: "Chicken Tikka Roll", price: 180, is_veg: false, is_available: true },
  { id: "dd-krn-5", stall_id: "dills-dlite", category_name: "Kathi Rolls — Non-Veg", name: "Chicken Lasoon Roll", price: 180, is_veg: false, is_available: true },

  // Starters — Veg
  { id: "dd-sv-1", stall_id: "dills-dlite", category_name: "Starters — Veg", name: "Pudina Soya Chaap (6 pcs)", price: 180, is_veg: true, is_available: true },
  { id: "dd-sv-2", stall_id: "dills-dlite", category_name: "Starters — Veg", name: "Malai Soya Chaap (6 pcs)", price: 200, is_veg: true, is_available: true },
  { id: "dd-sv-3", stall_id: "dills-dlite", category_name: "Starters — Veg", name: "Paneer Pakoda (6 pcs)", price: 180, is_veg: true, is_available: true },
  { id: "dd-sv-4", stall_id: "dills-dlite", category_name: "Starters — Veg", name: "Paneer Tikka (6 pcs)", price: 220, is_veg: true, is_available: true, is_bestseller: true },
  { id: "dd-sv-5", stall_id: "dills-dlite", category_name: "Starters — Veg", name: "Corn Cheese Tikka (6 pcs)", price: 220, is_veg: true, is_available: true },

  // Starters — Non-Veg
  { id: "dd-sn-1", stall_id: "dills-dlite", category_name: "Starters — Non-Veg", name: "Phadi Chicken Tikka (6 pcs)", price: 250, is_veg: false, is_available: true },
  { id: "dd-sn-2", stall_id: "dills-dlite", category_name: "Starters — Non-Veg", name: "Rajasthani Lasoon Tikka (6 pcs)", price: 250, is_veg: false, is_available: true },
  { id: "dd-sn-3", stall_id: "dills-dlite", category_name: "Starters — Non-Veg", name: "Peri Peri Chicken Tikka (6 pcs)", price: 260, is_veg: false, is_available: true },
  { id: "dd-sn-4", stall_id: "dills-dlite", category_name: "Starters — Non-Veg", name: "Smoke Chicken Tikka (6 pcs)", price: 280, is_veg: false, is_available: true },
  { id: "dd-sn-5", stall_id: "dills-dlite", category_name: "Starters — Non-Veg", name: "Punjabi Tangdi Kabab (4 pcs)", price: 280, is_veg: false, is_available: true, is_popular: true },
  { id: "dd-sn-6", stall_id: "dills-dlite", category_name: "Starters — Non-Veg", name: "Mix Chicken Platter", price: 400, is_veg: false, is_available: true, is_bestseller: true },

  // Main Course — Veg
  { id: "dd-mcv-1", stall_id: "dills-dlite", category_name: "Main Course — Veg", name: "Paneer Tikka Masala", price: 240, is_veg: true, is_available: true },
  { id: "dd-mcv-2", stall_id: "dills-dlite", category_name: "Main Course — Veg", name: "Kadai Paneer", price: 220, is_veg: true, is_available: true },
  { id: "dd-mcv-3", stall_id: "dills-dlite", category_name: "Main Course — Veg", name: "Paneer Butter Masala", price: 220, is_veg: true, is_available: true, is_bestseller: true },
  { id: "dd-mcv-4", stall_id: "dills-dlite", category_name: "Main Course — Veg", name: "Palak Paneer", price: 200, is_veg: true, is_available: true },
  { id: "dd-mcv-5", stall_id: "dills-dlite", category_name: "Main Course — Veg", name: "Veg Chapata", price: 150, is_veg: true, is_available: true },
  { id: "dd-mcv-6", stall_id: "dills-dlite", category_name: "Main Course — Veg", name: "Dal Makhani", price: 180, is_veg: true, is_available: true, is_popular: true },
  { id: "dd-mcv-7", stall_id: "dills-dlite", category_name: "Main Course — Veg", name: "Rajma", price: 180, is_veg: true, is_available: true },
  { id: "dd-mcv-8", stall_id: "dills-dlite", category_name: "Main Course — Veg", name: "Dal Fry", price: 140, is_veg: true, is_available: true },

  // Main Course — Non-Veg
  { id: "dd-mcn-1", stall_id: "dills-dlite", category_name: "Main Course — Non-Veg", name: "Chicken Home Style Curry", price: 280, is_veg: false, is_available: true },
  { id: "dd-mcn-2", stall_id: "dills-dlite", category_name: "Main Course — Non-Veg", name: "Smoke Butter Chicken", price: 300, is_veg: false, is_available: true, is_bestseller: true },
  { id: "dd-mcn-3", stall_id: "dills-dlite", category_name: "Main Course — Non-Veg", name: "Chicken Handi", price: 300, is_veg: false, is_available: true },
  { id: "dd-mcn-4", stall_id: "dills-dlite", category_name: "Main Course — Non-Veg", name: "Afghani Chicken Masala", price: 300, is_veg: false, is_available: true },
  { id: "dd-mcn-5", stall_id: "dills-dlite", category_name: "Main Course — Non-Veg", name: "Chicken Tikka Masala", price: 320, is_veg: false, is_available: true },
  { id: "dd-mcn-6", stall_id: "dills-dlite", category_name: "Main Course — Non-Veg", name: "Chicken Lababdar", price: 340, is_veg: false, is_available: true },

  // Roti / Naan
  { id: "dd-roti-1", stall_id: "dills-dlite", category_name: "Roti / Naan", name: "Tandoor Roti", price: 30, is_veg: true, is_available: true },
  { id: "dd-roti-2", stall_id: "dills-dlite", category_name: "Roti / Naan", name: "Butter Tandoor Roti", price: 40, is_veg: true, is_available: true },
  { id: "dd-roti-3", stall_id: "dills-dlite", category_name: "Roti / Naan", name: "Plain Naan", price: 35, is_veg: true, is_available: true },
  { id: "dd-roti-4", stall_id: "dills-dlite", category_name: "Roti / Naan", name: "Butter Naan", price: 45, is_veg: true, is_available: true, is_bestseller: true },
  { id: "dd-roti-5", stall_id: "dills-dlite", category_name: "Roti / Naan", name: "Garlic Naan", price: 50, is_veg: true, is_available: true },
  { id: "dd-roti-6", stall_id: "dills-dlite", category_name: "Roti / Naan", name: "Plain Paratha", price: 40, is_veg: true, is_available: true },
  { id: "dd-roti-7", stall_id: "dills-dlite", category_name: "Roti / Naan", name: "Laccha Paratha", price: 50, is_veg: true, is_available: true },
  { id: "dd-roti-8", stall_id: "dills-dlite", category_name: "Roti / Naan", name: "Missi Roti", price: 50, is_veg: true, is_available: true },
  { id: "dd-roti-9", stall_id: "dills-dlite", category_name: "Roti / Naan", name: "Cheese Naan", price: 80, is_veg: true, is_available: true },
  { id: "dd-roti-10", stall_id: "dills-dlite", category_name: "Roti / Naan", name: "Bread Basket", price: 170, subtitle: "Includes 1 Tandoor Roti, 1 Butter Naan, 1 Laccha Paratha, 1 Garlic Naan", is_veg: true, is_available: true, is_popular: true },

  // Rice Bowls
  { id: "dd-rb-1", stall_id: "dills-dlite", category_name: "Rice Bowls", name: "Plain Rice", price: 60, is_veg: true, is_available: true },
  { id: "dd-rb-2", stall_id: "dills-dlite", category_name: "Rice Bowls", name: "Tomato Rice", price: 100, is_veg: true, is_available: true },
  { id: "dd-rb-3", stall_id: "dills-dlite", category_name: "Rice Bowls", name: "Lemon Rice", price: 100, is_veg: true, is_available: true },
  { id: "dd-rb-4", stall_id: "dills-dlite", category_name: "Rice Bowls", name: "Khichdi", price: 100, is_veg: true, is_available: true },
  { id: "dd-rb-5", stall_id: "dills-dlite", category_name: "Rice Bowls", name: "Curd Rice", price: 100, is_veg: true, is_available: true },
  { id: "dd-rb-6", stall_id: "dills-dlite", category_name: "Rice Bowls", name: "Rajma with Rice", price: 150, is_veg: true, is_available: true },
  { id: "dd-rb-7", stall_id: "dills-dlite", category_name: "Rice Bowls", name: "Dal Makhani with Rice", price: 150, is_veg: true, is_available: true },
  { id: "dd-rb-8", stall_id: "dills-dlite", category_name: "Rice Bowls", name: "Jeera Rice with Dal", price: 150, is_veg: true, is_available: true },

  // Veg Combo Rice
  { id: "dd-vcr-1", stall_id: "dills-dlite", category_name: "Veg Combo Rice", name: "Veg Combo Rice", price: 150, subtitle: "Includes Veg Curry, Dal, Rice, 2 Phulka, Achar, Papad", is_veg: true, is_available: true },
  { id: "dd-vcr-2", stall_id: "dills-dlite", category_name: "Veg Combo Rice", name: "Paneer Butter Masala Combo", price: 170, subtitle: "Includes Paneer Butter Masala, Dal, Rice, 2 Phulka, Achar, Papad", is_veg: true, is_available: true, is_bestseller: true },

  // Non-Veg Combo Rice
  { id: "dd-nvcr-1", stall_id: "dills-dlite", category_name: "Non-Veg Combo Rice", name: "Non-Veg Combo Rice", price: 180, subtitle: "Includes Chicken Curry, Dal, Rice, 2 Phulka, Achar, Papad", is_veg: false, is_available: true },
  { id: "dd-nvcr-2", stall_id: "dills-dlite", category_name: "Non-Veg Combo Rice", name: "Butter Chicken Combo", price: 200, subtitle: "Includes Butter Chicken, Butter Naan, Salad", is_veg: false, is_available: true, is_bestseller: true },

  // Beverages
  { id: "dd-bev-1", stall_id: "dills-dlite", category_name: "Beverages", name: "Sweet Lassi", price: 80, is_veg: true, is_available: true },
  { id: "dd-bev-2", stall_id: "dills-dlite", category_name: "Beverages", name: "Salt Lassi", price: 60, is_veg: true, is_available: true },

  /* ─────────────────────────────────────────────────────────────
     STALL 6: AROMA BIRYANI & PULAO (Multi-price Size Selectors)
  ───────────────────────────────────────────────────────────── */
  // Chicken
  {
    id: "ab-chk-1",
    stall_id: "aroma-biryani",
    category_name: "Chicken",
    name: "Hyd Chicken Dum Biryani",
    price: 150,
    badge: "100% HALAL",
    is_bestseller: true,
    is_veg: false,
    is_available: true,
    image: "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=400&q=80",
    variants: [
      { name: "Single", price: 150 },
      { name: "Full", price: 270 },
      { name: "Family", price: 520 },
    ],
  },
  {
    id: "ab-chk-2",
    stall_id: "aroma-biryani",
    category_name: "Chicken",
    name: "Chicken Fry Piece Biryani",
    price: 220,
    badge: "100% HALAL",
    is_popular: true,
    is_veg: false,
    is_available: true,
    variants: [
      { name: "Single", price: 220 },
      { name: "Full", price: 400 },
      { name: "Family", price: 780 },
    ],
  },
  {
    id: "ab-chk-3",
    stall_id: "aroma-biryani",
    category_name: "Chicken",
    name: "Chicken Lollipop Biryani",
    price: 250,
    badge: "100% HALAL",
    is_veg: false,
    is_available: true,
    variants: [
      { name: "Single", price: 250 },
      { name: "Full", price: 470 },
    ],
  },
  {
    id: "ab-chk-4",
    stall_id: "aroma-biryani",
    category_name: "Chicken",
    name: "Chicken Fry Piece Pulao",
    price: 220,
    badge: "100% HALAL",
    is_veg: false,
    is_available: true,
    variants: [
      { name: "Single", price: 220 },
      { name: "Full", price: 400 },
      { name: "Family", price: 780 },
    ],
  },
  {
    id: "ab-chk-5",
    stall_id: "aroma-biryani",
    category_name: "Chicken",
    name: "Gongura Chicken Pulao",
    price: 250,
    badge: "100% HALAL",
    is_veg: false,
    is_available: true,
    variants: [
      { name: "Single", price: 250 },
      { name: "Full", price: 470 },
    ],
  },
  {
    id: "ab-chk-6",
    stall_id: "aroma-biryani",
    category_name: "Chicken",
    name: "Raju Gari Kodi Pulao",
    price: 250,
    badge: "100% HALAL",
    is_bestseller: true,
    is_veg: false,
    is_available: true,
    variants: [
      { name: "Single", price: 250 },
      { name: "Full", price: 470 },
    ],
  },

  // Mutton
  {
    id: "ab-mut-1",
    stall_id: "aroma-biryani",
    category_name: "Mutton",
    name: "Mutton Fry Piece Biryani",
    price: 320,
    badge: "100% HALAL",
    is_bestseller: true,
    is_veg: false,
    is_available: true,
    image: "https://images.unsplash.com/photo-1589302168068-964664d93dc0?w=400&q=80",
    variants: [
      { name: "Single", price: 320 },
      { name: "Full", price: 600 },
    ],
  },
  {
    id: "ab-mut-2",
    stall_id: "aroma-biryani",
    category_name: "Mutton",
    name: "Mutton Fry Piece Pulao",
    price: 320,
    badge: "100% HALAL",
    is_veg: false,
    is_available: true,
    variants: [
      { name: "Single", price: 320 },
      { name: "Full", price: 600 },
    ],
  },
  {
    id: "ab-mut-3",
    stall_id: "aroma-biryani",
    category_name: "Mutton",
    name: "Gongura Mutton Pulao",
    price: 320,
    badge: "100% HALAL",
    is_veg: false,
    is_available: true,
    variants: [
      { name: "Single", price: 320 },
      { name: "Full", price: 600 },
    ],
  },

  // Fish
  {
    id: "ab-fsh-1",
    stall_id: "aroma-biryani",
    category_name: "Fish",
    name: "Boneless Fish Biryani",
    price: 280,
    badge: "100% HALAL",
    is_veg: false,
    is_available: true,
    variants: [
      { name: "Single", price: 280 },
      { name: "Full", price: 480 },
    ],
  },

  /* ─────────────────────────────────────────────────────────────
     STALL 7: DOSTANA COOL POINT
  ───────────────────────────────────────────────────────────── */
  // Ice Cream
  { id: "cp-ic-1", stall_id: "cool-point", category_name: "Ice Cream", name: "Vanilla", price: 60, is_veg: true, is_available: true, image: "https://images.unsplash.com/photo-1488900128323-21503983a07e?w=400&q=80" },
  { id: "cp-ic-2", stall_id: "cool-point", category_name: "Ice Cream", name: "Strawberry", price: 60, is_veg: true, is_available: true },
  { id: "cp-ic-3", stall_id: "cool-point", category_name: "Ice Cream", name: "Chocolate", price: 70, is_veg: true, is_available: true },
  { id: "cp-ic-4", stall_id: "cool-point", category_name: "Ice Cream", name: "Black Current", price: 50, is_veg: true, is_available: true },
  { id: "cp-ic-5", stall_id: "cool-point", category_name: "Ice Cream", name: "Butter Scotch", price: 80, is_veg: true, is_available: true, is_bestseller: true },
  { id: "cp-ic-6", stall_id: "cool-point", category_name: "Ice Cream", name: "Mango", price: 70, is_veg: true, is_available: true },
  { id: "cp-ic-7", stall_id: "cool-point", category_name: "Ice Cream", name: "Belgium Dark Chocolate", price: 60, is_veg: true, is_available: true, is_popular: true },

  // Stone Ice Cream
  { id: "cp-sic-1", stall_id: "cool-point", category_name: "Stone Ice Cream", name: "Willa Wonka", price: 150, is_veg: true, is_available: true, is_bestseller: true },
  { id: "cp-sic-2", stall_id: "cool-point", category_name: "Stone Ice Cream", name: "Oreo Treat Shot", price: 140, is_veg: true, is_available: true },
  { id: "cp-sic-3", stall_id: "cool-point", category_name: "Stone Ice Cream", name: "Ferro Rocher", price: 180, is_veg: true, is_available: true, is_popular: true },
  { id: "cp-sic-4", stall_id: "cool-point", category_name: "Stone Ice Cream", name: "La Ferro", price: 150, is_veg: true, is_available: true },
  { id: "cp-sic-5", stall_id: "cool-point", category_name: "Stone Ice Cream", name: "Crunchy Choco", price: 160, is_veg: true, is_available: true },
  { id: "cp-sic-6", stall_id: "cool-point", category_name: "Stone Ice Cream", name: "Coffee Craze", price: 160, is_veg: true, is_available: true },
  { id: "cp-sic-7", stall_id: "cool-point", category_name: "Stone Ice Cream", name: "Nuts Overloaded", price: 170, is_veg: true, is_available: true },

  // Special Milk Shakes
  { id: "cp-sms-1", stall_id: "cool-point", category_name: "Special Milk Shakes", name: "Mango Shake", price: 100, is_veg: true, is_available: true },
  { id: "cp-sms-2", stall_id: "cool-point", category_name: "Special Milk Shakes", name: "Cream Vanilla", price: 100, is_veg: true, is_available: true },
  { id: "cp-sms-3", stall_id: "cool-point", category_name: "Special Milk Shakes", name: "Rich Chocolate", price: 100, is_veg: true, is_available: true },
  { id: "cp-sms-4", stall_id: "cool-point", category_name: "Special Milk Shakes", name: "Black Current Shake", price: 100, is_veg: true, is_available: true },
  { id: "cp-sms-5", stall_id: "cool-point", category_name: "Special Milk Shakes", name: "Nuty Nuts", price: 100, is_veg: true, is_available: true },
  { id: "cp-sms-6", stall_id: "cool-point", category_name: "Special Milk Shakes", name: "Strawberry Shake", price: 100, is_veg: true, is_available: true },

  // Thick Shakes
  { id: "cp-ts-1", stall_id: "cool-point", category_name: "Thick Shakes", name: "Belgium Dark Chocolate", price: 150, is_veg: true, is_available: true, is_bestseller: true },
  { id: "cp-ts-2", stall_id: "cool-point", category_name: "Thick Shakes", name: "Nutella Brownie", price: 180, is_veg: true, is_available: true, is_popular: true },
  { id: "cp-ts-3", stall_id: "cool-point", category_name: "Thick Shakes", name: "Ferro Delight", price: 160, is_veg: true, is_available: true },
  { id: "cp-ts-4", stall_id: "cool-point", category_name: "Thick Shakes", name: "Creamy Oreo", price: 140, is_veg: true, is_available: true },
  { id: "cp-ts-5", stall_id: "cool-point", category_name: "Thick Shakes", name: "Cold Coffee", price: 150, is_veg: true, is_available: true },
]

/**
 * Cross-Stall Recommendation Helper:
 * Biryani -> Lassi / Cooler
 * Dosa -> Tea Time / Filter Coffee
 * Chat -> Fresh Juice
 * Main Course -> Lassi
 * Ice Cream -> Thick Shake
 */
export function getRecommendationsForItem(item: MenuItem): MenuItem[] {
  if (item.stall_id === "aroma-biryani" || item.category_name?.toLowerCase().includes("biryani")) {
    return ALL_MENU_ITEMS.filter((i) => i.id === "jc-sea-7" || i.id === "tt-feat-2" || i.id === "jc-sea-6")
  }
  if (item.stall_id === "nani-tiffins" || item.category_name === "Dosa") {
    return ALL_MENU_ITEMS.filter((i) => i.id === "tt-feat-1" || i.id === "tt-c-1" || i.id === "tt-c-2")
  }
  if (item.stall_id === "talks-tonic" || item.category_name === "Chat" || item.category_name === "Pav Bhaji") {
    return ALL_MENU_ITEMS.filter((i) => i.id === "jc-fj-1" || i.id === "jc-fj-11" || i.id === "jc-sea-1")
  }
  if (item.stall_id === "dills-dlite") {
    return ALL_MENU_ITEMS.filter((i) => i.id === "dd-bev-1" || i.id === "jc-sea-6" || i.id === "tt-feat-1")
  }
  if (item.stall_id === "cool-point") {
    return ALL_MENU_ITEMS.filter((i) => i.id === "cp-ts-1" || i.id === "cp-ts-2")
  }
  // Default recommendations from top bestsellers
  return ALL_MENU_ITEMS.filter((i) => i.is_bestseller).slice(0, 3)
}
