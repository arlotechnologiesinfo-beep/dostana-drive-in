import { STALLS } from "@/data/menu"
import { getCatalogItem } from "@/lib/catalog"
import { useMenuAdminStore } from "@/stores/menu-admin"

/* ─────────────────────────────────────────────────────────────
   TYPES
───────────────────────────────────────────────────────────── */
export type OrderStatus =
  | "ORDER_RECEIVED"
  | "PREPARING"
  | "READY"
  | "DELIVERED"
  | "CANCELLED"

export type TableSessionStatus = "ACTIVE" | "COMPLETED" | "CANCELLED"

export interface TableSession {
  session_id: string
  food_court_id: string
  table_id: string
  status: TableSessionStatus
  created_at: string
  updated_at: string
}

export interface ChildStallOrder {
  id: string // e.g. AROMA-1024
  parent_order_id: string // e.g. DOSTANA-1024
  stall_id: string
  stall_name: string
  items: {
    menu_item_id: string
    variant_name?: string
    name: string
    unit_price: number
    quantity: number
    special_instructions?: string
  }[]
  total_amount: number
  status: OrderStatus
  /** set when status is CANCELLED */
  cancelled_by?: "CUSTOMER" | "STALL"
  cancel_reason?: string
  created_at: string
  updated_at: string
}

export type OrderEventKind = "PLACED" | "ACCEPTED" | "READY" | "SERVED" | "CANCELLED_BY_CUSTOMER" | "CANCELLED_BY_STALL"

/** A message for the customer's notification feed, written whenever an order moves. */
export interface OrderEvent {
  id: string
  table_id: string
  parent_order_id: string
  kind: OrderEventKind
  title: string
  body: string
  created_at: string
}

/** How long a customer may cancel on their own after placing an order. */
export const CANCEL_WINDOW_SECONDS = 120

export interface ParentOrder {
  id: string // e.g. DOSTANA-1024
  food_court_id: string
  table_id: string
  session_id: string
  customer_name: string
  customer_phone: string
  payment_method: "UPI" | "CASH_AT_TABLE"
  payment_status: "PENDING" | "PAID" | "FAILED" | "REFUNDED"
  subtotal: number
  tax_amount: number
  grand_total: number
  notes?: string
  child_orders: ChildStallOrder[]
  created_at: string
  updated_at: string
}

export interface WaiterRequest {
  id: string
  table_id: string
  session_id: string
  request_type:
    | "CALL_WAITER"
    | "NEED_WATER"
    | "NEED_BILL"
    | "EXTRA_PLATES"
    | "NEED_ASSISTANCE"
    | "NEED_CLEANING"
  /** optional detail from the customer, e.g. which order they need help with */
  note?: string
  status: "PENDING" | "ACKNOWLEDGED" | "RESOLVED"
  created_at: string
}

export interface OrderReview {
  id: string
  order_id: string
  table_id: string
  stall_id?: string
  rating: number
  comment?: string
  created_at: string
}

export interface StallStatus {
  stall_id: string
  status: "OPEN" | "BUSY" | "PAUSED" | "CLOSED"
}

/* ─────────────────────────────────────────────────────────────
   IN-MEMORY STORE WITH LOCALSTORAGE PERSISTENCE
───────────────────────────────────────────────────────────── */
const VALID_TABLES = Array.from({ length: 25 }, (_, i) => String(i + 1).padStart(2, "0"))

// Helper to load / save persistent state
function getStorageData<T>(key: string, defaultValue: T): T {
  if (typeof window === "undefined") return defaultValue
  try {
    const raw = localStorage.getItem(key)
    return raw ? JSON.parse(raw) : defaultValue
  } catch {
    return defaultValue
  }
}

function setStorageData<T>(key: string, value: T) {
  if (typeof window === "undefined") return
  try {
    localStorage.setItem(key, JSON.stringify(value))
    // other tabs get this natively; tell screens in this tab to refresh too
    window.dispatchEvent(new Event("storage"))
  } catch (e) {
    console.error("Failed to save to localStorage:", e)
  }
}

/* ─────────────────────────────────────────────────────────────
   VALIDATION HELPERS
───────────────────────────────────────────────────────────── */
export function isValidTable(tableId: string): boolean {
  const normalized = String(tableId).padStart(2, "0")
  return VALID_TABLES.includes(normalized)
}

