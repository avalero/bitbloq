import React from "react";
import dynamic from "next/dynamic";

import { colors, Icon } from "@bitbloq/ui";

import { addShapeGroups } from "./configurations/3d/addShapeGroups";
import Loading from "./components/Loading";
import { ResourcesTypes } from "./types";
import env from "./lib/env";

export { addShapeGroups };

const ENABLED_TOOLS = env.ENABLED_TOOLS || [];

const CreateDynamicComponent = function DynamicComponent(fn, loadingColor) {
  return dynamic(fn, {
    ssr: false,
    loading: function LoadingComponent() {
      return <Loading color={loadingColor} />;
    }
  });
};

export const documentTypes = {
  junior: {
    label: "tools.junior-label",
    shortLabel: "tools.junior-short-label",
    color: colors.brandOrange,
    buttonType: "orange",
    supported: ENABLED_TOOLS.includes("junior"),
    icon: "logo-junior",
    level: "tools.level-beginner",
    landingText: "tools.junior-landing-text",
    editorComponent: CreateDynamicComponent(
      () => import("./components/JuniorEditor"),
      colors.brandOrange
    )
  },
  robotics: {
    label: "tools.robotica-label",
    shortLabel: "tools.robotica-short-label",
    color: colors.green,
    supported: ENABLED_TOOLS.includes("robotics"),
    icon: "logo-robotics",
    level: "tools.level-intermediate",
    landingText: "tools.robotica-landing-text",
    editorComponent: CreateDynamicComponent(
      () => import("./components/RoboticsEditor"),
      colors.green
    )
  },
  code: {
    label: "tools.arduino-label",
    shortLabel: "tools.arduino-short-label",
    color: colors.brandPink,
    buttonType: "pink",
    icon: "logo-code",
    level: "tools.level-advanced",
    landingText: "tools.arduino-landing-text",
    supported: ENABLED_TOOLS.includes("code"),
    editorComponent: CreateDynamicComponent(
      () => import("./components/CodeEditor"),
      colors.brandPink
    )
  },
  "3d": {
    acceptedResourcesTypes: [ResourcesTypes.object3D],
    label: "tools.3d-label",
    shortLabel: "tools.3d-short-label",
    color: colors.brandBlue,
    buttonType: "blue",
    supported: ENABLED_TOOLS.includes("3d"),
    icon: "logo-3d",
    level: "tools.level-intermediate",
    landingText: "tools.3d-landing-text",
    editorComponent: CreateDynamicComponent(
      () => import("./components/ThreeDEditor"),
      colors.brandBlue
    )
  },
  apps: {
    label: "tools.apps-label",
    shortLabel: "tools.apps-short-label",
    color: colors.brandYellow,
    buttonType: "yellow",
    icon: "logo-apps",
    level: "tools.level-advanced",
    landingText: "tools.apps-landing-text",
    supported: ENABLED_TOOLS.includes("apps")
  }
};

export const resourceGroup = {
  label: "exercises.resources.title",
  icon: <Icon name="exercise-resources" />,
  shapes: [],
  resources: true
};

export const resourceTypes = {
  image: {
    id: "image",
    label: "cloud.resources.images",
    icon: "resource-image",
    formats: [".png", ".gif", ".jpg", ".jpeg", ".webp"]
  },
  video: {
    id: "video",
    label: "cloud.resources.videos",
    icon: "resource-video",
    formats: [".mp4", ".webm"]
  },
  sound: {
    id: "sound",
    label: "cloud.resources.sounds",
    icon: "resource-sound",
    formats: [".mp3", ".ocg"]
  },
  object3D: {
    id: "object3D",
    label: "cloud.resources.objects",
    icon: "resource-object3D",
    formats: [".stl"]
  },
  arduinoLibrary: {
    id: "arduinoLibrary",
    label: "cloud.resources.arduinoLibraries",
    icon: "resource-object3D",
    formats: [".zip"]
  },
  deleted: {
    id: "deleted",
    label: "cloud.resources.deleted",
    icon: "resource-deleted"
  }
};

export const plans = [
  {
    name: "unregistered",
    featureTable: [
      "create-documents",
      "download-documents",
      "open-documents",
      "create-documents-with-bq-kits",
      "exercise-access"
    ],
    ageLimit: 0
  },
  {
    name: "member",
    bitbloqCloud: true,
    highlightedFeatures: ["save-online-documents"],
    featureTable: [
      "create-documents",
      "download-documents",
      "open-documents",
      "create-documents-with-bq-kits",
      "exercise-access",
      "bitbloq-cloud",
      "save-unlimited-documents"
    ],
    isFree: true,
    ageLimit: 14
  },
  {
    name: "teacher",
    bitbloqCloud: true,
    highlightedFeatures: [
      "create-exercises",
      "correct-exercises",
      "unregistered-student-access"
    ],
    featureTable: [
      "create-documents",
      "download-documents",
      "open-documents",
      "create-documents-with-bq-kits",
      "exercise-access",
      "bitbloq-cloud",
      "save-unlimited-documents",
      "online-compilation",
      "exercise-compilation",
      "create-exercises",
      "correct-exercises"
    ],
    originalPrice: 6,
    isBetaFree: true,
    ageLimit: 18
  }
];

export const featureTable = [
  "create-documents",
  "download-documents",
  "open-documents",
  "create-documents-with-bq-kits",
  "exercise-access",
  "bitbloq-cloud",
  "save-unlimited-documents",
  "online-compilation",
  "exercise-compilation",
  "create-exercises",
  "correct-exercises"
];

export const educationalStages = [
  "preschool",
  "primary",
  "high-school",
  "college"
];

export const signupSteps = {
  birthDate: "birth-date",
  create: "create",
  leave: "leave",
  plan: "plan",
  userData: "user-data"
};

const defaultFlags = {
  SHOW_GRAPHQL_LOGS: false,
  JUNIOR_DEBUG_SPEED: 0
};

let savedFlags = {};
if (typeof window !== `undefined`) {
  const savedFlagsString = window.localStorage.getItem("flags");
  if (savedFlagsString) {
    try {
      savedFlags = JSON.parse(savedFlagsString);
    } catch (e) {}
  }
}

export const flags = {
  ...defaultFlags,
  ...savedFlags
};

export const maxLengthName = 64;
export const maxSTLFileSize = 5242880;

export const minChromeVersion = 69;

export const supportedLanguages = ["es", "en"];
export const defaultLanguage = "es";

export const googleAuthEndpoint =
  "https://accounts.google.com/o/oauth2/v2/auth";

export const googleScopes =
  "https://www.googleapis.com/auth/userinfo.profile https://www.googleapis.com/auth/userinfo.email";

export const privacyPolicyUrl =
  "https://storage.googleapis.com/webstatic.bq.com/Pol%C3%ADtica%20Privacidad/Politica%20privacidad_ES.pdf";
