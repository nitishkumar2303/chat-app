import User from "../db/models/user.model.js"; // Importing the User model to interact with the user collection in the database
import * as userService from "../services/user.services.js"; // Importing the userService to handle user-related operations
import { validationResult } from "express-validator"; // Importing validationResult from express-validator to handle validation errors
import redisClient from "../services/redis.service.js"; // Importing the Redis client for caching

export const createUserController = async (req, res) => {
  try {
    // Extract validation errors from the request
    const errors = validationResult(req);

    // If errors exist, return a 422 status with an array of errors
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }

    // Call the service layer to create a new user with the provided data
    const user = await userService.createUser(req.body);
    // console.log(user);
    const token = user.generateJWT(); // Generate a JWT token for the user
    delete user._doc.password; // Remove the password from the user object before sending it in the response
    console.log(user);
    // Send a 201 status (Created) along with the created user data
    res.status(201).send({ user, token });
  } catch (error) {
    // Handle any unexpected server errors with a 500 status
    res.status(500).send({ error: error.message });
  }
};

export const loginUserController = async (req, res) => {
  try {
    const { email, password } = req.body;
    // console.log(email, password);
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }

    const user = await User.findOne({ email }).select("+password");

    if (!user) {
      return res.status(404).send({ message: "User not found" });
    }

    const isValid = await user.isValidPassword(password);

    if (!isValid) {
      return res.status(401).send({ message: "Invalid password" });
    }
    const token = user.generateJWT();
    delete user._doc.password; // Remove the password from the user object before sending it in the response

    res.status(200).send({ user, token });
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
};

export const profileController = async (req, res) => {
  console.log("userss:: " , req.user);
  res.status(200).send({ user: req.user });
};

export const logoutController = async (req, res) => {
  try {
    const token = req.cookies.token || req.headers.authorization.split(" ")[1];

    await redisClient.set(token, "logout", "EX", 60 * 60 * 24); // this would set the token in redis with a expiry time of 1 day
    console.log("Token blacklisted in redis");
    res.clearCookie("token");
    res.status(200).send({
      message: "Logged Out Successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(400).send({ error: error.message });
  }
};

export const getAllUsersController = async (req, res) => {
  try {
    const loggedInUser = await User.findOne({ email: req.user.email });
    const allUsers = await userService.getAllUser( loggedInUser._id );
    // console.log(allUsers);
    if (allUsers.length === 0) {
      return res.status(404).json({ message: "No users found" });
    }
    res.status(200).json({ users: allUsers });
  } catch (error) {
    console.log(error);
    res.status(400).send({ error: error.message });
  }
};
