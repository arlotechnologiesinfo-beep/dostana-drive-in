"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  QrCode,
  Users,
  CheckCircle2,
  Clock,
  Plus,
  X,
  Trash2,
  Check,
} from "lucide-react"
import { AdminLayout } from "@/components/dashboard/AdminLayout"

type TableStatus = "AVAILABLE" | "OCCUPIED"

interface TableData {
  id: string
  number: number
  status: TableStatus
  occupiedSince?: string
  activeOrderId?: string
  activeOrderAmount?: number
  seats: number
}

const generateTables = (): TableData[] =>
  Array.from({ length: 25 }, (_, i) => {
    const num = i + 1
    const isOccupied = [2, 3, 5, 7, 8, 11, 12, 15, 18, 20, 22, 24].includes(num)
    return {
      id: `tbl-${num}`,
      number: num,
      status: isOccupied ? "OCCUPIED" : "AVAILABLE",
      seats: [2, 4, 4, 6][i % 4],
      occupiedSince: isOccupied ? `${Math.floor(Math.random() * 50 + 5)} min ago` : undefined,
      activeOrderId: isOccupied ? `ORD-${Math.random().toString(36).slice(2, 6).toUpperCase()}` : undefined,
      activeOrderAmount: isOccupied ? Math.floor(Math.random() * 500 + 100) : undefined,
    }
  })

