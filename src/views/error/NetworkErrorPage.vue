<script setup lang="ts">
import type { ErrorPageEvents, ErrorPageFullConfig } from '@/types/error'
import { ErrorType } from '@/types/error'
import { computed, onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import ErrorPage from './ErrorPage.vue'

// 路由信息
const route = useRoute()

// 错误配置
const errorConfig: Partial<ErrorPageFullConfig> = {
  type: ErrorType.NETWORK_ERROR,
  code: 'NETWORK',
  title: '网络连接失败',
  description: '无法连接到服务器，请检查您的网络连接后重试。',
  icon: 'network-error',
  showBackButton: true,
  showHomeButton: true,
  showRetryButton: true,
  showDetails: true,
  customActions: [
    {
      text: '检查网络',
      type: 'dashed',
      icon: 'setting',
      handler: () => {
        console.info('User checked network')
        // 这里可以打开网络设置或网络诊断
        // window.open('chrome://settings/networks')
      },
    },
  ],
  layout: {
    layout: 'centered',
    maxWidth: '600px',
    padding: '60px 20px',
    showBackgroundPattern: true,
    backgroundPattern: 'waves',
  },
  animation: {
    enabled: true,
    enterAnimation: 'fade',
    duration: 600,
    delay: 0,
  },
  theme: {
    primaryColor: 'var(--ant-info-color)',
    backgroundColor: 'var(--ant-body-background)',
    textColor: 'var(--ant-text-color)',
    borderColor: 'var(--ant-border-color-base)',
    shadow: 'var(--ant-shadow-2)',
  },
}

// 事件处理
const events: ErrorPageEvents = {
  onMounted: () => {
    // 记录网络错误
    console.warn('Network Connection Error:', {
      path: route.fullPath,
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      onLine: navigator.onLine,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      connection: (navigator as any).connection,
    })

    // 可以在这里上报网络错误
    // networkLogger.logNetworkError({ path: route.fullPath, online: navigator.onLine })
  },
  onBack: () => {
    console.info('User clicked back button on network error page')
  },
  onHome: () => {
    console.info('User clicked home button on network error page')
  },
  onRetry: () => {
    console.info('User clicked retry button on network error page')
  },
}

// 从路由参数获取自定义消息
const customDescription = ref<string>('')
const customDetails = ref<string>('')
const networkStatus = ref<string>('')
const errorType = ref<string>('')

onMounted(() => {
  // 从查询参数获取自定义描述
  if (route.query.message) {
    customDescription.value = route.query.message as string
  }

  // 从查询参数获取错误详情
  if (route.query.details) {
    customDetails.value = route.query.details as string
  }

  // 从查询参数获取网络状态
  if (route.query.status) {
    networkStatus.value = route.query.status as string
  }

  // 从查询参数获取错误类型
  if (route.query.errorType) {
    errorType.value = route.query.errorType as string
  }
})

// 动态描述
const dynamicDescription = computed(() => {
  if (customDescription.value) {
    return customDescription.value
  }

  if (errorType.value) {
    switch (errorType.value) {
      case 'timeout':
        return '请求超时，请检查您的网络连接后重试。'
      case 'offline':
        return '您的设备已断开网络连接，请连接网络后重试。'
      case 'dns':
        return 'DNS 解析失败，请检查您的网络设置。'
      case 'cors':
        return '跨域请求被阻止，请联系技术支持。'
      default:
        return errorConfig.description || '网络连接失败，请检查您的网络连接后重试。'
    }
  }

  return errorConfig.description || '网络连接失败，请检查您的网络连接后重试。'
})

// 动态详情
const dynamicDetails = computed(() => {
  if (customDetails.value) {
    return customDetails.value
  }

  let details = ''
  details += `网络状态: ${navigator.onLine ? '在线' : '离线'}\n`

  if (networkStatus.value) {
    details += `连接状态: ${networkStatus.value}\n`
  }

  if (errorType.value) {
    details += `错误类型: ${errorType.value}\n`
  }

  if (route.fullPath) {
    details += `请求路径: ${route.fullPath}\n`
  }

  // 连接信息
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  if ((navigator as any).connection) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const conn = (navigator as any).connection
    details += `连接类型: ${conn.effectiveType || 'unknown'}\n`
    details += `下行速度: ${conn.downlink || 'unknown'} Mbps\n`
    details += `往返时间: ${conn.rtt || 'unknown'} ms\n`
  }

  details += `时间戳: ${new Date().toISOString()}`

  return details || undefined
})
</script>

