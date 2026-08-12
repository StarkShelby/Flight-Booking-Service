const express = require("express");
const { ServerConfig, Queue } = require("./config");
const apiRoutes = require("./routes");
const { CRON } = require("./utils/common");

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api", apiRoutes);
app.use("/bookingService/api", apiRoutes);
Queue.connectionQueue();
app.listen(ServerConfig.PORT, () => {
  console.log(`Successfully started the server on PORT : ${ServerConfig.PORT}`);
  CRON();
});
