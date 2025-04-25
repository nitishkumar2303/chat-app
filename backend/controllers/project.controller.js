import projectModel from "../db/models/project.model.js";
import userModel from "../db/models/user.model.js";
import * as projectService from "../services/project.service.js";
import { validationResult } from "express-validator";

export const createProjectController = async (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).send({ errors: errors.array() });
  }

  const { name } = req.body;
  const loggedInUser = await userModel.findOne({ email: req.user.email });
  const userId = loggedInUser._id;

  const newProject = await projectService.createProject({ name, userId });
  if (newProject.status === "exists") {
    return res.status(400).send("Project name already exists");
  }

  res.status(201).json(newProject);
};

export const getAllProjectsController = async (req, res) => {
  try {
    const loggedInUser = await userModel.findOne({ email: req.user.email });
    const allProjects = await projectService.getAllProject({
      userId: loggedInUser._id,
    });
    // console.log(allProjects);
    // Check if the user has any projects
    if (allProjects.length === 0) {
      return res.status(404).json({ message: "No projects found" });
    }
    res.status(200).json({ projects: allProjects });
    
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};

export const addUserToProjectController = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }
  try {
    const { users, projectId } = req.body;
    const loggedInUser = await userModel.findOne({ email: req.user.email });

    const project = await projectService.addUserToProject({
      projectId,
      users,
      userId: loggedInUser._id,
    });

    // console.log(project);

    return res
      .status(200)
      .json({ message: "User added to project successfully", project });
  } catch (error) {
    console.log(error);
    res.status(400).json({ error: error.message });
  }
};

export const getProjectByIdController = async (req, res) => {
  const { projectId } = req.params;
  try {
    const project = await projectService.getProjectById({ projectId });
    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }
    res.status(200).json({ project });
  } catch (error) {
    console.log(error);
    res.status(400).json({ error: error.message });
  }
};
