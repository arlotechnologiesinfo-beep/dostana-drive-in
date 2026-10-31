import { OrderToaster } from "@/components/customer/OrderToaster"

export default function TableLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <OrderToaster />
      {children}
    </>
  )
}
