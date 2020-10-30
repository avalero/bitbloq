module.exports = {
  env: {
    browser: true,
    node: true,
    es6: true
  },
  parser: "@babel/eslint-parser",
  parserOptions: {
    ecmaFeatures: { jsx: true },
    ecmaVersion: 2018,
    sourceType: "module"
  },
  extends: [
    "eslint:recommended",
    "plugin:react/recommended",
    "plugin:prettier/recommended"
  ],
  rules: {
    "react/prop-types": "off",
    "no-empty": "off"
  },
  settings: {
    react: {
      version: "detect"
    }
  },
  ignorePatterns: ["**/lib3d/*", "**/api/src/api-types.ts"],
  overrides: [
    {
      parser: "@typescript-eslint/parser",
      parserOptions: {
        ecmaVersion: 6,
        sourceType: "module",
        ecmaFeatures: {
          jsx: true
        }
      },
      files: ["**/*.ts", "**/*.tsx"],
      extends: [
        "plugin:react/recommended",
        "plugin:@typescript-eslint/recommended",
        "prettier/@typescript-eslint",
        "plugin:prettier/recommended"
      ],
      rules: {
        "@typescript-eslint/explicit-function-return-type": "off",
        "@typescript-eslint/interface-name-prefix": "off",
        "@typescript-eslint/no-explicit-any": "off",
        "@typescript-eslint/no-var-requires": "off",
        "react/prop-types": "off",
        "react/react-in-jsx-scope": "off",
        "no-empty": "off"
      }
    }
  ]
};
