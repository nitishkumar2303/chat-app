import { Router } from "express";
import { body } from "express-validator"; // Importing body from express-validator for validation. // body is a middleware function that checks the request body for validation
import * as projectController from "../controllers/project.controller.js"; // Importing project controller functions
import * as authMiddleware from "../middleware/auth.middleware.js"; // Importing authentication middleware for user authentication

const router = Router();

router.post(
  "/create",
  authMiddleware.authUser,
  body("name").notEmpty().withMessage("Project name is required"), // Middleware to validate the request body
  projectController.createProjectController // Route to handle project creation
);

router.get(
  "/all",
  authMiddleware.authUser,
  projectController.getAllProjectsController
); // Route to get all projects for the authenticated user

router.put(
  "/addUser",
  authMiddleware.authUser,
  body("projectId").isString().withMessage("Project ID must be a string"),
  body("users")
    .isArray({ min: 1 })
    .withMessage("User ID must be a non-empty array")
    .bail()
    .custom((array) => array.every((id) => typeof id === "string"))
    .withMessage("Each User ID must be a string"),
  projectController.addUserToProjectController
); // Route to add a user to a project
 
router.get("/get-project/:projectId" , authMiddleware.authUser , projectController.getProjectByIdController); // Route to get a project by ID
export default router;
