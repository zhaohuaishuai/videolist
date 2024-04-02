import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import {resolve} from 'path'
import reactRefresh from '@vitejs/plugin-react-refresh'


// https://vitejs.dev/config/
export default defineConfig({
  plugins:[vue(
    {
      template: {
        compilerOptions: {
          isCustomElement: tag => tag === 'simple-greeting'
        }
      }
    }
  ),reactRefresh()],
  esbuild: {
    jsxInject: `import React from 'react'`,
    jsxFactory: 'React.createElement',
    jsxFragment: 'React.Fragment'
  },
  resolve:{
    alias:{
      '@':resolve(__dirname,'src')
    }
  },
  build:{
    lib:{
      entry: {
        main: resolve(__dirname, './src/main.ts'),
        useVu3Hook: resolve(__dirname, './src/hook/vue3Hook/note.ts'),
      },
      name:'StarNote',
      fileName:'[name]'
    },
    rollupOptions:{
      external:['vue'],
      output:{
        globals:{
          vue:'Vue'
        }
      },
      // input: {
      //   main: resolve(__dirname, './src/main.ts'),
      //   vue3: resolve(__dirname, './src/hook/note/note.ts'),
      // },
    }
  },
  
})
