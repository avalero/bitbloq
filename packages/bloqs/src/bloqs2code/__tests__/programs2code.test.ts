import {
  IBloqType,
  IBloq,
  IHardware,
  IComponent,
  ConnectorPinMode,
  IComponentInstance,
  IArduinoCode
} from "../../index";
import program2code, {
  getBloqDefinition,
  getComponentForBloq,
  getActions,
  actions2code
} from "../program2code";
import { bloqTypes } from "./config/bloqTypes";
import { components } from "./config/components";

import { BloqCategory, BloqParameterType } from "../../enums";
import { getFullComponentDefinition } from "../componentBuilder";

test("getBloqDefinition", () => {
  const bloqInstance: IBloq = {
    parameters: { component: "led", led1: true, led2: true },
    type: "DoubleLedOnOff"
  };

  const doubleLedOnOff: IBloqType = {
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
  };

  const bloqDefinition: Partial<IBloqType> = getBloqDefinition(
    bloqTypes,
    bloqInstance
  );
  expect(bloqDefinition).toBeDefined();
  expect(bloqDefinition).toEqual(doubleLedOnOff);
});

test("componentForBloq", () => {
  const bloqInstance: IBloq = {
    parameters: { component: "led", led1: true, led2: true },
    type: "DoubleLedOnOff"
  };

  const ZumjuniorDoubleLed: IComponent = {
    name: "ZumjuniorDoubleLed",
    extends: "",
    code: {
      globals: [
        "{% for pin in pinsInfo %}\n        uint8_t {{pin.pinVarName}} = {{pin.pinNumber}} ;\n        {% endfor %}"
      ],
      setup: [
        "{% for pin in pinsInfo %}\n        pinMode({{pin.pinVarName}},OUTPUT);\n        {% endfor %}"
      ]
    },
    onValue: "LOW",
    offValue: "HIGH",
    actions: [
      {
        name: "write",
        parameters: ["pinVarName", "value"],
        code: "digitalWrite({{pinVarName}}, {{value}})"
      }
    ],
    instanceName: "bloq-led-instance-name",
    connectors: [
      {
        name: "main",
        type: "zumjunior-digital",
        position: { x: 0.28, y: 1 },
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
      url:
        "https://bitbloq.bq.com/images/components/1548099714577.zumjunior_double_led.svg",
      width: 124,
      height: 124
    }
  };

  const hardware: IHardware = {
    board: "zumjunior",
    components: [{ component: "ZumjuniorDoubleLed", name: "led", port: "1" }]
  };

  const componentDefinition = getComponentForBloq(
    bloqInstance,
    hardware,
    components
  );

  expect(componentDefinition).toEqual(ZumjuniorDoubleLed);
});

test("ActionDefinition", () => {
  const bloqInstance: IBloq = {
    parameters: { component: "led", led1: true, led2: true },
    type: "DoubleLedOnOff"
  };

  const componentInstance: IComponentInstance = {
    component: "ZumjuniorDoubleLed",
    name: "led",
    port: "1"
  };

  const bloqDefinition = getBloqDefinition(bloqTypes, bloqInstance);

  const componentDefinition = getFullComponentDefinition(
    components,
    componentInstance
  );

  const actionsParameters = getActions(
    bloqInstance,
    bloqDefinition,
    componentDefinition
  );

  const actionsP = [
    {
      parameters: { pinVarName: "ledWhitePin", value: "true" },
      definition: {
        name: "write",
        parameters: ["pinVarName", "value"],
        code: "digitalWrite({{pinVarName}}, {{value}})"
      }
    },
    {
      parameters: { pinVarName: "ledColorPin", value: "true" },
      definition: {
        name: "write",
        parameters: ["pinVarName", "value"],
        code: "digitalWrite({{pinVarName}}, {{value}})"
      }
    }
  ];
  // console.info(actionsParameters);
  expect(actionsParameters).toEqual(actionsP);
});

test("actions2code", () => {
  const actionsP = [
    {
      parameters: { pinVarName: "ledWhitePin", value: "true" },
      definition: {
        name: "write",
        parameters: ["pinVarName", "value"],
        code: "digitalWrite({{pinVarName}}, {{value}})"
      }
    },
    {
      parameters: { pinVarName: "ledColorPin", value: "true" },
      definition: {
        name: "write",
        parameters: ["pinVarName", "value"],
        code: "digitalWrite({{pinVarName}}, {{value}})"
      }
    }
  ];

  const code: string[] = actions2code(actionsP);

  expect(code).toEqual([
    "digitalWrite(ledWhitePin, true)",
    "digitalWrite(ledColorPin, true)"
  ]);
});

test("program2code", () => {
  const bloqInstance1: IBloq = {
    parameters: { component: "led1", led1: true, led2: true },
    type: "DoubleLedOnOff"
  };

  const bloqInstance2: IBloq = {
    parameters: { component: "led2", led1: false, led2: true },
    type: "DoubleLedOnOff"
  };

  const hardware: IHardware = {
    board: "zumjunior",
    components: [
      { component: "ZumjuniorDoubleLed", name: "led1", port: "1" },
      { component: "ZumjuniorDoubleLed", name: "led2", port: "2" }
    ]
  };

  const program: IBloq[][] = [[]];
  program.push([bloqInstance1, bloqInstance2]);

  const includes: string[] = [];
  const globals: string[] = [];
  const setup: string[] = [];
  const loop: string[] = [];
  const definitions: string[] = [];

  const arduinoCode: IArduinoCode = {
    includes,
    globals,
    setup,
    loop,
    definitions
  };

  program2code(components, bloqTypes, hardware, program, arduinoCode);

  expect(arduinoCode.loop).toEqual([
    "digitalWrite(led1WhitePin, true)",
    "digitalWrite(led1ColorPin, true)",
    "digitalWrite(led2WhitePin, false)",
    "digitalWrite(led2ColorPin, true)"
  ]);
});