export function getOrCreateSession(tableId: string): TableSession {
  const normalized = String(tableId).padStart(2, "0")
  const sessions = getStorageData<TableSession[]>("dostana_sessions", [])

  let active = sessions.find((s) => s.table_id === normalized && s.status === "ACTIVE")
  if (!active) {
    active = {
      session_id: `SESS-${normalized}-${Date.now()}`,
      food_court_id: "dostana-drive-in",
      table_id: normalized,
      status: "ACTIVE",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }
    sessions.push(active)
    setStorageData("dostana_sessions", sessions)
  }

  return active
}

/* ─────────────────────────────────────────────────────────────
   STALL STUB HELPER
───────────────────────────────────────────────────────────── */
export function getStallAbbreviation(stallId: string): string {
  const map: Record<string, string> = {
    "nani-tiffins": "NANI",
    "tea-time": "TEA",
    "juice-corner": "JUICE",
    "talks-tonic": "TONIC",
    "dills-dlite": "DILLI",
    "aroma-biryani": "AROMA",
    "cool-point": "COOL",
  }
  return map[stallId] || "STALL"
}

/* ─────────────────────────────────────────────────────────────
   ORDER TRANSACTION & CREATION (SERVER-SIDE PRICE SAFETY)
───────────────────────────────────────────────────────────── */
export interface CreateOrderPayload {
  table_id: string
  customer_name: string
  customer_phone: string
  payment_method: "UPI" | "CASH_AT_TABLE"
  notes?: string
  idempotency_key?: string
  items: {
    menu_item_id: string
    stall_id: string
    variant_name?: string
    quantity: number
    special_instructions?: string
  }[]
}

// In-memory idempotency locks
const processedIdempotencyKeys = new Set<string>()

