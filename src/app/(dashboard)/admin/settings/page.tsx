"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import {
  Store,
  Clock,
  Bell,
  CreditCard,
  Wifi,
  Save,
  Check,
  Phone,
  Mail,
  Globe,
  MessageSquare,
  Shield,
} from "lucide-react"
import { AdminLayout } from "@/components/dashboard/AdminLayout"

export default function AdminSettingsPage() {
  const [saved, setSaved] = useState<string | null>(null)
  const [settings, setSettings] = useState({
    courtName:       "Dostana Drive In",
    tagline:         "Where Every Craving Finds Its Place.",
    address:         "123, Food Court Road, Hyderabad, Telangana",
    phone:           "+91 98765 43210",
    email:           "admin@dostanadriveIn.com",
    website:         "https://dostana.in",
    openTime:        "10:00",
    closeTime:       "23:00",
    whatsappEnabled: true,
    smsEnabled:      false,
    emailEnabled:    true,
    upiEnabled:      true,
    cashEnabled:     true,
    gstPercent:      "5",
    gstNumber:       "29ABCDE1234F1Z5",
    razorpayEnabled: true,
    autoAcceptOrders: false,
    orderTimeout:    "30",
  })

  const handleSave = (section: string) => {
    setSaved(section)
    setTimeout(() => setSaved(null), 2000)
  }

  const Section = ({
    id,
    icon: Icon,
    title,
    children,
  }: {
    id: string
    icon: React.ElementType
    title: string
    children: React.ReactNode
  }) => (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white shadow-[0_6px_24px_rgba(48,32,25,0.07)] rounded-2xl border border-border overflow-hidden"
    >
      <div className="flex items-center justify-between px-5 py-4 border-b border-border">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center">
            <Icon className="w-4 h-4 text-primary" />
          </div>
          <h2 className="font-bold text-foreground text-sm" style={{ fontFamily: "var(--font-heading)" }}>
            {title}
          </h2>
        </div>
        <button
          onClick={() => handleSave(id)}
          className={`flex items-center gap-2 text-xs font-bold px-4 py-2 rounded-xl transition-all ${
            saved === id
              ? "bg-success text-white"
              : "bg-primary text-white hover:bg-primary-dark"
          }`}
          style={{ fontFamily: "var(--font-heading)" }}
        >
          {saved === id ? (
            <>
              <Check className="w-3.5 h-3.5" />
              Saved!
            </>
          ) : (
            <>
              <Save className="w-3.5 h-3.5" />
              Save
            </>
          )}
        </button>
      </div>
      <div className="p-5 space-y-4">{children}</div>
    </motion.div>
  )

  const Field = ({
    label,
    children,
  }: {
    label: string
    children: React.ReactNode
  }) => (
    <div>
      <label className="block text-xs text-muted-foreground mb-1.5 font-medium">
        {label}
      </label>
      {children}
    </div>
  )

  const Toggle = ({
    value,
    onChange,
    label,
    desc,
  }: {
    value: boolean
    onChange: (v: boolean) => void
    label: string
    desc?: string
  }) => (
    <div className="flex items-center justify-between py-1">
      <div>
        <div className="text-sm text-foreground font-medium">{label}</div>
        {desc && <div className="text-xs text-muted-foreground">{desc}</div>}
      </div>
      <button
        onClick={() => onChange(!value)}
        className={`relative w-12 h-6 rounded-full transition-colors ${
          value ? "bg-success" : "bg-muted"
        }`}
      >
        <span
          className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow transition-all ${
            value ? "left-7" : "left-1"
          }`}
        />
      </button>
    </div>
  )

  return (
    <AdminLayout title="Settings" subtitle="Food court configuration and preferences">
      <div className="p-4 lg:p-6 space-y-5 max-w-2xl">
        {/* General Info */}
        <Section id="general" icon={Store} title="General Information">
          <Field label="Food Court Name">
            <input
              value={settings.courtName}
              onChange={(e) => setSettings({ ...settings, courtName: e.target.value })}
              className="input-field text-sm h-11"
            />
          </Field>
          <Field label="Tagline">
            <input
              value={settings.tagline}
              onChange={(e) => setSettings({ ...settings, tagline: e.target.value })}
              className="input-field text-sm h-11"
            />
          </Field>
          <Field label="Address">
            <textarea
              value={settings.address}
              onChange={(e) => setSettings({ ...settings, address: e.target.value })}
              className="w-full h-20 px-4 py-3 rounded-xl bg-surface border border-border text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary resize-none"
            />
          </Field>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Field label="Phone">
              <div className="relative">
                <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  value={settings.phone}
                  onChange={(e) => setSettings({ ...settings, phone: e.target.value })}
                  className="input-field pl-10 text-sm h-11"
                />
              </div>
            </Field>
            <Field label="Email">
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  value={settings.email}
                  onChange={(e) => setSettings({ ...settings, email: e.target.value })}
                  className="input-field pl-10 text-sm h-11"
                />
              </div>
            </Field>
          </div>
          <Field label="Website">
            <div className="relative">
              <Globe className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                value={settings.website}
                onChange={(e) => setSettings({ ...settings, website: e.target.value })}
                className="input-field pl-10 text-sm h-11"
              />
            </div>
          </Field>
        </Section>

        {/* Operating Hours */}
        <Section id="hours" icon={Clock} title="Operating Hours">
          <div className="grid grid-cols-2 gap-4">
            <Field label="Opening Time">
              <input
                type="time"
                value={settings.openTime}
                onChange={(e) => setSettings({ ...settings, openTime: e.target.value })}
                className="input-field text-sm h-11"
              />
            </Field>
            <Field label="Closing Time">
              <input
                type="time"
                value={settings.closeTime}
                onChange={(e) => setSettings({ ...settings, closeTime: e.target.value })}
                className="input-field text-sm h-11"
              />
            </Field>
          </div>
          <Field label="Order Timeout (minutes)">
            <input
              type="number"
              value={settings.orderTimeout}
              onChange={(e) => setSettings({ ...settings, orderTimeout: e.target.value })}
              className="input-field text-sm h-11"
            />
          </Field>
          <Toggle
            value={settings.autoAcceptOrders}
            onChange={(v) => setSettings({ ...settings, autoAcceptOrders: v })}
            label="Auto-Accept Orders"
            desc="Automatically accept orders without manual confirmation"
          />
        </Section>

        {/* Notifications */}
        <Section id="notifications" icon={Bell} title="Notifications">
          <Toggle
            value={settings.whatsappEnabled}
            onChange={(v) => setSettings({ ...settings, whatsappEnabled: v })}
            label="WhatsApp Notifications"
            desc="Send order updates via WhatsApp Business API"
          />
          <div className="h-px bg-border" />
          <Toggle
            value={settings.smsEnabled}
            onChange={(v) => setSettings({ ...settings, smsEnabled: v })}
            label="SMS Notifications"
            desc="Send order confirmations via SMS"
          />
          <div className="h-px bg-border" />
          <Toggle
            value={settings.emailEnabled}
            onChange={(v) => setSettings({ ...settings, emailEnabled: v })}
            label="Email Notifications"
            desc="Send order receipts to customer email"
          />
        </Section>

        {/* Payments */}
        <Section id="payments" icon={CreditCard} title="Payment Settings">
          <Toggle
            value={settings.upiEnabled}
            onChange={(v) => setSettings({ ...settings, upiEnabled: v })}
            label="UPI Payments"
            desc="Accept GPay, PhonePe, Paytm via Razorpay"
          />
          <div className="h-px bg-border" />
          <Toggle
            value={settings.cashEnabled}
            onChange={(v) => setSettings({ ...settings, cashEnabled: v })}
            label="Cash at Table"
            desc="Allow customers to pay with cash when served"
          />
          <div className="h-px bg-border" />
          <div className="grid grid-cols-2 gap-3">
            <Field label="GST Percentage (%)">
              <input
                type="number"
                value={settings.gstPercent}
                onChange={(e) => setSettings({ ...settings, gstPercent: e.target.value })}
                className="input-field text-sm h-11"
              />
            </Field>
            <Field label="GSTIN">
              <input
                value={settings.gstNumber}
                onChange={(e) => setSettings({ ...settings, gstNumber: e.target.value })}
                className="input-field text-sm h-11 font-mono"
              />
            </Field>
          </div>
        </Section>

        {/* Security */}
        <Section id="security" icon={Shield} title="Security">
          <div className="bg-white shadow-[0_6px_24px_rgba(48,32,25,0.07)] rounded-xl p-4 border border-border space-y-2 text-sm">
            <div className="text-muted-foreground text-xs">Connected integrations</div>
            {[
              { name: "Supabase",  status: "Not configured", color: "text-red-400" },
              { name: "Razorpay",  status: "Not configured", color: "text-red-400" },
              { name: "Cloudflare R2", status: "Not configured", color: "text-red-400" },
              { name: "WhatsApp API", status: "Not configured", color: "text-red-400" },
            ].map((svc) => (
              <div key={svc.name} className="flex items-center justify-between">
                <span className="text-muted-foreground text-xs">{svc.name}</span>
                <span className={`text-xs font-semibold ${svc.color}`}>{svc.status}</span>
              </div>
            ))}
          </div>
          <p className="text-xs text-muted-foreground">
            Add your API keys to the <code className="text-primary">.env.local</code> file to enable live integrations.
          </p>
        </Section>
      </div>
    </AdminLayout>
  )
}
