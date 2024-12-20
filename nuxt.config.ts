// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-04-03',
  devtools: { enabled: true },
  devServer: {
    port: 3001
  },
  app: {
    head: {
      meta: [{ name: 'viewport', content: 'width=device-width, initial-scale=1.0' }],
      title: '享樂酒店｜Enjoyment Luxury Hotel',
      link: [
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: 'anonymous' },
        { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Noto+Serif+TC:wght@200..900&display=swap' },
      ],
    },
  },
  css: ['~/assets/styles/all.scss', 'swiper/css', 'swiper/css/navigation', 'swiper/css/pagination'],
  modules: ["@pinia/nuxt"],
  components: {
    dirs: [
      {
        path: '~/components/global',
        global: true,
      },
    ],
  },
});
