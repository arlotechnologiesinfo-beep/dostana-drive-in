"use client"

import { useEffect, useMemo, useState } from "react"
import { KeyRound, Minus, Pencil, Plus, Search, Trash2, X } from "lucide-react"
import { StallShell } from "@/components/dashboard/StallShell"
import { applyMenuOverrides, type CatalogItem } from "@/lib/catalog"
import { useMounted } from "@/lib/use-mounted"
import { useMenuAdminStore } from "@/stores/menu-admin"
import { DEFAULT_PASSWORD, useStallAuthStore } from "@/stores/stall-auth"

const MAX_PRICE = 5000
const card = "rounded-[20px] bg-white shadow-[0_6px_24px_rgba(48,32,25,0.07)]"
const input = "h-12 w-full rounded-2xl border border-[#F1E7DE] bg-white px-4 text-sm outline-none focus:border-[#F4772B]"
const btn = "inline-flex min-h-11 items-center justify-center gap-2 rounded-full px-5 text-sm font-semibold transition-colors"

function Switch({ checked, onChange, label }: { checked: boolean; onChange: (v: boolean) => void; label: string }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      onClick={() => onChange(!checked)}
      className="flex h-11 w-14 items-center justify-center"
    >
      <span className={`flex h-7 w-12 items-center rounded-full p-0.5 transition-colors ${checked ? "bg-[#63B65B]" : "bg-[#C9BFB6]"}`}>
        <span className={`h-6 w-6 rounded-full bg-white shadow transition-transform ${checked ? "translate-x-5" : ""}`} />
      </span>
    </button>
  )
}

interface FormState {
  name: string
  category: string
  price: string
  veg: boolean
  description: string
  image: string
  unlimited: boolean
  stock: string
  available: boolean
}

function emptyForm(): FormState {
  return { name: "", category: "", price: "", veg: true, description: "", image: "", unlimited: true, stock: "", available: true }
}

