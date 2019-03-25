import { colors, Icon } from "@bitbloq/ui";

import ThreeDEditor from "./components/ThreeDEditor";
import JuniorEditor from "./components/JuniorEditor";

import carIcon from "./images/car.svg";
import busIcon from "./images/bus.svg";
import pickupIcon from "./images/pickup.svg";
import vanIcon from "./images/van.svg";
import truckIcon from "./images/truck.svg";
import helicopterIcon from "./images/helicopter.svg";
import tree1Icon from "./images/tree-1.svg";
import tree2Icon from "./images/tree-2.svg";
import streetlightIcon from "./images/streetlight.svg";
import trafficlightIcon from "./images/trafficlight.svg";
import trafficSign1Icon from "./images/traffic-sign-1.svg";
import trafficSign2Icon from "./images/traffic-sign-2.svg";
import trafficSign3Icon from "./images/traffic-sign-3.svg";
import windmillIcon from "./images/windmill.svg";
import building1Icon from "./images/building-1.svg";
import building2Icon from "./images/building-2.svg";
import building3Icon from "./images/building-3.svg";
import building4Icon from "./images/building-4.svg";

import carSTL from "./assets/stl/car.stl";
import busSTL from "./assets/stl/bus.stl";
import pickupSTL from "./assets/stl/pickup.stl";
import vanSTL from "./assets/stl/van.stl";
import truckSTL from "./assets/stl/truck.stl";
import helicopterSTL from "./assets/stl/helicopter.stl";
import tree1STL from "./assets/stl/tree-1.stl";
import tree2STL from "./assets/stl/tree-2.stl";
import streetlightSTL from "./assets/stl/streetlight.stl";
import trafficlightSTL from "./assets/stl/trafficlight.stl";
import trafficSign1STL from "./assets/stl/traffic-sign-1.stl";
import trafficSign2STL from "./assets/stl/traffic-sign-2.stl";
import trafficSign3STL from "./assets/stl/traffic-sign-3.stl";
import windmillSTL from "./assets/stl/windmill.stl";
import building1STL from "./assets/stl/building-1.stl";
import building2STL from "./assets/stl/building-2.stl";
import building3STL from "./assets/stl/building-3.stl";
import building4STL from "./assets/stl/building-4.stl";

import flagIcon from "./images/bloqs/flag.svg";
import switch1OnIcon from "./images/bloqs/switch-1on.svg";
import switch1OffIcon from "./images/bloqs/switch-1off.svg";
import switch2OnIcon from "./images/bloqs/switch-2on.svg";
import switch2OffIcon from "./images/bloqs/switch-2off.svg";
import buttonIcon from "./images/bloqs/button.svg";
import buttonPressedIcon from "./images/bloqs/button-pressed.svg";
import buttonReleasedIcon from "./images/bloqs/button-released.svg";
import lightIcon from "./images/bloqs/light.svg"
import darkIcon from "./images/bloqs/dark.svg"
import obstacleIcon from "./images/bloqs/obstacle.svg";
import noObstacleIcon from "./images/bloqs/no-obstacle.svg";
import timeIcon from "./images/bloqs/time.svg";
import time1Icon from "./images/bloqs/time-1.svg";
import time5Icon from "./images/bloqs/time-5.svg";
import doubleLedOnOnIcon from "./images/bloqs/double-led-on-on.svg";
import doubleLedOffOnIcon from "./images/bloqs/double-led-off-on.svg";
import doubleLedOnOffIcon from "./images/bloqs/double-led-on-off.svg";
import doubleLedOffOffIcon from "./images/bloqs/double-led-off-off.svg";

export const documentTypes = {
  bloqs: {
    label: "Robótica por bloques",
    shortLabel: "Robótica",
    color: colors.green,
    supported: false
  },
  "3d": {
    label: "Diseño 3D",
    shortLabel: "Diseño 3D",
    color: colors.brandBlue,
    supported: true,
    editorComponent: ThreeDEditor
  },
  code: {
    label: "Robótica por código",
    shortLabel: "Código",
    color: colors.brandPink,
    supported: false
  },
  junior: {
    label: "Robótica Junior",
    shortLabel: "Junior",
    color: colors.brandOrange,
    supported: true,
    editorComponent: JuniorEditor
  },
  apps: {
    label: "Diseño y programación de Apps",
    shortLabel: "Apps móviles",
    color: colors.brandYellow,
    supported: false
  }
};

