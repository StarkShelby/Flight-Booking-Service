const { StatusCodes } = require("http-status-codes");
const { Booking } = require("../models");
const { CrudRepo } = require("./crudRepo");

class BookingRepo extends CrudRepo {
  constructor() {
    super(Booking);
  }
}
module.exports = { BookingRepo };