<template>
  <ErrorPage :type="ErrorType.NETWORK_ERROR" :code="errorConfig.code" :title="errorConfig.title"
    :description="dynamicDescription" :details="dynamicDetails" :config="errorConfig" :events="events" />
</template>

<style scoped>
/* 网络错误页面特定样式 */
:deep(.error-page__code) {
  background: linear-gradient(135deg, var(--ant-info-color), var(--ant-info-6));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

:deep(.error-page__card) {
  background: var(--ant-component-background);
  border: 1px solid var(--ant-info-color-deprecated-border);
  box-shadow: 0 4px 12px rgba(24, 144, 255, 0.1);
}

/* 网络错误页面动画增强 */
:deep(.error-page__icon) {
  animation: networkErrorWave 2s ease-in-out infinite;
}

@keyframes networkErrorWave {

  0%,
  100% {
    transform: scale(1) rotate(0deg);
  }

  25% {
    transform: scale(1.02) rotate(1deg);
  }

  50% {
    transform: scale(1.05) rotate(0deg);
  }

  75% {
    transform: scale(1.02) rotate(-1deg);
  }
}

/* 重试按钮样式 */
:deep(.action-button--refresh) {
  background: linear-gradient(135deg, var(--ant-info-color), var(--ant-info-6));
  border: none;
  color: #ffffff;
}

:deep(.action-button--refresh:hover) {
  background: linear-gradient(135deg, var(--ant-info-5), var(--ant-info-7));
}

/* 检查网络按钮样式 */
:deep(.action-button--dashed) {
  border-color: var(--ant-info-color);
  color: var(--ant-info-color);
}

:deep(.action-button--dashed:hover) {
  border-color: var(--ant-info-5);
  color: var(--ant-info-5);
  background: var(--ant-info-1);
}

/* 错误详情样式 */
:deep(.error-page__details-content) {
  background: var(--ant-info-1);
  border: 1px solid var(--ant-info-3);
  font-family: 'Monaco', 'Menlo', 'Consolas', monospace;
}

:deep(.error-page__details-content pre) {
  color: var(--ant-info-7);
  font-size: 11px;
  line-height: 1.4;
}

/* 网络状态指示器 */
:deep(.error-page__card)::before {
  content: '';
  position: absolute;
  top: 12px;
  right: 12px;
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: var(--ant-error-color);
  animation: networkStatusBlink 1.5s ease-in-out infinite;
}

@keyframes networkStatusBlink {

  0%,
  100% {
    opacity: 1;
  }

  50% {
    opacity: 0.3;
  }
}

/* 响应式优化 */
@media (max-width: 768px) {
  :deep(.error-page__code) {
    font-size: 3rem;
  }
}

@media (max-width: 480px) {
  :deep(.error-page__code) {
    font-size: 2.5rem;
  }
}

/* 深色模式优化 */
@media (prefers-color-scheme: dark) {
  :deep(.error-page__code) {
    background: linear-gradient(135deg, var(--ant-info-4), var(--ant-info-6));
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }

  :deep(.error-page__card) {
    border-color: var(--ant-info-color-deprecated-border);
    box-shadow: 0 4px 12px rgba(24, 144, 255, 0.08);
  }

  :deep(.error-page__details-content) {
    background: var(--ant-info-1);
    border-color: var(--ant-info-3);
  }
}

/* 减少动画偏好 */
@media (prefers-reduced-motion: reduce) {
  :deep(.error-page__icon) {
    animation: none;
  }

  :deep(.error-page__card)::before {
    animation: none;
  }
}

/* 高对比度模式 */
@media (prefers-contrast: high) {
  :deep(.error-page__card) {
    border-width: 2px;
  }

  :deep(.error-page__details-content) {
    border-width: 2px;
  }
}
</style>
