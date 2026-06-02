import { Router } from "express";

import {
  createOrderController,
  verifyPaymentController,
  myBookingsController,
  allBookingsController,
   getBookedSlotsController
} from "./mentorBooking.controller.js";

import { protectAuth } from "../../middlewares/protectAuth.js";
import { protectAdmin } from "../../middlewares/protectAdmin.js";

const router = Router();

router.post(
  "/create-order",
  protectAuth,
  createOrderController
);

router.post(
  "/verify-payment",
  protectAuth,
  verifyPaymentController
);

router.get(
  "/my-bookings",
  protectAuth,
  myBookingsController
);

router.get(
  "/all-bookings",
  protectAdmin,
  allBookingsController
);
router.get(
  "/booked-slots",
  getBookedSlotsController
);
export default router;