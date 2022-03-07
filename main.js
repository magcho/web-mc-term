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
  console.info("[REMOTE CONNECTED]");
  const initMessage = `
マインクラフトのサーバー権限のターミナル\r
破壊的操作ができるので注意\r
\r
ctrl-c, ctrl-d, ctrl-p, ctrl-q, ctrl-zが動作しないようになっています\r
`;
  socket.emit("data", initMessage);
  term.write("\r");

  term.on("data", function (data) {
    socket.emit("data", data);
  });
  socket.on("data", (data) => {
    // console.log({ data, code: data.charCodeAt(0) });
    const asciiCodeBlackList = [
      "\x03", // ctrl-c
      "\x04", // ctrl-d
      "\x10", // ctrl-p
      "\x11", // ctrl-q
      "\x1A", // ctrl-z
    ];
    if (asciiCodeBlackList.includes(data)) return;

    term.write(data);
  });
  socket.on("disconnect", () => {
    console.info("[REMOTE DISCONNECTED]");
  });
});

// init
const startupCommand = "docker attach $(docker-compose ps -q mc)";
// setTimeout(() => {
term.write(`${startupCommand}\r`);
// }, 1000);

const port = process.env.PORT || 3000;
const serve = server.listen(port, () => {
  console.log(`[SERVER]${serve.address().address}:${serve.address().port}`);
});
