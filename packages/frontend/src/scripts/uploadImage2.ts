import path from "path";

const func = () => {
  console.log(path.join(__dirname, "src"));
};

export default func;

// self.addEventListener("message", message => {
//     console.log(2, message.data)
//     func()
// })
