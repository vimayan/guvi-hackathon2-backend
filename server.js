const express = require("express");
const app = express();
const server = require("http").createServer(app);
const Io = require("socket.io")(server, { cors: { origin: "*" } });

const cors = require("cors");
const morgan = require("morgan");

//DB details
const mongoose = require("mongoose");
const { CinemaHall } = require("./model/mongooseModel");

const route = require("./route/router");

//env eniviroment variable path
require("dotenv").config({ path: "./config/.env" });

//cors origin issue
app.use(cors({ origin: "*" }));

//middleware
app.use(morgan("dev"));
app.use(express.json());

app.use("/", route);

const url = process.env.URL;

mongoose.set("strictQuery", true);

mongoose
  .connect(url)
  .then(() => {
    console.log("Connected to the database!");
  })
  .catch((err) => {
    console.log("Cannot connect to the database!", err);
    process.exit();
  });

Io.on("connect", (socket) => {
  socket.on("join", (cinemaHall, callback) => {
    callback(cinemaHall);
    socket.join(cinemaHall);

    socket.on("seatselecting", (userSelected, cinemaHall, isselectedSeat) => {
      CinemaHall.findOneAndUpdate(
        { _id: cinemaHall._id },
        { $addToSet: { "screen.seatHolded": userSelected } },
        { returnDocument: "after" }
      ).then((data) => {
        //  console.log(data)
        Io.emit("seatholded", data.screen.seatHolded);
      });

      socket.on("disconnect", () => {
        CinemaHall.findOneAndUpdate(
          { _id: cinemaHall._id },
          { $pullAll: { "screen.seatHolded": isselectedSeat } },
          { returnDocument: "after" }
        ).then((data) => {
          console.log("disconnected");
          Io.emit("seatholded", data.screen.seatHolded);
        });
      });
    });

    socket.on("seatremoving", (userSelected, cinemaHall) => {
      CinemaHall.findOneAndUpdate(
        { _id: cinemaHall._id },
        { $pull: { "screen.seatHolded": { $eq: userSelected } } },
        { returnDocument: "after" }
      ).then((data) => {
        //  console.log(data)
        Io.emit("seatholded", data.screen.seatHolded);
      });
    });
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server listening on ${PORT} `);
});
