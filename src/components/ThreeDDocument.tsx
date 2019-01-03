import * as React from 'react';
import NoSSR from 'react-no-ssr';
import {ThreeD, TranslateProvider} from '@bitbloq/3d';

const messagesFiles = {
  'en': '/messages/en.json'
};

const initialContent = [
  {
    "type": "Cube",
    "viewOptions": {
      "color": "#9900ef",
      "visible": true,
      "highlighted": false,
      "name": "Cube",
      "opacity": 0.5
    },
    "operations": [
      {
        "x": 0,
        "y": 0,
        "z": 0,
        "relative": false,
        "type": "translation",
        "id": "13073561-0ec0-11e9-829d-87eb0d7daab7"
      },
      {
        "x": 0,
        "y": 0,
        "z": 0,
        "relative": true,
        "type": "rotation",
        "id": "13073562-0ec0-11e9-829d-87eb0d7daab7"
      },
      {
        "x": 1,
        "y": 1,
        "z": 1,
        "type": "scale",
        "id": "13073563-0ec0-11e9-829d-87eb0d7daab7"
      }
    ],
    "parameters": {
      "width": 10,
      "height": 10,
      "depth": 10
    }
  },
  {
    "type": "Cylinder",
    "viewOptions": {
      "color": "#ff6900",
      "visible": true,
      "highlighted": false,
      "name": "Cylinder",
      "opacity": 1
    },
    "operations": [
      {
        "x": 0,
        "y": 0,
        "z": 0,
        "relative": false,
        "type": "translation",
        "id": "145a1b31-0ec0-11e9-829d-87eb0d7daab7"
      },
      {
        "x": 0,
        "y": 0,
        "z": 0,
        "relative": true,
        "type": "rotation",
        "id": "145a1b32-0ec0-11e9-829d-87eb0d7daab7"
      },
      {
        "x": 1,
        "y": 1,
        "z": 1,
        "type": "scale",
        "id": "145a1b33-0ec0-11e9-829d-87eb0d7daab7"
      }
    ],
    "parameters": {
      "r0": 5,
      "r1": 5,
      "height": 17
    }
  }
];

const ThreeDDocument = () => (
  <NoSSR>
    <TranslateProvider messagesFiles={messagesFiles}>
      <ThreeD initialContent={initialContent} />
    </TranslateProvider>
  </NoSSR>
);

export default ThreeDDocument;