export default function AdminTablesPage() {
  const [tables, setTables] = useState<TableData[]>(generateTables())
  const [selectedTable, setSelectedTable] = useState<TableData | null>(null)
  const [showQR, setShowQR] = useState<TableData | null>(null)
  const [toast, setToast] = useState<string | null>(null)

  const showToast = (msg: string) => {
    setToast(msg)
    setTimeout(() => setToast(null), 2500)
  }

  const toggleStatus = (id: string) => {
    setTables((prev) =>
      prev.map((t) =>
        t.id === id
          ? {
              ...t,
              status: t.status === "OCCUPIED" ? "AVAILABLE" : "OCCUPIED",
              occupiedSince: t.status === "AVAILABLE" ? "Just now" : undefined,
              activeOrderId: t.status === "AVAILABLE" ? "ORD-NEW" : undefined,
              activeOrderAmount: t.status === "AVAILABLE" ? 0 : undefined,
            }
          : t
      )
    )
    setSelectedTable(null)
    showToast("Table status updated")
  }

  const occupiedCount  = tables.filter((t) => t.status === "OCCUPIED").length
  const availableCount = tables.filter((t) => t.status === "AVAILABLE").length

  return (
    <AdminLayout title="Tables" subtitle={`${occupiedCount} occupied · ${availableCount} available`}>
      {/* Toast */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-20 left-1/2 -translate-x-1/2 z-50 bg-surface border border-border rounded-xl px-5 py-3 flex items-center gap-2 shadow-2xl"
          >
            <Check className="w-4 h-4 text-success" />
            <span className="text-sm text-foreground">{toast}</span>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="p-4 lg:p-6 space-y-5">
        {/* Summary */}
        <div className="grid grid-cols-3 gap-3">
          {[
            { label: "Total Tables",  value: tables.length,  color: "text-foreground" },
            { label: "Occupied",       value: occupiedCount,  color: "text-primary" },
            { label: "Available",      value: availableCount, color: "text-success" },
          ].map((s) => (
            <div key={s.label} className="bg-white shadow-[0_6px_24px_rgba(48,32,25,0.07)] rounded-2xl p-4 border border-border text-center">
              <div className={`text-2xl font-black ${s.color}`} style={{ fontFamily: "var(--font-heading)" }}>
                {s.value}
              </div>
              <div className="text-xs text-muted-foreground mt-0.5">{s.label}</div>
            </div>
          ))}
        </div>

        {/* Legend */}
        <div className="flex items-center gap-4 text-xs text-muted-foreground">
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded-sm bg-success/20 border border-success/40" />
            Available
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded-sm bg-primary/20 border border-primary/40" />
            Occupied
          </div>
          <span>· Click a table for details</span>
        </div>

        {/* Table Grid */}
        <div className="grid grid-cols-5 sm:grid-cols-6 md:grid-cols-7 lg:grid-cols-8 xl:grid-cols-10 gap-2.5">
          {tables.map((table, i) => (
            <motion.button
              key={table.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.02 }}
              onClick={() => setSelectedTable(table)}
              className={`aspect-square rounded-2xl flex flex-col items-center justify-center gap-0.5 text-xs font-bold border transition-all hover:scale-105 active:scale-95 ${
                table.status === "OCCUPIED"
                  ? "bg-primary/10 border-primary/30 text-primary"
                  : "bg-success/8 border-success/25 text-success"
              }`}
              style={{ fontFamily: "var(--font-heading)" }}
            >
              <span className="text-base leading-none">{table.number}</span>
              <span className={`text-[8px] uppercase tracking-wide ${table.status === "OCCUPIED" ? "text-primary/70" : "text-success/70"}`}>
                {table.status === "OCCUPIED" ? "Occ" : "Avl"}
              </span>
            </motion.button>
          ))}

          {/* Add Table Button */}
          <button
            onClick={() => showToast("Table added! (Demo mode)")}
            className="aspect-square rounded-2xl flex flex-col items-center justify-center gap-0.5 bg-[#FFF4EA] border border-dashed border-border text-muted-foreground hover:bg-[#FFF4EA] hover:border-border transition-all"
          >
            <Plus className="w-5 h-5" />
          </button>
        </div>

        {/* Table Detail Drawer */}
        <AnimatePresence>
          {selectedTable && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setSelectedTable(null)}
                className="fixed inset-0 bg-black/60 z-40"
              />
              <motion.div
                initial={{ opacity: 0, y: 40, scale: 0.97 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 40, scale: 0.97 }}
                transition={{ type: "spring", stiffness: 400, damping: 35 }}
                className="fixed bottom-0 left-0 right-0 md:inset-auto md:top-1/2 md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:w-full md:max-w-sm z-50 bg-white shadow-[0_6px_24px_rgba(48,32,25,0.07)] rounded-t-3xl md:rounded-3xl border border-border p-6"
              >
                <div className="flex items-center justify-between mb-5">
                  <div>
                    <h2 className="font-bold text-foreground text-xl" style={{ fontFamily: "var(--font-heading)" }}>
                      Table {selectedTable.number}
                    </h2>
                    <p className="text-xs text-muted-foreground">{selectedTable.seats} seats</p>
                  </div>
                  <button
                    onClick={() => setSelectedTable(null)}
                    className="w-8 h-8 rounded-xl bg-surface border border-border flex items-center justify-center"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                {/* Status Badge */}
                <div className={`rounded-2xl p-4 mb-4 ${
                  selectedTable.status === "OCCUPIED"
                    ? "bg-primary/8 border border-primary/20"
                    : "bg-success/8 border border-success/20"
                }`}>
                  <div className="flex items-center gap-2 mb-2">
                    {selectedTable.status === "OCCUPIED" ? (
                      <Users className="w-4 h-4 text-primary" />
                    ) : (
                      <CheckCircle2 className="w-4 h-4 text-success" />
                    )}
                    <span className={`font-bold text-sm ${selectedTable.status === "OCCUPIED" ? "text-primary" : "text-success"}`}
                      style={{ fontFamily: "var(--font-heading)" }}>
                      {selectedTable.status === "OCCUPIED" ? "Currently Occupied" : "Available"}
                    </span>
                  </div>
                  {selectedTable.status === "OCCUPIED" && (
                    <div className="space-y-1 text-xs text-muted-foreground">
                      <div className="flex items-center gap-1.5">
                        <Clock className="w-3 h-3 text-gold" />
                        Since: <span className="text-foreground">{selectedTable.occupiedSince}</span>
                      </div>
                      {selectedTable.activeOrderId && (
                        <div>Order: <span className="text-foreground font-mono">{selectedTable.activeOrderId}</span></div>
                      )}
                      {selectedTable.activeOrderAmount !== undefined && (
                        <div>Bill so far: <span className="text-foreground font-bold">₹{selectedTable.activeOrderAmount}</span></div>
                      )}
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div className="space-y-2">
                  <button
                    onClick={() => { setShowQR(selectedTable); setSelectedTable(null) }}
                    className="w-full h-11 rounded-xl bg-white shadow-[0_6px_24px_rgba(48,32,25,0.07)] border border-border text-foreground font-semibold text-sm flex items-center justify-center gap-2"
                    style={{ fontFamily: "var(--font-heading)" }}
                  >
                    <QrCode className="w-4 h-4 text-primary" />
                    Show QR Code
                  </button>
                  <button
                    onClick={() => toggleStatus(selectedTable.id)}
                    className="w-full h-11 rounded-xl bg-surface border border-border text-muted-foreground hover:text-foreground font-semibold text-sm transition-colors"
                    style={{ fontFamily: "var(--font-heading)" }}
                  >
                    Mark as {selectedTable.status === "OCCUPIED" ? "Available" : "Occupied"}
                  </button>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>

        {/* QR Code Modal */}
        <AnimatePresence>
          {showQR && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setShowQR(null)}
                className="fixed inset-0 bg-black/70 z-50"
              />
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 bg-white shadow-[0_6px_24px_rgba(48,32,25,0.07)] rounded-3xl border border-border p-8 text-center w-72"
              >
                <button
                  onClick={() => setShowQR(null)}
                  className="absolute top-4 right-4 w-7 h-7 rounded-lg bg-surface border border-border flex items-center justify-center"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
                <div className="text-2xl mb-2" style={{ fontFamily: "var(--font-heading)" }}>QR — Table {showQR.number}</div>
                {/* Decorative QR placeholder */}
                <div className="w-40 h-40 mx-auto bg-white rounded-2xl flex items-center justify-center mb-4 p-3">
                  <div className="w-full h-full grid grid-cols-7 gap-0.5">
                    {Array.from({ length: 49 }, (_, i) => (
                      <div
                        key={i}
                        className={`rounded-sm ${Math.random() > 0.4 ? "bg-black" : "bg-transparent"}`}
                      />
                    ))}
                  </div>
                </div>
                <p className="text-xs text-muted-foreground mb-1">Scan to order from Table {showQR.number}</p>
                <p className="text-xs font-mono text-primary break-all">
                  dostana.in/table/{showQR.number}
                </p>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>
    </AdminLayout>
  )
}
