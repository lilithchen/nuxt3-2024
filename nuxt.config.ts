// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-04-03',
  devtools: { enabled: true },
  devServer: {
    port: 3001
  },
  app: {
    head: {
      title: '享樂酒店｜Enjoyment Luxury Hotel',
      charset: 'utf-8',
      meta: [
        { name: 'viewport', 
          content: 'width=device-width, initial-scale=1, minimum-scale=1, maximum-scale=1,',
        },
        {
          name: 'description',
          content: '高雄豪華住宿之選, 我們致力於為您提供無與倫比的奢華體驗與優質服務',
        },
      ],
      
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
