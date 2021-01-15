const Communication = require("./communication");

const X_AXIS = 43;
const Y_AXIS = 29.7;

function init() {
  return Communication.connect();
}

function goto(x, y) {
  return Communication.send("goto", x * X_AXIS, y * Y_AXIS);
}

function penup() {
  return Communication.send("penup");
}

function pendown() {
  return Communication.send("pendown");
}

function cleanup() {
  console.log("comms cleanup");
  Communication.cleanup();
}

module.exports = { init, goto, penup, pendown, cleanup };
