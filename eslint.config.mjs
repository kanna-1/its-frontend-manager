import globals from "globals";
import pluginJs from "@eslint/js";
import tseslint from "typescript-eslint";
import pluginReactConfig from "eslint-plugin-react/configs/recommended.js";

export default [
  {languageOptions: { globals: globals.browser }},
  pluginJs.configs.recommended,
  ...tseslint.configs.recommended,
  pluginReactConfig,
  
  {
    rules: {
        // Turn off rule that enforces react must be imported
        "react/jsx-uses-react": "off", 
        "react/react-in-jsx-scope": "off", 

        "no-unused-vars": "warn", // Warns about unused variables
        "no-undef": "warn", // Warns about undeclared variables
        "quotes": ["warn", "double"], // Enforce double quotes
        "indent": ["warn", 2], // Enforces 2 space indentation
        "@typescript-eslint/explicit-function-return-type": ["warn", { "allowExpressions": true }], // Requires explicit return types on functions
        "@typescript-eslint/explicit-module-boundary-types": "warn", // Requires explicit return types on exported functions and classes
        "@typescript-eslint/no-explicit-any": "warn", // Disallows `any` as a type
        "no-multiple-empty-lines": ["error", { "max": 1 }], // Rule to disallow double newlines
    }
  }
];