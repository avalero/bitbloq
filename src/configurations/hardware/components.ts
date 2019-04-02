import { IComponent, ConnectorPinMode } from "./types";

export const components: Partial<IComponent>[] = [
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
    "onValue": "HIGH",
    "offValue": "LOW",
    "actions": [
      {
        name: "read",
        parameters: [
          "pin"
        ],
        code: "digitalRead({{pin}})",
        returns: "uint8_t"
      }
    ]
  },
  {
    "name": "DigitalOutput",
    "extends": "Digital",
    "onValue": "HIGH",
    "offValue": "LOW",
    "actions": [
      {
        name: "write",
        parameters: [
          "pin", "value"
        ],
        code: "digitalWrite({{pin}}, {{value}})",
        returns: "uint8_t"
      }
    ]
  },
  {
    "name": "Button",
    "extends": "DigitalInput",
  },
  {
    "name": "Led",
    "extends": "DigitalOutput",
  },
  {
    "name": "ZumjuniorButton",
    "extends": "DigitalInput",
    "instanceName": "bloq-button-instance-name",
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
            "mode": ConnectorPinMode.INPUT,
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
    "instanceName": "bloq-led-instance-name",
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
            "mode": ConnectorPinMode.OUTPUT,
            "portPin": "0"
          },
          {
            "name": "ColorPin",
            "mode": ConnectorPinMode.OUTPUT,
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
  },
  {
    "name": "DoubleSwitch",
    "extends": "DigitalInput"
  },
  {
    "name": "ZumjuniorSwitch",
    "extends": "DoubleSwitch",
    "instanceName": "bloq-switch-instance-name",
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
            "name": "Pin1",
            "mode": ConnectorPinMode.INPUT,
            "portPin": "0"
          },
          {
            "name": "Pin2",
            "mode": ConnectorPinMode.INPUT,
            "portPin": "1"
          }
        ]
      }
    ],
    "image": {
      "url": "https://bitbloq.bq.com/images/components/1548099714577.zumjunior_slider.svg",
      "width": 124,
      "height": 124
    }
  }
];
