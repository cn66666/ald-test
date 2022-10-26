import Vue from 'vue'
import Router from 'vue-router'
import VueRouter from "vue-router";

Vue.use(Router)

var originalPush = VueRouter.prototype.push;

VueRouter.prototype.push = function push(location){
  return originalPush.call(this, location).catch(err => err);
}

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
          component: resolve => require(['../view/admin/admin'], resolve),
        },
        {
          path: '/admin/user/userList',
          name: 'userList',
          meta: { title: '用户列表' },
          component: resolve => require(['../view/user/userList'], resolve),
        },
        {
          path: '/admin/user/addUser',
          name: 'addUser',
          meta: { title: '添加用户' },
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
          path: '/admin/user/addRoleNum',
          name: 'addRoleNum',
          meta: { title: '添加角色权限次数' },
          component: resolve => require(['../view/user/addRoleNum'], resolve),
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
          path: '/admin/dealer/dealerInfo',
          name: 'dealerInfo',
          meta: { title: '客户信息数据' },
          component: resolve => require(['../view/dealer/dealerInfo'], resolve),
        },
        {
          path: '/admin/dealer/applyList',
          name: 'applyList',
          meta: { title: '客户申请清单' },
          component: resolve => require(['../view/dealer/applyList'], resolve),
        },
        {
          path: '/admin/dealer/addDealer',
          name: 'addDealer',
          meta: { title: '新建客户' },
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
          meta: { title: '客户额度清单' },
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
          path: '/admin/business/orderInfoList',
          name: 'orderInfoList',
          meta: { title: '销售单状态' },
          component: resolve => require(['../view/business/orderInfoList'], resolve),
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
          path: '/admin/business/fulfilErrorList',
          name: 'fulfilErrorList',
          meta: { title: '履行单拦截清单' },
          component: resolve => require(['../view/business/fulfilErrorList'], resolve),
        },
        {
          path: '/admin/business/fulfilInfo',
          name: 'fulfilInfo',
          meta: { title: '履行单信息' },
          component: resolve => require(['../view/business/fulfilInfo'], resolve),
        },
        {
          path: '/admin/business/invoiceInfo',
          name: 'invoiceInfo',
          meta: { title: '开票信息' },
          component: resolve => require(['../view/business/invoiceInfo'], resolve),
        },
        {
          path: '/admin/logs/openApiLogs',
          name: 'openApiLogs',
          meta: { title: '接口请求日志' },
          component: resolve => require(['../view/logs/openApiLogs'], resolve),
        },
        {
          path: '/admin/logs/systemRequestLogs',
          name: 'systemRequestLogs',
          meta: { title: '后台请求日志' },
          component: resolve => require(['../view/logs/systemRequestLogs'], resolve),
        },
        {
          path: '/admin/logs/erpRequestLogs',
          name: 'erpRequestLogs',
          meta: { title: '请求ERP日志' },
          component: resolve => require(['../view/logs/erpRequestLogs'], resolve),
        },
        {
          path: '/admin/logs/scoreLogs',
          name: 'scoreLogs',
          meta: { title: '评分卡详情' },
          component: resolve => require(['../view/logs/scoreLogs'], resolve),
        },
        {
          path: '/admin/dealer/quotaLogs',
          name: 'quotaLogs',
          meta: { title: '额度变更详情' },
          component: resolve => require(['../view/dealer/quotaLogs'], resolve),
        },
        {
          path: '/admin/business/overdueLogs',
          name: 'overdueLogs',
          meta: { title: '滞纳金变更详情' },
          component: resolve => require(['../view/business/overdueLogs'], resolve),
        },
        {
          path: '/admin/business/invoiceOverdueLogs',
          name: 'invoiceOverdueLogs',
          meta: { title: '发票逾期详情' },
          component: resolve => require(['../view/business/invoiceOverdueLogs'], resolve),
        },
        {
          path: '/admin/dealer/dealerInactiveList',
          name: 'dealerInactiveList',
          meta: { title: '客户注销清单' },
          component: resolve => require(['../view/dealer/dealerInactiveList'], resolve),
        },
        {
          path: '/admin/business/inactiveOrderInfoList',
          name: 'inactiveOrderInfoList',
          meta: { title: '销售单状态' },
          component: resolve => require(['../view/business/inactiveOrderInfoList'], resolve),
        },
        {
          path: '/admin/business/inactiveFulfilList',
          name: 'inactiveFulfilList',
          meta: { title: '履行单通过清单' },
          component: resolve => require(['../view/business/inactiveFulfilList'], resolve),
        },
        {
          path: '/admin/logs/erpInvoiceHistoryLogs',
          name: 'erpInvoiceHistoryLogs',
          meta: { title: '历史开票请求历史' },
          component: resolve => require(['../view/logs/erpInvoiceHistoryLogs'], resolve),
        },
        {
          path: '/admin/logs/dbOperLogs',
          name: 'dbOperLogs',
          meta: { title: '数据变更日志' },
          component: resolve => require(['../view/logs/dbOperLogs'], resolve),
        },
        {
          path: '/admin/logs/debugLogs',
          name: 'debugLogs',
          meta: { title: 'debug日志' },
          component: resolve => require(['../view/logs/debugLogs'], resolve),
        },
        {
          path: '/admin/logs/controlLogs',
          name: 'controlLogs',
          meta: { title: '监控日志' },
          component: resolve => require(['../view/logs/controlLogs'], resolve),
        },
        {
          path: '/admin/dealer/dealerPublicList',
          name: 'dealerPublicList',
          meta: { title: '公开信息查询' },
          component: resolve => require(['../view/dealer/dealerPublicList'], resolve),
        },
        {
          path: '/admin/dealer/dealerPublicReport',
          name: 'dealerPublicReport',
          meta: { title: '公开信息报告' },
          component: resolve => require(['../view/dealer/dealerPublicReport'], resolve),
        },
        {
          path: '/admin/dealer/exportInfoList',
          name: 'exportInfoList',
          meta: { title: '出口客户信息列表' },
          component: resolve => require(['../view/dealer/exportInfoList'], resolve),
        },
        {
          path: '/admin/dealer/dealerOperLogs',
          name: 'dealerOperLogs',
          meta: { title: '用户操作日志' },
          component: resolve => require(['../view/dealer/dealerOperLogs'], resolve),
        },
        {
          path: '/admin/dealer/payDaySetting',
          name: 'payDaySetting',
          meta: { title: '账期天数配置' },
          component: resolve => require(['../view/dealer/payDaySetting'], resolve),
        },
        {
          path: '/admin/user/noticeList',
          name: 'noticeList',
          meta: { title: '通知列表' },
          component: resolve => require(['../view/user/noticeList'], resolve),
        },
        {
          path: '/admin/user/noticeUserConfig',
          name: 'noticeUserConfig',
          meta: { title: '负责人配置' },
          component: resolve => require(['../view/user/noticeUserConfig'], resolve),
        },
        {
          path: '/admin/user/businessNoticeConfig',
          name: 'businessNoticeConfig',
          meta: { title: '业务负责人通知配置' },
          component: resolve => require(['../view/user/businessNoticeConfig'], resolve),
        },
        {
          path: '/admin/user/orderNoticeConfig',
          name: 'orderNoticeConfig',
          meta: { title: '跟单负责人通知配置' },
          component: resolve => require(['../view/user/orderNoticeConfig'], resolve),
        },
        {
          path: '/admin/dealer/changeQuotaDay',
          name: 'changeQuotaDay',
          meta: { title: '客户账期调整' },
          component: resolve => require(['../view/dealer/changeQuotaDay'], resolve),
        },
        {
          path: '/admin/dealer/dealerOverdueSkip',
          name: 'dealerOverdueSkip',
          meta: { title: '客户逾期特批' },
          component: resolve => require(['../view/dealer/dealerOverdueSkip'], resolve),
        },
        {
          path: '/admin/business/orderInvoiceList',
          name: 'orderInvoiceList',
          meta: { title: '客户回款情况' },
          component: resolve => require(['../view/business/orderInvoiceList'], resolve),
        },
        {
          path: '/admin/user/dailyNoticeConfig',
          name: 'dailyNoticeConfig',
          meta: { title: '客户日报配置' },
          component: resolve => require(['../view/user/dailyNoticeConfig'], resolve),
        },
        {
          path: '/admin/business/orderFulfilList',
          name: 'orderFulfilList',
          meta: { title: '客户发货情况' },
          component: resolve => require(['../view/business/orderFulfilList'], resolve),
        },
        {
          path: '/admin/user/noticeLogList',
          name: 'noticeLogList',
          meta: { title: '客户消息通知日志' },
          component: resolve => require(['../view/user/noticeLogList'], resolve),
        },
        {
          path: '/admin/dealer/oaApplyList',
          name: 'oaApplyList',
          meta: { title: 'OA审批清单' },
          component: resolve => require(['../view/dealer/oaApplyList'], resolve),
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
      path: '/dailyNotice/report',
      name: 'report',
      meta: { title: '信用评级系统-客户日报' },
      component: resolve => require(['../view/dailyNotice/report'], resolve),
    },
    {
      path: '/xingyun/upload',
      name: 'upload',
      component: resolve => require(['../view/upload'], resolve),
      meta: {
        title: '行云数据采集',
        icon: '/static/xingyun.ico'
      }
    },]
})
