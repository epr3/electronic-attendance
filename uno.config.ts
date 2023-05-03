import {
  defineConfig,
  transformerVariantGroup,
  transformerDirectives,
} from "unocss";
// import { handler } from "@unocss/preset-mini/utils";

export default defineConfig({
  transformers: [transformerVariantGroup(), transformerDirectives()],
  shortcuts: {
    btn: "block text-center min-w-[100px] py-2 px-4 font-semibold rounded-lg shadow-md",
    "btn-success": "text-white bg-green-500 hover:bg-green-700",
    "btn-info": "text-white bg-blue-500 hover:bg-blue-700",
    "btn-error": "text-white bg-red-500 hover:bg-red-700",
    "btn-disabled": "text-gray-400 bg-gray-200",
    "btn-lg": "py-4 px-6 text-lg",
    "btn-sm": "py-1 px-2 text-sm",
    "btn-xl": "py-4 px-8 text-xl",
    "menu-link": "block p-4 hover:bg-gray-100",
    "menu-header": "px-4 py-2 text-gray-400 font-bold text-sm",
    hr: "my-2 border-b border-gray-400",
  },
});
