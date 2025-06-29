import globals from "globals";
import pluginJs from "@eslint/js";
import tseslintParserPkg from "@typescript-eslint/parser";
import tseslintPluginPkg from "@typescript-eslint/eslint-plugin";
import pluginReact from "eslint-plugin-react";
import pluginReactHooks from "eslint-plugin-react-hooks";

const tseslintParser = tseslintParserPkg;
const tseslintPlugin = tseslintPluginPkg.plugin;

export default [
  {
    files: ["**/*.{js,mjs,cjs,ts,jsx,tsx}"],
    languageOptions: {
      parser: tseslintParser,
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
        ecmaVersion: "latest",
        sourceType: "module",
      },
      globals: {
        __DEV__: "readonly",
        __dirname: "readonly",
        __filename: "readonly",
        console: "readonly",
        exports: "readonly",
        module: "readonly",
        process: "readonly",
        require: "readonly",
      },
    },
    plugins: {
      typescript: tseslintPlugin,
      react: pluginReact,
      "react-hooks": pluginReactHooks,
    },
    rules: {
      ...pluginJs.configs.recommended.rules,
      ...tseslintPluginPkg.configs.recommended.rules,
      ...pluginReact.configs.recommended.rules,
      ...pluginReactHooks.configs.recommended.rules,
      // Add custom rules here
      "react/react-in-jsx-scope": "off",
      "react/prop-types": "off",
    },
  },
  {
    ignores: ["node_modules/", "build/", ".expo/", "ios/", "android/"],
  }
];