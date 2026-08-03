const express = require("express");

const { InfoController } = require("../../controllers");
const bookingRoute = require("./bookingRoute");

const router = express.Router();

router.get("/info", InfoController.info);
router.use("/bookings", bookingRoute);

module.exports = router;
