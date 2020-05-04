import ArduinoEventsLib from "./libraries/ArduinoEventsLib.zip";
import BQZUMJunior from "./libraries/BQZUMJunior.zip";
import BQZUMI2C7SegmentDisplay from "./libraries/BQZUMI2C7SegmentDisplay.zip";
import Servo from "./libraries/Servo.zip";
import BQZUMI2CColorSensor from "./libraries/BQZUMI2CColorSensor.zip";
import BQZUMI2CALPSSensor from "./libraries/BQZUMI2CALPSSensor.zip";
import BQZUMI2CTempSensor from "./libraries/BQZUMI2CTempSensor.zip";

export const juniorLibraries = [
  { zipURL: ArduinoEventsLib, precompiled: true },
  { zipURL: BQZUMJunior, precompiled: true },
  { zipURL: BQZUMI2C7SegmentDisplay, precompiled: true },
  { zipURL: Servo, precompiled: true },
  { zipURL: BQZUMI2CColorSensor, precompiled: true },
  { zipURL: BQZUMI2CALPSSensor, precompiled: true },
  { zipURL: BQZUMI2CTempSensor, precompiled: true }
];
