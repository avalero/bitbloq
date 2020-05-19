import { IHardware } from "@bitbloq/bloqs";
import Robotics from "./Robotics";

export interface IRoboticsContent {
  hardware: Partial<IHardware>;
}

export { Robotics };
