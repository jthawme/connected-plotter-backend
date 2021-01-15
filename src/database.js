const ON_DEATH = require("death");
const firebase = require("firebase");

const firebaseConfig = {
  apiKey: "AIzaSyBGMughqvwtMBKu39kciG0et9iWJWmibT0",
  authDomain: "connected-pen-plotter.firebaseapp.com",
  projectId: "connected-pen-plotter",
  storageBucket: "connected-pen-plotter.appspot.com",
  messagingSenderId: "1081608808507",
  appId: "1:1081608808507:web:0b6fe0e82e1ffc089f941e",
};
const app = firebase.initializeApp(firebaseConfig);
const database = app.database(
  "https://connected-pen-plotter-default-rtdb.europe-west1.firebasedatabase.app/"
);

const POINTS_REF = "points";
const INFO_REF = "info";

const infoRef = database.ref(INFO_REF);
const pointsRef = database.ref(POINTS_REF);

const penDownRef = infoRef.child("pen_down");
const onlineRef = infoRef.child("online");

const events = {
  points: [],
  point: [],
  "pen-down": [],
  online: [],
};

function fire(name, value) {
  events[name].forEach((cb) => cb(value));
}

function on(evt, cb) {
  events[evt].push(cb);
}

function init() {
  onlineRef.onDisconnect().set(false);

  pointsRef.once("value", (snapshot) => {
    if (snapshot && snapshot.val()) {
      fire("points", Object.values(snapshot.val()));
    }

    let initial = false;
    pointsRef.limitToLast(1).on("child_added", (snapshot) => {
      if (initial) {
        fire("point", snapshot.val());
      } else {
        initial = true;
      }
    });

    penDownRef.on("value", (snapshot) => {
      fire("pen-down", snapshot.val());
    });

    onlineRef.on("value", (snapshot) => {
      fire("online", snapshot.val());
    });

    // Debounce the online just a little
    setTimeout(() => {
      onlineRef.set(true);
    }, 500);
  });
}

function cleanup() {
  // onlineRef.set(false);
  // database.goOffline();
  // app.delete();
}

module.exports = {
  database,
  on,
  init,
  cleanup,
};
