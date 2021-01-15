const ON_DEATH = require("death");
const inquirer = require("inquirer");
const Database = require("./src/database");
const Printer = require("./src/printer");

let currentQueue = [];

Database.on("points", (points) => {
  currentQueue = [...currentQueue, ...points];
});
Database.on("point", (point) => {
  if (Printer.running()) {
    Printer.addPoint(point);
  } else {
    currentQueue = [...currentQueue, point];
  }
});

Database.on("online", (online) => {
  if (online) {
    if (currentQueue.length) {
      inquirer
        .prompt([
          {
            type: "confirm",
            name: "printExisting",
            message: `Print existing ${currentQueue.length} points`,
            default: false,
          },
        ])
        .then((answers) => {
          if (answers.printExisting) {
            currentQueue.forEach((point) => {
              Printer.addPoint(point);
            });
          }
          Printer.update();
        })
        .catch((error) => {
          if (error.isTtyError) {
            // Prompt couldn't be rendered in the current environment
          } else {
            // Something else when wrong
          }
        });
    } else {
      console.log("no existing ones");
      Printer.update();
    }
  }
});

(async function () {
  await Printer.start();
  Database.init();
  // console.log("Plotter online");
})();

ON_DEATH(() => {
  Database.cleanup();
  Printer.cleanup();
  process.exit(1);
});
