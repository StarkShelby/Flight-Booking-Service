const { BookingService } = require("../services");
const { StatusCodes } = require("http-status-codes");
const { SuccessResponse, ErrorResponse } = require("../utils/common");

async function createBooking(req, res) {
  try {
    const flight = await BookingService.createBooking({
      flightId: req.body.flightId,
      userId: req.body.userId,
      seatReserved: req.body.seatReserved,
    });
    SuccessResponse.data = flight;
    return res.status(StatusCodes.CREATED).json(SuccessResponse);
  } catch (error) {
    console.log(error.message);
    ErrorResponse.error = error;
    return res
      .status(error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR)
      .json(ErrorResponse);
  }
}

module.exports = { createBooking };
