/** Dish pictures (labelled artwork in /public/dishes). `term` is what tapping a dish searches the menu for. */
export interface DishImage {
  name: string
  file: string
  term: string
}

export const DISH_IMAGES: DishImage[] = [
  { name: "Biryani", file: "biryani", term: "biryani" },
  { name: "Dosa", file: "dosa", term: "dosa" },
  { name: "Idli", file: "idli", term: "idly" },
  { name: "South Indian", file: "south-indian", term: "south indian" },
  { name: "Pizza", file: "pizza", term: "pizza" },
  { name: "Pasta", file: "pasta", term: "pasta" },
  { name: "Noodles", file: "noodles", term: "noodle" },
  { name: "Shawarma", file: "shawarma", term: "shawarma" },
  { name: "Rolls", file: "rolls", term: "roll" },
  { name: "Salad", file: "salad", term: "salad" },
  { name: "Juice", file: "juice", term: "juice" },
  { name: "Desserts", file: "desserts", term: "dessert" },
  { name: "Cake", file: "cake", term: "cake" },
]
