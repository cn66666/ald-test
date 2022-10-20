/* jshint esversion: 6 */
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import Vue from 'vue';
import './assets/css/common.css';
import './assets/css/style.css';
import VueAxios from 'vue-axios';
import axios from 'axios';
import { Loading, Message,MessageBox} from 'element-ui';
import CollapseTransition from 'element-ui/lib/transitions/collapse-transition';
import router from './router';
import qs from 'qs';
import utils from "./assets/js/utils";
import el from "element-ui/src/locale/lang/el";
import numberFormat from './assets/js/filter'
import tenNumberFormat from './assets/js/tenFilter'
import rateNumberFormat from './assets/js/rateFilter'


router.beforeEach((to, from, next) => {
  /* 路由发生变化修改页面title */
  if (to.meta.title) {
    document.title = to.meta.title
  }
  next()
})
router.onError((error) => {
  const pattern = /Loading chunk (\d)+ failed/g;
  const isChunkLoadFailed = error.message.match(pattern);
  console.log(router)
  const targetPath = router.history.pending.fullPath;
  if (isChunkLoadFailed) {
    location.reload()
  }
});

Vue.config.productionTip = false;
Vue.use(ElementUI);
Vue.use(VueAxios,axios,qs,CollapseTransition);
Vue.prototype.$utils = utils;
Vue.filter("moneyFormat", numberFormat);
Vue.filter("tenFormat", tenNumberFormat);
Vue.filter("rateFormat", rateNumberFormat);

//axios 框架
axios.defaults.timeout = 60000;//1分钟超时时间

axios.defaults.paramsSerializer = function(data){

  return qs.stringify(data, { indices: false });
},


// 添加请求拦截器
axios.interceptors.request.use(function (config) {
  if (config.method == 'post'){
    if(localStorage.getItem("token") !== null) {
      config.headers.withCredentials = true
      config.headers.Authorization = localStorage.getItem("token")
      config.data['userPhone'] = localStorage.getItem("userPhone")
      config.data['role'] = localStorage.getItem("userRole")
      config.data['userName'] = localStorage.getItem("userName")
      config.data['userCode'] = localStorage.getItem("userCode")
      return config;
    }else{
      if (config.url === "/ald/login"){
        return config
      }else if (config.url === "/xingyun/upload"){
        return config
      }else if (config.url === "/ald/dealer/get_code"){
        return config
      }else if (config.url === "/dailyNotice/report"){
        return config
      }
      // router.push({path:"/login"})
    }
  }else {
    return config;
  }
}, function (error) {
  // 对请求错误做些什么
  return Promise.reject(error);
});

// http respones拦截器
// 添加响应拦截器
var cofirm = null;
axios.interceptors.response.use(function (response) {
  if(cofirm != null) {
    cofirm = null;//清除confirm
  }
  // 对响应数据做点什么
  return response;
}, function (error) {
  // 对响应错误做点什么
  switch (error.response.status) {
    case 401:
      if(cofirm == null) {
        //记录登录提示弹框
        cofirm =  MessageBox.confirm('登录失效，请重新登录！', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          router.push({path:"/login"})
        }).catch(() => {
          router.push({path:"/login"})
        });
      }
      break;
    case 500:
      let message = null;
      if(error.response.data != undefined) {
        message = error.response.data.message;
      } else {
        message = error.message;
      }
      Message.error({
        message: message
      });
      break;
  }
  return Promise.reject(error);
});





new Vue({
  el: '#app',
  router,
})
