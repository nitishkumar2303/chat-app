import React, { useState, useEffect } from "react";
import { useUser } from "../context/user.context";
import { set } from "mongoose";
import axios from "../config/axios";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const { user } = useUser();
  const [modalOpen, setModalOpen] = useState(false);
  const [projectName, setProjectName] = useState("");
  const [projects, setProject] = useState([]);

  async function createProject(e) {
    e.preventDefault();
    setProjectName("");
    setModalOpen(false);

    try {
      const res = await axios.post("/projects/create", { name: projectName });
      console.log("Project created successfully:", res.data);
      setProject((prev) => [...prev, res.data])
    } catch (err) {
      console.error("Error creating project:", err);
    }
  }

  useEffect(() => {
    // Fetch all projects when the component mounts
    const fetchProjects = async () => {
      try {
        const response = await axios.get("/projects/all");
        setProject(response.data.projects);
      } catch (error) {
        console.error("Error fetching projects:", error);
      }
    };
    fetchProjects();
  }, []);

  const toggleModal = () => {
    setModalOpen((prev) => !prev);
  };

  const navigate = useNavigate();

 
  return (
    <div className="min-h-screen px-4 py-8 bg-gray-900 text-white flex flex-col items-center">
      <h1 className="text-3xl sm:text-4xl font-bold mb-6">
        Welcome, {user ? user.email : "Guest"}!
      </h1>

      <button
        onClick={toggleModal}
        className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-lg transition-all duration-300 shadow-md"
      >
        + Create Project
      </button>

      <div className="w-full max-w-3xl mt-8 grid gap-4">
        {projects.length === 0 ? (
          <p className="text-gray-400 text-center">No projects found.</p>
        ) : (
          projects.map((project) => (
            <div
              onClick={() => navigate('/project', { state: { project } })}
              key={project._id}
              className="bg-gray-800 hover:bg-gray-700 transition duration-300 p-5 rounded-xl shadow cursor-pointer"
            > 
              <h2 className="text-xl font-semibold">{project.name}</h2>
              <p className="text-gray-400 text-sm mt-2">
                No of Users: {project.users.length}
              </p>
              <p className="text-gray-400 text-sm mt-1">🆔 ID: {project._id}</p>
              <p className="text-gray-400 text-sm">
                📅 Created: {new Date(project.createdAt).toLocaleDateString()}
              </p>
            </div>
          ))
        )}
      </div>

      {/* Modal */}
      {modalOpen && (
        <>
          {/* Overlay */}
          <div
            className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm z-40 transition-opacity"
            onClick={toggleModal}
          ></div>

          {/* Modal Content */}
          <div className="fixed z-50 top-1/2 left-1/2 w-[90%] sm:w-[400px] transform -translate-x-1/2 -translate-y-1/2 bg-zinc-800 text-white p-6 rounded-2xl shadow-xl transition-all duration-300 border border-zinc-700">
            <h2 className="text-2xl font-bold mb-4 text-center text-white">
              Create New Project 🚀
            </h2>

            <form onSubmit={createProject}>
              <input
                value={projectName}
                onChange={(e) => setProjectName(e.target.value)}
                type="text"
                placeholder="Enter project name"
                className="w-full p-3 bg-zinc-900 text-white border border-zinc-700 rounded-lg mb-5 focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder:text-zinc-400"
                required
              />
              <div className="flex justify-between">
                <button
                  type="submit"
                  className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-lg transition-all duration-200"
                >
                  Create
                </button>
                <button
                  type="button"
                  onClick={toggleModal}
                  className="bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded-lg transition-all duration-200"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </>
      )}
    </div>
  );
};

export default Home;
