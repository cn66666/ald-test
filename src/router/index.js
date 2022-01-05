import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/admin',
      name: '#',
      meta: { title: '首页', icon: ''},
      component: resolve => require(['../view/mould'], resolve),
      children: [
        {
          path: '/admin',
          name: 'admin',
          component: resolve => require(['../view/admin'], resolve),
        },
        {
          path: '/admin/user/userList',
          name: 'userList',
          meta: { title: '管理员列表' },
          component: resolve => require(['../view/user/userList'], resolve),
        },
        {
          path: '/admin/user/addUser',
          name: 'addUser',
          meta: { title: '添加管理员' },
          component: resolve => require(['../view/user/addUser'], resolve),
        },
        {
          path: '/admin/user/roleList',
          name: 'roleList',
          meta: { title: '角色列表' },
          component: resolve => require(['../view/user/roleList'], resolve),
        },
        {
          path: '/admin/user/changeRole',
          name: 'changeRole',
          meta: { title: '修改权限' },
          component: resolve => require(['../view/user/changeRole'], resolve),
        },
        {
          path: '/admin/user/addRole',
          name: 'addRole',
          meta: { title: '添加角色' },
          component: resolve => require(['../view/user/addRole'], resolve),
        },
        {
          path: '/admin/user/permissionList',
          name: 'permissionList',
          meta: { title: '权限列表' },
          component: resolve => require(['../view/user/permissionList'], resolve),
        },
        {
          path: '/admin/user/btnList',
          name: 'btnList',
          meta: { title: '按钮列表' },
          component: resolve => require(['../view/user/btnList'], resolve),
        },
        {
          path: '/admin/timer/jobList',
          name: 'jobList',
          meta: { title: '任务列表' },
          component: resolve => require(['../view/timer/jobList'], resolve),
        },
        {
          path: '/admin/timer/addJob',
          name: 'addJob',
          meta: { title: '添加任务' },
          component: resolve => require(['../view/timer/addJob'], resolve),
        },
        {
          path: '/admin/timer/jobLogList',
          name: 'jobLogList',
          meta: { title: '任务日志列表' },
          component: resolve => require(['../view/timer/jobLogList'], resolve),
        },
        {
          path: '/admin/logs/emailLogList',
          name: 'emailLogList',
          meta: { title: '邮件日志列表' },
          component: resolve => require(['../view/logs/emailLogList'], resolve),
        },
        {
          path: '/admin/dealer/applyList',
          name: 'applyList',
          meta: { title: '经销商申请清单' },
          component: resolve => require(['../view/dealer/applyList'], resolve),
        },
        {
          path: '/admin/dealer/addDealer',
          name: 'addDealer',
          meta: { title: '新建经销商' },
          component: resolve => require(['../view/dealer/addDealer'], resolve),
        },
        {
          path: '/admin/dealer/specialApply',
          name: 'specialApply',
          meta: { title: '暂存特殊审批' },
          component: resolve => require(['../view/dealer/specialApply'], resolve),
        },
        {
          path: '/admin/dealer/quotaList',
          name: 'quotaList',
          meta: { title: '经销商额度清单' },
          component: resolve => require(['../view/dealer/quotaList'], resolve),
        },
        {
          path: '/admin/dealer/interceptList',
          name: 'interceptList',
          meta: { title: '拦截清单' },
          component: resolve => require(['../view/dealer/interceptList'], resolve),
        },
        {
          path: '/admin/dealer/scoreList',
          name: 'scoreList',
          meta: { title: '评分卡申请' },
          component: resolve => require(['../view/dealer/scoreList'], resolve),
        },
        {
          path: '/admin/dealer/addScoreApply',
          name: 'addScoreApply',
          meta: { title: '评分卡数据补充' },
          component: resolve => require(['../view/dealer/addScoreApply'], resolve),
        },
        {
          path: '/admin/dealer/quarterList',
          name: 'quarterList',
          meta: { title: '季度额度调整' },
          component: resolve => require(['../view/dealer/quarterList'], resolve),
        },
        {
          path: '/admin/business/orderList',
          name: 'orderList',
          meta: { title: '赊销订单过滤' },
          component: resolve => require(['../view/business/orderList'], resolve),
        },
        {
          path: '/admin/business/sellOrderList',
          name: 'sellOrderList',
          meta: { title: '赊销订单历史' },
          component: resolve => require(['../view/business/sellOrderList'], resolve),
        },
        {
          path: '/admin/business/noSellOrderList',
          name: 'noSellOrderList',
          meta: { title: '非赊销订单历史' },
          component: resolve => require(['../view/business/noSellOrderList'], resolve),
        },
        {
          path: '/admin/business/dealerOverdueList',
          name: 'dealerOverdueList',
          meta: { title: '滞纳金管理' },
          component: resolve => require(['../view/business/dealerOverdueList'], resolve),
        },
        {
          path: '/admin/business/invoiceOverdueList',
          name: 'invoiceOverdueList',
          meta: { title: '开票滞纳金查询' },
          component: resolve => require(['../view/business/invoiceOverdueList'], resolve),
        },
        {
          path: '/admin/business/fulfilList',
          name: 'fulfilList',
          meta: { title: '履行单通过清单' },
          component: resolve => require(['../view/business/fulfilList'], resolve),
        },
        {
          path: '/admin/business/fulfilApplyList',
          name: 'fulfilApplyList',
          meta: { title: '履行单拦截清单' },
          component: resolve => require(['../view/business/fulfilApplyList'], resolve),
        },
      ]
    },
    {
      path: '/',
      name: 'index',
      component: resolve => require(['../view/index'], resolve),
    },
    {
      path: '/login',
      name: 'login',
      component: resolve => require(['../view/login'], resolve),
    },
    {
      path: '/xingyun/upload',
      name: 'upload',
      component: resolve => require(['../view/upload'], resolve),
      meta: {
        title: '行云数据采集',
        icon: '/static/xingyun.ico'
      }
    }]
})
