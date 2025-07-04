<script setup lang="ts">
import type { ErrorIconConfig } from '@/types/error'
import { computed } from 'vue'

interface Props {
  /** 图标名称 */
  name: string
  /** 图标大小 */
  size?: number | string
  /** 图标颜色 */
  color?: string
  /** 是否显示动画 */
  animated?: boolean
  /** 自定义样式类名 */
  className?: string
  /** 完整配置对象 */
  config?: ErrorIconConfig
}

const props = withDefaults(defineProps<Props>(), {
  size: 120,
  color: '',
  animated: true,
  className: '',
})

// 计算图标大小
const iconSize = computed(() => {
  const size = props.config?.size || props.size
  return typeof size === 'number' ? `${size}px` : size
})

// 计算图标颜色
const iconColor = computed(() => {
  return props.config?.color || props.color || 'var(--ant-text-color-tertiary)'
})

// 计算是否显示动画
const isAnimated = computed(() => {
  return props.config?.animated ?? props.animated
})

// 计算样式类名
const iconClasses = computed(() => {
  const classes = ['error-icon']

  if (isAnimated.value) {
    classes.push('error-icon--animated')
  }

  const customClass = props.config?.className || props.className
  if (customClass) {
    classes.push(customClass)
  }

  return classes.join(' ')
})

// SVG图标映射
const iconSvgs = {
  'not-found': `
    <svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
      <!-- 404页面图标 - 搜索放大镜 -->
      <circle cx="80" cy="80" r="45" stroke="currentColor" stroke-width="8" fill="none"/>
      <path d="M110 110l30 30" stroke="currentColor" stroke-width="8" stroke-linecap="round"/>
      <text x="80" y="90" text-anchor="middle" fill="currentColor" font-size="24" font-family="Arial, sans-serif">?</text>
      <!-- 装饰元素 -->
      <circle cx="50" cy="50" r="3" fill="currentColor" opacity="0.3"/>
      <circle cx="150" cy="50" r="3" fill="currentColor" opacity="0.3"/>
      <circle cx="50" cy="150" r="3" fill="currentColor" opacity="0.3"/>
      <circle cx="150" cy="150" r="3" fill="currentColor" opacity="0.3"/>
    </svg>
  `,
  'forbidden': `
    <svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
      <!-- 403权限图标 - 锁和禁止符号 -->
      <rect x="70" y="90" width="60" height="70" rx="8" stroke="currentColor" stroke-width="6" fill="none"/>
      <path d="M85 90V70c0-8.28 6.72-15 15-15s15 6.72 15 15v20" stroke="currentColor" stroke-width="6" fill="none"/>
      <circle cx="100" cy="120" r="6" fill="currentColor"/>
      <!-- 禁止符号 -->
      <circle cx="100" cy="100" r="80" stroke="currentColor" stroke-width="4" fill="none" opacity="0.3"/>
      <line x1="50" y1="50" x2="150" y2="150" stroke="currentColor" stroke-width="6" stroke-linecap="round" opacity="0.5"/>
    </svg>
  `,
  'server-error': `
    <svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
      <!-- 500服务器图标 - 服务器和警告 -->
      <rect x="50" y="60" width="100" height="80" rx="8" stroke="currentColor" stroke-width="6" fill="none"/>
      <rect x="60" y="70" width="80" height="8" rx="4" fill="currentColor" opacity="0.3"/>
      <rect x="60" y="85" width="80" height="8" rx="4" fill="currentColor" opacity="0.3"/>
      <rect x="60" y="100" width="80" height="8" rx="4" fill="currentColor" opacity="0.3"/>
      <!-- 警告符号 -->
      <circle cx="100" cy="40" r="15" fill="currentColor" opacity="0.2"/>
      <line x1="100" y1="30" x2="100" y2="42" stroke="currentColor" stroke-width="3" stroke-linecap="round"/>
      <circle cx="100" cy="48" r="2" fill="currentColor"/>
      <!-- 连接线 -->
      <line x1="40" y1="100" x2="50" y2="100" stroke="currentColor" stroke-width="3"/>
      <line x1="150" y1="100" x2="160" y2="100" stroke="currentColor" stroke-width="3"/>
    </svg>
  `,
  'network-error': `
    <svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
      <!-- 网络错误图标 - WiFi信号中断 -->
      <path d="M100 160c-11 0-20-9-20-20s9-20 20-20 20 9 20 20-9 20-20 20z" fill="currentColor"/>
      <path d="M100 120c-22 0-40-18-40-40h10c0 17 13 30 30 30s30-13 30-30h10c0 22-18 40-40 40z" fill="currentColor" opacity="0.7"/>
      <path d="M100 100c-33 0-60-27-60-60h10c0 28 22 50 50 50s50-22 50-50h10c0 33-27 60-60 60z" fill="currentColor" opacity="0.4"/>
      <!-- 中断线 -->
      <line x1="70" y1="70" x2="130" y2="130" stroke="currentColor" stroke-width="6" stroke-linecap="round" opacity="0.8"/>
      <line x1="130" y1="70" x2="70" y2="130" stroke="currentColor" stroke-width="6" stroke-linecap="round" opacity="0.8"/>
    </svg>
  `,
  'generic-error': `
    <svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
      <!-- 通用错误图标 - 感叹号 -->
      <circle cx="100" cy="100" r="80" stroke="currentColor" stroke-width="6" fill="none" opacity="0.2"/>
      <circle cx="100" cy="100" r="60" stroke="currentColor" stroke-width="4" fill="none" opacity="0.4"/>
      <line x1="100" y1="70" x2="100" y2="110" stroke="currentColor" stroke-width="8" stroke-linecap="round"/>
      <circle cx="100" cy="130" r="6" fill="currentColor"/>
    </svg>
  `,
}

