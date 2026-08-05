const express = require("express");
const { BookingController } = require("../../controllers");
const router = express.Router();

router.post("/", BookingController.createBooking);
router.patch("/:id/cancel", BookingController.cancelBooking);

module.exports = router;
