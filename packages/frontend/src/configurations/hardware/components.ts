import { IComponent, ConnectorPinMode } from "@bitbloq/bloqs";

import SevenSegmentImage from "../../images/hardware/zumjunior-7segment.svg";
import SevenSegmentSnapshotImage from "../../images/hardware/zumjunior-7segment.png";
import ButtonImage from "../../images/hardware/zumjunior-button.svg";
import ButtonSnapshotImage from "../../images/hardware/zumjunior-button.png";
import DoubleLedImage from "../../images/hardware/zumjunior-double-led.svg";
import DoubleLedSnapshotImage from "../../images/hardware/zumjunior-double-led.png";
import MiniservoImage from "../../images/hardware/zumjunior-miniservo.svg";
import MiniservoSnapshotImage from "../../images/hardware/zumjunior-miniservo.png";
import SensorsImage from "../../images/hardware/zumjunior-sensors.svg";
import SensorsSnapshotImage from "../../images/hardware/zumjunior-sensors.png";
import ServoImage from "../../images/hardware/zumjunior-servo.svg";
import ServoSnapshotImage from "../../images/hardware/zumjunior-servo.png";
import SliderImage from "../../images/hardware/zumjunior-slider.svg";
import SliderSnapshotImage from "../../images/hardware/zumjunior-slider.png";
import BuzzerImage from "../../images/hardware/buzzer.svg";
import RGBLedImage from "../../images/hardware/RGBled.svg";

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
    },
    actions: [
      {
        name: "read",
        parameters: ["pinVarName"],
        code: "digitalRead({{pinVarName}})",
        return: "uint8_t"
      }
    ]
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
    },
    actions: [
      {
        name: "write",
        parameters: ["pinVarName", "value"],
        code: `digitalWrite({{pinVarName}}, {{value}});`
      }
    ]
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
    values: {
      A: "880",
      B: "988",
      C: "1047",
      D: "1175",
      E: "2319",
      F: "1397",
      G: "1568"
    },
    actions: [
      {
        name: "write",
        parameters: ["pinVarName", "value", "duration"],
        code: `tone({{pinVarName}}Pin,{{value}},{{duration}}*1000);`
      }
    ],
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
    actions: [
      {
        name: "write",
        parameters: ["pinVarName", "value"],
        code: `{{pinVarName}}PinObj.write({{value}});`
      },
      {
        name: "read",
        parameters: ["pinVarName"],
        code: `{{pinVarName}}PinObj.read()`,
        return: "uint8_t"
      }
    ],
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
    actions: [
      {
        name: "write",
        parameters: ["pinVarName", "value"],
        code: `{{pinVarName}}PinObj.write({{value}});`
      },
      {
        name: "read",
        parameters: ["pinVarName"],
        code: `{{pinVarName}}PinObj.read()`,
        return: "uint8_t"
      }
    ],
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
    values: {
      clockwiseslow: "110",
      clockwisemedium: "120",
      clockwisefast: "180",
      counterclockwiseslow: "70",
      counterclockwisemedium: "60",
      counterclockwisefast: "0",
      stopslow: "90"
    },
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
    }
  },
  {
    name: "DigitalRGBLED",
    extends: "Component",
    values: {
      white: "{0,0,0}",
      red: "{0,255,255}",
      green: "{255,0,255}",
      blue: "{255,255,0}",
      off: "{255,255,255}"
    },
    code: {
      setup: [
        `{% for pin in pinsInfo %}
        pinMode({{pin.pinVarName}},OUTPUT);
        analogWrite({{pin.pinVarName}},255);
        {% endfor %}`
      ]
    },
    actions: [
      {
        name: "write",
        parameters: ["pinVarName", "value"],
        code: `
                analogWrite({{pinVarName}}PinRed,(int[3]){{value}}[0]);
                analogWrite({{pinVarName}}PinGreen,(int[3]){{value}}[1]);
                analogWrite({{pinVarName}}PinBlue,(int[3]){{value}}[2]);
                `
      }
    ],
    instanceName: "bloq-digitalrgbled-instance-name",
    connectors: [
      {
        name: "red",
        type: "digital",
        position: {
          x: -0.4,
          y: -1
        },
        pins: [
          {
            name: "PinRed",
            mode: ConnectorPinMode.OUTPUT
          }
        ]
      },
      {
        name: "green",
        type: "digital",
        position: {
          x: -0.4,
          y: -1
        },
        pins: [
          {
            name: "PinGreen",
            mode: ConnectorPinMode.OUTPUT
          }
        ]
      },
      {
        name: "blue",
        type: "digital",
        position: {
          x: -0.4,
          y: -1
        },
        pins: [
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
    values: {
      pressed: "{{read}} == HIGH",
      released: "{{read}} == LOW"
    },
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
    values: {
      on: "LOW",
      off: "HIGH"
    },
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
    values: {
      pos1: "{{read}} == LOW",
      pos2: "{{read}} == HIGH"
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
    actions: [
      {
        name: "writeNumber",
        parameters: ["pinVarName", "value"],
        code: `{{pinVarName}}Obj.displayInt({{value}});`
      },
      {
        name: "writeChar",
        parameters: ["pinVarName", "char1", "char2"],
        code: `{{pinVarName}}Obj.displayChar('{{char1}}','{{char2}}');`
      },
      {
        name: "readChar",
        parameters: ["pinVarName"],
        code: `{{pinVarName}}Obj.readChar()`,
        return: "string"
      },
      {
        name: "readNumber",
        parameters: ["pinVarName"],
        code: `{{pinVarName}}Obj.readInt()`,
        return: "uint8_t"
      },
      {
        name: "incrementNumber",
        parameters: ["pinVarName", "value"],
        code: `{{pinVarName}}Obj.displayInt({{pinVarName}}Obj.readInt()+{{value}});`
      },
      {
        name: "decrementNumber",
        parameters: ["pinVarName", "value"],
        code: `{{pinVarName}}Obj.displayInt({{pinVarName}}Obj.readInt()-{{value}});`
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
        {% endfor %}`
      ],
      setup: [
        `{% for pin in pinsInfo %}
        {{pin.pinVarName}}ALPS.setup();
        {{pin.pinVarName}}Color.setup();
        {{pin.pinVarName}}Temp.setup();
        {% endfor %}`
      ]
    },
    actions: [
      {
        name: "readDistance",
        parameters: ["pinVarName"],
        code: `{{pinVarName}}ALPS.getDistance()`,
        return: "uint8_t"
      },
      {
        name: "readTemperature",
        parameters: ["pinVarName"],
        code: `{{pinVarName}}Temp.getTemp()`,
        return: "uint8_t"
      },
      {
        name: "readLight",
        parameters: ["pinVarName"],
        code: `{{pinVarName}}ALPS.getAL()`,
        return: "uint8_t"
      },
      {
        name: "readColor",
        parameters: ["pinVarName"],
        code: `{{pinVarName}}Color.whichColor()`,
        return: "uint8_t"
      }
    ],
    values: {
      hot: " {{read}} >= 25",
      cold: "{{read}} < 25",
      light: "{{read}} >= 40",
      dark: "{{read}} < 40",
      sunset: "{{read}} >=40 && {{read}} < 60",
      obstacle: "{{read}} <20",
      no_obstacle: "{{read}} >=20",
      truered: "{{read}}==0",
      truegreen: "{{read}}==1",
      trueblue: "{{read}}==2",
      truewhite: "{{read}}==3",
      trueblack: "{{read}}==4",
      falsered: "{{read}}!=0",
      falsegreen: "{{read}}!=1",
      falseblue: "{{read}}!=2",
      falsewhite: "{{read}}!=3",
      falseblack: "{{read}}!=4"
    }
  }
];
