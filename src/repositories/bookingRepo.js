const { StatusCodes } = require("http-status-codes");
const { Booking } = require("../models");
const { CrudRepo } = require("./crudRepo");
const { AppError } = require("../utils");
const { Enums } = require("../utils/common");
const { Op } = require("sequelize");
const { CANCELLED, INITIATED, CONFIRMED } = Enums.BOOKING_STATUS;

class BookingRepo extends CrudRepo {
  constructor() {
    super(Booking);
  }

  async create(data, transaction) {
    const response = await Booking.create(data, {
      transaction: transaction,
    });
    return response;
  }

  async get(data, transaction) {
    const response = await Booking.findByPk(data, {
      transaction: transaction,
    });

    if (!response) {
      throw new AppError("Cannot find the resource", StatusCodes.NOT_FOUND);
    }
    return response;
  }

  async getOldBookings(timestamp) {
    const response = await Booking.findAll({
      where: {
        createdAt: {
          [Op.lt]: timestamp,
        },
        status: INITIATED,
      },
    });
    return response;
  }

  async update(data, id, transaction) {
    const respones = await Booking.update(
      data,
      {
        where: {
          id: id,
        },
      },
      { transaction: transaction },
    );
    return respones;
  }

  async cancelOldBooking(timestamp) {
    const response = await Booking.update(
      { status: CANCELLED },
      {
        where: {
          [Op.and]: [
            {
              createdAt: {
                [Op.lt]: timestamp,
              },
            },
            {
              status: {
                [Op.ne]: CONFIRMED,
              },
            },
            {
              status: {
                [Op.ne]: CANCELLED,
              },
            },
          ],
        },
      },
    );
    return response;
  }
}
module.exports = BookingRepo;
