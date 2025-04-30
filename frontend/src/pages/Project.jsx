import React, { useState, useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import axios from "../config/axios.js";
import {
  initializeSocket,
  recieveMessage,
  sendMessage,
} from "../config/socket.js";

import { useUser } from "../context/user.context.jsx";
import Markdown from "markdown-to-jsx";
import { use } from "react";

const Project = () => {
  const location = useLocation();
  const project = location.state?.project;
  // console.log(project);
  // console.log(project._id);

  const [sidePanel, setSidePanel] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [projectUsers, setProjectUsers] = useState(project.users || []);
  const [message, setMessage] = useState("");
  const { user, updateUser } = useUser();
  const [messages, setMessages] = useState([]); // State to store messages
  // console.log(user)

  function SyntaxHighlightedCode(props) {
    const ref = useRef(null);

    useEffect(() => {
      if (ref.current && props.className?.includes("lang-") && window.hljs) {
        window.hljs.highlightElement(ref.current);

        ref.current.removeAttribute("data-highlighted");
      }
    }, [props.className, props.children]);

    return <code {...props} ref={ref} />;
  }

  const toggleUserSelection = (user) => {
    setSelectedUsers((prev) => {
      const isSelected = prev.find((u) => u.email === user.email);
      if (isSelected) {
        return prev.filter((u) => u.email !== user.email);
      } else {
        return [...prev, user];
      }
    });
  };

  const handleAddSelectedUsers = () => {
    selectedUsers.forEach((user) => {
      handleAddUser(user);
    });

    setSelectedUsers([]); // Clear selected users after adding
    setShowModal(false); // Close the modal after adding users
  };

  const handleAddUser = (user) => {
    // console.log("This is before user being added:");
    axios.put("projects/addUser", {
      projectId: project._id,
      users: [user._id],
    });
    setProjectUsers((prev) => {
      if (!prev.some((u) => u._id === user._id)) {
        return [...prev, user];
      }
      return prev;
    });
    // console.log("User added successfully")
    setSearchQuery(""); // Clear the search query after adding a user
    setFilteredUsers(users); // Reset the filtered users list
  };

  const send = (e) => {
    if (e.key === "Enter") {
      sendMessage("project-message", {
        message,
        sender: user.email,
      });
      appendOutgoingMessage();
      setMessage("");
      return;
    }

    // console.log(JSON.stringify(user));
    // console.log(user._id);
    sendMessage("project-message", {
      message,
      sender: user.email,
    });
    appendOutgoingMessage();
    setMessage("");
  };

  const handleInputChange = (e) => {
    setMessage(e.target.value);
  };

  const [users, setUser] = useState([]);

  const messageBox = useRef(null); // Use useRef instead of createRef

  function appendIncomingMessage(data) {
    setMessages((prevMessages) => [
      ...prevMessages,
      { type: "incoming", sender: data.sender, message: data.message },
    ]);
  }

  function appendOutgoingMessage() {
    setMessages((prevMessages) => [
      ...prevMessages,
      { type: "outgoing", sender: user.email, message },
    ]);
  }

  useEffect(() => {
    // Initialize socket connection
    const socket = initializeSocket(project._id);
    console.log("Setting up receiveMessage for project-message");
    recieveMessage(socket, "project-message", (data) => {
      console.log("Received message:", data);
      appendIncomingMessage(data);
      // Handle incoming messages here
    });

    axios
      .get("/users/all")
      .then((res) => {
        // console.log(res.data);
        setUser(res.data.users);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  // Filter users based on search query
  useEffect(() => {
    setFilteredUsers(
      users.filter((user) =>
        user.email.toLowerCase().includes(searchQuery.toLowerCase())
      )
    );
  }, [searchQuery, users]);

  const toggleSidePannel = () => {
    setSidePanel((prev) => !prev);
  };

  return (
    <main className="h-screen w-screen flex bg-gray-900 text-white">
      <section className="left relative h-full min-w-75 max-w-95 bg-gray-800 flex flex-col justify-between">
        {/* This part contains header and modal */}

        <header className="flex justify-end p-2 px-4 w-full bg-gray-700">
          <button onClick={toggleSidePannel} className="cursor-pointer">
            <i className="ri-group-line"></i>
          </button>

          {/* Modal Trigger */}
          <button
            onClick={() => setShowModal(true)}
            className="cursor-pointer px-2"
          >
            <i className="ri-user-add-line"></i>
          </button>

          {/* /* Modal for adding user */}
          {showModal && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
              <div className="bg-gray-800 p-6 rounded-lg w-[90%] max-w-md">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-lg font-semibold text-white">
                    Add Users
                  </h2>
                  <button
                    onClick={() => setShowModal(false)}
                    className="text-white text-2xl hover:text-red-400 transition"
                  >
                    <i className="ri-close-fill" />
                  </button>
                </div>

                <input
                  type="text"
                  placeholder="Search by email"
                  className="w-full p-2 mb-4 bg-gray-900 text-white placeholder-gray-400 rounded focus:outline-none focus:ring-2 focus:ring-blue-600"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />

                <div className="user-list max-h-60 overflow-y-auto scrollbar-hide mb-4">
                  {filteredUsers
                    .filter(
                      (user) =>
                        !projectUsers.some(
                          (projectUser) => projectUser._id === user._id
                        )
                    )
                    .map((user) => (
                      <div
                        key={user._id}
                        className="user-box bg-gray-700 text-sm w-full h-10 flex items-center p-3 rounded-lg gap-2 mb-2"
                      >
                        <img
                          className="w-6 h-6 rounded-full object-cover"
                          src="https://api.dicebear.com/7.x/adventurer-neutral/svg?seed=mail@ashallendesign.co.uk"
                        />
                        <span className="flex-grow text-white">
                          {user.email}
                        </span>
                        <input
                          type="checkbox"
                          checked={selectedUsers.some(
                            (u) => u.email === user.email
                          )}
                          onChange={() => toggleUserSelection(user)}
                          className="accent-blue-600"
                        />
                      </div>
                    ))}
                </div>

                <button
                  onClick={handleAddSelectedUsers}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded w-full transition"
                  disabled={selectedUsers.length === 0}
                >
                  Add Selected Users
                </button>
              </div>
            </div>
          )}
          {/* End of modal */}
        </header>

        {/* end of part that contains header and modal */}

        {/* This part contains text messages */}
        <div
          ref={messageBox}
          className="conversation overflow-y-auto scrollbar-hide flex flex-col flex-1 gap-2"
        >
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`${
                msg.type === "incoming" ? "incomming" : "outgoing"
              } message flex flex-col gap-1 ${
                msg.type === "incoming" ? "bg-gray-900" : "bg-gray-600"
              } rounded-xl p-2 m-2 ${
                msg.type === "outgoing" ? "ml-auto" : ""
              } w-[75%]
              ${msg.sender === "ai" ? "w-[94%] mr-2 " : "max-w-[80%]"}`}
            >

              
              <small className="opacity-40 text-xs">{msg.sender}</small>
              {msg.sender === "ai" ? (
                <div className="bg-blue-700 p-2 text-xs rounded-lg overflow-x-auto ">
                  <Markdown
                    children={msg.message}
                    options={{
                      overrides: {
                        code: SyntaxHighlightedCode,
                      },
                    }}
                  />
                </div>
              ) : (
                <p className="text-xs">{msg.message}</p>
              )}
            </div>
          ))}
        </div>
        {/* end of conversation that contains incoming and outgoing messages */}

        {/* This part contains input field to send message */}
        <div className="message-box bg-gray-800">
          <div className="input-field flex justify-between items-center">
            <input
              value={message}
              onChange={handleInputChange}
              className="border-none focus:outline-none focus:ring-0 flex-grow bg-gray-900 text-white placeholder-gray-400 p-2"
              type="text"
              placeholder="Message"
            ></input>
            <button
              onClick={send}
              className="bg-blue-600 hover:bg-blue-700 text-white p-2"
            >
              <i className="ri-send-plane-fill"></i>
            </button>
          </div>
        </div>
        {/* end of input field to send message */}

        {/* this is side pannel */}
        <div
          className={`sidePannel w-full h-full bg-gray-900 absolute transition-all duration-300 ease-in-out ${
            sidePanel ? "left-0" : "left-[-100%]"
          } top-0`}
        >
          <div className="bg-gray-800 p-1 flex justify-between">
            <h1 className=" flex  items-center px-3">Collaborators</h1>
            <button
              className="text-white text-2xl hover:text-red-400 transition"
              onClick={() => setSidePanel(false)}
            >
              <i className="ri-close-fill" />
            </button>
          </div>

          <div className="user flex max-h-[90vh] flex-col gap-3 mt-3 overflow-y-auto scrollbar-hide ">
            {projectUsers.map((user) => {
              return (
                <div
                  key={user._id}
                  className="user-box bg-gray-800  text-sm w-[85%] h-10 flex items-center p-3.5 rounded-2xl gap-1"
                >
                  <img
                    className="w-6 h-6 rounded-full object-cover"
                    src="https://api.dicebear.com/7.x/adventurer-neutral/svg?seed=mail@ashallendesign.co.uk"
                  />
                  {user.email}
                </div>
              );
            })}
          </div>
        </div>
        {/* end of side pannel */}
      </section>
    </main>
  );
};

export default Project;
