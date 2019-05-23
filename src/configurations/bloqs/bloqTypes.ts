import flagIcon from "../../images/bloqs/flag.svg";
import switch1OnIcon from "../../images/bloqs/switch-1on.svg";
import switch1OffIcon from "../../images/bloqs/switch-1off.svg";
import switch2OnIcon from "../../images/bloqs/switch-2on.svg";
import switch2OffIcon from "../../images/bloqs/switch-2off.svg";
import rgbBlack from "../../images/bloqs/rgb-black.svg";
import rgbRed from "../../images/bloqs/rgb-red.svg";
import rgbGreen from "../../images/bloqs/rgb-green.svg";
import rgbBlue from "../../images/bloqs/rgb-blue.svg";
import buttonIcon from "../../images/bloqs/button.svg";
import buttonPressedIcon from "../../images/bloqs/button-pressed.svg";
import buttonReleasedIcon from "../../images/bloqs/button-released.svg";
import timeIcon from "../../images/bloqs/time.svg";
import time1Icon from "../../images/bloqs/time-1.svg";
import time5Icon from "../../images/bloqs/time-5.svg";
import doubleLedOnOnIcon from "../../images/bloqs/double-led-on-on.svg";
import rcservoclockwise from "../../images/bloqs/rcservo-clockwise.svg";
import rcservocounterclockwise from "../../images/bloqs/rcservo-counterclockwise.svg";
import rcservostop from "../../images/bloqs/rcservo-stop.svg";
import doubleLedOffOnIcon from "../../images/bloqs/double-led-off-on.svg";
import doubleLedOnOffIcon from "../../images/bloqs/double-led-on-off.svg";
import doubleLedOffOffIcon from "../../images/bloqs/double-led-off-off.svg";
import sevenSegmentsIcon from "../../images/bloqs/7segments.svg";
import obstacleIcon from "../../images/bloqs/obstacle.svg";
import noObstacleIcon from "../../images/bloqs/no-obstacle.svg";
import buzzerIcon from "../../images/bloqs/buzzer.svg";
import sendAIcon from "../../images/bloqs/send-message-a.svg";
import sendBIcon from "../../images/bloqs/send-message-b.svg";
import sendCIcon from "../../images/bloqs/send-message-c.svg";
import sendDIcon from "../../images/bloqs/send-message-d.svg";
import sendEIcon from "../../images/bloqs/send-message-e.svg";
import onAIcon from "../../images/bloqs/on-message-a.svg";
import onBIcon from "../../images/bloqs/on-message-b.svg";
import onCIcon from "../../images/bloqs/on-message-c.svg";
import onDIcon from "../../images/bloqs/on-message-d.svg";
import onEIcon from "../../images/bloqs/on-message-e.svg";

import { IBloqType, BloqCategory, BloqParameterType } from "@bitbloq/bloqs";


