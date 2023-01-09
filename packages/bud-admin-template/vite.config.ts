import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'
import dts from 'vite-plugin-dts'
import { createSvgIconsPlugin } from 'vite-plugin-svg-icons'

import Components from 'unplugin-vue-components/vite'
import { AntDesignVueResolver } from 'unplugin-vue-components/resolvers'
import vueJsx from '@vitejs/plugin-vue-jsx'
import { visualizer } from 'rollup-plugin-visualizer'
console.log(__dirname)
console.log(resolve(process.cwd(), 'src/assets/icons/svg'))

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    lib: {
      entry: resolve(__dirname, './src/index.ts'),
      name: 'Bundle',
      fileName: 'Bundle',
    },
    rollupOptions: {
      external: [
        'vue',
        '@shopify/draggable',
        '@ant-design/icons-vue',
        'ant-design-vue',
        'pinia',
        '@vitejs/plugin-vue-jsx',
        '@vitejs/plugin-vue',
        'vue-router',
        'axios',
        'dayjs',
        'less',
        '@vueuse/core',
        'vite-plugin-svg-icons',
        'vue-tsc',
      ],
      output: {
        globals: {
          vue: 'vue',
        },
      },
    },
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
    },
  },
  plugins: [
    vue(),
    dts({ include: './src' }),
    vueJsx(),
    Components({
      resolvers: [AntDesignVueResolver()],
    }),
    createSvgIconsPlugin({
      // 配置你存放 svg 图标的目录
      iconDirs: [resolve(process.cwd(), 'src/assets/icons/svg')],
      // 定义 symbolId 格式
      symbolId: 'icon-[dir]-[name]',
    }),
    visualizer(),
  ],
})
