const axios = require("axios");
const { BookingRepo } = require("../repositories");
const db = require("../models");
const { AppError } = require("../utils/index");
const { StatusCodes } = require("http-status-codes");
const { Enums } = require("../utils/common");
const { CANCELLED } = Enums.BOOKING_STATUS;
const { ServerConfig, Queue } = require("../config");
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
      const totalBilling = data.seatReserved * flightData.price;
      const bookingPayload = { ...data, totalCost: totalBilling };
      const booking = await bookingRepo.create(bookingPayload, transaction);
      //ab flight me seats update krna hai
      //axios ab flight table ko call krega aur bolega itne seats kam hue h to update kr lo...
      await axios.patch(
        `${ServerConfig.Flight_Service}/api/v1/flights/${data.flightId}/seats`,
        {
          seats: seatReserved,
        },
      );
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

async function makePayment(data) {
  try {
    const t = await db.sequelize.transaction();
    const bookingDetails = await bookingRepo.get(data.bookingId, transaction);
    if (bookingDetails.status == CANCELLED) {
      throw new AppError("The booking has expired", StatusCodes.BAD_REQUEST);
    }
    const bookingTime = new Date(bookingDetails.createdAt);
    const currentTime = new Date(Date.now());
    if (bookingTime - currentTime > 30000) {
      await cancelBooking(data.bookingid);
      throw new AppError("The booking has expired", StatusCodes.BAD_REQUEST);
    }
    if (bookingDetails.totalCost != data.totalCost) {
      throw new AppError(
        "The amount of the payment doesnt match",
        StatusCodes.BAD_REQUEST,
      );
    }

    if (bookingDetails.userId != data.userId) {
      throw new AppError("The user doesnt match", StatusCodes.BAD_REQUEST);
    }

    Queue.sendData({
      recipientEmail: "Hello@gmail.com",
      subject: "Flight booked",
      text: `Booking successfully done for the booking ${data.bookingId}`,
    });

    await transaction.commit();
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
}

module.exports = {
  createBooking,
  cancelOldBooking,
  cancelBooking,
  makePayment,
};
