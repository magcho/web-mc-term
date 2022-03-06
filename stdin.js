import pty from "node-pty";
import { Server } from "socket.io";
import http from "http";
import express from "express";

const term = pty.spawn("bash", [], {
  name: "xterm-256color",
  cols: 80,
  rows: 24,
});

const app = express();
const server = http.createServer(app);
const socket = new Server(server);

// serve
app.use("/xterm.js", express.static("./node_modules/xterm"));
app.use("/", express.static("public_html"));

// socket
socket.on("connection", (socket) => {
  console.log("socket.io connected");
  term.on("data", function (data) {
    socket.emit("data", data);
  });
  socket.on("data", (data) => term.write(data));
});

// init
const startupCommand = "docker attach $(docker-compose ps -q bash)";
setTimeout(() => {
  term.write(`${startupCommand}\r`);
}, 1000);

const port = process.env.PORT || 3000;
const serve = server.listen(port, () => {
  console.log(`[SERVER]${serve.address().address}:${serve.address().port}`);
});
