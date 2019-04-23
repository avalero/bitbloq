import { IBoard, IPortDirection } from "@bitbloq/bloqs";

import BoardImage from "../../images/hardware/zumjunior-board.svg";

export const boards: IBoard[] = [
  {
    name: "zumjunior",
    integrated: [
      {
        component: "DigitalRGBLED",
        name: "zumJuniorRGBLED",
        pins: {
          PinRed: "7",
          PinGreen: "8",
          PinBlue: "2",
        }
      },
      {
        component: "Buzzer",
        name: "zumJuniorBuzzer",
        pins: {
          Pin: "4",
        }
      }
    ],
    code: {
      includes: ["<BQZUMJunior.h>", "<BQZUMJuniorPorts.h>"],
      globals: ["BQ::ZUMJunior zumJunior;"],
      setup: ["zumJunior.setup();"]
    },
    image: {
      url: BoardImage,
      width: 300,
      height: 300
    },
    ports: [
      {
        name: "1",
        position: {
          x: -0.9,
          y: 0.15
        },
        connectorTypes: ["zumjunior-digital", "zumjunior-analog"],
        pins: [
          {
            name: "0",
            value: "BQ::ZUMJunior::ports[1][0]"
          },
          {
            name: "1",
            value: "BQ::ZUMJunior::ports[1][1]"
          }
        ],
        placeholderPosition: {
          x: -1.5,
          y: 0.8
        },
        direction: IPortDirection.West
      },
      {
        name: "2",
        position: {
          x: -0.9,
          y: -0.15
        },
        connectorTypes: ["zumjunior-digital", "zumjunior-analog"],
        pins: [
          {
            name: "0",
            value: "BQ::ZUMJunior::ports[2][0]"
          },
          {
            name: "1",
            value: "BQ::ZUMJunior::ports[2][1]"
          }
        ],
        placeholderPosition: {
          x: -1.5,
          y: -0.8
        },
        direction: IPortDirection.West
      },
      {
        name: "3",
        position: {
          x: 0.9,
          y: -0.15
        },
        connectorTypes: ["zumjunior-digital", "zumjunior-analog"],
        pins: [
          {
            name: "0",
            value: "BQ::ZUMJunior::ports[3][0]"
          },
          {
            name: "1",
            value: "BQ::ZUMJunior::ports[3][1]"
          }
        ],
        placeholderPosition: {
          x: 1.5,
          y: -0.8
        },
        direction: IPortDirection.East
      },
      {
        name: "4",
        position: {
          x: 0.9,
          y: 0.15
        },
        connectorTypes: ["zumjunior-digital", "zumjunior-analog"],
        pins: [
          {
            name: "0",
            value: "BQ::ZUMJunior::ports[4][0]"
          },
          {
            name: "1",
            value: "BQ::ZUMJunior::ports[4][1]"
          }
        ],
        placeholderPosition: {
          x: 1.5,
          y: 0.8
        },
        direction: IPortDirection.East
      },
      {
        name: "A",
        position: {
          x: 0.15,
          y: 0.9
        },
        connectorTypes: [
          "zumjunior-digital",
          "zumjunior-analog",
          "zumjunior-i2c"
        ],
        pins: [
          {
            name: "0",
            value: "BQ::ZUMJunior::ports[A][0]"
          },
          {
            name: "1",
            value: "BQ::ZUMJunior::ports[A][1]"
          },
          {
            name: "i2c",
            value: "BQ::ZUMJunior::i2cPorts[A]"
          }
        ],
        placeholderPosition: {
          x: 0.8,
          y: 1.5
        },
        direction: IPortDirection.North
      },
      {
        name: "B",
        position: {
          x: -0.15,
          y: 0.9
        },
        connectorTypes: [
          "zumjunior-digital",
          "zumjunior-analog",
          "zumjunior-i2c"
        ],
        pins: [
          {
            name: "0",
            value: "BQ::ZUMJunior::ports[B][0]"
          },
          {
            name: "1",
            value: "BQ::ZUMJunior::ports[B][1]"
          },
          {
            name: "i2c",
            value: "BQ::ZUMJunior::i2cPorts[B]"
          }
        ],
        placeholderPosition: {
          x: -0.8,
          y: 1.5
        },
        direction: IPortDirection.North
      }
    ]
  }
];
