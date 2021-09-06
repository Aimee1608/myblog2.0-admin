// import * as Vue from 'vue'
// import Router from 'vue-router'

import { createRouter, createWebHashHistory } from "vue-router";

/* Layout */
import Layout from '@/layout/index.vue'

/**
 * Note: sub-menu only appear when route children.length >= 1
 * Detail see: https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 *
 * hidden: true                   if set true, item will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu
 *                                if not set alwaysShow, when item has more than one children route,
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noRedirect           if set noRedirect will no redirect in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    roles: ['admin','editor']    control the page roles (you can set multiple roles)
    title: 'title'               the name show in sidebar and breadcrumb (recommend set)
    icon: 'svg-name'/'el-icon-x' the icon show in the sidebar
    breadcrumb: false            if set false, the item will hidden in breadcrumb(default is true)
    activeMenu: '/example/list'  if set path, the sidebar will highlight the path you set
  }
 */

/**
 * constantRoutes
 * a base page that does not have permission requirements
 * all roles can be accessed
 */
const constantRoutes = [{
  path: '/login',
  component: () => import('@/views/login/index.vue'),
  hidden: true
},

{
  path: '/404',
  component: () => import('@/views/404.vue'),
  hidden: true
},
{
  path: '/',
  redirect: '/home'
},
{
  path: '/home',
  component: Layout,
  // redirect: '/home',
  children: [{
    path: '',
    name: 'Home',
    component: () => import('@/views/home/index.vue'),
    meta: {
      title: '首页概览',
      icon: 'el-icon-s-data'
    }
  }]
},
{
  path: '/list',
  component: Layout,
  // redirect: '/list',
  // name: 'List',
  // component: () => import('@/views/table/index'),
  // meta: { title: '文档中心', icon: 'table' },
  // name: 'Example',
  // meta: { title: '文档中心', icon: 'el-icon-s-help' },
  children: [{
    path: '',
    name: 'List',
    component: () => import('@/views/list/index.vue'),
    meta: {
      title: '文章列表',
      icon: 'el-icon-document'
    }
  }]
},
{
  path: '/articleCate',
  component: Layout,
  children: [{
    path: '',
    name: 'ArticleCate',
    component: () => import('@/views/articleCate/index.vue'),
    meta: {
      title: '分类列表',
      icon: 'el-icon-collection-tag'
    }
  }]
},
{
  path: '/tags',
  component: Layout,
  children: [{
    path: '',
    name: 'Tags',
    component: () => import('@/views/tags/index.vue'),
    meta: {
      title: '标签列表',
      icon: 'el-icon-price-tag'
    }
  }]
},
{
  path: '/createArticle',
  component: Layout,
  children: [{
    hidden: true,
    path: '',
    name: 'CreateArticle',
    component: () => import('@/views/createArticle/index.vue'),
    meta: {
      title: '编辑文章',
      icon: 'el-icon-notebook-2'
    }
  }]
},
{
  path: '/articleDetail',
  component: Layout,
  children: [{
    hidden: true,
    path: '',
    name: 'ArticleDetail',
    component: () => import('@/views/articleDetail/index.vue'),
    meta: {
      title: '文章详情',
      icon: 'el-icon-notebook-2'
    }
  }]
},

{
  path: '/comment',
  component: Layout,
  children: [{
    path: '',
    name: 'Comment',
    component: () => import('@/views/comment/index.vue'),
    meta: {
      title: '评论管理',
      icon: 'el-icon-chat-dot-round'
    }
  }]
},
{
  path: '/resource',
  component: Layout,
  children: [{
    path: '',
    name: 'Resource',
    component: () => import('@/views/resource/index.vue'),
    meta: {
      title: '资源管理',
      icon: 'el-icon-receiving'
    }
  }]
},
// {
//   path: '/recycleBin',
//   component: Layout,
//   children: [{
//     path: '',
//     name: 'RecycleBin',
//     component: () => import('@/views/recycleBin/index.vue'),
//     meta: {
//       title: '回收站',
//       icon: 'el-icon-delete'
//     }
//   }]
// },
{
  path: '/user',
  component: Layout,
  children: [{
    path: '',
    name: 'User',
    component: () => import('@/views/user/index.vue'),
    meta: {
      title: '用户管理',
      icon: 'el-icon-user'
    }
  }]
},
// 404 page must be placed at the end !!!
{
  path: '/:catchAll(.*)',
  redirect: '/404',
  hidden: true
}]

const router = createRouter({
  scrollBehavior: () => ({
    y: 0
  }),
  history: createWebHashHistory(),
  routes: constantRoutes
})

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