export function createTransactionalOrder(payload: CreateOrderPayload): {
  success: boolean
  parent_order?: ParentOrder
  error?: string
} {
  const { table_id, customer_name, customer_phone, payment_method, notes, items, idempotency_key } = payload

  // 1. Table Validation
  if (!isValidTable(table_id)) {
    return { success: false, error: `Invalid table number: ${table_id}. Valid tables are 01 to 25.` }
  }

  // 2. Idempotency Key check
  if (idempotency_key) {
    if (processedIdempotencyKeys.has(idempotency_key)) {
      const existingOrders = getStorageData<ParentOrder[]>("dostana_orders", [])
      const found = existingOrders.find((o) => o.id.includes(idempotency_key))
      if (found) return { success: true, parent_order: found }
    }
    processedIdempotencyKeys.add(idempotency_key)
  }

  // 3. Cart & Item Availability + Server Price Safety
  if (!items || items.length === 0) {
    return { success: false, error: "Cart is empty." }
  }

  const session = getOrCreateSession(table_id)
  const orderNumber = Math.floor(1000 + Math.random() * 9000)
  const parentOrderId = `DOSTANA-${orderNumber}`

  // Group items by stall & recalculate prices strictly against ALL_MENU_ITEMS
  const itemsByStall: Record<string, ChildStallOrder["items"]> = {}

  const stockToConsume: [string, number, number | null][] = []
  for (const clientItem of items) {
    const dbItem = getCatalogItem(clientItem.menu_item_id)
    if (!dbItem) {
      return { success: false, error: `Menu item ${clientItem.menu_item_id} not found.` }
    }
    if (!dbItem.available) {
      return { success: false, error: `"${dbItem.name}" is sold out right now. Remove it from your cart to continue.` }
    }
    if (!Number.isInteger(clientItem.quantity) || clientItem.quantity < 1) {
      return { success: false, error: `Invalid quantity for "${dbItem.name}".` }
    }
    if (dbItem.stock !== null && dbItem.stock < clientItem.quantity) {
      return { success: false, error: `Only ${dbItem.stock} of "${dbItem.name}" left.` }
    }
    stockToConsume.push([dbItem.id, clientItem.quantity, dbItem.stock])

    // Determine correct unit price from DB
    let unitPrice = dbItem.price
    if (clientItem.variant_name && dbItem.variants) {
      const dbVariant = dbItem.variants.find((v) => v.name === clientItem.variant_name)
      if (dbVariant) {
        unitPrice = dbVariant.price
      }
    }

    if (!itemsByStall[clientItem.stall_id]) {
      itemsByStall[clientItem.stall_id] = []
    }

    itemsByStall[clientItem.stall_id].push({
      menu_item_id: clientItem.menu_item_id,
      variant_name: clientItem.variant_name,
      name: clientItem.variant_name ? `${dbItem.name} (${clientItem.variant_name})` : dbItem.name,
      unit_price: unitPrice,
      quantity: clientItem.quantity,
      special_instructions: clientItem.special_instructions,
    })
  }

  // Create Child Stall Orders
  const now = new Date().toISOString()
  const childOrders: ChildStallOrder[] = Object.entries(itemsByStall).map(([stallId, stallItems]) => {
    const stallInfo = STALLS.find((s) => s.id === stallId)
    const stallAbbr = getStallAbbreviation(stallId)
    const childTotal = stallItems.reduce((sum, item) => sum + item.unit_price * item.quantity, 0)

    return {
      id: `${stallAbbr}-${orderNumber}`,
      parent_order_id: parentOrderId,
      stall_id: stallId,
      stall_name: stallInfo?.name || stallId,
      items: stallItems,
      total_amount: childTotal,
      status: "ORDER_RECEIVED",
      created_at: now,
      updated_at: now,
    }
  })

  // Calculate Parent Order Totals
  const subtotal = childOrders.reduce((sum, c) => sum + c.total_amount, 0)
  const taxAmount = Math.round(subtotal * 0.05)
  const grandTotal = subtotal + taxAmount

  const parentOrder: ParentOrder = {
    id: parentOrderId,
    food_court_id: "dostana-drive-in",
    table_id: String(table_id).padStart(2, "0"),
    session_id: session.session_id,
    customer_name,
    customer_phone,
    payment_method,
    payment_status: payment_method === "UPI" ? "PAID" : "PENDING",
    subtotal,
    tax_amount: taxAmount,
    grand_total: grandTotal,
    notes,
    child_orders: childOrders,
    created_at: now,
    updated_at: now,
  }

  for (const [id, qty, stock] of stockToConsume) useMenuAdminStore.getState().consumeStock(id, qty, stock)

  // Persist to storage
  const existingOrders = getStorageData<ParentOrder[]>("dostana_orders", [])
  existingOrders.unshift(parentOrder)
  setStorageData("dostana_orders", existingOrders)

  for (const child of childOrders) {
    pushEvent(parentOrder, "PLACED", `Order sent to ${child.stall_name}`, `${itemSummary(child)}. Waiting for the stall to accept it. You can cancel for 2 minutes.`)
  }

  return { success: true, parent_order: parentOrder }
}

/* ─────────────────────────────────────────────────────────────
   ORDER QUERY & STATUS UPDATES
───────────────────────────────────────────────────────────── */
export function getOrdersForTable(tableId: string): ParentOrder[] {
  const normalized = String(tableId).padStart(2, "0")
  const orders = getStorageData<ParentOrder[]>("dostana_orders", [])
  return orders.filter((o) => o.table_id === normalized)
}

function itemSummary(child: ChildStallOrder): string {
  return child.items.map((i) => `${i.name} × ${i.quantity}`).join(", ")
}

function tableNo(order: ParentOrder): number {
  return parseInt(order.table_id, 10)
}

export function getOrderEvents(tableId: string): OrderEvent[] {
  const normalized = String(tableId).padStart(2, "0")
  return getStorageData<OrderEvent[]>("dostana_order_events", []).filter((e) => e.table_id === normalized)
}

