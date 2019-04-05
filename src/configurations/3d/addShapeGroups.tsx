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

import carSTL from "../../assets/stl/car.stl";
import busSTL from "../../assets/stl/bus.stl";
import pickupSTL from "../../assets/stl/pickup.stl";
import vanSTL from "../../assets/stl/van.stl";
import truckSTL from "../../assets/stl/truck.stl";
import helicopterSTL from "../../assets/stl/helicopter.stl";
import tree1STL from "../../assets/stl/tree-1.stl";
import tree2STL from "../../assets/stl/tree-2.stl";
import streetlightSTL from "../../assets/stl/streetlight.stl";
import trafficlightSTL from "../../assets/stl/trafficlight.stl";
import trafficSign1STL from "../../assets/stl/traffic-sign-1.stl";
import trafficSign2STL from "../../assets/stl/traffic-sign-2.stl";
import trafficSign3STL from "../../assets/stl/traffic-sign-3.stl";
import windmillSTL from "../../assets/stl/windmill.stl";
import building1STL from "../../assets/stl/building-1.stl";
import building2STL from "../../assets/stl/building-2.stl";
import building3STL from "../../assets/stl/building-3.stl";
import building4STL from "../../assets/stl/building-4.stl";

export const addShapeGroups = [
  {
    label: "city-elements",
    icon: <Icon name="city-elements" />,
    shapes: [
      {
        type: "PredesignedObject",
        parameters: { url: carSTL },
        label: "shape-car",
        icon: <img src={carIcon} />
      },
      {
        type: "PredesignedObject",
        parameters: { url: busSTL },
        label: "shape-bus",
        icon: <img src={busIcon} />
      },
      {
        type: "PredesignedObject",
        parameters: { url: pickupSTL },
        label: "shape-pickup",
        icon: <img src={pickupIcon} />
      },
      {
        type: "PredesignedObject",
        parameters: { url: vanSTL },
        label: "shape-van",
        icon: <img src={vanIcon} />
      },
      {
        type: "PredesignedObject",
        parameters: { url: truckSTL },
        label: "shape-truck",
        icon: <img src={truckIcon} />
      },
      {
        type: "PredesignedObject",
        parameters: { url: helicopterSTL },
        label: "shape-helicopter",
        icon: <img src={helicopterIcon} />
      },
      {
        type: "PredesignedObject",
        parameters: { url: tree1STL },
        label: "shape-tree-1",
        icon: <img src={tree1Icon} />
      },
      {
        type: "PredesignedObject",
        parameters: { url: tree2STL },
        label: "shape-tree-2",
        icon: <img src={tree2Icon} />
      },
      {
        type: "PredesignedObject",
        parameters: { url: streetlightSTL },
        label: "shape-streetlight",
        icon: <img src={streetlightIcon} />
      },
      {
        type: "PredesignedObject",
        parameters: { url: trafficlightSTL },
        label: "shape-trafficlight",
        icon: <img src={trafficlightIcon} />
      },
      {
        type: "PredesignedObject",
        parameters: { url: trafficSign1STL },
        label: "shape-traffic-sign-1",
        icon: <img src={trafficSign1Icon} />
      },
      {
        type: "PredesignedObject",
        parameters: { url: trafficSign2STL },
        label: "shape-traffic-sign-2",
        icon: <img src={trafficSign2Icon} />
      },
      {
        type: "PredesignedObject",
        parameters: { url: trafficSign3STL },
        label: "shape-traffic-sign-3",
        icon: <img src={trafficSign3Icon} />
      },
      {
        type: "PredesignedObject",
        parameters: { url: windmillSTL },
        label: "shape-windmill",
        icon: <img src={windmillIcon} />
      }
    ]
  },
  {
    label: "people",
    icon: <Icon name="people" />,
    shapes: [
      {
        type: "PredesignedObject",
        parameters: { url: building1STL },
        label: "shape-building-1",
        icon: <img src={building1Icon} />
      },
      {
        type: "PredesignedObject",
        parameters: { url: building2STL },
        label: "shape-building-2",
        icon: <img src={building2Icon} />
      },
      {
        type: "PredesignedObject",
        parameters: { url: building3STL },
        label: "shape-building-3",
        icon: <img src={building3Icon} />
      },
      {
        type: "PredesignedObject",
        parameters: { url: building4STL },
        label: "shape-building-4",
        icon: <img src={building4Icon} />
      }
    ]
  }
];
