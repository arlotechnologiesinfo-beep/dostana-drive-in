export interface FoodCourt {
  id: string
  name: string
  tagline: string
  slug: string
  config: Record<string, unknown>
  created_at: string
}

export interface Table {
  id: string
  food_court_id: string
  table_number: number
  qr_code: string
  status: "AVAILABLE" | "OCCUPIED"
  created_at: string
}

export interface Stall {
  id: string
  food_court_id: string
  name: string
  description: string
  image: string
  is_active: boolean
  is_popular: boolean
  created_at: string
}

export interface MenuCategory {
  id: string
  stall_id: string
  name: string
  sort_order: number
  created_at: string
}

export interface MenuItemVariant {
  name: string
  price: number
}

export interface MenuItem {
  id: string
  stall_id: string
  category_id?: string
  category_name?: string
  subcategory?: string
  name: string
  description?: string
  subtitle?: string
  price: number
  variants?: MenuItemVariant[]
  image?: string
  is_available: boolean
  is_veg: boolean
  is_bestseller?: boolean
  is_popular?: boolean
  badge?: string
  prep_time?: string
  created_at?: string
}

export interface CartItem {
  id: string
  stall_id: string
  stall_name: string
  menu_item_id: string
  variant_name?: string
  name: string
  price: number
  quantity: number
  special_instructions?: string
  image: string
}

export interface CartState {
  items: CartItem[]
  tableId: string | null
  addItem: (item: Omit<CartItem, "id">) => void
  removeItem: (cartItemId: string) => void
  updateQuantity: (cartItemId: string, quantity: number) => void
  updateSpecialInstructions: (cartItemId: string, instructions: string) => void
  clearCart: () => void
  setTableId: (tableId: string) => void
  getTotal: () => number
  getItemCount: () => number
  getItemsByStall: () => Record<string, CartItem[]>
}
