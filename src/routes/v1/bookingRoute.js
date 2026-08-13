const express = require("express");
const { BookingController } = require("../../controllers");
const router = express.Router();

router.post("/", BookingController.createBooking);
router.post("/payment", BookingController.makePayment);
router.patch("/:id/cancel", BookingController.cancelBooking);

module.exports = router;
