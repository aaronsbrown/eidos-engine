// For more info, see https://github.com/storybookjs/eslint-plugin-storybook#configuration-flat-config-format
import storybook from "eslint-plugin-storybook";
import security from "eslint-plugin-security";

import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  ...storybook.configs["flat/recommended"],
  {
    plugins: {
      security: security
    },
    rules: {
      // Security rules - moderate strictness for pattern generator app
      "security/detect-object-injection": "warn",
      "security/detect-non-literal-fs-filename": "warn", 
      "security/detect-non-literal-regexp": "warn",
      "security/detect-non-literal-require": "warn",
      "security/detect-possible-timing-attacks": "warn",
      "security/detect-pseudoRandomBytes": "warn",
      "security/detect-unsafe-regex": "error",
      "security/detect-buffer-noassert": "error",
      "security/detect-child-process": "error",
      "security/detect-disable-mustache-escape": "error",
      "security/detect-eval-with-expression": "error",
      "security/detect-new-buffer": "error",
      "security/detect-no-csrf-before-method-override": "error"
    }
  }
];

export default eslintConfig;
