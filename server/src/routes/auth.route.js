import express from "express";
import User from "../models/user.model.js";
import Dealer from "../models/dealer.model.js";
import { hashPassword, comparePassword } from "../utilities/hashPassword.js";
import { setToken } from "../utilities/auth.js";
import isAuthenticated from "../middlewares/auth.js";
import { ObjectId } from "mongodb";

const authRouter = express.Router();

// Router to register new user
authRouter.post("/register", async (req, res) => {
  try {
    const { firstname, lastname, email, password, userType } = req.body;
    if (!firstname || !lastname || !email || !password || !userType) {
      return res.statusCode(402).json({ message: "Kindly fill the fields" });
    }
    // Registration Logic to enter buyer user
    if (userType === "buyer") {
      const user = await User.findOne({ email: email });
      if (user) {
        return res.status(401).json({ message: "User already exists" });
      } else {
        const hashedPassword = await hashPassword(password);
        const newUser = await User.insertOne({
          email,
          userInfo: {
            firstname,
            lastname,
          },
          password: hashedPassword,
          createdAt: new Date(),
          updatedAt: new Date(),
        });
        console.log(newUser);
        return res.status(200).json({ message: "User created successfully" });
      }
    }

    // Registration Logic to enter dealer user
    else if (userType === "dealer") {
      const dealer = await Dealer.findOne({ email: email });
      if (dealer) {
        return res.status(401).json({ message: "User already exists" });
      } else {
        const hashedPassword = await hashPassword(password);
        const newDealer = await Dealer.insertOne({
          email,
          dealerInfo: {
            firstname,
            lastname,
          },
          password: hashedPassword,
        });
        console.log(newDealer);
        return res.status(200).json({ message: "User created successfully" });
      }
    }

    const user = await User.findOne({ email: email });
    if (user) {
      return res.status(401).json({ message: "User already exists" });
    } else {
      const hashedPassword = await hashPassword(password);
      const newUser = await User.insertOne({
        email,
        userInfo: {
          firstname,
          lastname,
        },
        password: hashedPassword,
      });
      console.log(newUser);
      return res.status(200).json({ message: "User created successfully" });
    }
  } catch (error) {
    return res.status(500).json({ message: "Some error occured" });
  }
});

// Router to login existing user
authRouter.post("/login", async (req, res) => {
  try {
    const { email, password, userType } = req.body;
    if (!email || !password) {
      return res
        .status(400)
        .json({ success: false, message: "Email and password are required" });
    }
    let user;
    let role;
    let username;
    if (userType === "buyer") {
      user = await User.findOne({ email: email });
      role = "buyer";
    } else if (userType === "dealer") {
      user = await Dealer.findOne({ email: email });
      role = "dealer";
    }
    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid email or password" });
    }
    const isPasswordMatching = await comparePassword(password, user.password);
    if (!isPasswordMatching) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid email or password" });
    }
    if (userType === "buyer") {
      username = `${user.userInfo.firstname} ${user.userInfo.lastname}`;
    } else if (userType === "dealer") {
      username = `${user.dealerInfo.firstname} ${user.dealerInfo.lastname}`;
    }
    const token = await setToken({ id: user._id });
    return res.status(200).json({
      success: true,
      message: "User logged in successfully",
      token: token,
      role: role,
      username: username,
    });
  } catch (error) {
    console.error("Login error:", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
});

authRouter.post("/logout", isAuthenticated, async (req, res) => {
  try {
    res.setHeader("Authorization", "");
    return res.status(201).json({ message: "User Logged Out" });
  } catch (error) {
    return res.status(500).json({ message: "Some error occured" });
  }
});

authRouter.post("/change-password", isAuthenticated, async (req, res) => {
  const id = req.user.id;
  const { currentPassword, newPassword, role } = req.body;
  try {
    if (!currentPassword || !newPassword) {
      return res.status(403).json({ message: "Kindly enter all fields" });
    }
    if (role === "buyer") {
      const user = await User.findOne({ _id: new ObjectId(id) });
      if (user) {
        const isPasswordMatching = await comparePassword(
          currentPassword,
          user.password
        );
        if (isPasswordMatching) {
          await User.updateOne(
            { _id: new ObjectId(id) },
            { $set: { password: newPassword }, $currentDate: { updatedAt: true } }
          );
          return res
            .status(201)
            .json({ success: true, message: "Password changed successfully" });
        } else {
          return res
            .status(401)
            .json({ success: false, message: "Current password is incorrect" });
        }
      } else {
        return res.status(403).json({ message: "User not found" });
      }
    } else if (role === "dealer") {
      const dealer = await Dealer.findOne({ _id: new ObjectId(id) });
      if (dealer) {
        const isPasswordMatching = await comparePassword(
          currentPassword,
          dealer.password
        );
        if (isPasswordMatching) {
          await Dealer.updateOne(
            { _id: new ObjectId(id) },
            { $set: { password: newPassword }, $currentDate: { updatedAt: true } }
          );
          return res
            .status(201)
            .json({ success: true, message: "Password changed successfully" });
        } else {
          return res
            .status(401)
            .json({ success: false, message: "Current password is incorrect" });
        }
      } else {
        return res.status(403).json({ message: "User not found" });
      }
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: error });
  }
});

export { authRouter };
