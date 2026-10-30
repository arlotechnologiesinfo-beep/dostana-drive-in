import { NextResponse } from "next/server"
import { createTransactionalOrder, getOrdersForTable, updateChildOrderStatus, type OrderStatus } from "@/lib/orders-db"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { table_id, customer_name, customer_phone, payment_method, notes, items, idempotency_key } = body

    if (!table_id || !customer_name || !customer_phone || !items || !items.length) {
      return NextResponse.json(
        { error: "Missing required fields: table_id, customer_name, customer_phone, items." },
        { status: 400 }
      )
    }

    const result = createTransactionalOrder({
      table_id,
      customer_name,
      customer_phone,
      payment_method: payment_method || "CASH_AT_TABLE",
      notes,
      items,
      idempotency_key,
    })

    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 400 })
    }

    return NextResponse.json({
      success: true,
      parent_order: result.parent_order,
      order_id: result.parent_order?.id,
      grand_total: result.parent_order?.grand_total,
      payment_status: result.parent_order?.payment_status,
    })
  } catch (error) {
    console.error("API Orders POST error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const tableId = searchParams.get("table_id")

    if (!tableId) {
      return NextResponse.json({ error: "table_id query parameter is required" }, { status: 400 })
    }

    const orders = getOrdersForTable(tableId)
    return NextResponse.json({ success: true, orders })
  } catch (error) {
    console.error("API Orders GET error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function PATCH(request: Request) {
  try {
    const body = await request.json()
    const { parent_order_id, child_order_id, status } = body as {
      parent_order_id: string
      child_order_id: string
      status: OrderStatus
    }

    if (!child_order_id || !status) {
      return NextResponse.json({ error: "child_order_id and status are required." }, { status: 400 })
    }

    const success = updateChildOrderStatus(parent_order_id, child_order_id, status)
    if (!success) {
      return NextResponse.json({ error: "Order not found or update failed." }, { status: 404 })
    }

    return NextResponse.json({ success: true, message: `Child order ${child_order_id} updated to ${status}` })
  } catch (error) {
    console.error("API Orders PATCH error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
