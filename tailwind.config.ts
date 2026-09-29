import type { Config } from "tailwindcss";
export default {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: { extend: { colors: {
    blush: "#FFF1F5", petal: "#FFD6E3", rose: "#FF7FA6", berry: "#E2437F", plum: "#4A1630",
  }, fontFamily: { display: ["'Baloo 2'", "ui-rounded", "system-ui", "sans-serif"] } } },
} satisfies Config;
