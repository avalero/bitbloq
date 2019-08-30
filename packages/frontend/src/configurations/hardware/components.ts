import { IComponent, ConnectorPinMode } from "@bitbloq/bloqs";

import SevenSegmentImage from "../../images/hardware/zumjunior-7segment.svg";
import ButtonImage from "../../images/hardware/zumjunior-button.svg";
import DoubleLedImage from "../../images/hardware/zumjunior-double-led.svg";
import MiniservoImage from "../../images/hardware/zumjunior-miniservo.svg";
import SensorsImage from "../../images/hardware/zumjunior-sensors.svg";
import ServoImage from "../../images/hardware/zumjunior-servo.svg";
import SliderImage from "../../images/hardware/zumjunior-slider.svg";
import BuzzerImage from "../../images/hardware/buzzer.svg";
import RGBLedImage from "../../images/hardware/RGBled.svg";

export const components: Partial<IComponent>[] = [
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
    extends: "Component",
  },
  {
    name: "DigitalInput",
    extends: "Digital",
    onValue: "HIGH",
    offValue: "LOW",
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
        returns: "uint8_t"
      }
    ]
  },
  {
    name: 'DigitalOutput',
    extends: 'Digital',
    onValue: 'HIGH',
    offValue: 'LOW',
    code: {
      setup: [
        `{% for pin in pinsInfo %}
        pinMode({{pin.pinVarName}},OUTPUT);
        {% endfor %}`,
      ],
    },
    actions: [
      {
        name: 'write',
        parameters: ['pinVarName', 'value'],
        code: `digitalWrite({{pinVarName}}, {{value}});`,
      },
    ],
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
    values:{
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
        name: 'write',
        parameters: ['pinVarName', 'value', 'duration'],
        code: `tone({{pinVarName}}Pin,{{value}},{{duration}}*1000);`,
      }
    ],
    code: {
      setup: [
        `{% for pin in pinsInfo %}
        pinMode({{pin.pinVarName}},OUTPUT);
        {% endfor %}`,
      ],
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
            mode: ConnectorPinMode.OUTPUT,
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
        name: 'write',
        parameters: ['pinVarName', 'value'],
        code: `{{pinVarName}}PinObj.write({{value}});`,
      },
      {
        name: 'read',
        parameters: ['pinVarName'],
        code: `{{pinVarName}}PinObj.read()`,
        return: "uint8_t"
      },
    ],
    code: {
      includes: [
        "<Servo.h>"
      ],
      globals: [
        `{% for pin in pinsInfo %}
        Servo {{pin.pinVarName}}Obj;
        {% endfor %}`
      ],
      setup: [
        `{% for pin in pinsInfo %}
        {{pin.pinVarName}}Obj.attach({{pin.pinVarName}});
        {{pin.pinVarName}}Obj.write(90);
        {% endfor %}`,
      ],
    },
  },
  {
    name: "ContRotServo",
    extends: "Servo",
    values:{
      clockwise: "175",
      counterclockwise: "5",
      stop: "90"
    },
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
      width: 124,
      height: 124
    }
  },
  {
    name: "DigitalRGBLED",
    extends: "Component",
    values:{
      red: "{0,255,255}",
      green: "{255,0,255}",
      blue: "{255,255,0}",
      off: "{255,255,255}",
    },
    code: {
      setup: [
        `{% for pin in pinsInfo %}
        pinMode({{pin.pinVarName}},OUTPUT);
        analogWrite({{pin.pinVarName}},255);
        {% endfor %}`,
      ],
    },
    actions: [
      {
        name: 'write',
        parameters: ['pinVarName', 'value'],
        code: `
        uint8_t {{pinVarName}}color[3] = {{value}} ;
        analogWrite({{pinVarName}}PinRed,{{pinVarName}}color[0]);
        analogWrite({{pinVarName}}PinGreen,{{pinVarName}}color[1]);
        analogWrite({{pinVarName}}PinBlue,{{pinVarName}}color[2]);
        `,
      },
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
            mode: ConnectorPinMode.OUTPUT,
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
            mode: ConnectorPinMode.OUTPUT,
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
            mode: ConnectorPinMode.OUTPUT,
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
    extends: "Button",
    values:{
      pressed: "HIGH",
      unPressed: "LOW"
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
      width: 124,
      height: 124
    }
  },
  {
    name: "ZumjuniorDoubleLed",
    extends: "Led",
    instanceName: "bloq-led-instance-name",
    values:{
      on: "LOW",
      off: "HIGH"
    },
    code: {
      setup: [
        `{% for pin in pinsInfo %}
        digitalWrite({{pin.pinVarName}},HIGH);
        {% endfor %}`,
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
      width: 124,
      height: 124
    }
  },
  {
    name: "ZumjuniorDoubleSwitch",
    extends: "DigitalInput",
    instanceName: "bloq-switch-instance-name",
    values:{
      pos1: "LOW",
      pos2: "HIGH"
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
            name: "Pin1",
            mode: ConnectorPinMode.INPUT,
            portPin: "1"
          },
          {
            name: "Pin0",
            mode: ConnectorPinMode.INPUT,
            portPin: "0"
          }
        ]
      }
    ],
    image: {
      url: SliderImage,
      width: 124,
      height: 124
    }
  },
  {
    name: "I2C",
    extends: "Component"
  },
  {
    name: "ZumjuniorSevenSegment",
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
          },
        ]
      }
    ],
    image: {
      url: SevenSegmentImage,
      width: 124,
      height: 124
    },
    code: {
      includes: [
        "<BQZUMI2C7SegmentDisplay.h>"
      ],
      globals: [
        `{% for pin in pinsInfo %}
        BQ::ZUM::I2C7SegmentDisplay {{pin.pinVarName}}Obj({{pin.pinVarName}});
        {% endfor %}`,
      ],
      setup: [
        `{% for pin in pinsInfo %}
        {{pin.pinVarName}}Obj.setup();
        {{pin.pinVarName}}Obj.displayChar(' ',' ');
        {% endfor %}`,
      ],
    },
    actions: [
      {
        name: 'writeNumber',
        parameters: ['pinVarName', 'value'],
        code: `{{pinVarName}}Obj.displayInt({{value}});`,
      },
      {
        name: 'writeChar',
        parameters: ['pinVarName', 'char1', 'char2'],
        code: `{{pinVarName}}Obj.displayChar('{{char1}}','{{char2}}');`,
      },
      {
        name: 'readChar',
        parameters: ['pinVarName'],
        code: `{{pinVarName}}Obj.readChar()`,
        return: "string"
      },
      {
        name: 'readNumber',
        parameters: ['pinVarName'],
        code: `{{pinVarName}}Obj.readInt()`,
        return: "uint8_t"
      },
      {
        name: 'incrementNumber',
        parameters: ['pinVarName', 'value'],
        code: `{{pinVarName}}Obj.displayInt({{pinVarName}}Obj.readInt()+{{value}});`
      },
      {
        name: 'decrementNumber',
        parameters: ['pinVarName','value'],
        code: `{{pinVarName}}Obj.displayInt({{pinVarName}}Obj.readInt()-{{value}});`
      },
    ],
  },
  {
    name: "ZumjuniorServo",
    extends: "Servo",
    instanceName: "bloq-servo-instance-name",
    connectors: [
      {
        name: "main",
        type: "zumjunior-digital",
        position: {
          x: 0.28,
          y: 1
        },
        pins: []
      }
    ],
    image: {
      url: ServoImage,
      width: 120,
      height: 132
    }
  },
  {
    name: "ZumjuniorMiniservo",
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
        pins: []
      }
    ],
    image: {
      url: MiniservoImage,
      width: 88,
      height: 95
    }
  },
  {
    name: "ZumjuniorMultiSensor",
    
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
      width: 123,
      height: 124
    },
    code: {
      includes: [
        "<BQZUMI2CTempSensor.h>",
        "<BQZUMI2CColorSensor.h>",
        "<BQZUMI2CALPSSensor.h>"
      ],
      globals: [
        `{% for pin in pinsInfo %}
        // uint8_t {{pin.pinVarName}} = {{pin.pinNumber}};
        BQ::ZUM::I2CALPSSensor {{pin.pinVarName}}ALPS({{pin.pinVarName}});
        BQ::ZUM::I2CColorSensor {{pin.pinVarName}}Color({{pin.pinVarName}});
        BQ::ZUM::I2CTempSensor {{pin.pinVarName}}Temp({{pin.pinVarName}});
        {% endfor %}`,
      ],
      setup: [
        `{% for pin in pinsInfo %}
        {{pin.pinVarName}}ALPS.setup();
        {{pin.pinVarName}}Color.setup();
        {{pin.pinVarName}}Temp.setup();
        {% endfor %}`,
      ],
    },
    actions: [
      {
        name: 'readDistance',
        parameters: ['pinVarName'],
        code: `{{pinVarName}}ALPS.getDistance()`,
        return: "uint8_t"
      },
    ],
  },
];