export const addShapeGroups = [
  {
    label: "city-elements",
    icon: <Icon name="city-elements" />,
    shapes: [
      {
        type: "PredesignedObject",
        parameters: { url: carSTL },
        label: "shape-car",
        icon: <img src={carIcon} />
      },
      {
        type: "PredesignedObject",
        parameters: { url: busSTL },
        label: "shape-bus",
        icon: <img src={busIcon} />
      },
      {
        type: "PredesignedObject",
        parameters: { url: pickupSTL },
        label: "shape-pickup",
        icon: <img src={pickupIcon} />
      },
      {
        type: "PredesignedObject",
        parameters: { url: vanSTL },
        label: "shape-van",
        icon: <img src={vanIcon} />
      },
      {
        type: "PredesignedObject",
        parameters: { url: truckSTL },
        label: "shape-truck",
        icon: <img src={truckIcon} />
      },
      {
        type: "PredesignedObject",
        parameters: { url: helicopterSTL },
        label: "shape-helicopter",
        icon: <img src={helicopterIcon} />
      },
      {
        type: "PredesignedObject",
        parameters: { url: tree1STL },
        label: "shape-tree-1",
        icon: <img src={tree1Icon} />
      },
      {
        type: "PredesignedObject",
        parameters: { url: tree2STL },
        label: "shape-tree-2",
        icon: <img src={tree2Icon} />
      },
      {
        type: "PredesignedObject",
        parameters: { url: streetlightSTL },
        label: "shape-streetlight",
        icon: <img src={streetlightIcon} />
      },
      {
        type: "PredesignedObject",
        parameters: { url: trafficlightSTL },
        label: "shape-trafficlight",
        icon: <img src={trafficlightIcon} />
      },
      {
        type: "PredesignedObject",
        parameters: { url: trafficSign1STL },
        label: "shape-traffic-sign-1",
        icon: <img src={trafficSign1Icon} />
      },
      {
        type: "PredesignedObject",
        parameters: { url: trafficSign2STL },
        label: "shape-traffic-sign-2",
        icon: <img src={trafficSign2Icon} />
      },
      {
        type: "PredesignedObject",
        parameters: { url: trafficSign3STL },
        label: "shape-traffic-sign-3",
        icon: <img src={trafficSign3Icon} />
      },
      {
        type: "PredesignedObject",
        parameters: { url: windmillSTL },
        label: "shape-windmill",
        icon: <img src={windmillIcon} />
      }
    ]
  },
  {
    label: "people",
    icon: <Icon name="people" />,
    shapes: [
      {
        type: "PredesignedObject",
        parameters: { url: building1STL },
        label: "shape-building-1",
        icon: <img src={building1Icon} />
      },
      {
        type: "PredesignedObject",
        parameters: { url: building2STL },
        label: "shape-building-2",
        icon: <img src={building2Icon} />
      },
      {
        type: "PredesignedObject",
        parameters: { url: building3STL },
        label: "shape-building-3",
        icon: <img src={building3Icon} />
      },
      {
        type: "PredesignedObject",
        parameters: { url: building4STL },
        label: "shape-building-4",
        icon: <img src={building4Icon} />
      }
    ]
  }
];

