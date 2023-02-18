import http from "http";
import express from "express";
import logger from "morgan";
import cors from 'cors';

// Socket.io
import { Server } from "socket.io";
import WebSockets from "../utils/WebSockets.js";

// Middlewares
import { decode } from '../middlewares/jwt.js'

// Routes
import indexRouter from "../routes/index.js";
import userRouter from "../routes/user.js";
import chatRoomRouter from "../routes/chatRoom.js";
import deleteRouter from "../routes/delete.js";

// Mongo Connection
import "../config/mongo.js";

const app = express();
const port = process.env.PORT || "3000" || "4000";

// CORS
const corsOptions = {
  origin: '*'
};

app.use(cors(corsOptions));

app.set("port", port);
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Routes
app.use("/", indexRouter);
app.use("/users", userRouter);
app.use("/room", decode, chatRoomRouter);
app.use("/delete", deleteRouter);

/** catch 404 and forward to error handler */
app.use('*', (req, res) => {
  return res.status(404).json({
    success: false,
    message: 'API endpoint doesnt exist'
  })
});

/** Create HTTP server. */
const server = http.createServer(app);

/** Create socket connection */
const io = new Server(server);
io.on('connection', WebSockets.connection)

/** Listen on provided port, on all network interfaces. */
server.listen(port);

/** Event listener for HTTP server "listening" event. */
server.on("listening", () => {
  console.log(`Listening on port:: http://localhost:${port}/`)
});
