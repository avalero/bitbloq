//const path = require("path");

const func = () => {
  console.log("función"); //path.join(__dirname, "src"));
};

self.addEventListener("message", message => {
  console.log(2, message.data);
  func();
});
