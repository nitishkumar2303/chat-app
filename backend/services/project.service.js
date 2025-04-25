import projectModel from "../db/models/project.model.js";
import mongoose from "mongoose";
export const createProject = async ({ name, userId }) => {
  try {
    if (!name) {
      throw new Error("Project name is required");
    }
    if (userId.length === 0) {
      throw new Error("Atleast one user is required");
    }

    let project;
    try {
      project = await projectModel.create({
        name,
        users: [userId],
      });
      return project;
    } catch (error) {
      if (error.code === 11000 && error.keyPattern && error.keyPattern.name) {
        return { status: "exists", message: "Project name already exists" }; // Project name already exists
      }
      throw error;
    }
  } catch (error) {
    console.error("Error creating project:", error);
    throw new Error("Failed to create project");
  }
};

export const getAllProject = async ({ userId }) => {
  try {
    if (!userId) {
      throw new Error("User ID is required");
    }
    const allProjects = await projectModel.find({ users: userId }).populate("users");

    return allProjects;
  } catch (err) {
    throw new Error("Failed to fetch projects");
  }
};

export const addUserToProject = async ({ projectId, users, userId }) => {
  // ✅ Check if projectId is present
  if (!projectId) {
    throw new Error("Project ID is required");
  }

  if (!userId) {
    throw new Error("User ID is required");
  }

  if (!mongoose.Types.ObjectId.isValid(userId)) {
    throw new Error("Invalid User ID format");
  }

  // ✅ Check if projectId is a valid MongoDB ObjectId
  if (!mongoose.Types.ObjectId.isValid(projectId)) {
    throw new Error("Invalid Project ID format");
  }

  // ✅ Check if users is a valid array
  if (!Array.isArray(users) || users.length === 0) {
    throw new Error("Users must be a non-empty array");
  }

  // ✅ Validate each userId inside the array
  for (const userId of users) {
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      throw new Error(`Invalid User ID: ${userId}`);
    }
  }
  const project = await projectModel.findOne({
    _id: projectId,
    users: userId,
  });

  if (!project) {
    throw new Error("Project not found or user not authorized");
  }

  const updatedProject = await projectModel.findOneAndUpdate(
    { _id: projectId },
    { $addToSet: { users: { $each: users } } },
    { new: true }
  );

  return updatedProject;
};

export const getProjectById = async ({ projectId }) => {
  if (!projectId) {
    throw new Error("Project ID is required");
  }

  if (!mongoose.Types.ObjectId.isValid(projectId)) {
    throw new Error("Invalid Project ID format");
  }
  const project = await projectModel.findById(projectId).populate("users");
  if (!project) {
    throw new Error("Project not found");
  }
  return project; 



};
