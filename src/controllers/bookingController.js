const { BookingService } = require("../services");
const { StatusCodes } = require("http-status-codes");
const { SuccessResponse, ErrorResponse } = require("../utils/common");
const { makePyment } = require("../services/bookingService");

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

async function cancelBooking(req, res) {
  try {
    const reponse = await BookingService.cancelBooking(req.params.id);
    SuccessResponse.data = response;
    return res.status(StatusCodes.OK).json(SuccessResponse);
  } catch (error) {
    ErrorResponse.error = error;
    return res
      .status(error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR)
      .json(ErrorResponse);
  }
}

async function makePayment(req, res) {
  try {
    const idempotencyKey = req.headers["x-indempotency-key"];
    if (!idempotencyKey) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ message: "IdempotencyKey is missing" });
    }
    if (inMemDb[idempotencyKey]) {
      res
        .status(StatusCodes.BAD_REQUEST)
        .json({ message: "Payment already Done" });
    }
    const response = await BookingService.makePayment({
        totalCost: req.body.totalCost,
        userId:req.body.userId,
        bookingId:req.body.bookingId

    })
    inMemDb([idempotencyKey]) = idempotencyKey
    SuccessResponse.data = response;
    return res.status(StatusCodes.BAD_REQUEST).json(SuccessResponse)
  } catch (error) {
    ErrorResponse.error = error;
    return res
      .status(error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR)
      .json(ErrorResponse);
  }
}

module.exports = { createBooking, cancelBooking, makePayment };
