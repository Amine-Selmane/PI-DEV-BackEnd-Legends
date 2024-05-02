const { Server } = require("socket.io");
const http = require("http");

const httpServer = http.createServer();
const io = new Server(httpServer, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
    allowedHeaders: ["my-custom-header"],
    credentials: true
  }
});

let activeUsers = [];

io.on("connection", (socket) => {
  // add new User
  socket.on("new-user-add", (newUserId) => {
    // if user is not added previously
    if (!activeUsers.some((user) => user.userId === newUserId)) {
      activeUsers.push({ userId: newUserId, socketId: socket.id });
      console.log("New User Connected", activeUsers);
    }
    // send all active users to new user
    io.emit("get-users", activeUsers);
  });

  

  // initiate a video call to a specific user
  socket.on("call-user", ({ callerId, receiverId, signal }) => {
    const receiverUser = activeUsers.find((user) => user.userId === receiverId);
    if (receiverUser) {
      io.to(receiverUser.socketId).emit("incoming-call", { callerId, signal });
    } else {
      console.log("Receiver user not found");
    }
  });

  // answer a video call
  socket.on("answer-call", ({ callerId, signal }) => {
    const callerUser = activeUsers.find((user) => user.userId === callerId);
    if (callerUser) {
      io.to(callerUser.socketId).emit("call-accepted", signal);
    } else {
      console.log("Caller user not found");
    }
  });

  socket.on("disconnect", () => {
    // remove user from active users
    activeUsers = activeUsers.filter((user) => user.socketId !== socket.id);
    console.log("User Disconnected", activeUsers);
    // send all active users to all users
    io.emit("get-users", activeUsers);
  });
});

httpServer.listen(8801, () => {
  console.log('Server is running on port 8801');
});
