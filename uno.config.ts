import {
  defineConfig,
  transformerVariantGroup,
  transformerDirectives,
} from "unocss";
// import { handler } from "@unocss/preset-mini/utils";

export default defineConfig({
  theme: {
    colors: {
      brand: {
        primary: "#1E7FE9",
        accent: {
          light: "#50BAD3",
          dark: "#4B6F9E",
        },
        shade: {
          light: "#FAF9F9",
          dark: "#1B1E35",
        },
      },
      info: "#1b1e35",
      success: "#3ea17e",
      warning: "#bc9146",
      danger: "#f44336",
    },
  },
  transformers: [transformerVariantGroup(), transformerDirectives()],
  shortcuts: [
    [/^square-(.*)$/, ([, c]) => `w-${c} h-${c}`],
    { "menu-link": "block p-4 hover:bg-gray-100" },
    { "menu-header": "px-4 py-2 text-gray-400 font-bold text-sm" },
    { hr: "my-2 border-b border-gray-400" },
  ],
});
