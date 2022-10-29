// https://v3.nuxtjs.org/api/configuration/nuxt.config
export default defineNuxtConfig({
  // ssr: false,
  app: {
    head: {
      htmlAttrs: {
        lang: "en",
      },
      meta: [
        { charset: "utf-8" },
        { name: "viewport", content: "width=device-width, initial-scale=1" },
        { name: "msapplication-TileColor", content: "#da532c" },
        { name: "theme-color", content: "#ffffff" },
        { name: "title", content: "Count on it - Home" },
        {
          name: "description",
          content:
            "Count on it is a simple and easy-to-use countdown website that lets you create powerful countdowns to your dates in 3 clicks.",
        },
        { property: "og:type", content: "website" },
        { property: "og:title", content: "Count on it - Home" },
        {
          property: "og:description",
          content:
            "Count on it is a simple and easy-to-use countdown website that lets you create powerful countdowns to your dates in 3 clicks.",
        },
        { property: "twitter:title", content: "Count on it - Home" },
        {
          property: "twitter:description",
          content:
            "Count on it is a simple and easy-to-use countdown website that lets you create powerful countdowns to your dates in 3 clicks.",
        },
      ],
      link: [
        {
          rel: "apple-touch-icon",
          sizes: "180x180",
          href: "/apple-touch-icon.png",
        },
        {
          rel: "icon",
          type: "image/png",
          sizes: "32x32",
          href: "/favicon-32x32.png",
        },
        {
          rel: "icon",
          type: "image/png",
          sizes: "16x16",
          href: "/favicon-16x16.png",
        },
        { rel: "mask-icon", href: "/safari-pinned-tab.svg", color: "#5bbad5" },
      ],
    },
  },
  buildModules: [
    "nuxt-windicss",
    "@kevinmarrec/nuxt-pwa",
    "@nuxtjs/color-mode",
    "@nuxtjs/google-fonts",
    "unplugin-icons/nuxt",
  ],
  pwa: {
    meta: {
      mobileAppIOS: true,
    },
    workbox: {
      enabled: true,
    },
  },
  colorMode: {
    classSuffix: "",
  },
  components: true,
  googleFonts: {
    families: {
      "Roboto Mono": [400],
    },
  },
});
