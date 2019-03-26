export const components = [
  {
    name: 'Digital',
    connectorType: 'DigitalPin',
    code: {
      globals: ['uint8_t {{pin}};'],
    },
  },
  {
    name: 'DigitalOutput',
    extends: 'Digital',
    code: {
      setup: ['pinMode({{pin}},INPUT);'],
    },
    actions: [
      {
        write: {
          params: ['pin', 'value'],
          code: 'digitalWrite({{pin}}, {{value}});',
        },
      },
    ],
  },
  {
    name: 'DigitalInput',
    extends: 'Digital',
    code: {
      setup: ['pinMode({{pin}},OUTPUT)'],
    },
    actions: [
      {
        read: {
          params: ['pin'],
          code: 'digitalRead({{pin}});',
          returns: 'uint8_t',
        },
      },
    ],
  },
  {
    name: 'LED',
    extends: 'DigitalOutput',
    actions: [
      {
        blink: {
          params: ['pin', 'times', 'delay'],
          code: `for(uint8_t i; i<{{times}}; i++){
                   digitalWrite({{pin}}, HIGH);
                   delay({{delay}});
                   digitalWrite({{pin}}, LOW);
                   delay({{delay}});
                }`,
        },
      },
    ],
    values: [{ turnOn: 1 }, { turnOff: 0 }],
  },
  {
    name: 'ZUMJuniorLED',
    extends: 'DigitalOutput',
    values: [{ turnOn: 0 }, { turnOff: 1 }],
  },
  {
    name: 'Button',
    extends: 'DigitalInput',
    values: [{ isPressed: 0 }, { isNotPressed: 1 }],
  },
];
