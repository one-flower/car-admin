import { createWebHistory, createRouter, RouteRecordRaw } from 'vue-router';
/* Layout */
import Layout from '@/layout/index.vue';

/**
 * Note: 路由配置项
 *
 * hidden: true                     // 当设置 true 的时候该路由不会再侧边栏出现 如401，login等页面，或者如一些编辑页面/edit/1
 * alwaysShow: true                 // 当你一个路由下面的 children 声明的路由大于1个时，自动会变成嵌套的模式--如组件页面
 *                                  // 只有一个时，会将那个子路由当做根路由显示在侧边栏--如引导页面
 *                                  // 若你想不管路由下面的 children 声明的个数都显示你的根路由
 *                                  // 你可以设置 alwaysShow: true，这样它就会忽略之前定义的规则，一直显示根路由
 * redirect: noRedirect             // 当设置 noRedirect 的时候该路由在面包屑导航中不可被点击
 * name:'router-name'               // 设定路由的名字，一定要填写不然使用<keep-alive>时会出现各种问题
 * query: '{"id": 1, "name": "ry"}' // 访问路由的默认传递参数
 * roles: ['admin', 'common']       // 访问路由的角色权限
 * permissions: ['a:a:a', 'b:b:b']  // 访问路由的菜单权限
 * meta : {
    noCache: true                   // 如果设置为true，则不会被 <keep-alive> 缓存(默认 false)
    title: 'title'                  // 设置该路由在侧边栏和面包屑中展示的名字
    icon: 'svg-name'                // 设置该路由的图标，对应路径src/assets/icons/svg
    breadcrumb: false               // 如果设置为false，则不会在breadcrumb面包屑中显示
    activeMenu: '/system/user'      // 当路由设置了该属性，则会高亮相对应的侧边栏。
  }
 */

// 公共路由
export const constantRoutes: RouteRecordRaw[] = [
  {
    path: '/redirect',
    component: Layout,
    hidden: true,
    children: [
      {
        path: '/redirect/:path(.*)',
        component: () => import('@/views/redirect/index.vue')
      }
    ]
  },
  {
    path: '/social-callback',
    hidden: true,
    component: () => import('@/layout/components/SocialCallback/index.vue')
  },
  {
    path: '/login',
    component: () => import('@/views/login.vue'),
    hidden: true
  },
  {
    path: '/register',
    component: () => import('@/views/register.vue'),
    hidden: true
  },
  {
    path: '/:pathMatch(.*)*',
    component: () => import('@/views/error/404.vue'),
    hidden: true
  },
  {
    path: '/401',
    component: () => import('@/views/error/401.vue'),
    hidden: true
  },
  {
    path: '',
    component: Layout,
    redirect: '/index',
    children: [
      {
        path: '/index',
        component: () => import('@/views/index.vue'),
        name: 'Index',
        meta: { title: '首页', icon: 'dashboard', affix: true }
      }
    ]
  },
  {
    path: '/user',
    component: Layout,
    hidden: true,
    redirect: 'noredirect',
    children: [
      {
        path: 'profile',
        component: () => import('@/views/system/user/profile/index.vue'),
        name: 'Profile',
        meta: { title: '个人中心', icon: 'user' }
      }
    ]
  }
];

