import { BloqCategory, BloqSubCategory } from "./types";

export const bloqCategories = [
  {
    name: BloqCategory.Component,
    icon: "led-on",
    label: "robotics.bloq-categories.components",
    color: "#ce1c23"
  },
  {
    name: BloqCategory.Functions,
    iconText: "robotics.bloq-categories.fun",
    label: "robotics.bloq-categories.functions",
    color: "#dd5b0c"
  },
  {
    name: BloqCategory.Control,
    iconText: "robotics.bloq-categories.con",
    label: "robotics.bloq-categories.control",
    color: "#11489a"
  },
  {
    name: BloqCategory.Math,
    iconText: "robotics.bloq-categories.mat",
    label: "robotics.bloq-categories.math",
    color: "#01c0c8"
  }
];

export const bloqSubCategories = [
  BloqSubCategory.Junior,
  BloqSubCategory.Basic,
  BloqSubCategory.Advanced
];
