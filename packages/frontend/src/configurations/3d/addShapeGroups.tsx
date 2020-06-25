import React from "react";
import { Icon } from "@bitbloq/ui";

import carIcon from "../../images/car.svg";
import busIcon from "../../images/bus.svg";
import pickupIcon from "../../images/pickup.svg";
import vanIcon from "../../images/van.svg";
import truckIcon from "../../images/truck.svg";
import helicopterIcon from "../../images/helicopter.svg";
import tree1Icon from "../../images/tree-1.svg";
import tree2Icon from "../../images/tree-2.svg";
import streetlightIcon from "../../images/streetlight.svg";
import trafficlightIcon from "../../images/trafficlight.svg";
import trafficSign1Icon from "../../images/traffic-sign-1.svg";
import trafficSign2Icon from "../../images/traffic-sign-2.svg";
import trafficSign3Icon from "../../images/traffic-sign-3.svg";
import windmillIcon from "../../images/windmill.svg";
import building1Icon from "../../images/building-1.svg";
import building2Icon from "../../images/building-2.svg";
import building3Icon from "../../images/building-3.svg";
import building4Icon from "../../images/building-4.svg";

const STL_STORAGE_PATH = "https://storage.googleapis.com/bitbloq-prod/stl";

export const addShapeGroups = [
  {
    label: "city-elements",
    icon: <Icon name="city-elements" />,
    shapes: [
      {
        type: "PredesignedObject",
        parameters: { url: `${STL_STORAGE_PATH}/car.stl` },
        label: "shape-car",
        icon: <img src={carIcon} />
      },
      {
        type: "PredesignedObject",
        parameters: { url: `${STL_STORAGE_PATH}/bus.stl` },
        label: "shape-bus",
        icon: <img src={busIcon} />
      },
      {
        type: "PredesignedObject",
        parameters: { url: `${STL_STORAGE_PATH}/pickup.stl` },
        label: "shape-pickup",
        icon: <img src={pickupIcon} />
      },
      {
        type: "PredesignedObject",
        parameters: { url: `${STL_STORAGE_PATH}/van.stl` },
        label: "shape-van",
        icon: <img src={vanIcon} />
      },
      {
        type: "PredesignedObject",
        parameters: { url: `${STL_STORAGE_PATH}/truck.stl` },
        label: "shape-truck",
        icon: <img src={truckIcon} />
      },
      {
        type: "PredesignedObject",
        parameters: { url: `${STL_STORAGE_PATH}/helicopter.stl` },
        label: "shape-helicopter",
        icon: <img src={helicopterIcon} />
      },
      {
        type: "PredesignedObject",
        parameters: { url: `${STL_STORAGE_PATH}/tree-1.stl` },
        label: "shape-tree-1",
        icon: <img src={tree1Icon} />
      },
      {
        type: "PredesignedObject",
        parameters: { url: `${STL_STORAGE_PATH}/tree-2.stl` },
        label: "shape-tree-2",
        icon: <img src={tree2Icon} />
      },
      {
        type: "PredesignedObject",
        parameters: { url: `${STL_STORAGE_PATH}/streetlight.stl` },
        label: "shape-streetlight",
        icon: <img src={streetlightIcon} />
      },
      {
        type: "PredesignedObject",
        parameters: { url: `${STL_STORAGE_PATH}/trafficlight.stl` },
        label: "shape-trafficlight",
        icon: <img src={trafficlightIcon} />
      },
      {
        type: "PredesignedObject",
        parameters: { url: `${STL_STORAGE_PATH}/traffic-sign-1.stl` },
        label: "shape-traffic-sign-1",
        icon: <img src={trafficSign1Icon} />
      },
      {
        type: "PredesignedObject",
        parameters: { url: `${STL_STORAGE_PATH}/traffic-sign-2.stl` },
        label: "shape-traffic-sign-2",
        icon: <img src={trafficSign2Icon} />
      },
      {
        type: "PredesignedObject",
        parameters: { url: `${STL_STORAGE_PATH}/traffic-sign-3.stl` },
        label: "shape-traffic-sign-3",
        icon: <img src={trafficSign3Icon} />
      },
      {
        type: "PredesignedObject",
        parameters: { url: `${STL_STORAGE_PATH}/windmill.stl` },
        label: "shape-windmill",
        icon: <img src={windmillIcon} />
      },
      {
        type: "PredesignedObject",
        parameters: { url: `${STL_STORAGE_PATH}/building-1.stl` },
        label: "shape-building-1",
        icon: <img src={building1Icon} />
      },
      {
        type: "PredesignedObject",
        parameters: { url: `${STL_STORAGE_PATH}/building-2.stl` },
        label: "shape-building-2",
        icon: <img src={building2Icon} />
      },
      {
        type: "PredesignedObject",
        parameters: { url: `${STL_STORAGE_PATH}/building-3.stl` },
        label: "shape-building-3",
        icon: <img src={building3Icon} />
      },
      {
        type: "PredesignedObject",
        parameters: { url: `${STL_STORAGE_PATH}/building-4.stl` },
        label: "shape-building-4",
        icon: <img src={building4Icon} />
      }
    ]
  }
];