function ItemDialog({
  initial,
  categories,
  title,
  onSave,
  onClose,
}: {
  initial: FormState
  categories: string[]
  title: string
  onSave: (f: FormState) => void
  onClose: () => void
}) {
  const [f, setF] = useState(initial)
  const [errors, setErrors] = useState<Record<string, string>>({})

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose()
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [onClose])

  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    const next: Record<string, string> = {}
    if (!f.name.trim()) next.name = "Enter the item name."
    if (!f.category.trim()) next.category = "Enter or choose a category."
    const price = Number(f.price)
    if (!Number.isInteger(price) || price < 1 || price > MAX_PRICE) next.price = `Enter a whole price from ₹1 to ₹${MAX_PRICE}.`
    if (f.image.trim() && !/^https:\/\//i.test(f.image.trim())) next.image = "Use an https:// image link."
    if (!f.unlimited && (!Number.isInteger(Number(f.stock)) || Number(f.stock) < 0 || f.stock === "")) next.stock = "Enter a whole number, 0 or more."
    setErrors(next)
    if (Object.keys(next).length === 0) onSave(f)
  }

  const err = (k: string) => (errors[k] ? <p role="alert" className="mt-1 text-xs text-[#EF493B]">{errors[k]}</p> : null)

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center md:items-center">
      <button type="button" aria-label="Close" className="absolute inset-0 bg-[#26160F]/40" onClick={onClose} />
      <form
        role="dialog"
        aria-modal="true"
        aria-label={title}
        onSubmit={submit}
        noValidate
        className="relative max-h-[92vh] w-full max-w-[520px] overflow-y-auto rounded-t-[28px] bg-[#FFF9F2] p-5 md:rounded-[28px] md:p-7"
      >
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-bold text-[#26160F]">{title}</h2>
          <button type="button" onClick={onClose} aria-label="Close" className="flex h-11 w-11 items-center justify-center rounded-full bg-white">
            <X className="h-5 w-5" aria-hidden="true" />
          </button>
        </div>
        <div className="space-y-4">
          <div>
            <label htmlFor="f-name" className="mb-1 block text-sm font-semibold">Item name</label>
            <input id="f-name" className={input} value={f.name} maxLength={60} onChange={(e) => setF({ ...f, name: e.target.value })} aria-invalid={!!errors.name} />
            {err("name")}
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label htmlFor="f-cat" className="mb-1 block text-sm font-semibold">Category</label>
              <input id="f-cat" list="cats" className={input} value={f.category} maxLength={40} onChange={(e) => setF({ ...f, category: e.target.value })} aria-invalid={!!errors.category} />
              <datalist id="cats">{categories.map((c) => <option key={c} value={c} />)}</datalist>
              {err("category")}
            </div>
            <div>
              <label htmlFor="f-price" className="mb-1 block text-sm font-semibold">Price (₹)</label>
              <input id="f-price" inputMode="numeric" className={input} value={f.price} onChange={(e) => setF({ ...f, price: e.target.value.replace(/\D/g, "") })} aria-invalid={!!errors.price} />
              {err("price")}
            </div>
          </div>
          <fieldset>
            <legend className="mb-1 text-sm font-semibold">Food type</legend>
            <div className="flex gap-2">
              {[true, false].map((v) => (
                <label key={String(v)} className={`flex min-h-11 flex-1 cursor-pointer items-center justify-center rounded-full border text-sm font-semibold ${f.veg === v ? "border-[#F4772B] bg-[#FFE7D6] text-[#E85D16]" : "border-[#F1E7DE] bg-white"}`}>
                  <input type="radio" name="veg" className="sr-only" checked={f.veg === v} onChange={() => setF({ ...f, veg: v })} />
                  {v ? "Vegetarian" : "Non-vegetarian"}
                </label>
              ))}
            </div>
          </fieldset>
          <div>
            <label htmlFor="f-desc" className="mb-1 block text-sm font-semibold">Description <span className="font-normal text-[#77716D]">(optional)</span></label>
            <textarea id="f-desc" rows={2} maxLength={160} className="w-full resize-none rounded-2xl border border-[#F1E7DE] bg-white p-3 text-sm outline-none focus:border-[#F4772B]" value={f.description} onChange={(e) => setF({ ...f, description: e.target.value })} />
          </div>
          <div>
            <label htmlFor="f-img" className="mb-1 block text-sm font-semibold">Photo link <span className="font-normal text-[#77716D]">(optional)</span></label>
            <input id="f-img" className={input} placeholder="https://" value={f.image} onChange={(e) => setF({ ...f, image: e.target.value })} aria-invalid={!!errors.image} />
            {err("image")}
          </div>
          <div className="rounded-2xl bg-white p-3">
            <label className="flex min-h-11 cursor-pointer items-center gap-3 text-sm font-semibold">
              <input type="checkbox" className="h-5 w-5 accent-[#F4772B]" checked={f.unlimited} onChange={(e) => setF({ ...f, unlimited: e.target.checked })} />
              Unlimited stock
            </label>
            {!f.unlimited && (
              <div className="mt-2">
                <label htmlFor="f-stock" className="mb-1 block text-sm font-semibold">Units available today</label>
                <input id="f-stock" inputMode="numeric" className={input} value={f.stock} onChange={(e) => setF({ ...f, stock: e.target.value.replace(/\D/g, "") })} aria-invalid={!!errors.stock} />
                {err("stock")}
              </div>
            )}
          </div>
          <div className="flex items-center justify-between rounded-2xl bg-white px-3">
            <span className="text-sm font-semibold">Live for customers</span>
            <Switch checked={f.available} onChange={(v) => setF({ ...f, available: v })} label="Live for customers" />
          </div>
        </div>
        <div className="mt-6 flex gap-3">
          <button type="button" onClick={onClose} className={`${btn} flex-1 border border-[#E6D6C8] bg-white`}>Cancel</button>
          <button type="submit" className={`${btn} flex-[2] bg-[#F4772B] text-white hover:bg-[#E85D16]`}>Save item</button>
        </div>
      </form>
    </div>
  )
}