export const bloqTypes = [
  {
    category: "event",
    name: "OnStart",
    label: "bloq-on-start",
    icon: flagIcon,
    code: {}
  },
  {
    category: "event",
    name: "OnSwitch1On",
    icon: switch1OnIcon,
    parameterDefinitions: [{
      name: "switch",
      label: "bloq-parameter-switch",
      type: "selectComponent",
      componentType: "DoubleSwitch"
    }],
    code: {}
  },
  {
    category: "event",
    name: "OnSwitch1Off",
    icon: switch1OffIcon,
    parameterDefinitions: [{
      name: "switch",
      label: "bloq-parameter-switch",
      type: "selectComponent",
      componentType: "DoubleSwitch"
    }],
    code: {}
  },
  {
    category: "event",
    name: "OnSwitch2On",
    icon: switch2OnIcon,
    parameterDefinitions: [{
      name: "switch",
      label: "bloq-parameter-switch",
      type: "selectComponent",
      componentType: "DoubleSwitch"
    }],
    code: {}
  },
  {
    category: "event",
    name: "OnSwitch2Off",
    icon: switch2OffIcon,
    parameterDefinitions: [{
      name: "switch",
      label: "bloq-parameter-switch",
      type: "selectComponent",
      componentType: "DoubleSwitch"
    }],
    code: {}
  },
  {
    category: "event",
    name: "OnButtonReleased",
    icon: buttonReleasedIcon,
    parameterDefinitions: [{
      name: "button",
      label: "bloq-parameter-button",
      type: "selectComponent",
      componentType: "Button"
    }],
    code: {}
  },
  {
    category: "event",
    name: "OnButtonPressed",
    label: "bloq-on-button-pressed",
    icon: buttonPressedIcon,
    parameterDefinitions: [{
      name: "button",
      label: "bloq-parameter-button",
      type: "selectComponent",
      componentType: "Button"
    }],
    code: {
      "declarations": "void {{parameters.button.name}}_pressed();",
      "definitions": "void {{parameters.button.name}}_pressed() {\n if({{parameters.button.name}}PinOn) return;\n{{parameters.button.name}}PinOn = true;\n{{nextCode.statement}}\n{{finallyCode}}}\n",
      "statement": "if({{getComponentCode(parameters.button, 'read')}}) {{parameters.button.name}}_pressed();",
      "finally": "{{parameters.button.name}}PinOn = false;\n"
    }
  },
  {
    category: "event",
    name: "OnLight",
    icon: lightIcon,
    parameterDefinitions: [{
      name: "button",
      label: "bloq-parameter-button",
      type: "selectComponent",
      componentType: "LightSensor"
    }],
    code: {}
  },
  {
    category: "event",
    name: "OnDark",
    icon: darkIcon,
    parameterDefinitions: [{
      name: "button",
      label: "bloq-parameter-button",
      type: "selectComponent",
      componentType: "LightSensor"
    }],
    code: {}
  },
  {
    category: "event",
    name: "OnObjectDetected",
    icon: obstacleIcon,
    parameterDefinitions: [{
      name: "button",
      label: "bloq-parameter-button",
      type: "selectComponent",
      componentType: "ProximitySensor"
    }],
    code: {}
  },
  {
    category: "event",
    name: "OnNoObjectDetected",
    icon: noObstacleIcon,
    parameterDefinitions: [{
      name: "button",
      label: "bloq-parameter-button",
      type: "selectComponent",
      componentType: "ProximitySensor"
    }],
    code: {}
  },
  {
    category: "action",
    name: "DoubleLedTurnOnOn",
    icon: doubleLedOnOnIcon,
    parameterDefinitions: [{
      name: "led",
      label: "bloq-parameter-led",
      type: "selectComponent",
      componentType: "DoubleLed"
    }],
    code: {}
  },
  {
    category: "action",
    name: "DoubleLedTurnOffOn",
    icon: doubleLedOffOnIcon,
    parameterDefinitions: [{
      name: "led",
      label: "bloq-parameter-led",
      type: "selectComponent",
      componentType: "DoubleLed"
    }],
    code: {}
  },
  {
    category: "action",
    name: "DoubleLedTurnOnOff",
    icon: doubleLedOnOffIcon,
    parameterDefinitions: [{
      name: "led",
      label: "bloq-parameter-led",
      type: "selectComponent",
      componentType: "DoubleLed"
    }],
    code: {}
  },
  {
    category: "action",
    name: "DoubleLedTurnOffOff",
    icon: doubleLedOffOffIcon,
    parameterDefinitions: [{
      name: "led",
      label: "bloq-parameter-led",
      type: "selectComponent",
      componentType: "DoubleLed"
    }],
    code: {}
  },
  {
    category: "wait",
    name: "Wait1Second",
    icon: time1Icon,
    code: {}
  },
  {
    category: "wait",
    name: "Wait5Seconds",
    icon: time5Icon,
    code: {}
  }
];

