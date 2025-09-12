module.exports = {
  i18n: {
    defaultLocale: "en",
    locales: ["en", "hi", "bn", "ti", "tu", "pu"],
    localePath: "./public/locales",
    reloadOnPrerender: process.env.NODE_ENV === "development",
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
}
