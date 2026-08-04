module.exports = {
  apps: [
    {
      name: 'pintu-frontend',
      script: './.output/server/index.mjs',
      env: {
        NUXT_PUBLIC_API_BASE: 'https://api-pintu.sdnsukapura01.sch.id',
        NUXT_PORT: 3001,
        NODE_ENV: 'production'
      }
    }
  ]
}
