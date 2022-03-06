import pty from "node-pty";
import readline from "readline";

process.stdin.resume();
process.stdin.setEncoding("utf8");

// const command = "docker exec -it e1b6e9746449 bash";
// const command = "bash";
// const command = "docker attach sad_perlman";
// const command = "/usr/bin/env";

const term = pty.spawn("bash", [], {
  // name: "xterm-256color",
  cols: 80,
  rows: 30,
});

term.on("data", function (data) {
  console.log(Date.now(), data);
  // process.stdout.write(data);
});


const startupCommand = 'docker-compose exec bash bash'
setTimeout(() => {
  const
  term.write("\r");
}, 1000);

const reader = readline.createInterface({
  input: process.stdin,
  output: console.log,
});
reader.on("line", (i) => {
  term.write(`${i}\r`);
});
// reader.on("close", () => {
//   console.log("disconected");
// });
