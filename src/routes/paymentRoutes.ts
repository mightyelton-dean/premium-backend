import { Router } from "express";
import Stripe from "stripe";
import AuthController from "../controllers/authController";

const router = Router();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2022-11-15",
});

router.post("/create-checkout-session", async (req, res) => {
  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: { name: "VIP Membership" },
            unit_amount: 1000, // $10.00
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: process.env.FRONTEND_URL + "/vip-success.html",
      cancel_url: process.env.FRONTEND_URL + "/vip-cancel.html",
    });
    res.json({ url: session.url });
  } catch (error) {
    res.status(500).json({ error: "Payment session creation failed" });
  }
});

// PayPal (redirect to PayPal payment page)
router.post("/paypal", (_req, res) => {
  // You would use the PayPal SDK here for a real integration
  res.json({ url: "https://www.paypal.com/checkoutnow?token=demo" });
});

// Paystack (redirect to Paystack payment page)
router.post("/paystack", (_req, res) => {
  // You would use the Paystack SDK or API here for a real integration
  res.json({ url: "https://paystack.com/pay/demo" });
});

// Flutterwave (redirect to Flutterwave payment page)
router.post("/flutterwave", (_req, res) => {
  // You would use the Flutterwave SDK or API here for a real integration
  res.json({ url: "https://flutterwave.com/pay/demo" });
});

// Apple Pay & Google Pay (handled by Stripe, but endpoint for clarity)
router.post("/applepay", (_req, res) => {
  res.json({ url: "https://your-stripe-applepay-url-or-instructions" });
});
router.post("/googlepay", (_req, res) => {
  res.json({ url: "https://your-stripe-googlepay-url-or-instructions" });
});

// Mobile Money (handled by Paystack/Flutterwave, but endpoint for clarity)
router.post("/mobilemoney", (_req, res) => {
  res.json({ url: "https://paystack.com/pay/demo-mobilemoney" });
});

// Bank Transfer
router.post("/banktransfer", (_req, res) => {
  res.json({
    instructions:
      "Transfer to Account Name: SportPredictPro, Bank: Example Bank, Account Number: 1234567890, SWIFT: EXAMPBANK, Reference: YourUsername",
  });
});

// Crypto
router.post("/crypto", (_req, res) => {
  res.json({
    instructions: {
      BTC: "bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh",
      ETH: "0x1234567890abcdef1234567890abcdef12345678",
      USDT: "TSJ7Jf9G2v7Gf4g7z3XoK8wQ7s3qJcYwVq",
    },
  });
});

// Western Union
router.post("/westernunion", (_req, res) => {
  res.json({
    instructions:
      "Send to Name: John Doe, Country: Nigeria, City: Lagos. After payment, send MTCN and details to support@sportpredictpro.com",
  });
});

// MoneyGram
router.post("/moneygram", (_req, res) => {
  res.json({
    instructions:
      "Send to Name: John Doe, Country: Nigeria, City: Lagos. After payment, send Reference Number and details to support@sportpredictpro.com",
  });
});

// AliPay
router.post("/alipay", (_req, res) => {
  res.json({
    instructions:
      "Scan the AliPay QR code or send to AliPay ID: sportpredictpro@alipay.com",
  });
});

// WeChat Pay
router.post("/wechatpay", (_req, res) => {
  res.json({
    instructions:
      "Scan the WeChat Pay QR code or send to WeChat ID: sportpredictpro",
  });
});

// Endpoint to activate VIP after payment (should be called by payment webhook or after verification)
router.post(
  "/activate-vip",
  AuthController.protect,
  AuthController.prototype.setVIP
);

export default router;
