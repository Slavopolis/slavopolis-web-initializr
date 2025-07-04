import '@/assets/base.css'
import '@/assets/styles/antd-custom.css'
import '@/assets/styles/theme.css'
import Antd from 'ant-design-vue'
import 'ant-design-vue/dist/reset.css'
import { createPinia } from 'pinia'
import { createApp } from 'vue'

import { setErrorHandler, setupGlobalErrorHandler } from '@/utils/errorHandler'
import App from './App.vue'
import router from './router'

const app = createApp(App)

app.use(createPinia())
app.use(router)
app.use(Antd)

// 初始化全局错误处理器
const errorHandler = setupGlobalErrorHandler(router)
setErrorHandler(errorHandler)

// Vue应用错误处理
app.config.errorHandler = (err, instance, info) => {
  console.error('Vue error:', err, info)

  // 处理Vue组件错误
  const error = err as Error
  errorHandler.showGenericError({
    message: 'Vue组件出错',
    details: `错误: ${error.message || String(err)}\n组件信息: ${info}\n堆栈: ${error.stack || ''}`,
    title: 'Vue错误',
  })
}

app.mount('#app')
