import {IBoard} from './types';

export const boards: IBoard[] = [
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
      ]
    },
    "ports": [
      {
        "name": "1",
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
      },
      {
        "name": "2",
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
        ]
      },
      {
        "name": "3",       
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
        ]
      },
      {
        "name": "4",
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
        ]      
      },
      {
        "name": "A",
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
        ]
      },
      {
        "name": "B",
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
        ]
      }
    ]
  }
];
