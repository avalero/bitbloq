import flagIcon from "../../images/bloqs/flag.svg";
import switch1OnIcon from "../../images/bloqs/switch-1on.svg";
import switch1OffIcon from "../../images/bloqs/switch-1off.svg";
import switch2OnIcon from "../../images/bloqs/switch-2on.svg";
import switch2OffIcon from "../../images/bloqs/switch-2off.svg";
import buttonIcon from "../../images/bloqs/button.svg";
import buttonPressedIcon from "../../images/bloqs/button-pressed.svg";
import buttonReleasedIcon from "../../images/bloqs/button-released.svg";
import timeIcon from "../../images/bloqs/time.svg";
import time1Icon from "../../images/bloqs/time-1.svg";
import time5Icon from "../../images/bloqs/time-5.svg";
import doubleLedOnOnIcon from "../../images/bloqs/double-led-on-on.svg";
import doubleLedOffOnIcon from "../../images/bloqs/double-led-off-on.svg";
import doubleLedOnOffIcon from "../../images/bloqs/double-led-on-off.svg";
import doubleLedOffOffIcon from "../../images/bloqs/double-led-off-off.svg";
import sevenSegmentsIcon from "../../images/bloqs/7segments.svg";
import obstacleIcon from "../../images/bloqs/obstacle.svg";
import noObstacleIcon from "../../images/bloqs/no-obstacle.svg";
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
          // value: "{{value}}"
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
      }
    ]
  },
  {
    category: BloqCategory.Event,
    name: "OnObstacle",
    label: "bloq-on-obstacle",
    icon: obstacleIcon,
    components: ["ZumjuniorSensors"],
    parameters: [
      {
        name: "component",
        label: "bloq-parameter-sensors",
        type: BloqParameterType.SelectComponent
      },
    ]
  },
  {
    category: BloqCategory.Event,
    name: "OnNoObstacle",
    label: "bloq-on-no-obstacle",
    icon: noObstacleIcon,
    components: ["ZumjuniorSensors"],
    parameters: [
      {
        name: "component",
        label: "bloq-parameter-sensors",
        type: BloqParameterType.SelectComponent
      },
    ]
  },
  {
    category: BloqCategory.Action,
    name: "DoubleLedOnOff",
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
    ]
  },
  {
    category: BloqCategory.Wait,
    name: "Wait1Second",
    icon: time1Icon,
    code: {},
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
        value: "<",
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
  },
];
