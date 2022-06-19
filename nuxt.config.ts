import { defineNuxtConfig } from "nuxt";
import IconsResolver from "unplugin-icons/resolver";
import ViteComponents from "unplugin-vue-components/vite";
// https://v3.nuxtjs.org/api/configuration/nuxt.config
export default defineNuxtConfig({
  ssr: false,
  buildModules: [
    "nuxt-windicss",
    "@nuxtjs/color-mode",
    "@nuxtjs/google-fonts",
    "unplugin-icons/nuxt",
  ],
  colorMode: {
    classSuffix: "",
  },
  components: true,
  googleFonts: {
    families: {
      "Major Mono Display": [400],
    },
  },
  vite: {
    plugins: [
      ViteComponents({
        resolvers: [
          IconsResolver({
            componentPrefix: "",
          }),
        ],
        dts: true,
      }),
    ],
    // base: '/_nuxt/'
  },
});
