import express from "express";
import cors from "cors";
import { Server } from "socket.io";

const app = express();

const PORT = process.env.PORT || 5000;

app.use(cors());

const server = app.listen(PORT, 
  () => console.log(`server is running ${PORT}`)
);

const io = new Server(server, {
  cors: {
    origin: "*",
    method: ["GET", "POST"],
  },
});

app.get("/", (_req, res) => {
      res.send("server is running");
});

io.on('connection', (socket)=>{
  socket.emit('me', socket.id);

  socket.on('disconnect', ()=>{
    socket.broadcast.emit("callended");
  });

  socket.on("calluser",({ userToCall, signalData, from, name })=>{
    io.to(userToCall).emit("calluser",{signal: signalData, from, name});
  });

  socket.on("answercall", (data)=>{
    io.to(data.to).emit("callaccepted", data.signal);
  });

});
