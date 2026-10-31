"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { Bot, ChevronDown, MessageCircle, Search, Send } from "lucide-react"
import { SubPage } from "@/components/customer/SubPage"
import { answerQuestion, FAQ_CATEGORIES, FAQS, QUICK_QUESTIONS, type ChatReply } from "@/lib/help-content"
import { createWaiterRequest, getCancelState } from "@/lib/orders-db"
import { useOrders } from "@/lib/use-orders"

interface Message {
  id: number
  from: "me" | "bot"
  text: string
  actions?: ChatReply["actions"]
}

const card = "rounded-[20px] border border-[#F1E7DE] bg-white shadow-[0_6px_24px_rgba(48,32,25,0.06)]"

export default function HelpPage() {
  const tableId = String(useParams().tableId).padStart(2, "0")
  const router = useRouter()
  const { orders } = useOrders(tableId)
  // answer about the order still in progress, otherwise the most recent one
  const latest = orders.find((o) => o.child_orders.some((c) => c.status !== "CANCELLED" && c.status !== "DELIVERED")) ?? orders[0]
  const [tab, setTab] = useState<"faq" | "chat">("faq")

  /* FAQs */
  const [query, setQuery] = useState("")
  const [openId, setOpenId] = useState<string | null>(null)
  const [category, setCategory] = useState<string>("All")
  const shown = useMemo(() => {
    const q = query.trim().toLowerCase()
    return FAQS.filter((f) => (category === "All" || f.category === category) && (!q || f.q.toLowerCase().includes(q) || f.a.toLowerCase().includes(q) || f.keys.some((k) => q.includes(k))))
  }, [query, category])

  /* Chat */
  const [messages, setMessages] = useState<Message[]>([
    { id: 1, from: "bot", text: "Hi, I'm the DOSTANA helper, an automated assistant. Ask about your order, payment, cancelling or the menu. For anything I can't answer, I'll connect you to the stall or a waiter." },
  ])
  const [draft, setDraft] = useState("")
  const nextId = useRef(2)
  const logEnd = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (tab === "chat") logEnd.current?.scrollIntoView({ block: "end" })
  }, [messages, tab])

  const push = (m: Omit<Message, "id">) => setMessages((list) => [...list, { ...m, id: nextId.current++ }])

  const ask = (text: string) => {
    const clean = text.trim()
    if (!clean) return
    push({ from: "me", text: clean })
    const cancel = latest ? (getCancelState(latest).state === "open" ? "open" : "closed") : "none"
    const reply = answerQuestion(clean, latest, cancel)
    window.setTimeout(() => push({ from: "bot", text: reply.text, actions: reply.actions }), 350)
    setDraft("")
  }

  const runAction = (id: NonNullable<ChatReply["actions"]>[number]["id"]) => {
    if (id === "open-order" && latest) router.push(`/table/${tableId}/orders/${latest.id}`)
    else if (id === "faqs") setTab("faq")
    else if (id === "ask-stall" || id === "call-waiter") {
      const stalls = latest ? Array.from(new Set(latest.child_orders.map((c) => c.stall_name))).join(", ") : ""
      const res = createWaiterRequest(
        tableId,
        id === "call-waiter" ? "CALL_WAITER" : "NEED_ASSISTANCE",
        id === "ask-stall" ? `Customer needs the stall${stalls ? ` (${stalls})` : ""} to help${latest ? ` with order #${latest.id.replace("DOSTANA-", "")}` : ""}.` : undefined
      )
      push({ from: "bot", text: res.success ? "Done. A waiter has been told and will come to your table." : (res.error ?? "I couldn't send that. Please wave to a waiter.") })
    }
  }

  const tabBtn = (id: "faq" | "chat", label: string, Icon: typeof Search) => (
    <button
      type="button"
      role="tab"
      aria-selected={tab === id}
      onClick={() => setTab(id)}
      className={`flex min-h-12 flex-1 items-center justify-center gap-2 rounded-full text-[15px] font-semibold ${tab === id ? "bg-[#F4772B] text-white" : "text-[#5E5650]"}`}
    >
      <Icon className="h-4 w-4" aria-hidden="true" /> {label}
    </button>
  )

  return (
    <SubPage tableId={tableId} title="Help and support">
      <div role="tablist" aria-label="Help sections" className="mb-4 flex gap-1 rounded-full border border-[#F1E7DE] bg-white p-1">
        {tabBtn("faq", "FAQs", Search)}
        {tabBtn("chat", "Chat assistant", MessageCircle)}
      </div>

      {tab === "faq" ? (
        <section role="tabpanel" aria-label="Frequently asked questions">
          <label htmlFor="faq-search" className="sr-only">Search help</label>
          <div className="relative">
            <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-[#77716D]" aria-hidden="true" />
            <input id="faq-search" type="search" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search: cancel, refund, allergy…" className="h-12 w-full rounded-full border border-[#F1E7DE] bg-white pl-12 pr-4 text-[15px] outline-none focus:border-[#F4772B]" />
          </div>
          <div className="-mx-4 mt-3 flex gap-2 overflow-x-auto px-4 pb-1">
            {["All", ...FAQ_CATEGORIES].map((c) => (
              <button key={c} type="button" aria-pressed={category === c} onClick={() => setCategory(c)} className={`min-h-11 shrink-0 rounded-full border px-4 text-sm font-semibold ${category === c ? "border-[#F4772B] bg-[#FFE7D6] text-[#7A2E05]" : "border-[#F1E7DE] bg-white text-[#302019]"}`}>
                {c}
              </button>
            ))}
          </div>
          <ul className="mt-3 space-y-2">
            {shown.map((f) => {
              const open = openId === f.id
              return (
                <li key={f.id} className={card}>
                  <h3>
                    <button type="button" aria-expanded={open} aria-controls={`faq-${f.id}`} onClick={() => setOpenId(open ? null : f.id)} className="flex min-h-14 w-full items-center justify-between gap-3 px-4 py-2 text-left text-[15px] font-semibold text-[#26160F]">
                      {f.q}
                      <ChevronDown className={`h-5 w-5 shrink-0 text-[#77716D] transition-transform ${open ? "rotate-180" : ""}`} aria-hidden="true" />
                    </button>
                  </h3>
                  {open && (
                    <p id={`faq-${f.id}`} className="px-4 pb-4 text-sm leading-6 text-[#5E5650]">{f.a}</p>
                  )}
                </li>
              )
            })}
          </ul>
          {shown.length === 0 && (
            <div className={`${card} mt-3 p-6 text-center`}>
              <p className="font-semibold text-[#26160F]">No answers found for that</p>
              <p className="mt-1 text-sm text-[#5E5650]">Try the chat assistant, or ask a waiter to help.</p>
              <button type="button" onClick={() => setTab("chat")} className="mt-3 min-h-12 rounded-full bg-[#F4772B] px-6 text-[15px] font-semibold text-white">Open chat assistant</button>
            </div>
          )}
          <div className={`${card} mt-5 p-5`}>
            <h2 className="text-base font-bold text-[#26160F]">Still need help?</h2>
            <p className="mt-1 text-sm text-[#5E5650]">For anything else, contact the stall that is making your food, or call a waiter to your table.</p>
            <button type="button" onClick={() => setTab("chat")} className="mt-3 min-h-12 rounded-full border border-[#F4772B] px-6 text-[15px] font-semibold text-[#E85D16]">Chat with the assistant</button>
          </div>
        </section>
      ) : (
        <section role="tabpanel" aria-label="Chat assistant" className={`${card} flex flex-col`}>
          <div role="log" aria-live="polite" aria-label="Conversation" className="max-h-[52vh] min-h-[280px] space-y-3 overflow-y-auto p-4">
            {messages.map((m) => (
              <div key={m.id} className={`flex ${m.from === "me" ? "justify-end" : "justify-start"}`}>
                <div className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-6 ${m.from === "me" ? "bg-[#F4772B] text-white" : "bg-[#FFF4EA] text-[#26160F]"}`}>
                  {m.from === "bot" && <span className="mb-1 flex items-center gap-1 text-xs font-semibold text-[#7A2E05]"><Bot className="h-3.5 w-3.5" aria-hidden="true" /> Helper</span>}
                  {m.text}
                  {m.actions && (
                    <span className="mt-2 flex flex-wrap gap-2">
                      {m.actions.map((a) => (
                        <button key={a.id} type="button" onClick={() => runAction(a.id)} className="min-h-11 rounded-full border border-[#F4772B] bg-white px-4 text-sm font-semibold text-[#E85D16]">{a.label}</button>
                      ))}
                    </span>
                  )}
                </div>
              </div>
            ))}
            <div ref={logEnd} />
          </div>
          <div className="flex gap-2 overflow-x-auto border-t border-[#F1E7DE] px-4 py-3">
            {QUICK_QUESTIONS.map((q) => (
              <button key={q} type="button" onClick={() => ask(q)} className="min-h-11 shrink-0 rounded-full border border-[#F1E7DE] bg-white px-4 text-sm font-semibold text-[#302019]">{q}</button>
            ))}
          </div>
          <form onSubmit={(e) => { e.preventDefault(); ask(draft) }} className="flex gap-2 border-t border-[#F1E7DE] p-3">
            <label htmlFor="chat-input" className="sr-only">Type your question</label>
            <input id="chat-input" value={draft} onChange={(e) => setDraft(e.target.value)} maxLength={200} placeholder="Type your question" className="h-12 min-w-0 flex-1 rounded-full border border-[#F1E7DE] px-4 text-[15px] outline-none focus:border-[#F4772B]" />
            <button type="submit" aria-label="Send question" className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#F4772B] text-white">
              <Send className="h-5 w-5" aria-hidden="true" />
            </button>
          </form>
        </section>
      )}
      <p className="mt-4 text-xs leading-5 text-[#77716D]">The assistant is automated and answers from our FAQs and your order status. It can make mistakes, so for anything important ask the stall or a waiter.</p>
    </SubPage>
  )
}
