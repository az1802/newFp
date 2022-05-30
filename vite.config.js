/*
 * @Author: sunjie
 * @Date: 2022-01-20 18:54:05
 * @LastEditors: sunj
 * @LastEditTime: 2022-02-18 16:24:40
 * @FilePath: /new-fanpiao-uniapp/vite.config.js
 */
import { defineConfig } from 'vite'
import uni from '@dcloudio/vite-plugin-uni'

const { resolve } = require('path')

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    sourcemap: true,
  },
  plugins: [
    uni(),
  ],
  resolve: {
    alias: [
      { find: '@', replacement: resolve(__dirname, 'src') },
      { find: '@components', replacement: resolve(__dirname, 'src/components') },
      { find: '@api', replacement: resolve(__dirname, 'src/api') },
      { find: '@utils', replacement: resolve(__dirname, 'src/utils') },
      { find: '@hooks', replacement: resolve(__dirname, 'src/hooks') },
      { find: '@state', replacement: resolve(__dirname, 'src/state') },
      { find: '@design', replacement: resolve(__dirname, 'src/design') },
      { find: '@static', replacement: resolve(__dirname, 'src/static') },
      { find: '@mockData', replacement: resolve(__dirname, 'src/mockData') },
      { find: '@assets', replacement: resolve(__dirname, 'src/assets') }
    ]
  }
})
