const Plotter = require("./plotter");

const currentQueue = [];
let penDown = false;

const UPDATE_DELAY = 150;

let updateTimer = 0;
let isRunning = false;

function addPoint(point) {
  currentQueue.push(point);
}

function sleep(time) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve();
    }, time);
  });
}

async function update() {
  isRunning = true;
  clearTimeout(updateTimer);

  const next = () => {
    updateTimer = setTimeout(() => {
      update();
    }, UPDATE_DELAY);
  };

  // console.log(currentQueue);

  if (currentQueue.length === 0) {
    next();
    return;
  }

  const currentPoint = currentQueue.splice(0, 1).pop();

  if (!currentPoint) {
    next();
  }

  if (currentPoint.down !== penDown) {
    penDown = currentPoint.down;

    if (currentPoint.down) {
      await Plotter.pendown();
      await sleep(100);
    } else {
      await Plotter.penup();
      await sleep(100);
    }
  }

  await Plotter.goto(currentPoint.x, currentPoint.y);
  await sleep(100);

  next();
}

async function start() {
  await Plotter.init();

  return true;
}

function running() {
  return isRunning;
}

function cleanup() {
  console.log("printer cleanup");
  Plotter.cleanup();
  clearTimeout(updateTimer);
}

module.exports = { addPoint, start, cleanup, update, running };
