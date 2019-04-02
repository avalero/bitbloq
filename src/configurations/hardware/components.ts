export const components = [
  {
    "name": "Digital",
    "code": {
      "globals": [
        "uint8_t {{pin}};"
      ],
    },
  },
  {
    "name": "DigitalOutput",
    "extends": "Digital",
    "code": {
      "setup": [
        "pinMode({{pin}},INPUT);"
      ],
    },
    "write": {
      "code": "digitalWrite({{pin}}, {{value}});",
    }
  },
  {
    "name": "DigitalInput",
    "extends": "Digital",
    "code": {
      "setup": [
        "pinMode({{pin}},OUTPUT)"
      ],
    },
    "read": {
      "code": "digitalRead({{pin}});",
      "returns": "uint8_t"
    }
  },
  {
    "name": "LED",
    "extends": "DigitalOutput",
    "write": {
      "values":{
        "turnOn": 1,
        "turnOff": 0
      },
    }
  },
  {
    "name": "Button",
    "extends": "DigitalInput",
    "read": {
      "values":{
        "isPressed": 1,
        "isNotPressed": 0
      },
    }
  }
];