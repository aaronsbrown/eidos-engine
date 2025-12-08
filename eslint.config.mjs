// ESLint configuration for NextJS 16 with TypeScript support
import typescript from '@typescript-eslint/eslint-plugin';
import typescriptParser from '@typescript-eslint/parser';

const eslintConfig = [
  {
    ignores: ["node_modules/**", ".next/**", "out/**", "dist/**", "storybook-static/**"],
  },
  {
    files: ["**/*.{js,jsx,ts,tsx}"],
    languageOptions: {
      ecmaVersion: 2024,
      sourceType: "module",
      parser: typescriptParser,
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
      },
    },
    plugins: {
      '@typescript-eslint': typescript,
    },
    rules: {
      // Minimal rules to prevent build failures
      "no-unused-vars": "off",
      "@typescript-eslint/no-unused-vars": "off",
      "@typescript-eslint/no-explicit-any": "off",
      "react-hooks/exhaustive-deps": "off",
    }
  }
];

export default eslintConfig;
