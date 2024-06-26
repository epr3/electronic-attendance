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
        sans: {
          name: "DM Sans",
          weights: [
            "100",
            "200",
            "300",
            "400",
            "500",
            "600",
            "700",
            "800",
            "900",
          ],
        },
      },
    },
  },

  runtimeConfig: {
    vonageApiKey: process.env.VONAGE_API_KEY,
    vonageApiSecret: process.env.VONAGE_API_SECRET,
  },

  devtools: {
    enabled: false,
  },
});
