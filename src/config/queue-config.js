const amqlib = require("amqplib");
let connection, channel;

async function connectionQueue() {
  try {
    connection = await amqlib.connect("amqp://localhost");
    channel = await connection.createChannel();
    await channel.assertQueue("noti-queue");
  } catch (error) {
    console.log(error);
  }
}

async function sendData(data) {
  try {
    await channel.sendToQueue("noti-queue", Buffer.from(JSON.stringify(data)));
  } catch (error) {
    console.log(error);
  }
}

module.exports = {
  sendData,
  connectionQueue,
};
