import { IBloqType, BloqCategory } from "../../../index";
import { BloqParameterType } from "../../../enums";

export const bloqTypes: Array<Partial<IBloqType>> = [
  {
    category: BloqCategory.Event,
    name: "OnStart",
    label: "bloq-on-start",
    code: {}
  },
  {
    category: BloqCategory.Event,
    name: "OnSwitchOnOff",
    components: ["DoubleSwitch"],

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
            value: "true"
          },
          {
            label: "bloq-parameter-off",
            value: "false"
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
    components: ["ZumjuniorSensors"],
    parameters: [
      {
        name: "component",
        label: "bloq-parameter-sensors",
        type: BloqParameterType.SelectComponent
      }
    ]
  },
  {
    category: BloqCategory.Event,
    name: "OnNoObstacle",
    label: "bloq-on-no-obstacle",
    components: ["ZumjuniorSensors"],
    parameters: [
      {
        name: "component",
        label: "bloq-parameter-sensors",
        type: BloqParameterType.SelectComponent
      }
    ]
  },
  {
    category: BloqCategory.Action,
    name: "DoubleLedOnOff",
    components: ["ZumjuniorDoubleLed"],
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
            value: "true"
          },
          {
            label: "bloq-parameter-off",
            value: "false"
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
        name: "write",
        parameters: {
          pinVarName: "{{component}}WhitePin",
          value: "{{led1}}"
        }
      },
      {
        name: "write",
        parameters: {
          pinVarName: "{{component}}ColorPin",
          value: "{{led2}}"
        }
      }
    ]
  },
  {
    category: BloqCategory.Action,
    name: "SetSevenSegmentValue",
    label: "bloq-set-sevent-segment",
    components: ["SevenSegment"],
    parameters: [
      {
        name: "component",
        label: "bloq-parameter-component",
        type: BloqParameterType.SelectComponent
      }
    ]
  },
  {
    category: BloqCategory.Wait,
    name: "Wait1Second",
    code: {}
  },
  {
    category: BloqCategory.Wait,
    name: "Wait5Seconds",
    code: {}
  },
  {
    category: BloqCategory.Wait,
    name: "WaitObstacle",
    label: "bloq-wait-obstacle",
    components: ["ZumjuniorSensors"],
    parameters: [
      {
        name: "component",
        label: "bloq-parameter-sensors",
        type: BloqParameterType.SelectComponent
      }
    ]
  },
  {
    category: BloqCategory.Wait,
    name: "WaitNoObstacle",
    label: "bloq-wait-no-obstacle",
    components: ["ZumjuniorSensors"],
    parameters: [
      {
        name: "component",
        label: "bloq-parameter-sensors",
        type: BloqParameterType.SelectComponent
      }
    ]
  }
];
