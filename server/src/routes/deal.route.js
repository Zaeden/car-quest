import express from "express";
import Car from "../models/car.model.js";
import Dealer from "../models/dealer.model.js";
import Deal from "../models/deal.model.js";
import { ObjectId } from "mongodb";
import isAuthenticated from "../middlewares/auth.js";

const dealRouter = express.Router();

dealRouter.post("/", isAuthenticated, async (req, res) => {
  try {
    const dealerId = req.user.id;
    const { dealTitle, dealDescription, dealDiscount, carId } = req.body;
    if ((!dealTitle || !dealDescription, !dealDiscount)) {
      return res.status(401).json({ message: "Kindly fill all fields" });
    }
    const newDeal = await Deal.insertOne({
      carId: carId,
      dealInfo: {
        dealTitle,
        dealDescription,
        dealDiscount,
      },
    });
    if (newDeal) {
      await Dealer.updateOne(
        { _id: new ObjectId(dealerId) },
        { $push: { listOfDeals: newDeal.insertedId } }
      );
      return res.status(201).json({ message: "New Deal Added Successfully" });
    }
  } catch (error) {
    console.log(error);
    return res.status(501).json({ message: "Some Error Occured" });
  }
});

export { dealRouter };