function pushEvent(order: ParentOrder, kind: OrderEventKind, title: string, body: string) {
  const events = getStorageData<OrderEvent[]>("dostana_order_events", [])
  events.unshift({
    id: `EV-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    table_id: order.table_id,
    parent_order_id: order.id,
    kind,
    title,
    body,
    created_at: new Date().toISOString(),
  })
  setStorageData("dostana_order_events", events.slice(0, 300))
}

/** Puts cancelled items back on the shelf for items that track stock. */
function restoreStock(child: ChildStallOrder) {
  for (const line of child.items) {
    const current = getCatalogItem(line.menu_item_id)
    if (!current || current.stock === null) continue
    useMenuAdminStore.getState().patchItem(
      current.id,
      { stock: current.stock + line.quantity, ...(current.stock === 0 ? { available: true } : {}) },
      "Order cancelled"
    )
  }
}

/** Applies a change to one stall's part of an order and returns the updated order, or null when nothing changed. */
function mutateChild(parentOrderId: string, childOrderId: string, change: (child: ChildStallOrder) => ChildStallOrder | null): { order: ParentOrder; child: ChildStallOrder } | null {
  const orders = getStorageData<ParentOrder[]>("dostana_orders", [])
  let result: { order: ParentOrder; child: ChildStallOrder } | null = null
  const now = new Date().toISOString()

  const next = orders.map((order) => {
    if (order.id !== parentOrderId && !order.child_orders.some((c) => c.id === childOrderId)) return order
    const children = order.child_orders.map((child) => {
      if (child.id !== childOrderId) return child
      const changed = change(child)
      return changed ? { ...changed, updated_at: now } : child
    })
    const updatedChild = children.find((c) => c.id === childOrderId)!
    const original = order.child_orders.find((c) => c.id === childOrderId)
    if (!original || updatedChild === original) return order
    const updatedOrder = { ...order, child_orders: children, updated_at: now }
    result = { order: updatedOrder, child: updatedChild }
    return updatedOrder
  })

  if (result) setStorageData("dostana_orders", next)
  return result
}

export function updateChildOrderStatus(
  parentOrderId: string,
  childOrderId: string,
  newStatus: OrderStatus
): boolean {
  if (newStatus === "CANCELLED") return rejectChildOrder(parentOrderId, childOrderId, "The stall could not make this order.")

  const changed = mutateChild(parentOrderId, childOrderId, (child) =>
    child.status === "CANCELLED" || child.status === "DELIVERED" || child.status === newStatus ? null : { ...child, status: newStatus }
  )
  if (!changed) return false

  const { order, child } = changed
  if (newStatus === "PREPARING") {
    pushEvent(order, "ACCEPTED", `${child.stall_name} accepted your order`, `${itemSummary(child)} is being cooked now.`)
  } else if (newStatus === "READY") {
    pushEvent(order, "READY", "Your order is cooked and ready", `${child.stall_name} finished ${itemSummary(child)}. A waiter is bringing it to Table ${tableNo(order)}.`)
  } else if (newStatus === "DELIVERED") {
    pushEvent(order, "SERVED", `Served at Table ${tableNo(order)}`, `${itemSummary(child)} from ${child.stall_name}. Enjoy your meal!`)
  }
  return true
}

/** A stall declines or cannot finish its part of an order. The customer is told why. */
export function rejectChildOrder(parentOrderId: string, childOrderId: string, reason: string): boolean {
  const changed = mutateChild(parentOrderId, childOrderId, (child) =>
    child.status === "ORDER_RECEIVED" || child.status === "PREPARING"
      ? { ...child, status: "CANCELLED", cancelled_by: "STALL", cancel_reason: reason }
      : null
  )
  if (!changed) return false
  restoreStock(changed.child)
  const paid = changed.order.payment_status === "PAID" ? " Please ask a waiter about your payment." : ""
  pushEvent(changed.order, "CANCELLED_BY_STALL", `${changed.child.stall_name} couldn't make your order`, `${itemSummary(changed.child)}. Reason: ${reason}${paid}`)
  return true
}

/* ─────────────────────────────────────────────────────────────
   CUSTOMER CANCELLATION (2-MINUTE WINDOW)
───────────────────────────────────────────────────────────── */
export type CancelState =
  | { state: "open"; secondsLeft: number }
  | { state: "closed"; reason: "TIME" | "ACCEPTED" | "CANCELLED" }

/** Customers can cancel for 2 minutes, and only while no stall has accepted its part. */
export function getCancelState(order: ParentOrder, now: number = Date.now()): CancelState {
  const live = order.child_orders.filter((c) => c.status !== "CANCELLED")
  if (live.length === 0) return { state: "closed", reason: "CANCELLED" }
  if (live.some((c) => c.status !== "ORDER_RECEIVED")) return { state: "closed", reason: "ACCEPTED" }
  const elapsed = (now - new Date(order.created_at).getTime()) / 1000
  if (elapsed >= CANCEL_WINDOW_SECONDS) return { state: "closed", reason: "TIME" }
  return { state: "open", secondsLeft: Math.ceil(CANCEL_WINDOW_SECONDS - elapsed) }
}

export function cancelOrderByCustomer(tableId: string, parentOrderId: string): { success: boolean; error?: string } {
  const normalized = String(tableId).padStart(2, "0")
  const orders = getStorageData<ParentOrder[]>("dostana_orders", [])
  const order = orders.find((o) => o.id === parentOrderId && o.table_id === normalized)
  if (!order) return { success: false, error: "We couldn't find that order." }

  // Re-check the rules here so a stale screen can't cancel food a stall already started.
  const state = getCancelState(order)
  if (state.state !== "open") {
    return { success: false, error: "This order can no longer be cancelled here. Please contact the stall." }
  }

  const now = new Date().toISOString()
  const live = order.child_orders.filter((c) => c.status !== "CANCELLED")
  const updated: ParentOrder = {
    ...order,
    child_orders: order.child_orders.map((c) =>
      c.status === "CANCELLED" ? c : { ...c, status: "CANCELLED", cancelled_by: "CUSTOMER", cancel_reason: "Cancelled by you", updated_at: now }
    ),
    updated_at: now,
  }
  setStorageData("dostana_orders", orders.map((o) => (o.id === order.id ? updated : o)))
  live.forEach(restoreStock)
  const paid = order.payment_status === "PAID" ? " Ask a waiter about your payment." : " Nothing to pay."
  pushEvent(updated, "CANCELLED_BY_CUSTOMER", `Order #${order.id.replace("DOSTANA-", "")} cancelled`, `You cancelled before the stalls started.${paid}`)
  return { success: true }
}

/* ─────────────────────────────────────────────────────────────
   WAITER ASSISTANCE ENGINE (ANTI-SPAM COOLDOWN)
───────────────────────────────────────────────────────────── */
export function createWaiterRequest(
  tableId: string,
  requestType: WaiterRequest["request_type"],
  note?: string
): { success: boolean; request?: WaiterRequest; cooldown_seconds?: number; error?: string } {
  if (!isValidTable(tableId)) {
    return { success: false, error: "Invalid table number." }
  }

  const normalized = String(tableId).padStart(2, "0")
  const session = getOrCreateSession(normalized)
  const requests = getStorageData<WaiterRequest[]>("dostana_waiter_requests", [])

  // Cooldown Check: 60 seconds anti-spam
  const recent = requests.find(
    (r) => r.table_id === normalized && r.status === "PENDING"
  )
  if (recent) {
    const elapsedSec = Math.floor((Date.now() - new Date(recent.created_at).getTime()) / 1000)
    if (elapsedSec < 60) {
      return {
        success: false,
        cooldown_seconds: 60 - elapsedSec,
        error: `Please wait ${60 - elapsedSec} seconds before submitting another request.`,
      }
    }
  }

  const req: WaiterRequest = {
    id: `REQ-${Date.now()}`,
    table_id: normalized,
    session_id: session.session_id,
    request_type: requestType,
    ...(note ? { note } : {}),
    status: "PENDING",
    created_at: new Date().toISOString(),
  }

  requests.unshift(req)
  setStorageData("dostana_waiter_requests", requests)

  return { success: true, request: req }
}

export function getWaiterRequests(): WaiterRequest[] {
  return getStorageData<WaiterRequest[]>("dostana_waiter_requests", [])
}

export function updateWaiterRequestStatus(
  requestId: string,
  newStatus: WaiterRequest["status"]
): boolean {
  const requests = getStorageData<WaiterRequest[]>("dostana_waiter_requests", [])
  let found = false
  const updated = requests.map((r) => {
    if (r.id === requestId) {
      found = true
      return { ...r, status: newStatus }
    }
    return r
  })

  if (found) {
    setStorageData("dostana_waiter_requests", updated)
  }
  return found
}

/* ─────────────────────────────────────────────────────────────
   REVIEWS & RATINGS
───────────────────────────────────────────────────────────── */
export function addOrderReview(review: Omit<OrderReview, "id" | "created_at">): OrderReview {
  const reviews = getStorageData<OrderReview[]>("dostana_reviews", [])
  const newRev: OrderReview = {
    ...review,
    id: `REV-${Date.now()}`,
    created_at: new Date().toISOString(),
  }
  reviews.unshift(newRev)
  setStorageData("dostana_reviews", reviews)
  return newRev
}
