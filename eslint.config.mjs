import nextPlugin from "@next/eslint-plugin-next";
import next from "eslint-config-next";

export default [
  ...next,
  {
    plugins: {
      "@next/next": nextPlugin
    },
    rules: {
      "@next/next/no-html-link-for-pages": "off"
    }
  }
];