// 获取SVG内容
const getSvgContent = (name: string): string => {
  return iconSvgs[name as keyof typeof iconSvgs] || iconSvgs['generic-error']
}
</script>

<template>
  <div :class="iconClasses" :style="{
    width: iconSize,
    height: iconSize,
    color: iconColor
  }">
    <!-- eslint-disable-next-line vue/no-v-html -->
    <div class="error-icon__svg" v-html="getSvgContent(config?.name || name)" />
  </div>
</template>

<style scoped>
.error-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  position: relative;
  flex-shrink: 0;
}

.error-icon__svg {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.error-icon__svg :deep(svg) {
  width: 100%;
  height: 100%;
  display: block;
}

/* 动画效果 */
.error-icon--animated {
  animation: errorIconBreathe 3s ease-in-out infinite;
}

.error-icon--animated .error-icon__svg {
  transition: transform 0.3s ease;
}

.error-icon--animated:hover .error-icon__svg {
  transform: scale(1.05);
}

@keyframes errorIconBreathe {

  0%,
  100% {
    opacity: 0.8;
    transform: scale(1);
  }

  50% {
    opacity: 1;
    transform: scale(1.02);
  }
}

/* 特定图标的动画 */
.error-icon--animated .error-icon__svg :deep(svg) {
  animation: errorIconFloat 4s ease-in-out infinite;
}

@keyframes errorIconFloat {

  0%,
  100% {
    transform: translateY(0);
  }

  50% {
    transform: translateY(-3px);
  }
}

/* 加载时的入场动画 */
.error-icon {
  animation: errorIconFadeIn 0.6s ease-out;
}

@keyframes errorIconFadeIn {
  from {
    opacity: 0;
    transform: scale(0.8) translateY(20px);
  }

  to {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
}

/* 响应式调整 */
@media (max-width: 768px) {
  .error-icon {
    width: 80px;
    height: 80px;
  }
}

@media (max-width: 480px) {
  .error-icon {
    width: 64px;
    height: 64px;
  }
}

/* 深色模式优化 */
@media (prefers-color-scheme: dark) {
  .error-icon__svg :deep(svg) {
    filter: brightness(1.1);
  }
}

/* 高对比度模式 */
@media (prefers-contrast: high) {
  .error-icon {
    filter: contrast(1.5);
  }
}

/* 减少动画偏好 */
@media (prefers-reduced-motion: reduce) {

  .error-icon--animated,
  .error-icon--animated .error-icon__svg,
  .error-icon--animated .error-icon__svg :deep(svg) {
    animation: none;
  }

  .error-icon--animated .error-icon__svg {
    transition: none;
  }

  .error-icon {
    animation: none;
  }
}

/* 焦点状态 */
.error-icon:focus-visible {
  outline: 2px solid var(--ant-primary-color);
  outline-offset: 4px;
  border-radius: 8px;
}

/* 自定义颜色主题 */
.error-icon--primary {
  color: var(--ant-primary-color);
}

.error-icon--error {
  color: var(--ant-error-color);
}

.error-icon--warning {
  color: var(--ant-warning-color);
}

.error-icon--info {
  color: var(--ant-info-color);
}

.error-icon--success {
  color: var(--ant-success-color);
}
</style>
