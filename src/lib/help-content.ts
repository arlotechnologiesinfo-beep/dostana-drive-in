import { CANCEL_WINDOW_SECONDS, type ParentOrder } from "@/lib/orders-db"

export interface Faq {
  id: string
  category: string
  q: string
  a: string
  /** words a customer might type; used by the chat assistant */
  keys: string[]
}

export const FAQ_CATEGORIES = ["Ordering", "Order status", "Cancel and changes", "Payment", "Food and allergies", "Table and service", "Offers and account"] as const

const mins = CANCEL_WINDOW_SECONDS / 60

export const FAQS: Faq[] = [
  // Ordering
  { id: "how-order", category: "Ordering", q: "How do I order?", a: "Scan the QR code on your table or enter your table number. Browse any stall, add dishes to one cart, and check out once. Each stall receives only its own part of your order.", keys: ["how", "order", "place", "start", "scan"] },
  { id: "many-stalls", category: "Ordering", q: "Can I order from different stalls in one go?", a: "Yes. Your cart combines every stall. We split it into one order per stall, and each stall cooks its own dishes. Food may reach your table at different times.", keys: ["different", "multiple", "many", "stalls", "together", "one cart"] },
  { id: "soldout", category: "Ordering", q: "Why can't I add a dish?", a: "The stall has switched it off or it is sold out. Pick another dish, or check again later because stalls update their stock live.", keys: ["sold", "out", "unavailable", "cannot add", "can't add", "not available", "finished"] },
  { id: "instructions", category: "Ordering", q: "Can I ask for less spice or no onion?", a: "Add a note on the item or on your order at checkout. The stall sees it on the order. If it is important, such as an allergy, also tell the stall or a waiter.", keys: ["spice", "spicy", "onion", "note", "instruction", "less", "extra", "request"] },
  { id: "quantity", category: "Ordering", q: "Is there a limit on quantity?", a: "Some dishes have limited stock. If there is a limit, the app tells you how many are left.", keys: ["quantity", "limit", "stock", "how many", "left"] },
  { id: "serves", category: "Ordering", q: "How many people does a dish serve?", a: "Open the dish page. It shows how many portions the dish serves and roughly how long it takes to cook when the stall has set it.", keys: ["serves", "portion", "people", "size", "plate", "family"] },

  // Order status
  { id: "where", category: "Order status", q: "Where is my order?", a: "Open My Orders and tap your order. Each stall shows its own status: Waiting for stall, Being cooked, Ready, or Served. You also get a notification each time a stall accepts, cooks or serves.", keys: ["where", "status", "track", "progress", "update", "late", "long", "time", "wait", "waiting", "taking"] },
  { id: "statuses", category: "Order status", q: "What do the order statuses mean?", a: "Waiting for stall: sent, not accepted yet. Being cooked: the stall accepted and started cooking. Ready: cooked and a waiter is bringing it. Served: it is at your table.", keys: ["mean", "statuses", "stages", "steps", "accepted", "cooking", "cooked", "ready", "served", "preparing"] },
  { id: "partial", category: "Order status", q: "One stall's food came earlier. Is that normal?", a: "Yes. Every stall cooks its own dishes, so a quick tea can arrive before a biryani. Your order shows each stall separately.", keys: ["earlier", "first", "some", "partial", "missing", "not all", "other stall", "different times"] },
  { id: "notify", category: "Order status", q: "How will I know when my food is ready?", a: "A pop-up appears on any page of the app and a message is saved in Notifications. Keep the app open on your table. Phone alerts when the app is closed need real accounts and are not part of this demo.", keys: ["notify", "notification", "alert", "know", "message", "pop"] },
  { id: "noaccept", category: "Order status", q: "My order still says Waiting for stall.", a: "The stall hasn't accepted it yet. You can cancel within " + mins + " minutes. If it stays waiting for longer, contact the stall or ask a waiter to check.", keys: ["not accepted", "waiting", "stuck", "no response", "ignored", "pending"] },
  { id: "wrong", category: "Order status", q: "I got the wrong or a missing item.", a: "Please tell a waiter or the stall straight away. Open the order and use 'Ask the stall for help', or use Call waiter. Mention the order number so they can fix it quickly.", keys: ["wrong", "missing", "incorrect", "different", "mistake", "not what", "forgot"] },

  // Cancel and changes
  { id: "cancel", category: "Cancel and changes", q: "Can I cancel my order?", a: "Yes, for " + mins + " minutes after you place it, as long as the stall has not accepted it. Open the order and tap Cancel order. After that, the stall has started cooking, so please contact the stall to cancel.", keys: ["cancel", "cancellation", "undo", "stop", "remove order", "do not want", "don't want", "changed my mind"] },
  { id: "cancel-late", category: "Cancel and changes", q: "It has been more than " + mins + " minutes. Can I still cancel?", a: "Not from the app. Food may already be cooking. Open the order and tap 'Ask the stall for help', or call a waiter. The stall decides whether it can still be cancelled.", keys: ["late", "after", "too late", "more than", "expired", "time over", "cancel late"] },
  { id: "change", category: "Cancel and changes", q: "Can I add or change items after ordering?", a: "You can't edit a placed order. Place a new order for extra items. To change an item, cancel within " + mins + " minutes or contact the stall.", keys: ["change", "edit", "modify", "add more", "add item", "swap", "replace", "update order"] },
  { id: "stall-cancel", category: "Cancel and changes", q: "The stall declined my order. Why?", a: "A stall can decline when a dish is finished, the kitchen is too busy, or it is closing. You'll see the reason in the order and in Notifications. Other stalls in your order are not affected.", keys: ["declined", "rejected", "refused", "stall cancelled", "cancelled by", "couldn't make"] },

  // Payment
  { id: "pay", category: "Payment", q: "How can I pay?", a: "Choose UPI or Pay at Table at checkout. With Pay at Table, a waiter brings the bill and you pay in cash or UPI at your table.", keys: ["pay", "payment", "upi", "cash", "card", "gpay", "phonepe", "paytm", "bill"] },
  { id: "refund", category: "Payment", q: "I paid and cancelled. What happens to my money?", a: "Tell a waiter or the stall your order number. They will confirm how and when your payment is returned. Refund times depend on the payment method.", keys: ["refund", "money", "paid", "charged", "deducted", "return"] },
  { id: "gst", category: "Payment", q: "What are the taxes and charges?", a: "Your order shows an item total, taxes and charges, and a final total before you confirm. A tax invoice can be requested from a waiter.", keys: ["tax", "gst", "charges", "invoice", "receipt", "extra charge"] },
  { id: "failed", category: "Payment", q: "My payment failed or was charged twice.", a: "Don't pay again. Tell a waiter your table number and what happened. They can check the order and sort it out.", keys: ["failed", "twice", "double", "error", "declined payment", "stuck payment"] },

  // Food and allergies
  { id: "allergy", category: "Food and allergies", q: "I have an allergy. What should I do?", a: "Dish pages list common allergens when the stall has added them, but they may be incomplete. Always tell the stall or a waiter about any allergy before you order.", keys: ["allergy", "allergic", "allergen", "nuts", "dairy", "gluten", "egg", "soy", "shellfish", "intolerance"] },
  { id: "veg", category: "Food and allergies", q: "How do I find only vegetarian food?", a: "Use the Veg filter on the home page and in search. Veg and non-veg are marked on every dish.", keys: ["veg", "vegetarian", "non-veg", "nonveg", "vegan", "jain", "filter"] },
  { id: "photos", category: "Food and allergies", q: "Do dishes look exactly like the photos?", a: "Photos and prices in this demo menu are samples. The restaurant approves the real menu and photos before launch. Portions may vary a little.", keys: ["photo", "picture", "look", "image", "demo", "sample", "price"] },
  { id: "complaint", category: "Food and allergies", q: "The food is cold or not good.", a: "We're sorry. Tell a waiter right away or open the order and use 'Ask the stall for help', so the stall can fix it while you're still at the table.", keys: ["cold", "bad", "stale", "hair", "taste", "quality", "complaint", "undercooked", "burnt", "raw"] },

  // Table and service
  { id: "waiter", category: "Table and service", q: "How do I call a waiter?", a: "Go to More, then Call waiter, and choose water, bill, plates, cleaning or general help. The waiter dashboard shows your table number straight away.", keys: ["waiter", "call", "staff", "service", "water", "plates", "cleaning", "bill", "help me"] },
  { id: "switch", category: "Table and service", q: "I moved to another table.", a: "Go to More, then Table Switch, and choose your new table so food comes to the right place. Orders already placed go to the table they were placed from, so tell a waiter.", keys: ["switch", "move", "moved", "table change", "different table", "new table", "wrong table"] },
  { id: "qr", category: "Table and service", q: "The QR code isn't working.", a: "Enter your table number (1 to 25) on the home page of DOSTANA DRIVE IN. If it still fails, ask a waiter.", keys: ["qr", "scan", "code", "not working", "invalid", "table number", "camera"] },
  { id: "hours", category: "Table and service", q: "Why is a stall closed?", a: "Stalls can pause orders when busy or closed. A closed stall can't take new orders. Try another stall, or ask a waiter when it reopens.", keys: ["closed", "open", "paused", "busy", "hours", "timing", "stall closed"] },

  // Offers and account
  { id: "offers", category: "Offers and account", q: "How do I use an offer or coupon?", a: "Open Offers from More. Offers and discounts shown right now are samples. Real offers will appear once the restaurant approves them.", keys: ["offer", "coupon", "discount", "promo", "code", "deal", "gold", "reward", "cashback"] },
  { id: "profile", category: "Offers and account", q: "Do I need an account?", a: "No. You can order with just your name and phone number. They are used so the stall and waiter can find you. They are saved on this device in this demo.", keys: ["account", "login", "sign in", "register", "profile", "phone", "name", "privacy", "data"] },
]

