import next from "eslint-config-next";

export default [
  ...next,
  {
    rules: {
      "react-hooks/set-state-in-effect": "off",
      "@next/next/no-html-link-for-pages": "off"
    }
  }
];
