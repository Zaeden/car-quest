import express from "express";
import cors from "cors";
import "dotenv/config";
import { connectDB, db } from "./db/index.js";
import { authRouter } from "./routes/auth.route.js";
import { carRouter } from "./routes/car.route.js";
import { dealRouter } from "./routes/deal.route.js";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    origin: "https://car-quest-044u.onrender.com",
    credentials: true,
  })
);

app.use("/api/auth", authRouter);
app.use("/api/car", carRouter);
app.use("/api/deals", dealRouter);

connectDB()
  .then((response) => {
    app.listen(PORT, (err) => {
      if (err) {
        console.log(`${err}`);
      }
      console.log(`${response}`);
      console.log(`Server running at Port No: ${PORT}`);
    });
  })
  .catch((error) => {
    console.log(`${error}`);
  });
