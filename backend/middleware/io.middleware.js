import jwt from "jsonwebtoken"; // Import the jwt library
import mongoose from "mongoose";
import projectModel from "../db/models/project.model.js";

export const socketAuth = async (socket, next) => {
  try {
    const token =
      socket.handshake.auth.token ||
      socket.handshake.headers.authorization?.split(" ")[1]; // Extract the token from the socket handshake 

    const projectid = socket.handshake.query.projectId; // Extract the project ID from the socket handshake query
    if (!mongoose.Types.ObjectId.isValid(projectid)) {
      throw new Error("Invalid Project ID"); // If project ID is not a valid mongoose ObjectId, throw an error
    }

    socket.project = await projectModel.findById(projectid); // Find the project by ID and attach it to the socket object

    if (!token) {
      throw new Error("Unauthorized User"); // If no token, throw an error
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET); // Verify the token using the secret key

    if (!decoded) {
      throw new Error("Unauthorized User"); // If token is invalid, throw an error
    }

    socket.user = decoded; // Attach the token to the socket object
    next(); // Call the next middleware
  } catch (error) {
    next(error); // Pass the error to the next middleware
  }
};
