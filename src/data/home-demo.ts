/**
 * DEMO CONTENT for the customer homepage.
 *
 * Every record in this file is sample data (`demo: true`) to be replaced by the
 * stalls, menus, offers and photography the restaurant approves. Photos are
 * Unsplash images used as stand-ins. Stall ids match `STALLS` in `./menu`.
 */

const photo = (id: string, w = 600) =>
  `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}&q=80`

export interface HeroSlide {
  id: string
  eyebrow: string
  title: string
  description: string
  cta: string
  badge: string
  image: string
  stallId: string
  demo: true
}

export const HERO_SLIDES: HeroSlide[] = [
  {
    id: "royal-biryani",
    eyebrow: "TODAY'S SPECIAL",
    title: "Royal Biryani",
    description: "Authentic Flavors, Unforgettable Taste",
    cta: "Order Now",
    badge: "FLAT 30% OFF",
    image: photo("1563379091339-03b21ab4a4f8", 900),
    stallId: "aroma-biryani",
    demo: true,
  },
  {
    id: "dosa-mornings",
    eyebrow: "CHEF'S PICK",
    title: "Crispy Dosa",
    description: "Golden, Hot and Made to Order",
    cta: "Order Now",
    badge: "FLAT ₹50 OFF",
    image: photo("1630383249896-424e482df921", 900),
    stallId: "nani-tiffins",
    demo: true,
  },
  {
    id: "sweet-finish",
    eyebrow: "SWEET FINISH",
    title: "Dessert Delights",
    description: "End Your Meal on a Sweeter Note",
    cta: "Order Now",
    badge: "20% OFF",
    image: photo("1551024601-bec78aea704b", 900),
    stallId: "cool-point",
    demo: true,
  },
]

export interface HomeCategory {
  id: string
  label: string
  image: string
  /** soft pastel ring from the palette */
  bg: string
  /** tags matched against stall cuisines and dish cuisines */
  tags: string[]
}

export const HOME_CATEGORIES: HomeCategory[] = [
  { id: "biryani", label: "Biryani", image: "/dishes/biryani.png", bg: "#FFE7D6", tags: ["biryani"] },
  { id: "south-indian", label: "South Indian", image: "/dishes/south-indian.png", bg: "#EAF6E5", tags: ["south indian"] },
  { id: "chinese", label: "Chinese", image: "/dishes/noodles.png", bg: "#FFF1E5", tags: ["chinese"] },
  { id: "pizza", label: "Pizza", image: "/dishes/pizza.png", bg: "#FFD9C2", tags: ["pizza"] },
  { id: "burgers", label: "Burgers", image: "/dishes/burger.webp", bg: "#EAF6E5", tags: ["burgers"] },
  { id: "desserts", label: "Desserts", image: "/dishes/desserts.png", bg: "#FCE8E7", tags: ["desserts"] },
  { id: "north-indian", label: "North Indian", image: photo("1585937421612-70a008356fbe", 240), bg: "#FCE8E7", tags: ["north indian"] },
]

export interface HomeStall {
  id: string
  name: string
  cuisines: string[]
  rating: number
  prep: string
  /** upper bound of the prep window, minutes, for filtering */
  prepMax: number
  avgForTwo: number
  image: string
  demo: true
}

/** The six stalls of the food court, with demo ratings, times and prices. */
export const HOME_STALLS: HomeStall[] = [
  { id: "aroma-biryani", name: "Aroma Biryani", cuisines: ["Biryani", "Mughlai", "Pulao"], rating: 4.5, prep: "25–35 min", prepMax: 35, avgForTwo: 200, image: photo("1563379091339-03b21ab4a4f8"), demo: true },
  { id: "nani-tiffins", name: "Nani's Tiffins", cuisines: ["South Indian", "Tiffins", "Breakfast"], rating: 4.6, prep: "10–15 min", prepMax: 15, avgForTwo: 180, image: photo("1630383249896-424e482df921"), demo: true },
  { id: "dills-dlite", name: "Dilli's D'Lite", cuisines: ["North Indian", "Chinese", "Curries"], rating: 4.4, prep: "20–30 min", prepMax: 30, avgForTwo: 250, image: photo("1585937421612-70a008356fbe"), demo: true },
  { id: "tea-time", name: "Tea Time", cuisines: ["Tea", "Snacks", "Beverages"], rating: 4.3, prep: "15–25 min", prepMax: 25, avgForTwo: 150, image: photo("1556679343-c7306c1976bc"), demo: true },
  { id: "talks-tonic", name: "Talks & Tonic", cuisines: ["Pizza", "Burgers", "Chaat"], rating: 4.2, prep: "20–30 min", prepMax: 30, avgForTwo: 250, image: photo("1568901346375-23c9450c58cd"), demo: true },
  { id: "cool-point", name: "Dostana Cool Point", cuisines: ["Desserts", "Shakes", "Ice Cream"], rating: 4.7, prep: "5–10 min", prepMax: 10, avgForTwo: 150, image: photo("1488900128323-21503983a07e"), demo: true },
]

