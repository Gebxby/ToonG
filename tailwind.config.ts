import type { Config } from "tailwindcss";
export default {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: { extend: { colors: {
    blush: "#FFF1F5", petal: "#FFD6E3", rose: "#FF7FA6", berry: "#E2437F", plum: "#4A1630",
  }, fontFamily: { display: ["'Baloo 2'", "ui-rounded", "system-ui", "sans-serif"] } } },keyframes: {
  "fade-up": { from: { opacity: "0", transform: "translateY(14px)" }, to: { opacity: "1", transform: "none" } },
  "fade-in": { from: { opacity: "0" }, to: { opacity: "1" } },
  pop: { from: { opacity: "0", transform: "scale(.96)" }, to: { opacity: "1", transform: "none" } },
  shake: { "0%,100%": { transform: "translateX(0)" }, "25%": { transform: "translateX(-6px)" }, "75%": { transform: "translateX(6px)" } },
},
animation: {
  "fade-up": "fade-up .5s cubic-bezier(.22,1,.36,1) both",
  "fade-in": "fade-in .35s ease-out both",
  pop: "pop .35s cubic-bezier(.22,1,.36,1) both",
  shake: "shake .35s ease-in-out",
},
} satisfies Config;
