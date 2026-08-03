const axios = require("axios");
const { BookingRepo } = require("../repositories");
const db = require("../models");
const { AppError } = require("../utils/index");
const { StatusCodes } = require("http-status-codes");

async function createBooking(data) {
  try {
    const t = await db.sequelize.transaction(async function BookingImp(t) {
      const flight = await axios.get(
        `http://localhost:3000/api/v1/flights/${data.flightId}`,
      );
      const flightData = flight.data.data;
      if (data.seatReserved > flightData.totalSeats) {
        throw new AppError("Seats are not available", StatusCodes.BAD_REQUEST);
      }
      console.log(flight);
      return flight.data;
    });
    return t; //transaction
  } catch (error) {
    console.log(error.message);
    if (error instanceof AppError) throw error;
    throw new AppError(error.message || StatusCodes.INTERNAL_SERVER_ERROR);
  }
}

module.exports = { createBooking };
