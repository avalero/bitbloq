import React, { useState } from "react";
import { bloqTypes, boards, components } from "@bitbloq/junior";
import {
  HardwareDesigner,
  HorizontalBloqEditor,
  IHardware,
  IBloqLine,
  IExtraData
} from "@bitbloq/bloqs";

export default {
  title: "junior"
};

export const HardwareDesignerNormal = () => {
  const [hardware, setHardware] = useState<IHardware>({
    board: "zumjunior",
    components: []
  });

  return (
    <div style={{ height: 500, display: "flex" }}>
      <HardwareDesigner
        boards={boards}
        components={components}
        hardware={hardware}
        onHardwareChange={setHardware}
      />
    </div>
  );
};

export const HardwareDesignerReadOnly = () => {
  const hardware = {
    board: "zumjunior",
    components: [
      {
        component: "ZumjuniorButton",
        name: "bloq-button-instance-name",
        port: "B"
      },
      {
        component: "ZumjuniorButton",
        name: "bloq-button-instance-name2",
        port: "2"
      },
      {
        component: "ZumjuniorSevenSegment",
        name: "bloq-seven-segment-instance-name",
        port: "A"
      }
    ]
  };

  return (
    <div style={{ height: 500, display: "flex" }}>
      <HardwareDesigner
        boards={boards}
        components={components}
        hardware={hardware}
        readOnly
      />
    </div>
  );
};

export const HorizontalBloqEditorNormal = () => {
  const board = boards.find(b => b.name === "zumjunior");
  const [program, setProgram] = useState<IBloqLine[]>([]);
  const [extraData, setExtraData] = useState<IExtraData>({});

  return (
    <div style={{ height: 500, display: "flex" }}>
      <HorizontalBloqEditor
        lines={program}
        components={components}
        bloqTypes={bloqTypes}
        availableBloqs={bloqTypes}
        onLinesChange={setProgram}
        board={board}
        extraData={extraData}
        onExtraDataChange={setExtraData}
        externalUpload
      />
    </div>
  );
};

export const HorizontalBloqEditorReadOnly = () => {
  const board = boards.find(b => b.name === "zumjunior");
  const program: IBloqLine[] = [
    {
      id: "fd0180d0-7837-11ea-9a2f-0d38d145d71e",
      bloqs: [
        {
          type: "OnDetectColor",
          parameters: {
            component: "",
            detect: "==",
            color: "green",
            value: "{{detect}}{{color}}"
          }
        },
        {
          type: "RGBLed",
          parameters: {
            component: "",
            value: "red"
          }
        },
        {
          type: "sendMessageA",
          parameters: {
            value: "messageC"
          }
        }
      ],
      disabled: false
    },
    {
      id: "083e1710-7838-11ea-9a2f-0d38d145d71e",
      bloqs: [
        {
          type: "OnDetectLight",
          parameters: {
            component: "",
            value: "sunset"
          }
        },
        {
          type: "ServoPosition",
          parameters: {
            component: "",
            value: 110
          }
        }
      ]
    }
  ];

  return (
    <div style={{ height: 500, display: "flex" }}>
      <HorizontalBloqEditor
        lines={program}
        components={components}
        bloqTypes={bloqTypes}
        board={board}
        externalUpload
        readOnly
      />
    </div>
  );
};