function PasswordPanel({ stallId }: { stallId: string }) {
  const changePassword = useStallAuthStore((s) => s.changePassword)
  const usesDefault = useStallAuthStore((s) => s.hashes[stallId] === undefined)
  const [open, setOpen] = useState(false)
  const [cur, setCur] = useState("")
  const [next, setNext] = useState("")
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null)

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    const r = await changePassword(stallId, cur, next)
    setMsg({ ok: r.ok, text: r.ok ? "Password changed." : (r.error ?? "Couldn't change it.") })
    if (r.ok) {
      setCur("")
      setNext("")
    }
  }

  return (
    <section aria-label="Account" className={`${card} p-4`}>
      <button type="button" onClick={() => setOpen((o) => !o)} aria-expanded={open} className="flex min-h-11 w-full items-center gap-3 text-left">
        <KeyRound className="h-5 w-5 text-[#E85D16]" aria-hidden="true" />
        <span className="flex-1 text-sm font-semibold">Change password</span>
        {usesDefault && <span className="rounded-full bg-[#FCE8E7] px-3 py-1 text-xs font-semibold text-[#EF493B]">Default in use</span>}
      </button>
      {open && (
        <form onSubmit={submit} className="mt-3 space-y-3">
          <div>
            <label htmlFor="cur-pw" className="mb-1 block text-sm font-semibold">Current password</label>
            <input id="cur-pw" type="password" autoComplete="current-password" className={input} value={cur} onChange={(e) => setCur(e.target.value)} />
            {usesDefault && <p className="mt-1 text-xs text-[#77716D]">First time? The default is {DEFAULT_PASSWORD}.</p>}
          </div>
          <div>
            <label htmlFor="new-pw" className="mb-1 block text-sm font-semibold">New password</label>
            <input id="new-pw" type="password" autoComplete="new-password" className={input} value={next} onChange={(e) => setNext(e.target.value)} />
            <p className="mt-1 text-xs text-[#77716D]">At least 8 characters.</p>
          </div>
          {msg && <p role="status" className={`text-sm ${msg.ok ? "text-[#145A25]" : "text-[#EF493B]"}`}>{msg.text}</p>}
          <button type="submit" className={`${btn} bg-[#F4772B] text-white`}>Save password</button>
        </form>
      )}
    </section>
  )
}

