/**
 * Labelled dish artwork in /public/dishes, matched to menu items by name or category.
 * The artwork carries its own caption and white background, so show it with `object-contain`.
 */
const RULES: [RegExp, string][] = [
  [/biryani|biriyani|pulao/i, "biryani"],
  [/dosa|uttapam|uthappam/i, "dosa"],
  [/idly|idli/i, "idli"],
  [/south indian|meals/i, "south-indian"],
  [/pizza/i, "pizza"],
  [/pasta|penne|macaroni/i, "pasta"],
  [/noodle|fried rice|manchurian/i, "noodles"],
  [/shawarma/i, "shawarma"],
  [/\broll\b|\brolls\b|wrap/i, "rolls"],
  [/salad/i, "salad"],
  [/juice|shake|cooler|lassi|smoothie|mojito/i, "juice"],
  [/ice ?cream|sundae|waffle|kulfi|dessert/i, "desserts"],
  [/cake|brownie|pastry/i, "cake"],
  [/burger|sandwich/i, "burger"],
]

export function dishArt(name: string, category?: string): string | undefined {
  const byName = RULES.find(([re]) => re.test(name))
  const hit = byName ?? RULES.find(([re]) => category && re.test(category))
  return hit ? `/dishes/${hit[1]}.${hit[1] === "burger" ? "webp" : "png"}` : undefined
}

/** True for the labelled artwork, which must not be cropped. */
export function isDishArt(src?: string): boolean {
  return Boolean(src && src.startsWith("/dishes/"))
}
