import {io} from "socket.io-client";

let socketInstance = null;

export const initializeSocket = (projectId) => {
  socketInstance = io(import.meta.env.VITE_API_URL, {
    auth: {
      token: localStorage.getItem("token"),
    },
    query: {
      projectId, // Pass the project ID as a query parameterx
    },
  });

  return socketInstance;
};

export const recieveMessage = (socket, eventName, cb) => {
  if (!socket) {
    console.error("Socket is not initialized"); // Debug log
    return;
  }
  console.log(`Listening for event: ${eventName}`); // Debug log
  socket.on(eventName, cb);
};

export const sendMessage = (event, data) => {
  if (!socketInstance) {
    console.error("Socket is not initialized");
    return;
  }
  // console.log("in socket.js" +JSON.stringify(data))
  socketInstance.emit(event, data); // Ensure the event name matches the server-side listener
};