// 动态路由，基于用户权限动态去加载
export const dynamicRoutes: RouteRecordRaw[] = [
  {
    path: '/system/user-auth',
    component: Layout,
    hidden: true,
    permissions: ['system:user:edit'],
    children: [
      {
        path: 'role/:userId(\\d+)',
        component: () => import('@/views/system/user/authRole.vue'),
        name: 'AuthRole',
        meta: { title: '分配角色', activeMenu: '/system/user', icon: '' }
      }
    ]
  },
  {
    path: '/system/role-auth',
    component: Layout,
    hidden: true,
    permissions: ['system:role:edit'],
    children: [
      {
        path: 'user/:roleId(\\d+)',
        component: () => import('@/views/system/role/authUser.vue'),
        name: 'AuthUser',
        meta: { title: '分配用户', activeMenu: '/system/role', icon: '' }
      }
    ]
  },
  {
    path: '/system/dict-data',
    component: Layout,
    hidden: true,
    permissions: ['system:dict:list'],
    children: [
      {
        path: 'index/:dictId(\\d+)',
        component: () => import('@/views/system/dict/data.vue'),
        name: 'Data',
        meta: { title: '字典数据', activeMenu: '/system/dict', icon: '' }
      }
    ]
  },
  {
    path: '/system/oss-config',
    component: Layout,
    hidden: true,
    permissions: ['system:ossConfig:list'],
    children: [
      {
        path: 'index',
        component: () => import('@/views/system/oss/config.vue'),
        name: 'OssConfig',
        meta: { title: '配置管理', activeMenu: '/system/oss', icon: '' }
      }
    ]
  },
  {
    path: '/tool/gen-edit',
    component: Layout,
    hidden: true,
    permissions: ['tool:gen:edit'],
    children: [
      {
        path: 'index/:tableId(\\d+)',
        component: () => import('@/views/tool/gen/editTable.vue'),
        name: 'GenEdit',
        meta: { title: '修改生成配置', activeMenu: '/tool/gen', icon: '' }
      }
    ]
  },
  {
    path: '/workflow/leaveEdit',
    component: Layout,
    hidden: true,
    permissions: ['workflow:leave:edit'],
    children: [
      {
        path: 'index',
        component: () => import('@/views/workflow/leave/leaveEdit.vue'),
        name: 'leaveEdit',
        meta: { title: '请假申请', activeMenu: '/workflow/leave', noCache: true }
      }
    ]
  },
  {
    path: '/sys',
    name: 'sys',
    component: Layout,
    hidden: false,
    permissions: ['superadmin'],
    meta: {
      'title': '系统管理',
      'icon': 'system',
      'noCache': false,
      'link': null
    },
    children: [
      {
        path: 'post',
        component: () => import('@/views/sys/post/index.vue'),
        name: 'post',
        meta: { title: '岗位设置', activeMenu: '/sys/post', icon: '' }
      },
      {
        path: 'brand',
        component: () => import('@/views/sys/brand/index.vue'),
        name: 'brand',
        meta: { title: '产品品牌', activeMenu: '/sys/brand', icon: '' }
      },
      {
        path: 'mechanism',
        component: () => import('@/views/sys/mechanism/index.vue'),
        name: 'mechanism',
        meta: { title: '上游机构', activeMenu: '/sys/mechanism', icon: '' }
      },
      {
        path: 'customTag',
        component: () => import('@/views/sys/custom-tag/index.vue'),
        name: 'customTag',
        meta: { title: '客户标签', activeMenu: '/sys/customTag', icon: '' }
      },
      {
        path: 'channelSource',
        component: () => import('@/views/sys/channel-source/index.vue'),
        name: 'channelSource',
        meta: { title: '客户来源', activeMenu: '/sys/channelSource', icon: '' }
      },
      {
        path: 'management',
        component: () => import('@/views/sys/management/index.vue'),
        name: 'management',
        meta: { title: '项目管理', activeMenu: '/sys/management', icon: '' }
      }
    ]
  },
  {
    path: '/storeManagement',
    name: 'storeManagement',
    component: Layout,
    hidden: false,
    permissions: ['superadmin'],
    meta: {
      'title': '店铺管理',
      'icon': 'store',
      'noCache': false,
      'link': null
    },
    children: [
      {
        path: 'staff',
        component: () => import('@/views/store-management/staff/index.vue'),
        name: 'staff',
        meta: { title: '员工管理', activeMenu: '/storeManagement/staff', icon: '' }
      },
      {
        path: 'recharge',
        component: () => import('@/views/store-management/recharge/index.vue'),
        name: 'recharge',
        meta: { title: '充值管理', activeMenu: '/storeManagement/recharge', icon: '' }
      }
    ]
  },
  {
    path: '/customerManagement',
    name: 'customerManagement',
    component: Layout,
    hidden: false,
    permissions: ['superadmin'],
    meta: {
      'title': '客户管理',
      'icon': '',
      'noCache': false,
      'link': null
    },
    children: [
      {
        path: 'user',
        component: () => import('@/views/customer-management/user/index.vue'),
        name: 'user',
        meta: { title: '用户管理', activeMenu: '/customerManagement/user', icon: '' }
      },
      {
        path: 'customer',
        component: () => import('@/views/customer-management/customer/index.vue'),
        name: 'customer',
        meta: { title: '客户管理', activeMenu: '/customerManagement/customer', icon: '' }
      },
      {
        path: 'car',
        component: () => import('@/views/customer-management/car/index.vue'),
        name: 'car',
        meta: { title: '车辆管理', activeMenu: '/customerManagement/car', icon: '' }
      }
    ]
  },
  {
    path: '/productManagement',
    name: 'productManagement',
    component: Layout,
    hidden: false,
    permissions: ['superadmin'],
    meta: {
      'title': '产品管理',
      'icon': '',
      'noCache': false,
      'link': null
    },
    children: [
      {
        path: 'product',
        component: () => import('@/views/product-management/product/index.vue'),
        name: 'product',
        meta: { title: '产品管理', activeMenu: '/productManagement/product', icon: '' }
      }
    ]
  },
  {
    path: '/orderManagement',
    name: 'orderManagement',
    component: Layout,
    hidden: false,
    permissions: ['superadmin'],
    meta: {
      'title': '订单管理',
      'icon': '',
      'noCache': false,
      'link': null
    },
    children: [
      {
        path: 'order',
        component: () => import('@/views/order-management/order/index.vue'),
        name: 'order',
        meta: { title: '订单管理', activeMenu: '/orderManagement/order', icon: '' }
      },
      {
        path: 'commission',
        component: () => import('@/views/order-management/commission/index.vue'),
        name: 'commission',
        meta: { title: '提成分配', activeMenu: '/orderManagement/commission', icon: '' }
      }
    ]
  },
  {
    path: '/maintainManagement',
    name: 'maintainManagement',
    component: Layout,
    hidden: false,
    permissions: ['superadmin'],
    meta: {
      'title': '质保保养',
      'icon': '',
      'noCache': false,
      'link': null
    },
    children: [
      {
        path: 'warranty',
        component: () => import('@/views/maintain-management/warranty/index.vue'),
        name: 'warranty',
        meta: { title: '质保产品', activeMenu: '/customerManagement/warranty', icon: '' }
      },
      {
        path: 'maintain',
        component: () => import('@/views/maintain-management/maintain/index.vue'),
        name: 'maintain',
        meta: { title: '保养产品', activeMenu: '/customerManagement/maintain', icon: '' }
      }
    ]
  }
];

/**
 * 创建路由
 */
const router = createRouter({
  history: createWebHistory(import.meta.env.VITE_APP_CONTEXT_PATH),
  routes: constantRoutes,
  // 刷新时，滚动条位置还原
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition;
    } else {
      return { top: 0 };
    }
  }
});

export default router;
