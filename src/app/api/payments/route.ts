import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { order_id, amount, currency = "INR" } = body as {
      order_id: string
      amount: number
      currency?: string
    }

    if (!order_id || !amount) {
      return NextResponse.json(
        { error: "Missing required fields: order_id, amount" },
        { status: 400 }
      )
    }

    // In production: create a real Razorpay order
    // const razorpay = new Razorpay({ key_id: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID!, key_secret: process.env.RAZORPAY_KEY_SECRET! })
    // const razorpayOrder = await razorpay.orders.create({ amount: amount * 100, currency, receipt: order_id })

    const mockRazorpayOrderId = `pay_${Date.now().toString(36).toUpperCase()}`

    return NextResponse.json({
      success: true,
      razorpay_order_id: mockRazorpayOrderId,
      amount,
      currency,
      order_id,
      key_id: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID ?? "rzp_test_demo",
    })
  } catch {
    return NextResponse.json(
      { error: "Failed to create payment intent" },
      { status: 500 }
    )
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json()
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      order_id,
    } = body as {
      razorpay_order_id: string
      razorpay_payment_id: string
      razorpay_signature: string
      order_id: string
    }

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return NextResponse.json(
        { error: "Missing payment verification fields" },
        { status: 400 }
      )
    }

    // In production: verify signature using HMAC SHA-256
    // const hmac = crypto.createHmac("sha256", process.env.RAZORPAY_KEY_SECRET!)
    // hmac.update(razorpay_order_id + "|" + razorpay_payment_id)
    // const digest = hmac.digest("hex")
    // if (digest !== razorpay_signature) return NextResponse.json({ error: "Invalid signature" }, { status: 400 })

    // Mock: always succeeds in demo mode
    return NextResponse.json({
      success: true,
      message: "Payment verified",
      order_id,
      razorpay_payment_id,
      status: "CAPTURED",
    })
  } catch {
    return NextResponse.json(
      { error: "Payment verification failed" },
      { status: 500 }
    )
  }
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const orderId = searchParams.get("order_id")

  if (!orderId) {
    return NextResponse.json({ error: "order_id required" }, { status: 400 })
  }

  // In production: fetch real payment status from Razorpay / Supabase
  return NextResponse.json({
    order_id: orderId,
    status: "CAPTURED",
    amount: 0,
    message: "Connect Supabase/Razorpay to fetch real payment status",
  })
}
