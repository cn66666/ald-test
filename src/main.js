/* jshint esversion: 6 */
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import Vue from 'vue';
import './assets/css/common.css';
import VueAxios from 'vue-axios';
import axios from 'axios';
import { Loading, Message,MessageBox} from 'element-ui';
import CollapseTransition from 'element-ui/lib/transitions/collapse-transition';
import router from './router';
import qs from 'qs';
import utils from "./assets/js/utils";
import el from "element-ui/src/locale/lang/el";


router.beforeEach((to, from, next) => {
  /* 路由发生变化修改页面title */
  if (to.meta.title) {
    document.title = to.meta.title
  }
  next()
})


Vue.config.productionTip = false;
Vue.use(ElementUI);
Vue.use(VueAxios,axios,qs,CollapseTransition);
Vue.prototype.$utils = utils;

//axios 框架
axios.defaults.timeout = 60000;//1分钟超时时间

axios.defaults.paramsSerializer = function(data){

  return qs.stringify(data, { indices: false });
},


// 添加请求拦截器
axios.interceptors.request.use(function (config) {
  if(localStorage.getItem("token") !== null) {
    config.headers.withCredentials = true
    config.headers.Authorization = localStorage.getItem("token")
    config.data['userPhone'] = localStorage.getItem("userPhone")
    config.data['role'] = localStorage.getItem("userRole")
    config.data['userName'] = localStorage.getItem("userName")
    return config;
  }else{
    if (config.url === "/ald/login"){
      return config
    }
    router.push({path:"/login"})
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