export interface ChatReply {
  text: string
  actions?: { id: "open-order" | "ask-stall" | "call-waiter" | "faqs"; label: string }[]
}

const STOP = new Set(["the", "a", "an", "is", "are", "my", "me", "i", "to", "of", "it", "and", "or", "in", "on", "for", "do", "can", "how", "what", "why", "when", "where"])

function words(text: string): string[] {
  return text.toLowerCase().replace(/[^a-z0-9' ]/g, " ").split(/\s+/).filter((w) => w && !STOP.has(w))
}

function liveStatus(order: ParentOrder): string {
  const parts = order.child_orders.map((c) => {
    const label =
      c.status === "ORDER_RECEIVED" ? "waiting for the stall to accept"
      : c.status === "PREPARING" ? "being cooked"
      : c.status === "READY" ? "cooked and ready, a waiter is bringing it"
      : c.status === "DELIVERED" ? "served"
      : c.cancelled_by === "STALL" ? `declined (${c.cancel_reason})` : "cancelled"
    return `${c.stall_name}: ${label}`
  })
  return parts.join(". ")
}

/** Rule-based helper: matches the question to FAQs, and answers live from the customer's latest order. */
export function answerQuestion(question: string, latest: ParentOrder | undefined, cancel: "open" | "closed" | "none"): ChatReply {
  const text = question.toLowerCase()
  const w = words(question)
  if (w.length === 0) return { text: "Type your question, or pick one of the quick questions below." }

  const mentionsOrder = /order|food|biryani|tea|dish|meal|tiffin/.test(text)
  const statusIntent = /where|status|track|ready|late|long|wait|how much time|taking|when/.test(text)
  const cancelIntent = /cancel|undo|do not want|don't want|changed my mind/.test(text)

  if (/human|person|manager|someone|talk to/.test(text)) {
    return { text: "I'm an automated helper. For a person, call a waiter and they will come to your table.", actions: [{ id: "call-waiter", label: "Call waiter" }] }
  }

  if (latest && cancelIntent) {
    const id = latest.id.replace("DOSTANA-", "")
    if (cancel === "open") return { text: `Your order #${id} can still be cancelled. Open it and tap Cancel order. The stall hasn't accepted it yet.`, actions: [{ id: "open-order", label: "Open my order" }] }
    if (cancel === "closed") return { text: `Order #${id} can't be cancelled in the app any more, because the ${mins}-minute time is over or a stall has started cooking. Please contact the stall.`, actions: [{ id: "ask-stall", label: "Ask the stall for help" }, { id: "open-order", label: "Open my order" }] }
  }

  if (latest && statusIntent && (mentionsOrder || w.length <= 4)) {
    return { text: `Order #${latest.id.replace("DOSTANA-", "")} right now. ${liveStatus(latest)}.`, actions: [{ id: "open-order", label: "Open my order" }] }
  }

  const scored = FAQS.map((f) => {
    let score = 0
    for (const k of f.keys) if (text.includes(k)) score += k.includes(" ") ? 3 : 2
    for (const word of w) if (f.q.toLowerCase().includes(word)) score += 1
    return { f, score }
  }).sort((x, y) => y.score - x.score)

  if (scored[0].score >= 2) {
    const extra = scored[0].f.category === "Cancel and changes" || scored[0].f.category === "Order status"
    return { text: scored[0].f.a, actions: extra && latest ? [{ id: "open-order", label: "Open my order" }, { id: "ask-stall", label: "Ask the stall for help" }] : undefined }
  }

  return {
    text: "I couldn't find an answer to that. For anything else, please contact the stall or call a waiter and they'll help you directly.",
    actions: [{ id: "ask-stall", label: "Ask the stall for help" }, { id: "call-waiter", label: "Call waiter" }, { id: "faqs", label: "Browse FAQs" }],
  }
}

export const QUICK_QUESTIONS = ["Where is my order?", "Can I cancel my order?", "How do I pay?", "I have an allergy", "The wrong item came", "Call a waiter"]