function ManagerView({ stall }: { stall: { id: string; name: string } }) {
  const mounted = useMounted()
  const overrides = useMenuAdminStore((s) => s.items)
  const open = useMenuAdminStore((s) => s.stallOpen[stall.id] !== false)
  const { addItem, patchItem, removeItem, setStallOpen } = useMenuAdminStore.getState()
  const by = stall.name

  const [query, setQuery] = useState("")
  const [cat, setCat] = useState("All")
  const [show, setShow] = useState<"all" | "live" | "off">("all")
  const [editing, setEditing] = useState<CatalogItem | "new" | null>(null)
  const [removing, setRemoving] = useState<string | null>(null)
  const [priceDraft, setPriceDraft] = useState<Record<string, string>>({})
  const [priceError, setPriceError] = useState<string | null>(null)

  const items = useMemo(
    () => (mounted ? applyMenuOverrides(overrides, {}).filter((i) => i.stallId === stall.id) : []),
    [mounted, overrides, stall.id]
  )
  const categories = useMemo(() => Array.from(new Set(items.map((i) => i.category).filter(Boolean) as string[])), [items])

  const q = query.trim().toLowerCase()
  const visible = items.filter(
    (i) =>
      (cat === "All" || i.category === cat) &&
      (show === "all" || (show === "live" ? i.available : !i.available)) &&
      (!q || i.name.toLowerCase().includes(q))
  )

  const live = items.filter((i) => i.available && (i.stock === null || i.stock > 0)).length
  const low = items.filter((i) => i.stock !== null && i.stock > 0 && i.stock <= 5).length

  const commitPrice = (i: CatalogItem) => {
    const raw = priceDraft[i.id]
    if (raw === undefined) return
    const p = Number(raw)
    if (!Number.isInteger(p) || p < 1 || p > MAX_PRICE) {
      setPriceError(`${i.name}: enter a whole price from ₹1 to ₹${MAX_PRICE}.`)
      return
    }
    setPriceError(null)
    if (p !== i.price) patchItem(i.id, { price: p }, by)
    setPriceDraft(({ [i.id]: _drop, ...rest }) => rest)
  }

  const save = (f: FormState) => {
    const base = {
      name: f.name.trim(),
      category: f.category.trim(),
      price: Number(f.price),
      veg: f.veg,
      description: f.description.trim() || undefined,
      image: f.image.trim() || undefined,
      available: f.available,
      stock: f.unlimited ? null : Number(f.stock),
    }
    if (editing === "new") addItem({ ...base, stallId: stall.id }, by)
    else if (editing) patchItem(editing.id, base, by)
    setEditing(null)
  }

  const formFor = (i: CatalogItem): FormState => ({
    name: i.name,
    category: i.category ?? "",
    price: String(i.price),
    veg: i.veg,
    description: i.description ?? "",
    image: i.image ?? "",
    unlimited: i.stock === null,
    stock: i.stock === null ? "" : String(i.stock),
    available: i.available,
  })

  const setAll = (on: boolean) => visible.forEach((i) => patchItem(i.id, { available: on }, by))

  return (
    <main className="mx-auto w-full max-w-[1100px] space-y-4 px-4 pb-24 pt-5 md:px-8">
      <section className={`${card} flex flex-wrap items-center gap-4 p-4`}>
        <div className="min-w-0 flex-1 basis-56">
          <h1 className="text-lg font-extrabold text-[#26160F]">Menu and stock</h1>
          <p className="text-sm text-[#77716D]">{items.length} items · {live} live · {items.length - live} off or sold out{low > 0 ? ` · ${low} running low` : ""}</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold">{open ? "Accepting orders" : "Closed for orders"}</span>
          <Switch checked={open} onChange={(v) => setStallOpen(stall.id, v)} label="Accepting orders" />
        </div>
        <button type="button" onClick={() => setEditing("new")} className={`${btn} bg-[#F4772B] text-white hover:bg-[#E85D16]`}>
          <Plus className="h-4 w-4" aria-hidden="true" /> Add item
        </button>
      </section>

      <PasswordPanel stallId={stall.id} />

      <section className="flex flex-wrap gap-3">
        <div className="relative min-w-[200px] flex-1">
          <label htmlFor="menu-search" className="sr-only">Search your menu</label>
          <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#77716D]" aria-hidden="true" />
          <input id="menu-search" className={`${input} pl-11`} placeholder="Search your menu" value={query} onChange={(e) => setQuery(e.target.value)} />
        </div>
        <div role="group" aria-label="Show" className="flex gap-2">
          {(["all", "live", "off"] as const).map((s) => (
            <button key={s} type="button" aria-pressed={show === s} onClick={() => setShow(s)} className={`${btn} ${show === s ? "bg-[#F4772B] text-white" : "bg-white"}`}>
              {s === "all" ? "All" : s === "live" ? "Live" : "Off"}
            </button>
          ))}
        </div>
      </section>

      <div role="group" aria-label="Categories" className="flex gap-2 overflow-x-auto pb-1">
        {["All", ...categories].map((c) => (
          <button key={c} type="button" aria-pressed={cat === c} onClick={() => setCat(c)} className={`${btn} shrink-0 ${cat === c ? "bg-[#FFE7D6] text-[#E85D16]" : "bg-white"}`}>
            {c}
          </button>
        ))}
      </div>

      {visible.length > 0 && (
        <div className="flex gap-2">
          <button type="button" onClick={() => setAll(true)} className={`${btn} border border-[#E6D6C8] bg-white`}>Turn shown items on</button>
          <button type="button" onClick={() => setAll(false)} className={`${btn} border border-[#E6D6C8] bg-white`}>Turn shown items off</button>
        </div>
      )}

      {priceError && <p role="alert" className="rounded-xl bg-[#FCE8E7] px-3 py-2 text-sm text-[#EF493B]">{priceError}</p>}

      <ul className="space-y-3">
        {visible.map((i) => (
          <li key={i.id} className={`${card} flex flex-wrap items-center gap-x-4 gap-y-2 p-4 ${i.available ? "" : "opacity-80"}`}>
            <div className="min-w-0 flex-1 basis-48">
              <p className="flex items-center gap-2 text-[15px] font-bold text-[#26160F]">
                <span className={`h-3.5 w-3.5 shrink-0 rounded-[3px] border-2 ${i.veg ? "border-[#145A25]" : "border-[#EF493B]"}`} role="img" aria-label={i.veg ? "Vegetarian" : "Non-vegetarian"} />
                <span className="truncate">{i.name}</span>
                {i.custom && <span className="rounded-full bg-[#FFE7D6] px-2 py-0.5 text-xs font-semibold text-[#E85D16]">Added by you</span>}
              </p>
              <p className="text-xs text-[#77716D]">{i.category || "No category"}</p>
            </div>

            <div>
              <label htmlFor={`p-${i.id}`} className="sr-only">Price for {i.name}</label>
              <div className="flex h-11 w-28 items-center rounded-full border border-[#F1E7DE] bg-white px-3 focus-within:border-[#F4772B]">
                <span className="text-sm text-[#77716D]">₹</span>
                <input
                  id={`p-${i.id}`}
                  inputMode="numeric"
                  className="w-full bg-transparent px-1 text-sm font-bold outline-none"
                  value={priceDraft[i.id] ?? String(i.price)}
                  onChange={(e) => setPriceDraft({ ...priceDraft, [i.id]: e.target.value.replace(/\D/g, "") })}
                  onBlur={() => commitPrice(i)}
                  onKeyDown={(e) => e.key === "Enter" && (e.target as HTMLInputElement).blur()}
                />
              </div>
            </div>

            <div className="flex items-center gap-1" role="group" aria-label={`Stock for ${i.name}`}>
              {i.stock === null ? (
                <button type="button" onClick={() => patchItem(i.id, { stock: 10 }, by)} className={`${btn} border border-[#F1E7DE] bg-white`}>Unlimited</button>
              ) : (
                <>
                  <button type="button" aria-label={`One less ${i.name}`} onClick={() => patchItem(i.id, { stock: Math.max(0, (i.stock ?? 0) - 1), ...(i.stock === 1 ? { available: false } : {}) }, by)} className="flex h-11 w-11 items-center justify-center rounded-full bg-white shadow-sm"><Minus className="h-4 w-4" aria-hidden="true" /></button>
                  <span className={`min-w-[56px] text-center text-sm font-bold ${i.stock === 0 ? "text-[#EF493B]" : i.stock <= 5 ? "text-[#E85D16]" : ""}`}>{i.stock === 0 ? "Sold out" : `${i.stock} left`}</span>
                  <button type="button" aria-label={`One more ${i.name}`} onClick={() => patchItem(i.id, { stock: (i.stock ?? 0) + 1 }, by)} className="flex h-11 w-11 items-center justify-center rounded-full bg-white shadow-sm"><Plus className="h-4 w-4" aria-hidden="true" /></button>
                  <button type="button" onClick={() => patchItem(i.id, { stock: null }, by)} className="min-h-11 px-2 text-xs font-medium text-[#77716D] underline">No limit</button>
                </>
              )}
            </div>

            <div className="flex items-center gap-1">
              <span className="text-xs font-semibold text-[#77716D]">{i.available && (i.stock === null || i.stock > 0) ? "Live" : "Off"}</span>
              <Switch checked={i.available} onChange={(v) => patchItem(i.id, { available: v, ...(v && i.stock === 0 ? { stock: null } : {}) }, by)} label={`${i.name} live for customers`} />
            </div>

            <div className="flex items-center gap-1">
              <button type="button" onClick={() => setEditing(i)} aria-label={`Edit ${i.name}`} className="flex h-11 w-11 items-center justify-center rounded-full bg-white shadow-sm"><Pencil className="h-4 w-4" aria-hidden="true" /></button>
              {removing === i.id ? (
                <>
                  <button type="button" onClick={() => { removeItem(i.id, by); setRemoving(null) }} className={`${btn} bg-[#EF493B] text-white`}>Remove {i.name}</button>
                  <button type="button" onClick={() => setRemoving(null)} className={`${btn} border border-[#E6D6C8] bg-white`}>Keep</button>
                </>
              ) : (
                <button type="button" onClick={() => setRemoving(i.id)} aria-label={`Remove ${i.name}`} className="flex h-11 w-11 items-center justify-center rounded-full bg-white text-[#EF493B] shadow-sm"><Trash2 className="h-4 w-4" aria-hidden="true" /></button>
              )}
            </div>
          </li>
        ))}
      </ul>

      {mounted && visible.length === 0 && (
        <p className={`${card} px-6 py-12 text-center text-sm text-[#77716D]`}>
          {items.length === 0 ? "No items yet. Add your first item to start taking orders." : "No items match these filters."}
        </p>
      )}

      {editing && (
        <ItemDialog
          title={editing === "new" ? "Add item" : "Edit item"}
          initial={editing === "new" ? emptyForm() : formFor(editing)}
          categories={categories}
          onSave={save}
          onClose={() => setEditing(null)}
        />
      )}
    </main>
  )
}

export default function StallMenuManagerPage() {
  return <StallShell>{(stall) => <ManagerView stall={stall} />}</StallShell>
}
