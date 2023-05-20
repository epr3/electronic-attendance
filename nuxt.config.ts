// https://nuxt.com/docs/api/configuration/nuxt-config

export default defineNuxtConfig({
  typescript: {
    shim: false,
    strict: true,
  },

  build: {
    transpile: ["trpc-nuxt"],
  },

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
    "nuxt-iron-session",
    "@vee-validate/nuxt",
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
    webFonts: {
      provider: "google",
      fonts: {
        sans: "DM Sans",
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
