export const FOOD_COURT = {
  name: "DOSTANA DRIVE IN",
  tagline: "Where Every Craving Finds Its Place.",
  tables: 25,
}

export const COLORS = {
  primary: "#E53935",
  gold: "#F5C542",
  black: "#111111",
  surface: "#18181B",
  text: "#FFFFFF",
}

export const ORDER_STATUSES = [
  "ORDER_RECEIVED",
  "PREPARING",
  "READY",
  "OUT_FOR_DELIVERY",
  "DELIVERED",
] as const

export type OrderStatus = (typeof ORDER_STATUSES)[number]

export const PAYMENT_METHODS = ["UPI", "CASH_AT_TABLE"] as const

export type PaymentMethod = (typeof PAYMENT_METHODS)[number]
