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
    {
      btn: "block text-center text-black min-w-[100px] py-4 px-4 font-semibold rounded shadow-md",
    },
    {
      "btn-primary": "bg-brand-primary text-white",
    },
    {
      "btn-success": "bg-success text-white",
    },
    {
      "btn-info": "bg-info text-white",
    },
    {
      "btn-error": "bg-danger text-white",
    },
    { "btn-disabled": "text-gray-400 bg-gray-200" },
    { "btn-lg": "py-8 px-8 text-lg" },
    { "btn-sm": "py-2 px-2 text-sm" },
    { "btn-xl": "py-12 px-12 text-xl" },
    { "menu-link": "block p-4 hover:bg-gray-100" },
    { "menu-header": "px-4 py-2 text-gray-400 font-bold text-sm" },
    { hr: "my-2 border-b border-gray-400" },
  ],
});
