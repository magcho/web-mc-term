import pty from "node-pty";
import readline from "readline";
import { Server } from "socket.io";
import http from "http";
import express from "express";

process.stdin.resume();
process.stdin.setEncoding("utf8");

const term = pty.spawn("bash", [], {
  name: "xterm-256color",
  cols: 80,
  rows: 24,
});

const app = express();
const server = http.createServer(app);
const socket = new Server(server);

// serve
// app.use("/xterm.js", express.static("./node_modules/xterm"));
app.use("/", express.static("/public_html"));
// app.get("/test", (req, res) => {
//   res.json({ hello: "0" });
// });

// socket
socket.on("connect", (socket) => {
  term.on("data", function (data) {
    console.log(new date.now().toLocalString("ja-JP"), data.trim());

    // process.stdout.write(data);
  });
});

// const reader = readline.createInterface({
//   input: process.stdin,
//   output: console.log,
// });
// reader.on("line", (i) => {
//   term.write(`${i}\r`);
// });
// reader.on("close", () => {
//   console.log("disconected");
// });

// init
// const startupCommand = "docker attach $(docker-compose ps -q mc)";
// term.write(`${startupCommand}\r`);

const port = process.env.PORT || 3000;
const serve = app.listen(port, () => {
  console.log(`[SERVER]${serve.address().address}:${serve.address().port}`);
});
