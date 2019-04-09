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
import { IBloqType, BloqCategory, BloqParameterType } from "./types";

export const bloqTypes: Array< Partial <IBloqType> > = [
  {
    category: BloqCategory.Event,
    name: "OnStart",
    label: "bloq-on-start",
    icon: flagIcon,
    code: {}
  },
  {
    category: BloqCategory.Event,
    name: "OnSwitchOnOff",
    components: ["DoubleSwitch"],
    iconSwitch: {
      "switch === 1 and switchValue": switch1OnIcon,
      "switch === 2 and switchValue": switch2OnIcon,
      "switch === 1 and not switchValue": switch1OffIcon,
      "switch === 2 and not switchValue": switch2OffIcon
    },
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
        name: "switchValue",
        label: "bloq-parameter-switch-value",
        type: BloqParameterType.Select,
        options: [
          {
            label: "bloq-parameter-on",
            value: true
          },
          {
            label: "bloq-parameter-off",
            value: false
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
      "action === 'pressed'": buttonPressedIcon,
      "action === 'released'": buttonReleasedIcon
    },
    parameters: [
      {
        name: "component",
        label: "bloq-parameter-button",
        type: BloqParameterType.SelectComponent
      },
      {
        name: "action",
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
    components: ["SevenSegment"],
    parameters: [
      {
        name: "component",
        label: "bloq-parameter-seven-segment",
        type: BloqParameterType.SelectComponent
      },
      {
        name: "digit1",
        label: "bloq-parameter-digit1",
        type: BloqParameterType.Text
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
      "led1 and led2": doubleLedOnOnIcon,
      "not led1 and led2": doubleLedOffOnIcon,
      "led1 and not led2": doubleLedOnOffIcon,
      "not led1 and not led2": doubleLedOffOffIcon
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
            value: true
          },
          {
            label: "bloq-parameter-off",
            value: false
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
            value: true
          },
          {
            label: "bloq-parameter-off",
            value: false
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
    name: "SetSevenSegmentValue",
    label: "bloq-set-sevent-segment",
    components: ["SevenSegment"],
    icon: sevenSegmentsIcon,
    parameters: [
      {
        name: "component",
        label: "bloq-parameter-component",
        type: BloqParameterType.SelectComponent
      },
    ]
  },
  {
    category: BloqCategory.Wait,
    name: "Wait1Second",
    icon: time1Icon,
    code: {}
  },
  {
    category: BloqCategory.Wait,
    name: "Wait5Seconds",
    icon: time5Icon,
    code: {}
  },
  {
    category: BloqCategory.Wait,
    name: "WaitObstacle",
    label: "bloq-wait-obstacle",
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
    category: BloqCategory.Wait,
    name: "WaitNoObstacle",
    label: "bloq-wait-no-obstacle",
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
];