export const eventBloqGroups = [
  {
    category: "event",
    icon: flagIcon,
    types: ["OnStart"]
  },
  {
    category: "event",
    icon: switch1OnIcon,
    types: ["OnSwitch1On", "OnSwitch1Off", "OnSwitch2On", "OnSwitch2Off"]
  },
  {
    category: "event",
    icon: buttonIcon,
    types: ["OnButtonReleased", "OnButtonPressed"]
  },
  {
    category: "event",
    icon: lightIcon,
    types: ["OnLight", "OnDark"]
  },
  {
    category: "event",
    icon: obstacleIcon,
    types: ["OnObjectDetected", "OnNoObjectDetected"]
  }
];

export const actionBloqGroups = [
  {
    category: "action",
    icon: doubleLedOnOnIcon,
    types: [
      "DoubleLedTurnOnOn",
      "DoubleLedTurnOffOn",
      "DoubleLedTurnOnOff",
      "DoubleLedTurnOffOff"
    ]
  }
];

export const waitBloqGroups = [
  {
    category: "wait",
    icon: timeIcon,
    types: ["Wait1Second", "Wait5Seconds"]
  }
];

export const boards = [
  {
    "name": "zumjunior",
    "code": {
      "includes": [
        "<BQZUMJunior.h>",
        "<BQZUMJuniorPorts.h>"
      ],
      "globals": [
        "BQ::ZUMJunior zumJunior;"
      ],

      "setup": [
        "zumJunior.setup();"
      ],

      "loop": [

      ],
      
      "definitions": [

      ]
    },
    "image": {
      "url": "https://bitbloq.bq.com/images/boards/1548099714577.zumjunior.svg",
      "width": 300,
      "height": 300
    },
    "ports": [
      {
        "name": "1",
        "position": {
          "x": -0.9,
          "y": 0.15,
        },
        "connectorTypes": [
          "zumjunior-digital",
          "zumjunior-analog"
        ],
        "pins": [
          {
            "name": "0",
            "value": "BQ::ZUMJunior::ports[1][0]"
          },
          {
            "name": "1",
            "value": "BQ::ZUMJunior::ports[1][1]"
          }
        ],
        "placeholderPosition": {
          "x": -1.5,
          "y": 0.8,
        },
        "direction": "west"
      },
      {
        "name": "2",
        "position": {
          "x": -0.9,
          "y": -0.15,
        },
        "connectorTypes": [
          "zumjunior-digital",
          "zumjunior-analog"
        ],
        "pins": [
          {
            "name": "0",
            "value": "BQ::ZUMJunior::ports[2][0]"
          },
          {
            "name": "1",
            "value": "BQ::ZUMJunior::ports[2][1]"
          }
        ],
        "placeholderPosition": {
          "x": -1.5,
          "y": -0.8,
        },
        "direction": "west"
      },
      {
        "name": "3",
        "position": {
          "x": 0.9,
          "y": -0.15,
        },
        "connectorTypes": [
          "zumjunior-digital",
          "zumjunior-analog"
        ],
        "pins": [
          {
            "name": "0",
            "value": "BQ::ZUMJunior::ports[3][0]"
          },
          {
            "name": "1",
            "value": "BQ::ZUMJunior::ports[3][1]"
          }
        ],
        "placeholderPosition": {
          "x": 1.5,
          "y": -0.8,
        },
        "direction": "east"
      },
      {
        "name": "4",
        "position": {
          "x": 0.9,
          "y": 0.15,
        },
        "connectorTypes": [
          "zumjunior-digital",
          "zumjunior-analog"
        ],
        "pins": [
          {
            "name": "0",
            "value": "BQ::ZUMJunior::ports[4][0]"
          },
          {
            "name": "1",
            "value": "BQ::ZUMJunior::ports[4][1]"
          }
        ],
        "placeholderPosition": {
          "x": 1.5,
          "y": 0.8,
        },
        "direction": "east"
      },
      {
        "name": "A",
        "position": {
          "x": 0.15,
          "y": 0.9,
        },
        "connectorTypes": [
          "zumjunior-digital",
          "zumjunior-analog",
          "zumjunior-i2c"
        ],
        "pins": [
          {
            "name": "0",
            "value": "BQ::ZUMJunior::ports[A][0]"
          },
          {
            "name": "1",
            "value": "BQ::ZUMJunior::ports[A][0]"
          },
          {
            "name": "i2c",
            "value": "BQ::ZUMJunior::i2cPorts[A]"
          }
        ],
        "placeholderPosition": {
          "x": 0.8,
          "y": 1.5,
        },
        "direction": "north"
      },
      {
        "name": "B",
        "position": {
          "x": -0.15,
          "y": 0.9,
        },
        "connectorTypes": [
          "zumjunior-digital",
          "zumjunior-analog",
          "zumjunior-i2c"
        ],
        "pins": [
          {
            "name": "0",
            "value": "BQ::ZUMJunior::ports[B][0]"
          },
          {
            "name": "1",
            "value": "BQ::ZUMJunior::ports[B][0]"
          },
          {
            "name": "i2c",
            "value": "BQ::ZUMJunior::i2cPorts[B]"
          }
        ],
        "placeholderPosition": {
          "x": -0.8,
          "y": 1.5,
        },
        "direction": "north"
      }
    ]
  }
];

