<script setup lang="ts">
import type { ErrorLayoutConfig } from '@/types/error'
import { computed } from 'vue'

interface Props {
  /** 布局配置 */
  config?: ErrorLayoutConfig
  /** 是否显示背景图案 */
  showPattern?: boolean
  /** 背景图案类型 */
  pattern?: 'dots' | 'grid' | 'waves' | 'none'
  /** 最大宽度 */
  maxWidth?: number | string
  /** 内边距 */
  padding?: number | string
}

const props = withDefaults(defineProps<Props>(), {
  config: () => ({}),
  showPattern: false,
  pattern: 'none',
  maxWidth: '1200px',
  padding: '40px 20px',
})

// 计算样式
const containerStyle = computed(() => ({
  maxWidth: typeof props.maxWidth === 'number' ? `${props.maxWidth}px` : props.maxWidth,
  padding: typeof props.padding === 'number' ? `${props.padding}px` : props.padding,
}))

// 背景图案类名
const patternClass = computed(() => {
  if (!props.showPattern || props.pattern === 'none') return ''
  return `error-layout__pattern--${props.pattern}`
})

// 布局类型
const layoutClass = computed(() => {
  const layout = props.config?.layout || 'centered'
  return `error-layout--${layout}`
})
</script>

<template>
  <div class="error-layout" :class="[layoutClass, patternClass]">
    <div class="error-layout__background">
      <!-- 背景图案 -->
      <div v-if="showPattern && pattern !== 'none'" class="error-layout__pattern"
        :class="`error-layout__pattern--${pattern}`" />
    </div>

    <div class="error-layout__container" :style="containerStyle">
      <div class="error-layout__content">
        <slot />
      </div>
    </div>
  </div>
</template>

<style scoped>
.error-layout {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  position: relative;
  background: var(--ant-body-background);
  overflow: hidden;
}

.error-layout__background {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  pointer-events: none;
  z-index: 0;
}

.error-layout__container {
  position: relative;
  z-index: 1;
  margin: 0 auto;
  width: 100%;
  flex: 1;
  display: flex;
  flex-direction: column;
}

.error-layout__content {
  flex: 1;
  display: flex;
  flex-direction: column;
}

/* 布局类型 */
.error-layout--centered .error-layout__content {
  justify-content: center;
  align-items: center;
  text-align: center;
}

.error-layout--top .error-layout__content {
  justify-content: flex-start;
  padding-top: 120px;
  align-items: center;
  text-align: center;
}

.error-layout--bottom .error-layout__content {
  justify-content: flex-end;
  padding-bottom: 120px;
  align-items: center;
  text-align: center;
}

/* 背景图案 */
.error-layout__pattern {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  opacity: 0.03;
}

.error-layout__pattern--dots {
  background-image: radial-gradient(circle,
      var(--ant-text-color) 1px,
      transparent 1px);
  background-size: 20px 20px;
}

.error-layout__pattern--grid {
  background-image:
    linear-gradient(to right, var(--ant-border-color-split) 1px, transparent 1px),
    linear-gradient(to bottom, var(--ant-border-color-split) 1px, transparent 1px);
  background-size: 40px 40px;
}

.error-layout__pattern--waves {
  background-image: repeating-linear-gradient(45deg,
      transparent,
      transparent 10px,
      var(--ant-border-color-split) 10px,
      var(--ant-border-color-split) 11px);
}

/* 响应式设计 */
@media (max-width: 768px) {
  .error-layout__container {
    padding: 20px 16px;
  }

  .error-layout--top .error-layout__content {
    padding-top: 60px;
  }

  .error-layout--bottom .error-layout__content {
    padding-bottom: 60px;
  }

  .error-layout__pattern--dots {
    background-size: 16px 16px;
  }

  .error-layout__pattern--grid {
    background-size: 32px 32px;
  }
}

@media (max-width: 480px) {
  .error-layout__container {
    padding: 16px 12px;
  }

  .error-layout--top .error-layout__content {
    padding-top: 40px;
  }

  .error-layout--bottom .error-layout__content {
    padding-bottom: 40px;
  }
}

/* 动画支持 */
.error-layout {
  animation: errorLayoutFadeIn 0.6s ease-out;
}

@keyframes errorLayoutFadeIn {
  from {
    opacity: 0;
  }

  to {
    opacity: 1;
  }
}

/* 深色模式下的图案优化 */
@media (prefers-color-scheme: dark) {
  .error-layout__pattern {
    opacity: 0.02;
  }
}

/* 高对比度支持 */
@media (prefers-contrast: high) {
  .error-layout__pattern {
    opacity: 0.08;
  }
}

/* 减少动画偏好支持 */
@media (prefers-reduced-motion: reduce) {
  .error-layout {
    animation: none;
  }

  .error-layout__pattern {
    animation: none;
  }
}
</style>
