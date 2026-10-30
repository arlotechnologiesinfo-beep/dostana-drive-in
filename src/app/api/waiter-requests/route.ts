import { NextResponse } from "next/server"
import { createWaiterRequest, getWaiterRequests, updateWaiterRequestStatus } from "@/lib/orders-db"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { table_id, request_type } = body

    if (!table_id || !request_type) {
      return NextResponse.json({ error: "table_id and request_type are required." }, { status: 400 })
    }

    const res = createWaiterRequest(table_id, request_type)
    if (!res.success) {
      return NextResponse.json({ error: res.error, cooldown_seconds: res.cooldown_seconds }, { status: 429 })
    }

    return NextResponse.json({ success: true, request: res.request })
  } catch (error) {
    console.error("API Waiter Requests POST error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function GET() {
  try {
    const requests = getWaiterRequests()
    return NextResponse.json({ success: true, requests })
  } catch (error) {
    console.error("API Waiter Requests GET error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function PATCH(request: Request) {
  try {
    const body = await request.json()
    const { request_id, status } = body

    if (!request_id || !status) {
      return NextResponse.json({ error: "request_id and status are required." }, { status: 400 })
    }

    const updated = updateWaiterRequestStatus(request_id, status)
    if (!updated) {
      return NextResponse.json({ error: "Request not found" }, { status: 404 })
    }

    return NextResponse.json({ success: true, message: `Request ${request_id} updated to ${status}` })
  } catch (error) {
    console.error("API Waiter Requests PATCH error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
