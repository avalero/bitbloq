import {
  getComponentDefinition,
  getFullComponentDefinition,
  composeComponents
} from "../componentBuilder";
import { IComponentNew } from "../../index";

import { components } from "./config/components";

const LED = {
  name: "LED",
  extends: "DigitalOutput",
  write: {
    values: {
      turnOn: 1,
      turnOff: 0
    }
  }
};

const fullLED = {
  name: "LED",
  code: {
    globals: ["uint8_t {{pin}};"],
    setup: ["pinMode({{pin}},INPUT);"]
  },
  extends: undefined,
  write: {
    code: "digitalWrite({{pin}}, {{value}});",
    values: { turnOn: 1, turnOff: 0 }
  }
};

const DigitalOutput = {
  name: "DigitalOutput",
  extends: "Digital",
  code: {
    setup: ["pinMode({{pin}},INPUT);"]
  },
  write: {
    code: "digitalWrite({{pin}}, {{value}});"
  }
};

const LEDDigitalOutputComp = {
  name: "LED",
  extends: "Digital",
  code: { setup: ["pinMode({{pin}},INPUT);"] },
  write: {
    code: "digitalWrite({{pin}}, {{value}});",
    values: { turnOn: 1, turnOff: 0 }
  }
};

test("getComponentDefinition", () => {
  const comp: Partial<IComponentNew> = getComponentDefinition(
    components,
    "LED"
  );
  // console.info(comp);
  expect(comp).toEqual(LED);
});

test("composeComponents", () => {
  const composition: Partial<IComponentNew> = composeComponents(
    DigitalOutput,
    LED
  );
  expect(composition).toEqual(LEDDigitalOutputComp);
});

test("constructComponent", () => {
  const comp: Partial<IComponentNew> = getFullComponentDefinition(
    components,
    LED
  );
  expect(comp).toEqual(fullLED);
});
