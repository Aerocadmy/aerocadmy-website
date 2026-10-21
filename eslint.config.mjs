import nextConfig from "eslint-config-next/core-web-vitals";

const config = [
  { ignores: [".next/**", ".next-dev/**", ".next-preview/**", "node_modules/**"] },
  ...nextConfig,
  {
    rules: {
      "react-hooks/set-state-in-effect": "off",
      "react-hooks/refs": "off",
      "@next/next/no-html-link-for-pages": "off",
    },
  },
];

export default config;
