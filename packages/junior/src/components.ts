import { IComponent, ConnectorPinMode } from "@bitbloq/bloqs";

import SevenSegmentImage from "./images/hardware/zumjunior-7segment.svg";
import SevenSegmentSnapshotImage from "./images/hardware/zumjunior-7segment.png";
import ButtonImage from "./images/hardware/zumjunior-button.svg";
import ButtonSnapshotImage from "./images/hardware/zumjunior-button.png";
import DoubleLedImage from "./images/hardware/zumjunior-double-led.svg";
import DoubleLedSnapshotImage from "./images/hardware/zumjunior-double-led.png";
import MiniservoImage from "./images/hardware/zumjunior-miniservo.svg";
import MiniservoSnapshotImage from "./images/hardware/zumjunior-miniservo.png";
import SensorsImage from "./images/hardware/zumjunior-sensors.svg";
import SensorsSnapshotImage from "./images/hardware/zumjunior-sensors.png";
import ServoImage from "./images/hardware/zumjunior-servo.svg";
import ServoSnapshotImage from "./images/hardware/zumjunior-servo.png";
import SliderImage from "./images/hardware/zumjunior-slider.svg";
import SliderSnapshotImage from "./images/hardware/zumjunior-slider.png";
import BuzzerImage from "./images/hardware/buzzer.svg";
import RGBLedImage from "./images/hardware/RGBled.svg";

