import { Router } from "express";
import { createUserController , loginUserController ,logoutController,profileController , getAllUsersController } from "../controllers/user.controller.js";
import { body } from "express-validator"; // Importing body from express-validator for validation. // body is a middleware function that checks the request body for validation
import * as  authMiddleware from "../middleware/auth.middleware.js"; // Importing authentication middleware for user authentication
import { get } from "mongoose";

const router = Router(); // Create a new router instance

router.post("/register",
    body('email').isEmail().withMessage("Email must be a valid email"), // Middleware to validate the request body
    body('password').isLength({ min: 3 }).withMessage("Password must be at least 3 characters"), // Middleware to validate the request body
    createUserController // Route to handle user registration
); 

router.post('/login' , 
    body('email').isEmail().withMessage("Email must be a valid email"),
    body('password').isLength({ min: 3 }).withMessage("Password must be at least 3 characters"), // Middleware to validate the request body
    loginUserController // Route to handle user login
)   

router.get('/profile' , authMiddleware.authUser , profileController) // Route to handle user profile retrieval

router.get('/logout' , authMiddleware.authUser , logoutController) // Route to handle user logout

router.get('/all' , authMiddleware.authUser , getAllUsersController) // Route to handle user logout

export default router;
