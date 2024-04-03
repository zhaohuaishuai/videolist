import { defineConfig } from 'vite'
import {resolve} from 'path'
// https://vitejs.dev/config/
export default defineConfig({
  resolve:{
    alias:{
      '@':resolve(__dirname,'src')
    }
  },
  build:{
    lib:{
      entry: {
        main: resolve(__dirname, './src/main.ts'),
      },
      name:'AudioList',
      fileName:'[name]'
    }, 
  },
})
