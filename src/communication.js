const ON_DEATH = require("death");
const zerorpc = require("zerorpc");
const path = require("path");
const { spawn } = require("child_process");

const DEFAULT_PORT = 4242;

const events = {
  "spawn-close": [(data) => console.error("spawn close", data)],
  "spawn-error": [(data) => console.error("spawn error", data)],
};

let spawnedChild;
let zerorpcClient;

function connect(port = DEFAULT_PORT) {
  return new Promise((resolve) => {
    spawnedChild = spawn("python3", ["-i", path.join(__dirname, "server.py")]);

    spawnedChild.on("close", (code, signal) => {
      fireEvent("spawn-close", { code, signal });
    });

    spawnedChild.on("error", (err) => {
      fireEvent("spawn-error", { error: err });
    });

    resolve();
  }).then(() => {
    return connectServer(port);
  });
}

function connectServer(port = DEFAULT_PORT) {
  return new Promise((resolve) => {
    zerorpcClient = new zerorpc.Client();
    zerorpcClient.connect(`tcp://127.0.0.1:${port}`);

    zerorpcClient.invoke("handshake", (error, res, more) => {
      // console.log("here", res, error);
      if (!error && res === true) {
        console.log("Connected", res);
        resolve(zerorpcClient);
      }
    });
  });
}

function send() {
  const [name, ...rest] = arguments;

  return new Promise((resolve, reject) => {
    zerorpcClient.invoke(name, ...rest, (error, res, more) => {
      if (error) {
        reject(error);
      } else {
        resolve(res);
      }
    });
  });
}

function fireEvent(evt, data) {
  if (events[evt]) {
    events[evt].forEach((cb) => cb(data));
  }
}

function off(evt, cb) {
  const idx = events[evt].indexOf(cb);

  events[evt].splice(idx, 1);
}

function on(evt, cb) {
  if (!events[evt]) {
    events[evt] = [];
  }

  events[evt].push(cb);

  return () => off(evt, cb);
}

function cleanup() {
  console.log(!!spawnedChild);

  if (spawnedChild) {
    spawnedChild.kill();
  }
}

ON_DEATH(cleanup);

module.exports = { on, off, send, connect, cleanup };
