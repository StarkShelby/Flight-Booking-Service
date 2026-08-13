const cron = require("node-cron");
function scheduleCrons() {
  const { BookingService } = require("../../services");
  //har 20 min baad chalega
  cron.schedule("*/30 * * * *", async () => {
    console.log("Running cancel Old Booking");
    await BookingService.cancelOldBooking();
  });
}

module.exports = scheduleCrons;
