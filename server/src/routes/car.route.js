import express from "express";
import User from "../models/user.model.js";
import Car from "../models/car.model.js";
import Dealer from "../models/dealer.model.js";
import { ObjectId } from "mongodb";
import isAuthenticated from "../middlewares/auth.js";
import SoldVehicles from "../models/soldVehicles.model.js";

const carRouter = express.Router();

//route to search for a car
carRouter.get("/search", isAuthenticated, async (req, res) => {
  try {
    const searchQuery = req.query.q;
    console.log(searchQuery);
    const regexQuery = new RegExp(searchQuery, "i");
    const searchResults = await Car.find({ name: regexQuery }).toArray();
    return res
      .status(200)
      .json({ success: true, message: "Cars Found", searchResults });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ message: "Some error occured", error: error });
  }
});

// route to view all cars
carRouter.get("/", isAuthenticated, async (req, res) => {
  try {
    const data = await Car.find().toArray();
    if (!data) {
      return res.status(402).json({ message: "No data found" });
    }
    console.log(data);
    return res.status(201).json({ message: "Success", data: data });
  } catch (error) {
    return res.status(501).json({ message: "Some Error Occured" });
  }
});

// Route to add a car in a dealership
carRouter.post("/dealership", isAuthenticated, async (req, res) => {
  try {
    const dealerId = req.user.id;
    const {
      type,
      name,
      model,
      engine,
      fuelType,
      interiorColor,
      exteriorColor,
      imageURL,
      price,
    } = req.body;
    if (
      !type ||
      !name ||
      !model ||
      !engine ||
      !fuelType ||
      !interiorColor ||
      !exteriorColor ||
      !price
    ) {
      return res.status(401).json({ message: "Kindly fill all fields" });
    }
    const newCar = await Car.insertOne({
      type,
      name,
      model,
      carInfo: {
        engine,
        fuelType,
        interiorColor,
        exteriorColor,
        imageURL,
        dealerId,
        price,
        isSold: false,
      },
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    if (newCar) {
      const carId = newCar.insertedId;
      await Dealer.updateOne(
        { _id: new ObjectId(dealerId) },
        { $push: { listOfCars: carId }, $currentDate: { updatedAt: true } }
      );
      return res.status(201).json({ message: "Car Added Successfully" });
    } else {
      return res.status(401).json({ message: "Unable to Add Car Details" });
    }
  } catch (error) {
    console.log(error);
    return res.status(501).json({ message: "Some Error Occured" });
  }
});

// To view all cars in a certain dealership
carRouter.get("/dealership", isAuthenticated, async (req, res) => {
  try {
    const dealerId = req.user.id;

    const cars = await Car.find({ "carInfo.dealerId": dealerId }).toArray();

    if (!cars) {
      return res.status(401).json({ message: "Car not found" });
    }
    return res.status(201).json({ message: "Car Found", listOfCars: cars });
  } catch (error) {
    console.log(error);
    return res.status(501).json({ message: "Some Error Occured" });
  }
});

//To view a certain car details
carRouter.get("/:carId", isAuthenticated, async (req, res) => {
  const { carId } = req.params;
  try {
    const carDetails = await Car.findOne({ _id: new ObjectId(carId) });
    const dealerDetails = await Dealer.findOne({
      _id: new ObjectId(carDetails.carInfo.dealerId),
    });
    return res
      .status(201)
      .json({
        message: "Car Found",
        carDetails: carDetails,
        dealerDetails: dealerDetails,
      });
  } catch (error) {
    console.log(error);
    return res.status(501).json({ message: "Some Error Occured" });
  }
});

// Route to update a car in a dealership
carRouter.put("/:carId", isAuthenticated, async (req, res) => {
  try {
    const dealerId = req.user.id;
    const { carId } = req.params;
    const {
      type,
      name,
      model,
      engine,
      fuelType,
      interiorColor,
      exteriorColor,
      imageURL,
      price,
    } = req.body;
    if (
      !type ||
      !name ||
      !model ||
      !engine ||
      !fuelType ||
      !interiorColor ||
      !exteriorColor ||
      !price
    ) {
      return res.status(401).json({ message: "Kindly fill all fields" });
    }
    const updatedCar = await Car.updateOne(
      { _id: new ObjectId(carId) },
      {
        $set: {
          type,
          name,
          model,
          carInfo: {
            engine,
            fuelType,
            interiorColor,
            exteriorColor,
            imageURL,
            price,
            dealerId,
          },
        },
        $currentDate: { updatedAt: true },
      }
    );
    if (updatedCar) {
      return res.status(201).json({ message: "Car Updated Successfully" });
    } else {
      return res.status(401).json({ message: "Unable to Update Car Details" });
    }
  } catch (error) {
    console.log(error);
    return res.status(501).json({ message: "Some Error Occured" });
  }
});

// Route to add sold vehicle to sold, user, dealer models
carRouter.post("/dealership/sold", isAuthenticated, async (req, res) => {
  try {
    console.log(req.user.id, req.body);
    const buyerId = req.user.id;
    const { carId, dealerId } = req.body;
    if (!carId || !dealerId) {
      return res.status(401).json({ message: "Kindly fill all fields" });
    }
    const newSoldVehicle = await SoldVehicles.insertOne({
      carId,
      soldVehicleInfo: {
        buyerId,
        dealerId,
      },
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    if (newSoldVehicle) {
      await Car.updateOne(
        { _id: new ObjectId(carId) },
        { $set: { isSold: true } }
      );

      const car = await Car.findOne({ _id: new ObjectId(carId) });
      const { isSold } = car.carInfo.isSold;
      // Adds new Sold vehicle data to User Model
      await User.updateOne(
        { _id: new ObjectId(buyerId) },
        {
          $push: { boughtVehicles: newSoldVehicle.insertedId },
          $currentDate: { updatedAt: true },
        }
      );
      // Adds new Sold vehicle data to Dealer Model
      await Dealer.updateOne(
        { _id: new ObjectId(dealerId) },
        {
          $push: { soldVehicles: newSoldVehicle.insertedId },
          $currentDate: { updatedAt: true },
        }
      );
      return res
        .status(201)
        .json({
          success: true,
          message: "Congrats you bought the car",
          isSold: isSold,
        });
    } else {
      return res
        .status(401)
        .json({ success: false, message: "Unable to Sell Car" });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Some error occured" });
  }
});

//Route to get all sold vechicles by dealers
carRouter.get("/dealership/sold", isAuthenticated, async (req, res) => {
  try {
    const dealerId = req.user.id;
    const soldVehicles = await SoldVehicles.find({
      "soldVehicleInfo.dealerId": dealerId,
    }).toArray();
    console.log(soldVehicles);
    if (soldVehicles) {
      const carsPromises = soldVehicles.map(async (vehicle) => {
        return await Car.findOne({ _id: new ObjectId(vehicle.carId) });
      });
      const cars = await Promise.all(carsPromises);
      if (cars) {
        return res
          .status(200)
          .json({ success: true, message: "Sold Car Found", cars: cars });
      }
    } else {
      return res.status(400).json({ success: false, message: "No Car Found" });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Some error occured" });
  }
});

//Route to get all bought vechicles by buyers
carRouter.get("/buyer/bought", isAuthenticated, async (req, res) => {
  try {
    const userId = req.user.id;
    const soldVehicles = await SoldVehicles.find({
      "soldVehicleInfo.buyerId": userId,
    }).toArray();
    console.log(soldVehicles);
    if (soldVehicles) {
      const carsPromises = soldVehicles.map(async (vehicle) => {
        return await Car.findOne({ _id: new ObjectId(vehicle.carId) });
      });
      const cars = await Promise.all(carsPromises);
      if (cars) {
        return res
          .status(200)
          .json({ success: true, message: "Bought Car Found", cars: cars });
      }
    } else {
      return res.status(400).json({ success: false, message: "No Car Found" });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Some error occured" });
  }
});

export { carRouter };
