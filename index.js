const Plotter = require("./src/plotter");

(async function () {
  await Plotter.init();
  console.log("Plotter online");
})();
