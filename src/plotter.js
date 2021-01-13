const ON_DEATH = require("death");
const Communication = require("./src/communication");

function init() {
  return Communication.connect();
}

function goto(x, y) {
  return Communication.send("goto", x, y);
}

function penup() {
  return Communication.send("penup");
}

function pendown() {
  return Communication.send("pendown");
}

ON_DEATH(() => {
  Communication.cleanup();
});

module.exports = { init, goto, penup, pendown };
