import { Message } from 'element-ui';

export const checkPermission = (check) => {
  // 权限校验的对象
  var role = localStorage.getItem("userRole")
  if (check === 'L1'){
    if (role === '普通用户'){
      Message.warning('失败: 无当前权限')
      return false
    }
  }
  if (check === 'L2'){
    if (role === '普通用户' || role === 'L1审批员'){
      Message.warning('失败: 无当前权限')
      return false
    }
  }
  if (check === 'L3'){
    if (role === '普通用户' || role === 'L1审批员' || role === 'L2审批员'){
      Message.warning('失败: 无当前权限')
      return false
    }
  }
  if (check === 'admin'){
    if (role !== '管理员'){
      Message.warning('失败: 无当前权限')
      return false
    }
  }
  return (target, name, descriptor)=>{
    const oldValue = descriptor.value
    descriptor.value = function (...args){
      oldValue.apply(target, args)
    }
    return descriptor
  }
}

export default {
  getRoleList: function (that) {
    that.axios.post('/ald/user/get_role_list', {'oper': that.userPhone,}).then(res => {
      if (res.data.code == 'ok') {
        that.tableData = res.data.data
      }
    }).catch(res => {
    })
  },

  getNowDate: function (){
    var now = new Date();
    const y = now.getFullYear();
    const m = now.getMonth() + 1 + '';
    const d = now.getDate();
    const hh = now.getHours();
    const mm = now.getMinutes();
    const ss = now.getSeconds();
    return y + m + d + hh + mm + ss;
  }

}