export const components: Array<Partial<IComponent>> = [
  {
    name: "Component",
    code: {
      globals: [
        `{% for pin in pinsInfo %}
        uint8_t {{pin.pinVarName}} = {{pin.pinNumber}} ;
        {% endfor %}`
      ]
    }
  },
  {
    name: "Digital",
    extends: "Component"
  },
  {
    name: "DigitalInput",
    extends: "Digital",
    code: {
      setup: [
        `{% for pin in pinsInfo %}
        pinMode({{pin.pinVarName}},INPUT);
        {% endfor %}`
      ]
    }
  },
  {
    name: "DigitalOutput",
    extends: "Digital",
    code: {
      setup: [
        `{% for pin in pinsInfo %}
        pinMode({{pin.pinVarName}},OUTPUT);
        {% endfor %}`
      ]
    }
  },
  {
    name: "Button",
    extends: "DigitalInput"
  },
  {
    name: "Led",
    extends: "DigitalOutput"
  },
  {
    name: "Buzzer",
    extends: "Component",
    code: {
      setup: [
        `{% for pin in pinsInfo %}
        pinMode({{pin.pinVarName}},OUTPUT);
        {% endfor %}`
      ]
    },
    instanceName: "bloq-buzzer-instance-name",
    connectors: [
      {
        name: "main",
        type: "digital",
        position: {
          x: -0.4,
          y: -1
        },
        pins: [
          {
            name: "Pin",
            mode: ConnectorPinMode.OUTPUT
          }
        ]
      }
    ],
    image: {
      url: BuzzerImage,
      width: 124,
      height: 124
    }
  },
  {
    name: "Servo",
    extends: "Component",
    code: {
      includes: ["<Servo.h>"],
      globals: [
        `{% for pin in pinsInfo %}
        Servo {{pin.pinVarName}}Obj;
        {% endfor %}`
      ],
      setup: [
        `{% for pin in pinsInfo %}
        {{pin.pinVarName}}Obj.attach({{pin.pinVarName}});
        {% endfor %}`
      ]
    }
  },
  {
    name: "ContRotServo",
    extends: "Component",
    code: {
      includes: ["<Servo.h>"],
      globals: [
        `{% for pin in pinsInfo %}
        Servo {{pin.pinVarName}}Obj;
        {% endfor %}`
      ],
      setup: [
        `{% for pin in pinsInfo %}
        {{pin.pinVarName}}Obj.attach({{pin.pinVarName}});
        {{pin.pinVarName}}Obj.write(90);
        {% endfor %}`
      ]
    }
  },
  {
    name: "ZumjuniorServo",
    label: "hardware.component.cont-rot-servo",
    extends: "ContRotServo",
    instanceName: "bloq-controt-servo-instance-name",
    connectors: [
      {
        name: "main",
        type: "zumjunior-digital",
        position: {
          x: -0.4,
          y: -1
        },
        pins: [
          {
            name: "Pin",
            mode: ConnectorPinMode.OUTPUT,
            portPin: "0"
          }
        ]
      }
    ],
    image: {
      url: ServoImage,
      width: 80,
      height: 80
    },
    snapshotImage: {
      url: ServoSnapshotImage,
      width: 80,
      height: 80
    },
    libraries: [
      {
        zipURL:
          "https://storage.googleapis.com/bitbloq-prod/arduino-libraries/Servo.zip",
        precompiled: true
      }
    ]
  },
  {
    name: "DigitalRGBLED",
    extends: "Component",
    code: {
      setup: [
        `{% for pin in pinsInfo %}
        pinMode({{pin.pinVarName}},OUTPUT);
        analogWrite({{pin.pinVarName}},255);
        {% endfor %}`
      ]
    },
    instanceName: "bloq-digitalrgbled-instance-name",
    connectors: [
      {
        name: "main",
        type: "digital",
        position: {
          x: -0.4,
          y: -1
        },
        pins: [
          {
            name: "PinRed",
            mode: ConnectorPinMode.OUTPUT
          },
          {
            name: "PinGreen",
            mode: ConnectorPinMode.OUTPUT
          },
          {
            name: "PinBlue",
            mode: ConnectorPinMode.OUTPUT
          }
        ]
      }
    ],
    image: {
      url: RGBLedImage,
      width: 124,
      height: 124
    }
  },
  {
    name: "ZumjuniorButton",
    label: "hardware.component.button",
    extends: "Button",
    instanceName: "bloq-button-instance-name",
    connectors: [
      {
        name: "main",
        type: "zumjunior-digital",
        position: {
          x: -0.4,
          y: -1
        },
        pins: [
          {
            name: "Pin",
            mode: ConnectorPinMode.INPUT,
            portPin: "0"
          }
        ]
      }
    ],
    image: {
      url: ButtonImage,
      width: 80,
      height: 80
    },
    snapshotImage: {
      url: ButtonSnapshotImage,
      width: 80,
      height: 80
    }
  },
  {
    name: "ZumjuniorDoubleLed",
    label: "hardware.component.double-led",
    extends: "Led",
    instanceName: "bloq-led-instance-name",
    code: {
      setup: [
        `{% for pin in pinsInfo %}
        digitalWrite({{pin.pinVarName}},HIGH);
        {% endfor %}`
      ]
    },
    connectors: [
      {
        name: "main",
        type: "zumjunior-digital",
        position: {
          x: 0.28,
          y: 1
        },
        pins: [
          {
            name: "WhitePin",
            mode: ConnectorPinMode.OUTPUT,
            portPin: "0"
          },
          {
            name: "ColorPin",
            mode: ConnectorPinMode.OUTPUT,
            portPin: "1"
          }
        ]
      }
    ],
    image: {
      url: DoubleLedImage,
      width: 80,
      height: 80
    },
    snapshotImage: {
      url: DoubleLedSnapshotImage,
      width: 80,
      height: 80
    }
  },
  {
    name: "ZumjuniorDoubleSwitch",
    label: "hardware.component.double-switch",
    extends: "DigitalInput",
    instanceName: "bloq-switch-instance-name",
    connectors: [
      {
        name: "main",
        type: "zumjunior-digital",
        position: {
          x: 0.28,
          y: 1
        },
        pins: [
          {
            name: "Pin0",
            mode: ConnectorPinMode.INPUT,
            portPin: "1"
          },
          {
            name: "Pin1",
            mode: ConnectorPinMode.INPUT,
            portPin: "0"
          }
        ]
      }
    ],
    image: {
      url: SliderImage,
      width: 80,
      height: 80
    },
    snapshotImage: {
      url: SliderSnapshotImage,
      width: 80,
      height: 80
    }
  },
  {
    name: "I2C",
    extends: "Component"
  },
  {
    name: "ZumjuniorSevenSegment",
    label: "hardware.component.seven-segment",
    extends: "I2C",
    instanceName: "bloq-seven-segment-instance-name",
    connectors: [
      {
        name: "main",
        type: "zumjunior-i2c",
        position: {
          x: 0.28,
          y: 1
        },
        pins: [
          {
            name: "i2c",
            mode: ConnectorPinMode.I2C,
            portPin: "i2c"
          }
        ]
      }
    ],
    image: {
      url: SevenSegmentImage,
      width: 80,
      height: 80
    },
    snapshotImage: {
      url: SevenSegmentSnapshotImage,
      width: 80,
      height: 80
    },
    code: {
      includes: ["<BQZUMI2C7SegmentDisplay.h>"],
      globals: [
        `{% for pin in pinsInfo %}
        BQ::ZUM::I2C7SegmentDisplay {{pin.pinVarName}}Obj({{pin.pinVarName}});
        {% endfor %}`
      ],
      setup: [
        `{% for pin in pinsInfo %}
        {{pin.pinVarName}}Obj.setup();
        {{pin.pinVarName}}Obj.displayInt(0);
        {% endfor %}`
      ]
    },
    libraries: [
      {
        zipURL:
          "https://storage.googleapis.com/bitbloq-prod/arduino-libraries/BQZUMI2C7SegmentDisplay.zip",
        precompiled: true
      }
    ]
  },
  {
    name: "ZumjuniorMiniservo",
    label: "hardware.component.miniservo",
    extends: "Servo",
    instanceName: "bloq-miniservo-instance-name",
    connectors: [
      {
        name: "main",
        type: "zumjunior-digital",
        position: {
          x: 0.28,
          y: 1
        },
        pins: [
          {
            name: "Pin",
            mode: ConnectorPinMode.OUTPUT,
            portPin: "0"
          }
        ]
      }
    ],
    libraries: [
      {
        zipURL:
          "https://storage.googleapis.com/bitbloq-prod/arduino-libraries/Servo.zip",
        precompiled: true
      }
    ],
    image: {
      url: MiniservoImage,
      width: 80,
      height: 80
    },
    snapshotImage: {
      url: MiniservoSnapshotImage,
      width: 80,
      height: 80
    }
  },
  {
    name: "ZumjuniorMultiSensor",
    label: "hardware.component.multisensor",
    extends: "I2C",

    instanceName: "bloq-sensors-instance-name",
    connectors: [
      {
        name: "main",
        type: "zumjunior-i2c",
        position: {
          x: 0.28,
          y: 1
        },
        pins: [
          {
            name: "i2c",
            mode: ConnectorPinMode.I2C,
            portPin: "i2c"
          }
        ]
      }
    ],
    image: {
      url: SensorsImage,
      width: 80,
      height: 80
    },
    snapshotImage: {
      url: SensorsSnapshotImage,
      width: 80,
      height: 80
    },
    code: {
      defines: ["red 0", "green 1", "blue 2", "white 3", "black 4"],
      includes: [
        "<BQZUMI2CTempSensor.h>",
        "<BQZUMI2CColorSensor.h>",
        "<BQZUMI2CALPSSensor.h>"
      ],
      globals: [
        `{% for pin in pinsInfo %}
        BQ::ZUM::I2CALPSSensor {{pin.pinVarName}}ALPS({{pin.pinVarName}});
        BQ::ZUM::I2CColorSensor {{pin.pinVarName}}Color({{pin.pinVarName}});
        BQ::ZUM::I2CTempSensor {{pin.pinVarName}}Temp({{pin.pinVarName}});
        uint8_t ___tempThreshold{{pin.pinVarName}}Temp;
        {% endfor %}`
      ],
      setup: [
        `{% for pin in pinsInfo %}
        {{pin.pinVarName}}ALPS.setup();
        {{pin.pinVarName}}Color.setup();
        {{pin.pinVarName}}Temp.setup();
        ___tempThreshold{{pin.pinVarName}}Temp = {{pin.pinVarName}}Temp.getTemp();
        {% endfor %}`
      ]
    },
    libraries: [
      {
        zipURL:
          "https://storage.googleapis.com/bitbloq-prod/arduino-libraries/BQZUMI2CALPSSensor.zip",
        precompiled: true
      },
      {
        zipURL:
          "https://storage.googleapis.com/bitbloq-prod/arduino-libraries/BQZUMI2CColorSensor.zip",
        precompiled: true
      },
      {
        zipURL:
          "https://storage.googleapis.com/bitbloq-prod/arduino-libraries/BQZUMI2CTempSensor.zip",
        precompiled: true
      }
    ]
  }
];
