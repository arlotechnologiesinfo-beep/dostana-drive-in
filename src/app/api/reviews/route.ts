import { NextResponse } from "next/server"
import { addOrderReview } from "@/lib/orders-db"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { order_id, table_id, stall_id, rating, comment } = body

    if (!order_id || !table_id || !rating) {
      return NextResponse.json({ error: "order_id, table_id, and rating are required." }, { status: 400 })
    }

    if (rating < 1 || rating > 5) {
      return NextResponse.json({ error: "Rating must be between 1 and 5." }, { status: 400 })
    }

    const review = addOrderReview({ order_id, table_id, stall_id, rating, comment })
    return NextResponse.json({ success: true, review })
  } catch (error) {
    console.error("API Reviews POST error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