export const components = [
  {
    "name": "Component",
    "code": {
      "definitions": [
        "{% for connection in component.connections %}",
        "{% for pin in getConnector(connection.connector).pins %}",
        "const uint_8 {{component.name}}{{pin.name}} = {{getBoardPin(connection.port, pin.portPin).value}};",
        "{% endfor %}",
        "{% endfor %}"
      ],
      "setup": [
        "{% for connection in component.connections %}",
        "{% for pin in getConnector(connection.connector).pins %}",
        "pinMode({{component.name}}{{pin.name}}, {{pin.mode}});",
        "{% endfor %}",
        "{% endfor %}"
      ]
    }
  },
  {
    "name": "Digital",
    "extends": "Component"
  },
  {
    "name": "DigitalInput",
    "extends": "Digital",
    "code": {
      "read": "digitalRead({{component.name}}{{componentClass.connectors[0].pins[0].name}})"
    }
  },
  {
    "name": "DigitalOutput",
    "extends": "Digital",
    "code": {
      "write": "digitalWrite({{component.name}}{{componentClass.connectors[0].pins[0].name}}, {{value}})"
    }
  },
  {
    "name": "Button",
    "extends": "DigitalInput"
  },
  {
    "name": "Led",
    "extends": "DigitalOutput",
    "onValue": "HIGH",
    "offValue": "LOW"
  },
  {
    "name": "ZumjuniorButton",
    "extends": "Button",
    "instanceName": "button",
    "connectors": [
      {
        "name": "main",
        "type": "zumjunior-digital",
        "position": {
          "x": -0.4,
          "y": -1,
        },
        "pins": [
          {
            "name": "Pin",
            "mode": "INPUT",
            "portPin": "0"
          }
        ]
      }
    ],
    "image": {
      "url": "https://bitbloq.bq.com/images/components/1548099714577.zumjunior_button.svg",
      "width": 124,
      "height": 124
    }
  },
  {
    "name": "DoubleLed",
    "extends": "Led"
  },
  {
    "name": "ZumjuniorLed",
    "extends": "DoubleLed",
    "onValue": "LOW",
    "offValue": "HIGH",
    "instanceName": "led",
    "connectors": [
      {
        "name": "main",
        "type": "zumjunior-digital",
        "position": {
          "x": 0.28,
          "y": 1,
        },
        "pins": [
          {
            "name": "WhitePin",
            "mode": "OUTPUT",
            "portPin": "0"
          },
          {
            "name": "ColorPin",
            "mode": "OUTPUT",
            "portPin": "1"
          }
        ]
      }
    ],
    "image": {
      "url": "https://bitbloq.bq.com/images/components/1548099714577.zumjunior_double_led.svg",
      "width": 124,
      "height": 124
    }
  }
];
