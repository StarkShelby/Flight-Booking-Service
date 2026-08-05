const axios = require("axios");
const { BookingRepo } = require("../repositories");
const db = require("../models");
const { AppError } = require("../utils/index");
const { StatusCodes } = require("http-status-codes");
const { Enums } = require("../utils/common");
const { CANCELLED } = Enums.BOOKING_STATUS;
const { ServerConfig } = require("../config");
const serverConfig = require("../config/server-config");
const bookingRepo = new BookingRepo();

async function createBooking(data) {
  try {
    const t = await db.sequelize.transaction(async function BookingImp(t) {
      const flight = await axios.get(
        `${ServerConfig.Flight_Service}/api/v1/flights/${data.flightId}`,
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

async function cancelOldBooking() {
  try {
    const time = new Date(Date.now() - 5 * 60 * 1000);
    const booknigs = await bookingRepo.getOldBookings(time);
    for (const booking of bookings) {
      await cancelBooking(booking.id);
    }
    return response;
  } catch (error) {
    if (error instanceof AppError) throw error;
    throw new AppError(error.message || StatusCodes.INTERNAL_SERVER_ERROR);
  }
}

async function cancelBooking(bookingId) {
  try {
    const t = await db.sequelize.transaction();
    const bookingDetails = await bookingRepo.get(bookingId, transaction);
    if (bookingDetails.status === CANCELLED) {
      await transaction.commit();
      return true;
    }

    await axios.patch(
      `${ServerConfig.Flight_Service}/api/v1/flights/${bookingDetails.flightId}/seats`,
      { seats: bookingDetails.seatReserved, dec: 0 },
    );
    await bookingDetails.update(bookingId, { status: CANCELLED }, transaction);
    await transaction.commit();
  } catch (error) {
    console.log(error.message);
    if (error instanceof AppError) throw error;
    await transaction.rollback();
    throw new AppError(error.message || StatusCodes.INTERNAL_SERVER_ERROR);
  }
}

module.exports = { createBooking, cancelOldBooking, cancelBooking };
