import Vue from 'vue'
import Router from 'vue-router'
import home from '@/view/home/home'
import shoppingMall from '@/view/shoppingMall/shoppingMall'
import deal from '@/view/deal/deal'
import my from '@/view/my/my'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/login',
      name: 'login',
      component: () => import('@/view/account/login'),
    },
    {
      path: '/register',
      name: 'register',
      component: () => import('@/view/account/register'),
    },
    {
      path: '/selectCity',
      name: 'selectCity',
      component: () => import('@/view/account/selectCity'),
    },
    {
      path: '/forgetPassword',
      name: 'forgetPassword',
      component: () => import('@/view/account/forgetPassword'),
    },
    {
      path: '/myInfo',
      name: 'myInfo',
      component: () => import('@/view/account/myInfo'),
      meta: { requiresAuth: true }
    },
    {
      path: '/',
      name: 'home',
      component: home,
      meta: { requiresAuth: true }
    },
    {
      path: '/home',
      name: 'home',
      component: home,
      meta: { requiresAuth: true }
    },
    {
      path:'/transfer',
      name:'transfer',
      component:()=>import('@/view/home/transfer'),
      meta: { requiresAuth: true }
    },
    {
      path:'/transferAxm',
      name:'transferAxm',
      component:()=>import('@/view/home/transferAxm'),
      meta: { requiresAuth: true }
    },
    // 划转明细
    {
      path:'/transferList',
      name:'transferList',
      component:()=>import('@/view/home/transferList'),
      meta: { requiresAuth: true }
    },
    {
      path:'/rush',
      name:'rush',
      component:()=>import('@/view/home/rush'),
      meta: { requiresAuth: true }
    },
    {
      path:'/rushList',
      name:'rushList',
      component:()=>import('@/view/home/rushList'),
      meta: { requiresAuth: true }
    },
    {
      path: '/topUp',
      name: 'topUp',
      component: () => import('@/view/home/topUp'),
      meta: { requiresAuth: true }
    },
    {
      path: '/scan',
      name: 'scan',
      component: () => import('@/view/home/scan'),
      meta: { requiresAuth: true }
    },
    {
      path: '/extract',
      name: 'extract',
      component: () => import('@/view/home/extract'),
      meta: { requiresAuth: true }
    },
    {
      path: '/record',
      name: 'record',
      component: () => import('@/view/home/record'),
      meta: { requiresAuth: true }
    },
    {
      path: '/share',
      name: 'share',
      component: () => import('@/view/home/share'),
      meta: { requiresAuth: true }
    },
    {
      path: '/partner',
      name: 'partner',
      component: () => import('@/view/home/partner'),
      meta: { requiresAuth: true }
    },
    {
      path: '/publicity',
      name: 'publicity',
      component: () => import('@/view/home/publicity'),
      meta: { requiresAuth: true }
    },
    {
      path: '/graphicDetails',
      name: 'graphicDetails',
      component: () => import('@/view/home/graphicDetails'),
      meta: { requiresAuth: true }
    },
    { // 商学院
      path: '/service',
      name: 'service',
      component: () => import('@/view/home/service'),
      meta: { requiresAuth: true }
    },
    {
      path:'/publicityList',
      name:'publicityList',
      component:()=>import('@/view/home/publicityList'),
      meta: { requiresAuth: true }
    },
    {
      path:'/serviceList',
      name:'serviceList',
      component:()=>import('@/view/home/serviceList'),
      meta: { requiresAuth: true }
    },
    {
      path:'/cityAgent',
      name:'cityAgent',
      component:()=>import('@/view/home/cityAgent'),
      meta: { requiresAuth: true }
    },
    {
      path:"*",
      redirect:'/'
    },
    {
      path: '/shoppingMall',
      name: 'shoppingMall',
      component: shoppingMall,
      meta: { requiresAuth: true }
    },
    {
      path: '/my',
      name: 'my',
      component: my,
      meta: { requiresAuth: true }
    },
    {
      path: '/personalData',
      name: "personalData",
      component: () => import('@/view/my/personalData.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/announcement',
      name: "announcement",
      component: () => import('@/view/my/announcement'),
      meta: { requiresAuth: true }
    },
    {
      path: '/identification',
      name: "identification",
      component: () => import('@/view/my/identification'),
      meta: { requiresAuth: true }
    },
    {
      path: '/laborUnion',
      name: "laborUnion",
      component: () => import('@/view/my/laborUnion'),
      meta: { requiresAuth: true }
    },
    {
      path: '/myMill',
      name: "myMill",
      component: () => import('@/view/my/myMill'),
      meta: { requiresAuth: true }
    },
    {
      path: '/accountBook',
      name: "accountBook",
      component: () => import('@/view/my/accountBook'),
      meta: { requiresAuth: true }
    },
    {
      path: '/leaveWord',
      name: "leaveWord",
      component: () => import('@/view/my/leaveWord'),
      meta: { requiresAuth: true }
    },
    {
      path: '/userInfo',
      name: "userInfo",
      component: () => import('@/view/my/userInfo'),
      meta: { requiresAuth: true }
    },
    {
      path: '/safety',
      name: "safety",
      component: () => import('@/view/my/safety'),
      meta: { requiresAuth: true }
    },
    {
      path: '/taskCenter',
      name: "taskCenter",
      component: () => import('@/view/my/taskCenter'),
      meta: { requiresAuth: true }
    },
    {
      path: '/modifyPwd/:type',
      name: "modifyPwd",
      component: () => import('@/view/my/modifyPwd'),
      meta: { requiresAuth: true }
    },
    {
      path: '/deal',
      name: "deal",
      component: deal,
      meta: { requiresAuth: true }
    },
    {
      path: '/orderList',
      name: "orderList",
      component: ()=>import('@/view/deal/orderList'),
      meta: { requiresAuth: true }
    },
    {
      path: '/myDeal',
      name: "myDeal",
      component: () => import('@/view/deal/myDeal'),
      meta: { requiresAuth: true }
    },
    {
      path: '/orderDetail',
      name: "orderDetail",
      component: () => import('@/view/deal/orderDetail'),
      meta: { requiresAuth: true }
    },
    {
      path: '/updateImg',
      name: "updateImg",
      component: () => import('@/view/deal/updateImg'),
      meta: { requiresAuth: true }
    },
    {
      path: '/quickSale',
      name: "quickSale",
      component: () => import('@/view/deal/quickSale'),
      meta: { requiresAuth: true }
    },
    {
      path: '/orderX',
      name: "orderX",
      component: () => import('@/view/deal/orderX'),
      meta: { requiresAuth: true }
    },
    {
      path: '/usdtList',
      name: "usdtList",
      component: () => import('@/view/deal/usdtList'),
      meta: { requiresAuth: true }
    },
    {
      path: '/tradingOrder',
      name: "tradingOrder",
      component: () => import('@/view/my/tradingOrder'),
      meta: { requiresAuth: true }
    },
  ]
})