export const bloqTypes: Array< Partial <IBloqType> > = [
  {
    category: BloqCategory.Event,
    name: "OnStart",
    label: "bloq-on-start",
    icon: flagIcon
  },
  {
    category: BloqCategory.Event,
    name: "OnSwitchOnOff",
    label: "bloq-on-switch",
    components: ["ZumjuniorDoubleSwitch"],
    iconSwitch: {
      "switch === 1 and value === 'pos1'": switch1OnIcon,
      "switch === 2 and value === 'pos1'": switch2OnIcon,
      "switch === 1 and value === 'pos2'": switch1OffIcon,
      "switch === 2 and value === 'pos2'": switch2OffIcon
    },
    actions: [
      {
        name: "read",
        parameters:{
          pinVarName: "{{component}}Pin{{switch}}",
        }
      }
    ],
    parameters: [
      {
        name: "component",
        label: "bloq-parameter-component",
        type: BloqParameterType.SelectComponent
      },
      {
        name: "switch",
        label: "bloq-parameter-switch",
        type: BloqParameterType.Select,
        options: [
          {
            label: "bloq-parameter-switch-1",
            value: 1
          },
          {
            label: "bloq-parameter-switch-2",
            value: 2
          }
        ]
      },
      {
        name: "value",
        label: "bloq-parameter-value",
        type: BloqParameterType.Select,
        options: [
          {
            label: "bloq-parameter-on",
            value: "pos1"
          },
          {
            label: "bloq-parameter-off",
            value: "pos2"
          }
        ]
      },
      {
        name: "trueCondition",
        label: "bloq-parameter-action",
        type: BloqParameterType.Hidden,
        value: "==",
      }
    ],
    code: {}
  },
  {
    category: BloqCategory.Event,
    name: "OnMessage",
    label: "bloq-on-message",
    iconSwitch: {
      "value === 'messageA'": onAIcon,
      "value === 'messageB'": onBIcon,
      "value === 'messageC'": onCIcon,
      "value === 'messageD'": onDIcon,
      "value === 'messageE'": onEIcon,
    },
    code: {
      globals: [
      "bool ___messageA = false;",
      "bool ___messageB = false;",
      "bool ___messageC = false;",
      "bool ___messageD = false;",
      "bool ___messageE = false;"]
      ,
      endloop: [
        "___messageA = false;",
        "___messageB = false;",
        "___messageC = false;",
        "___messageD = false;",
        "___messageE = false;",
      ]
    },
    actions: [
      {
      name: "onMessage",
      parameters: {
        variable: "___{{value}}"},
      }
    ],
    parameters: [
      {
        name: "value",
        label: "bloq-message-value",
        type: BloqParameterType.Select,
        options: [
          {
            label: "A",
            value: "messageA"
          },
          {
            label: "B",
            value: "messageB"
          },
          {
            label: "C",
            value: "messageC"
          },
          {
            label: "D",
            value: "messageD"
          },
          {
            label: "E",
            value: "messageE"
          },
        ]
      },
    ],
  },
  {
    category: BloqCategory.Event,
    label: "bloq-on-cr-servo",
    name: "OnContRotServo",
    components: ["ContRotServo"],
    iconSwitch: {
      "value === 'clockwise'": rcservoclockwise,
      "value === 'counterclockwise'": rcservocounterclockwise,
      "value === 'stop'": rcservostop
    },
    actions: [
      {
        name: "read",
        parameters:{
          pinVarName: "{{component}}"
        }
      }
    ],
    parameters: [
      {
        name: "component",
        label: "bloq-parameter-component",
        type: BloqParameterType.SelectComponent
      },
      {
        name: "value",
        label: "bloq-parameter-rotation",
        type: BloqParameterType.Select,
        options: [
          {
            label: "bloq-parameter-clockwise",
            value: "clockwise"

          },
          {
            label: "bloq-parameter-counterclockwise",
            value: "counterclockwise"
          },
          {
            label: "bloq-parameter-stop",
            value: "stop"
          }
        ]
      },
      {
        name: "trueCondition",
        label: "bloq-parameter-action",
        type: BloqParameterType.Hidden,
        value: "==",
      }
    ],
    code: {}
  },
  {
    category: BloqCategory.Event,
    name: "OnButtonPress",
    label: "bloq-on-button-pressed",
    components: ["Button"],
    iconSwitch: {
      "value === 'pressed'": buttonPressedIcon,
      "value === 'released'": buttonReleasedIcon
    },
    actions: [
      {
        name: "read",
        parameters:{
          pinVarName: "{{component}}Pin",
        }
      }
    ],
    parameters: [
      {
        name: "component",
        label: "bloq-parameter-button",
        type: BloqParameterType.SelectComponent
      },
      {
        name: "value",
        label: "bloq-parameter-action",
        type: BloqParameterType.Select,
        options: [
          {
            label: "bloq-parameter-press",
            value: "pressed"
          },
          {
            label: "bloq-parameter-release",
            value: "released"
          }
        ]
      },
      {
        name: "trueCondition",
        label: "bloq-parameter-action",
        type: BloqParameterType.Hidden,
        value: "==",
      }
    ],
    code: {}
  },
  {
    category: BloqCategory.Event,
    name: "OnSevenSegmentValue",
    label: "bloq-on-seven-segment",
    icon: sevenSegmentsIcon,
    components: ["ZumjuniorSevenSegment"],
    actions: [
      {
        name: "readNumber",
        parameters:{
          pinVarName: "{{component}}i2c",
        }
      }
    ],
    parameters: [
      {
        name: "component",
        label: "bloq-parameter-seven-segment",
        type: BloqParameterType.SelectComponent
      },
      {
        name: "value",
        label: "bloq-parameter-value",
        type: BloqParameterType.Number
      },
      {
        name: "trueCondition",
        label: "bloq-parameter-action",
        type: BloqParameterType.Hidden,
        value: "==",
      }
    ]
  },
  {
    category: BloqCategory.Event,
    name: "OnObstacle",
    label: "bloq-on-obstacle",
    icon: obstacleIcon,
    components: ["ZumjuniorMultiSensor"],
    actions: [
      {
        name: "readDistance",
        parameters:{
          pinVarName: "{{component}}i2c",
        }
      }
    ],
    parameters: [
      {
        name: "component",
        label: "bloq-parameter-sensors",
        type: BloqParameterType.SelectComponent
      },
      {
        name: "value",
        label: "bloq-parameter-value",
        type: BloqParameterType.Hidden,
        value: "20",
      },
      {
        name: "trueCondition",
        label: "bloq-parameter-action",
        type: BloqParameterType.Hidden,
        value: "<=",
      }
    ]
  },
  {
    category: BloqCategory.Event,
    name: "OnNoObstacle",
    label: "bloq-on-no-obstacle",
    icon: noObstacleIcon,
    components: ["ZumjuniorMultiSensor"],
    actions: [
      {
        name: "readDistance",
        parameters:{
          pinVarName: "{{component}}i2c",
        }
      }
    ],
    parameters: [
      {
        name: "component",
        label: "bloq-parameter-sensors",
        type: BloqParameterType.SelectComponent
      },
      {
        name: "value",
        label: "bloq-parameter-value",
        type: BloqParameterType.Hidden,
        value: "20",
      },
      {
        name: "trueCondition",
        label: "bloq-parameter-action",
        type: BloqParameterType.Hidden,
        value: ">",
      }
    ]
  },
  {
    category: BloqCategory.Action,
    name: "DoubleLedOnOff",
    label: "bloq-double-led",
    components: ["ZumjuniorDoubleLed"],
    iconSwitch: {
      "led1 === 'on' and led2 === 'on'": doubleLedOnOnIcon,
      "led1 === 'off' and led2 === 'on'": doubleLedOffOnIcon,
      "led1 === 'on' and led2 === 'off'": doubleLedOnOffIcon,
      "led1 === 'off' and led2 === 'off'": doubleLedOffOffIcon
    },
    parameters: [
      {
        name: "component",
        label: "bloq-parameter-component",
        type: BloqParameterType.SelectComponent
      },

      {
        name: "led1",
        label: "bloq-parameter-led-1",
        type: BloqParameterType.Select,
        options: [
          {
            label: "bloq-parameter-on",
            value: "on"

          },
          {
            label: "bloq-parameter-off",
            value: "off"
          }
        ]
      },
      {
        name: "led2",
        label: "bloq-parameter-led-2",
        type: BloqParameterType.Select,
        options: [
          {
            label: "bloq-parameter-on",
            value: "on"
          },
          {
            label: "bloq-parameter-off",
            value: "off"
          }
        ]
      }
    ],
    code: {},
    actions: [
      {
        name: 'write',
        parameters: {
          pinVarName: '{{component}}WhitePin',
          value: '{{led1}}',
        },
      },
      {
        name: 'write',
        parameters: {
          pinVarName: '{{component}}ColorPin',
          value: '{{led2}}',
        },
      },
    ],
  },
  {
    category: BloqCategory.Action,
    name: "ContRotServo",
    label: "bloq-cr-servo",
    components: ["ContRotServo"],
    iconSwitch: {
      "rotation === 'clockwise'": rcservoclockwise,
      "rotation === 'counterclockwise'": rcservocounterclockwise,
      "rotation === 'stop'": rcservostop
    },
    parameters: [
      {
        name: "component",
        label: "bloq-parameter-component",
        type: BloqParameterType.SelectComponent
      },

      {
        name: "rotation",
        label: "bloq-parameter-rotation",
        type: BloqParameterType.Select,
        options: [
          {
            label: "bloq-parameter-clockwise",
            value: "clockwise"

          },
          {
            label: "bloq-parameter-counterclockwise",
            value: "counterclockwise"
          },
          {
            label: "bloq-parameter-stop",
            value: "stop"
          }
        ]
      }
    ],
    code: {},
    actions: [
      {
        name: 'write',
        parameters: {
          pinVarName: '{{component}}',
          value: '{{rotation}}',
        },
      }
    ],
  },
  {
    category: BloqCategory.Action,
    name: "RGBLed",
    label: "bloq-rgbled-color",
    components: ["DigitalRGBLED"],
    iconSwitch: {
      "value === 'red'": rgbRed,
      "value === 'blue'": rgbBlue,
      "value === 'green'": rgbGreen,
      "value === 'off'": rgbBlack
    },
    parameters: [
      {
        name: "component",
        label: "bloq-parameter-component",
        type: BloqParameterType.SelectComponent
      },

      {
        name: "value",
        label: "bloq-parameter-color",
        type: BloqParameterType.Select,
        options: [
          {
            label: "red",
            value: "red"
          },
          {
            label: "green",
            value: "green"
          },
          {
            label: "blue",
            value: "blue"
          },
          {
            label: "off",
            value: "off"

          },
        ]
      }
    ],
    code: {},
    actions: [
      {
        name: 'write',
        parameters: {
          pinVarName: '{{component}}',
          value: '{{value}}',
        },
      }
    ],
  },
  {
    category: BloqCategory.Action,
    name: "Buzzer",
    label: "bloq-buzzer",
    components: ["Buzzer"],
    icon: buzzerIcon,
    parameters: [
      {
        name: "component",
        label: "bloq-parameter-component",
        type: BloqParameterType.SelectComponent
      },
      {
        name: "value",
        label: "bloq-parameter-tone",
        type: BloqParameterType.Select,
        options: [
          {
            label: "A-tone",
            value: "A"
          },
          {
            label: "B-tone",
            value: "B"
          },
          {
            label: "C-tone",
            value: "C"
          },
          {
            label: "D-tone",
            value: "D"
          },
          {
            label: "E-tone",
            value: "E"
          },
          {
            label: "F-tone",
            value: "F"
          },
          {
            label: "G-tone",
            value: "G"
          },
        ]
        
      },
      {
        name: "duration",
        label: "bloq-parameter-duration-sec",
        type: BloqParameterType.Number
      },
    ],
    code: {},
    actions: [
      {
        name: 'write',
        parameters: {
          pinVarName: '{{component}}',
          value: '{{value}}',
          duration: '{{duration}}'
        },
      }
    ],
  },
  {
    category: BloqCategory.Action,
    name: "SetSevenSegmentNumericValue",
    label: "bloq-set-seven-segment-num",
    components: ["ZumjuniorSevenSegment"],
    icon: sevenSegmentsIcon,
    parameters: [
      {
        name: "component",
        label: "bloq-parameter-component",
        type: BloqParameterType.SelectComponent
      },
      {
        name: "value",
        label: "bloq-parameter-value",
        type: BloqParameterType.Number
      },
    ],
    code: {},
    actions: [
      {
        name: 'writeNumber',
        parameters: {
          pinVarName: '{{component}}i2c',
          value: '{{value}}',
        },
      },
    ]
  },
  {
    category: BloqCategory.Action,
    name: "IncrementSevenSegmentNumericValue",
    label: "bloq-inc-seven-segment-num",
    components: ["ZumjuniorSevenSegment"],
    icon: sevenSegmentsIcon,
    parameters: [
      {
        name: "component",
        label: "bloq-parameter-component",
        type: BloqParameterType.SelectComponent
      },
      {
        name: "value",
        label: "bloq-inc-seven-value",
        type: BloqParameterType.Number
      },
    ],
    code: {},
    actions: [
      {
        name: 'incrementNumber',
        parameters: {
          pinVarName: '{{component}}i2c',
          value: '{{value}}',
        },
      },
    ]
  },
  {
    category: BloqCategory.Action,
    name: "DecrementSevenSegmentNumericValue",
    label: "bloq-dec-seven-segment-num",
    components: ["ZumjuniorSevenSegment"],
    icon: sevenSegmentsIcon,
    parameters: [
      {
        name: "component",
        label: "bloq-parameter-component",
        type: BloqParameterType.SelectComponent
      },
      {
        name: "value",
        label: "bloq-inc-seven-value",
        type: BloqParameterType.Number
      },
    ],
    code: {},
    actions: [
      {
        name: 'decrementNumber',
        parameters: {
          pinVarName: '{{component}}i2c',
          value: '{{value}}',
        },
      },
    ],
  },
  {
    category: BloqCategory.Action,
    name: "sendMessageA",
    label: "bloq-send-message",
    iconSwitch: {
      "value === 'messageA'": sendAIcon,
      "value === 'messageB'": sendBIcon,
      "value === 'messageC'": sendCIcon,
      "value === 'messageD'": sendDIcon,
      "value === 'messageE'": sendEIcon,
    },
    code: {
      globals: ["bool ___messageA = false;",
      "bool ___messageB = false;",
      "bool ___messageC = false;",
      "bool ___messageD = false;",
      "bool ___messageE = false;"]
    },
    actions: [
      {
      name: "send",
      parameters: {
        code: "___{{value}} = true;"},
      }
    ],
    parameters: [
      {
        name: "value",
        label: "bloq-message-value",
        type: BloqParameterType.Select,
        options: [
          {
            label: "A",
            value: "messageA"
          },
          {
            label: "B",
            value: "messageB"
          },
          {
            label: "C",
            value: "messageC"
          },
          {
            label: "D",
            value: "messageD"
          },
          {
            label: "E",
            value: "messageE"
          },
        ]
      },
    ],

  },
  {
    category: BloqCategory.Wait,
    name: "Wait1Second",
    label: "bloq-wait-1-second",
    icon: time1Icon,
    code: {
    },
    actions: [
      {
      name: "wait",
      parameters: {code: "heap.insert({{functionName}},1000);"},
      }
    ]
  },
  {
    category: BloqCategory.Wait,
    name: "Wait5Seconds",
    "label": "bloq-wait-5-second",
    icon: time5Icon,
    code: {},
    actions: [
      {
      name: "wait",
      parameters: {code: "heap.insert({{functionName}},5000);"},
      }
    ]
  },
  {
    category: BloqCategory.Wait,
    name: "WaitObstacle",
    label: "bloq-wait-obstacle",
    icon: obstacleIcon,
    components: ["ZumjuniorMultiSensor"],
    actions: [
      {
        name: "readDistance",
        parameters:{
          pinVarName: "{{component}}i2c",
        }
      }
    ],
    parameters: [
      {
        name: "component",
        label: "bloq-parameter-sensors",
        type: BloqParameterType.SelectComponent
      },
      {
        name: "value",
        label: "bloq-parameter-value",
        type: BloqParameterType.Hidden,
        value: "20",
      },
      {
        name: "trueCondition",
        label: "bloq-parameter-action",
        type: BloqParameterType.Hidden,
        value: "<=",
      }
    ]
  },
  {
    category: BloqCategory.Wait,
    name: "WaitNoObstacle",
    label: "bloq-wait-no-obstacle",
    icon: noObstacleIcon,
    components: ["ZumjuniorMultiSensor"],
    actions: [
      {
        name: "readDistance",
        parameters:{
          pinVarName: "{{component}}i2c",
        }
      }
    ],
    parameters: [
      {
        name: "component",
        label: "bloq-parameter-sensors",
        type: BloqParameterType.SelectComponent
      },
      {
        name: "value",
        label: "bloq-parameter-value",
        type: BloqParameterType.Hidden,
        value: "20",
      },
      {
        name: "trueCondition",
        label: "bloq-parameter-action",
        type: BloqParameterType.Hidden,
        value: ">",
      }
    ]
  },
  {
    category: BloqCategory.Wait,
    name: "WaitButtonPressed",
    label: "bloq-wait-button-pressed",
    components: ["Button"],
    iconSwitch: {
      "value === 'pressed'": buttonPressedIcon,
      "value === 'released'": buttonReleasedIcon
    },
    actions: [
      {
        name: "read",
        parameters:{
          pinVarName: "{{component}}Pin",
        }
      }
    ],
    parameters: [
      {
        name: "component",
        label: "bloq-parameter-button",
        type: BloqParameterType.SelectComponent
      },
      {
        name: "value",
        label: "bloq-parameter-action",
        type: BloqParameterType.Select,
        options: [
          {
            label: "bloq-parameter-press",
            value: "pressed"
          },
          {
            label: "bloq-parameter-release",
            value: "released"
          }
        ]
      },
      {
        name: "trueCondition",
        label: "bloq-parameter-action",
        type: BloqParameterType.Hidden,
        value: "==",
      }
    ],
  },
  {
    category: BloqCategory.Wait,
    name: "WaitForSevenSegmentValue",
    label: "bloq-wait-seven-segment",
    icon: sevenSegmentsIcon,
    components: ["ZumjuniorSevenSegment"],
    actions: [
      {
        name: "readNumber",
        parameters:{
          pinVarName: "{{component}}i2c",
        }
      }
    ],
    parameters: [
      {
        name: "component",
        label: "bloq-parameter-seven-segment",
        type: BloqParameterType.SelectComponent
      },
      {
        name: "value",
        label: "bloq-parameter-value",
        type: BloqParameterType.Number
      },
      {
        name: "trueCondition",
        label: "bloq-parameter-action",
        type: BloqParameterType.Hidden,
        value: "==",
      }
    ]
  },
  {
    category: BloqCategory.Wait,
    name: "WainSwitchOnOff",
    label: "bloq-wait-switch",
    components: ["ZumjuniorDoubleSwitch"],
    iconSwitch: {
      "switch === 1 and value === 'pos1'": switch1OnIcon,
      "switch === 2 and value === 'pos1'": switch2OnIcon,
      "switch === 1 and value === 'pos2'": switch1OffIcon,
      "switch === 2 and value === 'pos2'": switch2OffIcon
    },
    actions: [
      {
        name: "read",
        parameters:{
          pinVarName: "{{component}}Pin{{switch}}",
          value: "{{value}}"
        }
      }
    ],
    parameters: [
      {
        name: "component",
        label: "bloq-parameter-component",
        type: BloqParameterType.SelectComponent
      },
      {
        name: "switch",
        label: "bloq-parameter-switch",
        type: BloqParameterType.Select,
        options: [
          {
            label: "bloq-parameter-switch-1",
            value: 1
          },
          {
            label: "bloq-parameter-switch-2",
            value: 2
          }
        ]
      },
      {
        name: "value",
        label: "bloq-parameter-value",
        type: BloqParameterType.Select,
        options: [
          {
            label: "bloq-parameter-on",
            value: "pos1"
          },
          {
            label: "bloq-parameter-off",
            value: "pos2"
          }
        ]
      },
      {
        name: "trueCondition",
        label: "bloq-parameter-action",
        type: BloqParameterType.Hidden,
        value: "==",
      }
    ],
    code: {}
  }
];
