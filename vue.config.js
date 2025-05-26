const { defineConfig } = require('@vue/cli-service')
/*
module.exports = defineConfig({
  transpileDependencies: true
})
  */


// vue.config.js
module.exports = {
  pages: {
    index: {
      entry: 'src/main.js',
      title: 'Biblioteca', // << aquí defines el title que luego se usa en index.html
    }
  }
}
