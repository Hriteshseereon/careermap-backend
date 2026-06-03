import razorpay from "../../../lib/razorpay.js";
import prisma from "../../../config/db.js";
import crypto from "crypto";

export const createOrder = async (userId, planId) => {
  planId = Number(planId);
  const plan = await prisma.plans.findUnique({
    where: { id: planId },
  });

  if (!plan) throw new Error("Plan not found");

  const order = await razorpay.orders.create({
    amount: Number(plan.price) * 100, // paise
    currency: "INR",
    receipt: `receipt_${Date.now()}`,
  });

  // 🔥 store pending payment
  await prisma.payment.create({
    data: {
      userId,
      planId,
      amount: Number(plan.price),
      status: "pending",
      stripeId: order.id, // reuse field or rename
    },
  });

  return order;
};

export const verifyPayment = async (userId,body) => {
  const {
    razorpay_order_id,
    razorpay_payment_id,
    razorpay_signature,
    planId,
  } = body;

  const generatedSignature = crypto
    .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
    .update(razorpay_order_id + "|" + razorpay_payment_id)
    .digest("hex");

  if (generatedSignature !== razorpay_signature) {
    throw new Error("Payment verification failed");
  }

  // 🔥 update payment
  await prisma.payment.updateMany({
    where: { stripeId: razorpay_order_id },
    data: {
      status: "success",
    },
  });

  // get plan details
  const plan = await prisma.plans.findUnique({
    where: { id: Number(planId) },
  });

  // 🔥 create subscription
  await prisma.subscriptions.create({
    data: {
      userId: Number(userId),
      planId: Number(planId),
      startDate: new Date(),
      endDate: new Date(
        new Date().setFullYear(new Date().getFullYear() + 1)
      ),
      status: "active",
      amount: Number(plan.price),
    },
  });

  return true;
};