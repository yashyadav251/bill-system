const app = require("./app");
const cors=require("cors")
const connectDatabase = require("./config/database")
connectDatabase();
const { Server } = require("socket.io")
// import { Server } from "socket.io";
// import { createServer } from "http";
const { createServer } = require("http");
const server = createServer(app);
const io = new Server(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"],
        credentials: true,
    },
});
app.use(
    cors({
        origin: "*",
        methods: ["GET", "POST"],
        credentials: true,
    })
);
let meterdata=[];
app.get("/api/v1/getdata", (req, res) => {
    console.log("Connection received");
    io.emit("send");
    setTimeout(() => {
        // const meterdata = {/* your meter data */};
        res.json({ meterdata });
        meterdata=[];
      }, 5000);
});

io.on("connection", (socket) => {
    console.log("User Connected", socket.id);
    io.emit('activeConnections', io.engine.clientsCount);
    socket.on("message", (data) => {
        meterdata.push(data);
        console.log(data, socket.id);
    });


    socket.on("join-room", (room) => {
        socket.join(room);
        console.log(`${socket.id} joined room ${room}`);
    });
    socket.emit("welcome", "welcome to the server")

    socket.on("disconnect", () => {
        console.log("User Disconnected", socket.id);
    });
});



server.listen(process.env.PORT || 5000, () => {
    console.log("server is runing on port 5000");
})