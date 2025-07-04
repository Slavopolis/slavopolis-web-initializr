import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/about',
      name: 'about',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/AboutView.vue'),
    },
    // 错误页面路由
    {
      path: '/error',
      name: 'error',
      children: [
        {
          path: '404',
          name: 'error-404',
          component: () => import('../views/error/NotFoundPage.vue'),
          meta: {
            title: '页面未找到',
            description: '404 - 页面未找到',
          },
        },
        {
          path: '403',
          name: 'error-403',
          component: () => import('../views/error/ForbiddenPage.vue'),
          meta: {
            title: '权限不足',
            description: '403 - 权限不足',
          },
        },
        {
          path: '500',
          name: 'error-500',
          component: () => import('../views/error/ServerErrorPage.vue'),
          meta: {
            title: '服务器错误',
            description: '500 - 服务器错误',
          },
        },
        {
          path: 'network',
          name: 'error-network',
          component: () => import('../views/error/NetworkErrorPage.vue'),
          meta: {
            title: '网络连接失败',
            description: '网络连接失败',
          },
        },
        {
          path: 'general',
          name: 'error-general',
          component: () => import('../views/error/ErrorPage.vue'),
          meta: {
            title: '错误',
            description: '通用错误页面',
          },
        },
      ],
    },
    // 404 路由重定向
    {
      path: '/:pathMatch(.*)*',
      name: 'not-found',
      redirect: { name: 'error-404' },
    },
  ],
})

// 路由守卫
router.beforeEach((to, from, next) => {
  // 设置页面标题
  if (to.meta?.title) {
    document.title = `${to.meta.title} - Slavopolis`
  }

  // 这里可以添加权限检查逻辑
  // if (to.meta?.requiresAuth && !isAuthenticated()) {
  //   next({ name: 'error-403' })
  //   return
  // }

  next()
})

// 路由错误处理
router.onError((error) => {
  console.error('Router error:', error)

  // 根据错误类型导航到对应的错误页面
  if (error.name === 'ChunkLoadError') {
    // 代码分块加载错误，通常是网络问题
    router.push({
      name: 'error-network',
      query: {
        errorType: 'chunk-load',
        message: '页面加载失败，请刷新重试',
      },
    })
  } else {
    // 其他错误
    router.push({
      name: 'error-general',
      query: {
        message: '路由错误，请稍后重试',
        details: error.message,
      },
    })
  }
})

export default router
