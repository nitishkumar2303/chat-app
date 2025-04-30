import "dotenv/config";
import http from "http";
import app from "./app.js";
import { Server } from "socket.io";
import { socketAuth } from "./middleware/io.middleware.js";
import {generateResult} from './services/ai.service.js'

const port = process.env.PORT || 3000;

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*", // this means that we are allowing all origins to access our server
  },
}); // this means that we have attached scoket.io with http so now our server can listen to socket.io events and http events at the same time

io.use(socketAuth); // this middleware will check if the user is authenticated or not


io.on("connection", (socket) => {
  console.log("A user connected");
  console.log("room ID:", socket.project._id.toString());
  socket.roomId = socket.project._id.toString(); // this is the room id that we will use to join the room
  
  
  socket.join(socket.roomId); // join the room with the project id

  socket.on("project-message", async (data) => {
    console.log("Received message:", data);
    

    const aiInMessage = data.message.includes("@ai");

    if(aiInMessage){
      socket.broadcast.to(socket.roomId).emit("project-message", data)
      const prompt = data.message.replace("@ai" , "");
      const result= await generateResult(prompt);

      io.to(socket.roomId).emit("project-message" , {
        sender: "ai",
        message: result,
      })
      return;
    }


    
    socket.broadcast.to(socket.roomId).emit("project-message", data); // this will send the message to all the users in the project room
  });
  socket.on("event", (data) => {
    /* … */
  });
  socket.on("disconnect", () => {
    console.log("A user disconnected");
    socket.leave(socket.roomId); // leave the room when the user disconnects
    socket.broadcast.to(socket.roomId).emit("user-disconnected", socket.user); // this will send the message to all the users in the project room
    /* … */
  })
});

server.listen(port, () => {
  console.log(`server is running on port ${port}`);
});
