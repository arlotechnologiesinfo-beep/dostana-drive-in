import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const body = await request.text()
    const signature = request.headers.get("x-razorpay-signature")

    // In production: Verify webhook signature
    // const crypto = require("crypto")
    // const expectedSignature = crypto
    //   .createHmac("sha256", process.env.RAZORPAY_WEBHOOK_SECRET!)
    //   .update(body)
    //   .digest("hex")
    //
    // if (expectedSignature !== signature) {
    //   return NextResponse.json({ error: "Invalid signature" }, { status: 400 })
    // }

    const event = JSON.parse(body)

    switch (event.event) {
      case "payment.captured":
        // Mark order as paid in database
        // Send WhatsApp confirmation
        console.log("Payment captured:", event.payload.payment.entity)
        break
      case "payment.failed":
        // Mark order as failed
        console.log("Payment failed:", event.payload.payment.entity)
        break
      default:
        console.log("Unhandled event:", event.event)
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    return NextResponse.json(
      { error: "Webhook processing failed" },
      { status: 500 }
    )
  }
}
