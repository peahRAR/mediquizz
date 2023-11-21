// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  modules: ["@nuxtjs/tailwindcss", "@nuxt/image", "nuxt-socket-io"],
  io : { 
    // options du module 
    sockets: [ { 
      name: 'main' , 
      url: 'http://localhost:3000' 
    } ] 
  },
  image: {
    dir: 'assets/img',
    format: ['webp']
  },
})