import ButtonImage from "../images/button.svg";
import JoystickImage from "../images/joystick.svg";

const components = [
  {
    name: "button",
    label: "hardware.component.button",
    instanceName: "hardware.instanceName.button",
    connectors: [
      {
        name: "main",
        type: "digital",
        position: {
          x: 0,
          y: 1
        },
        direction: "south"
      }
    ],
    image: {
      url: ButtonImage,
      width: 56,
      height: 40
    }
  },
  {
    name: "joystick",
    label: "hardware.component.joystick",
    instanceName: "hardware.instanceName.joystick",
    connectors: [
      {
        name: "kvg",
        label: "KVG",
        type: "digital",
        position: {
          x: 0,
          y: -1
        }
      },
      {
        name: "xvg",
        label: "XVG",
        type: "digital",
        position: {
          x: -0.4,
          y: 1
        }
      },
      {
        name: "yvg",
        label: "YVG",
        type: "digital",
        position: {
          x: 0.4,
          y: 1
        }
      }
    ],
    image: {
      url: JoystickImage,
      width: 68,
      height: 54
    }
  }
];

export default components;
