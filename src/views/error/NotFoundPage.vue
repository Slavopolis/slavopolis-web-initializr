<script setup lang="ts">
import type { ErrorPageEvents, ErrorPageFullConfig } from '@/types/error'
import { ErrorType } from '@/types/error'
import { onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import ErrorPage from './ErrorPage.vue'

// 路由信息
const route = useRoute()

// 错误配置
const errorConfig: Partial<ErrorPageFullConfig> = {
  type: ErrorType.NOT_FOUND,
  code: '404',
  title: '页面未找到',
  description: '抱歉，您访问的页面不存在或已被删除。',
  icon: 'not-found',
  showBackButton: true,
  showHomeButton: true,
  showRetryButton: false,
  showDetails: false,
  layout: {
    layout: 'centered',
    maxWidth: '600px',
    padding: '60px 20px',
    showBackgroundPattern: true,
    backgroundPattern: 'dots',
  },
  animation: {
    enabled: true,
    enterAnimation: 'fade',
    duration: 600,
    delay: 0,
  },
  theme: {
    primaryColor: 'var(--ant-primary-color)',
    backgroundColor: 'var(--ant-body-background)',
    textColor: 'var(--ant-text-color)',
    borderColor: 'var(--ant-border-color-base)',
    shadow: 'var(--ant-shadow-2)',
  },
}

// 事件处理
const events: ErrorPageEvents = {
  onMounted: () => {
    // 记录404错误
    console.info('404 Page Not Found:', {
      path: route.fullPath,
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
    })

    // 可以在这里上报错误统计
    // analytics.track('404_error', { path: route.fullPath })
  },
  onBack: () => {
    console.info('User clicked back button on 404 page')
  },
  onHome: () => {
    console.info('User clicked home button on 404 page')
  },
}

// 从路由参数获取自定义消息
const customDescription = ref<string>('')
const customDetails = ref<string>('')

onMounted(() => {
  // 从查询参数获取自定义描述
  if (route.query.message) {
    customDescription.value = route.query.message as string
  }

  // 从查询参数获取错误详情
  if (route.query.details) {
    customDetails.value = route.query.details as string
  }
})
</script>

<template>
  <ErrorPage :type="ErrorType.NOT_FOUND" :code="errorConfig.code" :title="errorConfig.title"
    :description="customDescription || errorConfig.description" :details="customDetails" :config="errorConfig"
    :events="events" />
</template>

<style scoped>
/* 404页面特定样式 */
:deep(.error-page__code) {
  background: linear-gradient(135deg, var(--ant-primary-color), var(--ant-primary-6));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

:deep(.error-page__card) {
  background: var(--ant-component-background);
  backdrop-filter: blur(10px);
  border: 1px solid var(--ant-border-color-split);
}

/* 404页面动画增强 */
:deep(.error-page__icon) {
  animation: notFoundBounce 2s ease-in-out infinite;
}

@keyframes notFoundBounce {

  0%,
  100% {
    transform: translateY(0);
  }

  50% {
    transform: translateY(-10px);
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
    background: linear-gradient(135deg, var(--ant-primary-4), var(--ant-primary-6));
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }
}

/* 减少动画偏好 */
@media (prefers-reduced-motion: reduce) {
  :deep(.error-page__icon) {
    animation: none;
  }
}
</style>
