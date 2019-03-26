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
];
