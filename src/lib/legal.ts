/**
 * DRAFT legal page content. These are plain-language starting points for Arlo Technologies,
 * not legal advice. Have them reviewed by qualified counsel, and fill in the real registered
 * address, GSTIN, FSSAI licence number and grievance officer before launch.
 */
export interface LegalPage {
  slug: string
  title: string
  summary: string
  sections: { heading: string; body: string[] }[]
}

export const LEGAL_PAGES: LegalPage[] = [
  {
    slug: "terms",
    title: "Terms and Conditions",
    summary: "The rules for using Dostana Drive In to order food at your table.",
    sections: [
      { heading: "Using the service", body: ["Dostana Drive In lets you order from the stalls in our food court using your phone while you sit at a table. You must enter or scan a valid table code to start an order.", "Please do not misuse table codes or place orders for a table you are not sitting at."] },
      { heading: "Orders and prices", body: ["Each stall prepares its own items. One checkout creates one order per stall. Prices, availability and preparation times are set by the stalls and can change without notice.", "We confirm prices and stock again when you place your order. If an item sells out, we will tell you before you pay."] },
      { heading: "Payment", body: ["You can pay by UPI or at the table. Prices include applicable taxes unless shown separately. Your bill shows the total before you confirm."] },
      { heading: "Changes", body: ["We may update these terms from time to time. The latest version is always on this page."] },
    ],
  },
  {
    slug: "privacy",
    title: "Privacy Policy",
    summary: "What we collect, why, and the choices you have.",
    sections: [
      { heading: "What we collect", body: ["Your table number, the items in your cart and orders, and optional details such as your name if you add it. Your cart and favourites are stored on your device."] },
      { heading: "How we use it", body: ["To prepare and serve your order, show you order status, let waiters help you, and improve the service. We do not sell your personal information."] },
      { heading: "Sharing", body: ["Each stall sees only the items in its own part of your order, your table number and any notes you add. Payment providers handle payment details; we do not store card or UPI credentials."] },
      { heading: "Your choices", body: ["You can clear your cart and favourites at any time, and ask us to delete personal details we hold by contacting us."] },
    ],
  },
  {
    slug: "refunds",
    title: "Refund and Cancellation Policy",
    summary: "When you can cancel an order and how refunds work.",
    sections: [
      { heading: "Cancelling an order", body: ["You can ask to cancel before a stall starts preparing your items. Once preparation begins, that stall's items cannot be cancelled."] },
      { heading: "Sold-out or unavailable items", body: ["If a stall cannot prepare an item after you have paid, you will be refunded for that item. Other stalls' items in the same checkout are not affected."] },
      { heading: "How refunds are paid", body: ["Refunds go back to the original payment method. UPI refunds usually reach you within a few working days. Cash payments are refunded at the table."] },
      { heading: "Quality concerns", body: ["If something is not right with your food, tell a waiter straight away so the stall can fix it."] },
    ],
  },
  {
    slug: "cookies",
    title: "Cookie and Storage Policy",
    summary: "How we use your browser's storage.",
    sections: [
      { heading: "What we store", body: ["We save your cart, favourites, recent tables and display preferences in your browser so the app works as you move between screens. We do not use this storage for advertising."] },
      { heading: "Controlling it", body: ["You can clear this data from your browser settings at any time. Your cart and favourites will reset."] },
    ],
  },
  {
    slug: "allergens",
    title: "Allergen and Food Safety",
    summary: "Important information for diners with allergies.",
    sections: [
      { heading: "Allergens", body: ["Our stalls handle ingredients such as nuts, dairy, gluten, eggs, soy and shellfish. Dishes may contain traces of other ingredients prepared in the same kitchen.", "If you have an allergy, tell a waiter before you order. Item pages do not yet list every allergen."] },
      { heading: "Veg and non-veg", body: ["Every dish shows a veg or non-veg mark. Stalls prepare both types, so cross-contact is possible in shared kitchens."] },
      { heading: "Food licence", body: ["FSSAI licence number: to be added before launch."] },
    ],
  },
  {
    slug: "accessibility",
    title: "Accessibility Statement",
    summary: "Our commitment to making ordering easy for everyone.",
    sections: [
      { heading: "Our aim", body: ["We aim to meet WCAG 2.1 AA. Our screens work with keyboards and screen readers, use clear contrast, and keep tap targets large."] },
      { heading: "Need help?", body: ["Tap your table number and choose Assistance, and a waiter will help you order. You can also contact us to report a barrier."] },
    ],
  },
  {
    slug: "contact",
    title: "Contact and Grievance",
    summary: "How to reach us and raise a concern.",
    sections: [
      { heading: "At the food court", body: ["The quickest help is a waiter at your table. Use Assistance on your table screen to call one."] },
      { heading: "Company", body: ["Dostana Drive In is operated by Arlo Technologies. Registered address, GSTIN, support email and grievance officer details: to be added before launch."] },
    ],
  },
]

export function getLegalPage(slug: string): LegalPage | undefined {
  return LEGAL_PAGES.find((p) => p.slug === slug)
}
