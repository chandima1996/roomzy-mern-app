import express from "express";
// Add stripeWebhook to the list of imports here
import {
  createPaymentIntent,
  stripeWebhook,
} from "../controllers/paymentController.js";
import { clerkAuth } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/create-payment-intent", clerkAuth, createPaymentIntent);
router.post(
  "/webhook",
  express.raw({ type: "application/json" }),
  stripeWebhook
);

export default router;
