import {
  defineConfig,
  transformerVariantGroup,
  transformerDirectives,
} from "unocss";
// import { handler } from "@unocss/preset-mini/utils";

const spacing = {
  s: "8px",
  m: "12px",
  l: "18px",
  xl: "28px",
  "2xl": "40px",
  "3xl": "60px",
};

const fontSize = {
  s: ["16px", "20px"],
  m: ["20px", "22px"],
  l: ["22px", "26px"],
  xl: ["32px", "1"],
  "2xl": ["40px", "1"],
};

const lineHeight = {
  s: "20px",
  m: "22px",
  l: "26px",
  xl: "32px",
  "2xl": "38px",
};

const letterSpacing = {
  s: "0px",
  m: "-0.15px",
  l: "-0.3px",
  xl: "-0.45px",
  "2xl": "-0.6px",
};

const borderRadius = {
  s: "4px",
  m: "6px",
  l: "10px",
  xl: "14px",
};

export default defineConfig({
  theme: {
    colors: {
      primary: {
        default: "#c05165",
        "5xDark": "#420000",
        "4xDark": "#540002",
        "3xDark": "#68001a",
        "2xDark": "#81002c",
        xDark: "#961e3e",
        light: "#cb6b78",
        xLight: "#d68790",
        "2xLight": "#df9fa5",
        "3xLight": "#e7b7bb",
        "4xLight": "#f0d3d5",
        "5xLight": "#f6ebec",
      },
      secondary: {
        default: "#008957",
        "5xDark": "#002000",
        "4xDark": "#002900",
        "3xDark": "#003807",
        "2xDark": "#004d1d",
        xDark: "#00612f",
        dark: "#007543",
        light: "#379a6d",
        xLight: "#63ad87",
        "2xLight": "#84bd9e",
        "3xLight": "#a4cdb6",
        "4xLight": "#c8e0d2",
        "5xLight": "#e7f0eb",
      },
      tertiary: {
        default: "#0083c1",
        "5xDark": "#001851",
        "4xDark": "#002562",
        "3xDark": "#003574",
        "2xDark": "#00498a",
        xDark: "#005c9c",
        dark: "#006faf",
        light: "#2293ca",
        xLight: "#60a6d3",
        "2xLight": "#84b8db",
        "3xLight": "#a5c9e3",
        "4xLight": "#c9dded",
        "5xLight": "#e8eff5",
      },
      accent: {
        default: "#0080c6",
        "5xDark": "#001456",
        "4xDark": "#002367",
        "3xDark": "#003378",
        "2xDark": "#00478e",
        xDark: "#0059a1",
        dark: "#006cb3",
        light: "#3d90ce",
        xLight: "#6ca4d6",
        "2xLight": "#8db6de",
        "3xLight": "#abc7e5",
        "4xLight": "#ccdcee",
        "5xLight": "#e9eff5",
      },
      grey: {
        normal: "#677b79",
        "5xDark": "#002522",
        "4xDark": "#0e322f",
        "3xDark": "#21413e",
        "2xDark": "#324e4b",
        xDark: "#445c59",
        dark: "#576d6a",
        light: "#839492",
        xLight: "#9eabaa",
        "2xLight": "#b6c0bf",
        "3xLight": "#ced6d5",
        "4xLight": "#e6e9e8",
        "5xLight": "#f9f9f9",
      },
    },
    spacing,
    letterSpacing,
    lineHeight,
    fontSize,
    borderRadius,
  },
  transformers: [transformerVariantGroup(), transformerDirectives()],
  shortcuts: [
    [/^text-(s|m|l|xl|2xl)$/, ([, c]) => `text-${c} tracking-${c}`],
    {
      btn: "block text-center min-w-[100px] py-l px-l font-semibold rounded-m shadow-md",
    },
    {
      "btn-success":
        "text-secondary-2x-dark bg-secondary-4x-light hover:bg-secondary-3x-light",
    },
    {
      "btn-info":
        "text-tertiary-2x-dark bg-tertiary-4x-light hover:bg-tertiary-light",
    },
    {
      "btn-error":
        "text-primary-2x-dark bg-primary-4x-light hover:bg-primary-dark",
    },
    { "btn-disabled": "text-gray-400 bg-gray-200" },
    { "btn-lg": "py-xl px-xl text-l" },
    { "btn-sm": "py-s px-s text-s" },
    { "btn-xl": "py-2xl px-2xl text-xl" },
    { "menu-link": "block p-m hover:bg-gray-100" },
    { "menu-header": "px-4 py-2 text-gray-400 font-bold text-sm" },
    { hr: "my-2 border-b border-gray-400" },
  ],
});
