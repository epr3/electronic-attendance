// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  typescript: {
    shim: false,
    strict: true,
  },

  build: {
    transpile: ["trpc-nuxt"],
  },

  plugins: ["~/plugins/dayjs", "~/plugins/trpc"],

  components: {
    dirs: [
      {
        path: "~/components",
        pathPrefix: false,
        extensions: ["vue"],
      },
    ],
  },

  modules: [
    "@nuxtjs/eslint-module",
    "@unocss/nuxt",
    "@vueuse/nuxt",
    "@vee-validate/nuxt",
    "nuxt-iron-session",
  ],

  unocss: {
    preflight: true,
    uno: true,
    icons: {
      collections: {
        heroicons: () =>
          import("@iconify-json/heroicons/icons.json").then((i) => i.default),
      },
    },
  },

  session: {
    cookieName: "electronic-attendance",
    password: "complex_password_at_least_32_characters_long",
    cookieOptions: {
      secure: process.env.NODE_ENV === "production",
    },
  },

  runtimeConfig: {},

  devtools: {
    enabled: false,
  },
});
