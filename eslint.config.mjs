import { FlatCompat } from "@eslint/eslintrc";
import js from "@eslint/js";
import path from "path";
import { fileURLToPath } from "url";
import globals from "globals";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

export default [
  {
    ignores: [".next/**", "node_modules/**"],
  },
  js.configs.recommended,
  ...compat.plugins("css-modules"),
  ...compat.extends("plugin:css-modules/recommended"),
  // ...compat.extends("next/core-web-vitals"),
  {
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
      }
    },
    rules: {
       "no-unused-vars": "warn",
       "no-console": "warn",
    }
  }
];