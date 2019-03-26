const juniorbloqs = [
  {
    category: 'action',
    name: 'turnLedOnOff',
    icon: 'turnLedOnOffIcon',
    components: ['LED', 'ZUMJuniorLED'],
    parameters: [
      {
        name: 'name',
        label: 'bloq-name-led',
        type: 'string',
        value: '{name}',
      },
      {
        name: 'options',
        label: 'bloq-options-led',
        type: 'select',
        value: [
          {
            name: 'turnOn',
            label: 'bloq-turnon-led',
            icon: 'doubleLedOnfIcon',
          },
          {
            name: 'turnOff',
            label: 'bloq-turnoff-led',
            icon: 'doubleLedOfffIcon',
          },
        ],
      },
    ],
  },
  {
    category: 'action',
    name: 'blinkLED',
    icon: 'blinkLEDIcon',
    components: ['LED', 'ZUMJuniorLED'],
    parameters: [
      {
        name: 'name',
        label: 'bloq-name-led',
        type: 'string',
        value: 'miLED',
      },
      {
        name: 'delay',
        label: 'bloq-options-blink-led-delay',
        type: 'number',
        value: 1000,
      },
      {
        name: 'times',
        label: 'bloq-options-blink-led-times',
        type: 'number',
        value: 5,
      },
    ],
  },
];