export interface HomeDish {
  id: string
  name: string
  stallId: string
  stallName: string
  price: number
  rating: number
  veg: boolean
  cuisines: string[]
  image: string
  demo: true
}

export const HOME_DISHES: HomeDish[] = [
  { id: "demo-chicken-biryani", name: "Chicken Biryani", stallId: "aroma-biryani", stallName: "Aroma Biryani", price: 249, rating: 4.6, veg: false, cuisines: ["Biryani"], image: "/dishes/biryani.png", demo: true },
  { id: "demo-paneer-butter-masala", name: "Paneer Butter Masala", stallId: "dills-dlite", stallName: "Dilli's D'Lite", price: 199, rating: 4.4, veg: true, cuisines: ["North Indian"], image: photo("1631452180519-c014fe946bc7", 400), demo: true },
  { id: "demo-masala-dosa", name: "Masala Dosa", stallId: "nani-tiffins", stallName: "Nani's Tiffins", price: 129, rating: 4.5, veg: true, cuisines: ["South Indian"], image: "/dishes/dosa.png", demo: true },
  { id: "demo-margherita-pizza", name: "Margherita Pizza", stallId: "talks-tonic", stallName: "Talks & Tonic", price: 299, rating: 4.3, veg: true, cuisines: ["Pizza"], image: "/dishes/pizza.png", demo: true },
  { id: "demo-veg-fried-rice", name: "Veg Fried Rice", stallId: "dills-dlite", stallName: "Dilli's D'Lite", price: 159, rating: 4.4, veg: true, cuisines: ["Chinese"], image: "/dishes/noodles.png", demo: true },
  { id: "demo-chicken-burger", name: "Chicken Burger", stallId: "talks-tonic", stallName: "Talks & Tonic", price: 179, rating: 4.5, veg: false, cuisines: ["Burgers"], image: "/dishes/burger.webp", demo: true },
  { id: "demo-butter-naan", name: "Butter Naan", stallId: "dills-dlite", stallName: "Dilli's D'Lite", price: 49, rating: 4.6, veg: true, cuisines: ["North Indian"], image: photo("1626074353765-517a681e40be", 400), demo: true },
  { id: "demo-chocolate-dessert", name: "Chocolate Dessert", stallId: "cool-point", stallName: "Dostana Cool Point", price: 149, rating: 4.7, veg: true, cuisines: ["Desserts"], image: "/dishes/cake.png", demo: true },
]

export const PROMO_HEALTHY_IMAGE = photo("1512621776951-a57141f2eefd", 400)
export const PROMO_DEALS_IMAGE = photo("1621996346565-e3dbc646d9a9", 400)

export interface HomeOffer {
  id: string
  headline: string
  detail: string
  code: string
  categoryId: string
  /** card background and text colours from the app palette */
  bg: string
  fg: string
  image: string
  demo: true
}

export const HOME_OFFERS: HomeOffer[] = [
  { id: "biryani-30", headline: "FLAT 30% OFF", detail: "On Biryani", code: "BIRYANI30", categoryId: "biryani", bg: "#EF493B", fg: "#FFFFFF", image: photo("1563379091339-03b21ab4a4f8", 300), demo: true },
  { id: "pizza-bogo", headline: "BUY 1 GET 1", detail: "On Pizzas", code: "PIZZA2X", categoryId: "pizza", bg: "#F4772B", fg: "#FFFFFF", image: photo("1513104890138-7c749659a591", 300), demo: true },
  { id: "chinese-20", headline: "20% OFF", detail: "On Chinese", code: "CHINA20", categoryId: "chinese", bg: "#E85D16", fg: "#FFFFFF", image: photo("1512058564366-18510be2db19", 300), demo: true },
  { id: "dessert-15", headline: "15% OFF", detail: "On Desserts", code: "SWEET15", categoryId: "desserts", bg: "#FCE8E7", fg: "#EF493B", image: photo("1551024601-bec78aea704b", 300), demo: true },
  { id: "south-50", headline: "FLAT ₹50 OFF", detail: "On South Indian", code: "SOUTH50", categoryId: "south-indian", bg: "#EAF6E5", fg: "#145A25", image: photo("1589301760014-d929f3979dbc", 300), demo: true },
]
