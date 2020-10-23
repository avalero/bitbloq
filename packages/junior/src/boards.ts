import { IBoard, IPortDirection } from "@bitbloq/bloqs";

import BoardImage from "./images/hardware/zumjunior-board.svg";
import MiniBoardImage from "./images/hardware/zumjunior-mini-board.svg";
import BoardSnapshotImage from "./images/hardware/zumjunior-board.png";

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
          PinBlue: "2"
        }
      },
      {
        component: "Buzzer",
        name: "zumJuniorBuzzer",
        pins: {
          Pin: "4"
        }
      }
    ],
    code: {
      includes: ["<BQZUMJunior.h>", "<BQZUMJuniorPorts.h>"],
      globals: ["BQ::ZUMJunior zumJunior;"],
      setup: ["zumJunior.setup();"],
      defines: [
        "NOTE_C4  262",
        "NOTE_D4  294",
        "NOTE_E4  330",
        "NOTE_F4  349",
        "NOTE_G4  392",
        "NOTE_A4  440",
        "NOTE_B4  494",
        "NOTE_C5  523",
        "NOTE_D5  587",
        "NOTE_E5  659",
        "NOTE_F5  698",
        "NOTE_G5  784",
        "NOTE_A5  880",
        "NOTE_B5  988"
      ]
    },
    libraries: [
      {
        zipURL:
          "https://storage.googleapis.com/bitbloq-prod/arduino-libraries/BQZUMJunior.zip",
        precompiled: true
      },
      {
        zipURL:
          "https://storage.googleapis.com/bitbloq-prod/arduino-libraries/ArduinoEventsLib.zip",
        precompiled: true
      }
    ],
    image: {
      url: BoardImage,
      width: 300,
      height: 300,
      tablet: {
        width: 200,
        height: 200
      }
    },
    schematicCenter: {
      x: 0,
      y: -0.23
    },
    schematicImage: {
      url: MiniBoardImage,
      width: 80,
      height: 80
    },
    snapshotImage: {
      url: BoardSnapshotImage,
      width: 200,
      height: 200
    },
    ports: [
      {
        name: "1",
        position: {
          x: -1,
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
          x: -1.6,
          y: 0.8,
          tablet: {
            x: -1.95,
            y: 0.9
          }
        },
        direction: IPortDirection.West,
        schematicPosition: {
          x: -0.03,
          y: -0.17
        },
        schematicPlaceholderPosition: {
          x: -0.76,
          y: 0.22
        }
      },
      {
        name: "2",
        position: {
          x: -1,
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
          x: -1.6,
          y: -0.8,
          tablet: {
            x: -1.95,
            y: -0.9
          }
        },
        direction: IPortDirection.West,
        schematicPosition: {
          x: -0.03,
          y: -0.29
        },
        schematicPlaceholderPosition: {
          x: -0.76,
          y: -0.68
        }
      },
      {
        name: "3",
        position: {
          x: 1,
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
          x: 1.6,
          y: -0.8,
          tablet: {
            x: 1.95,
            y: -0.9
          }
        },
        direction: IPortDirection.East,
        schematicPosition: {
          x: 0.03,
          y: -0.29
        },
        schematicPlaceholderPosition: {
          x: 0.76,
          y: -0.68
        }
      },
      {
        name: "4",
        position: {
          x: 1,
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
          x: 1.6,
          y: 0.8,
          tablet: {
            x: 1.95,
            y: 0.9
          }
        },
        direction: IPortDirection.East,
        schematicPosition: {
          x: 0.03,
          y: -0.17
        },
        schematicPlaceholderPosition: {
          x: 0.76,
          y: 0.22
        }
      },
      {
        name: "A",
        position: {
          x: 0.15,
          y: 1
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
          y: 1.6,
          tablet: {
            x: 0.8,
            y: 1.95
          }
        },
        direction: IPortDirection.North,
        schematicPosition: {
          x: 0.06,
          y: -0.29
        },
        schematicPlaceholderPosition: {
          x: 0.38,
          y: 0.68
        }
      },
      {
        name: "B",
        position: {
          x: -0.15,
          y: 1
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
          y: 1.6,
          tablet: {
            x: -0.8,
            y: 1.95
          }
        },
        direction: IPortDirection.North,
        schematicPosition: {
          x: -0.06,
          y: -0.29
        },
        schematicPlaceholderPosition: {
          x: -0.38,
          y: 0.68
        }
      }
    ]
  }
];
