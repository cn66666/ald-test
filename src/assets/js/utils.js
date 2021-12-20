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
    that.axios.post('/aladdin/user/get_role_list', {'oper': that.userPhone,}).then(res => {
      if (res.data.code == 'ok') {
        that.tableData = res.data.data
      }
    }).catch(res => {
    })
  },
  // checkPermission: function (that){
  //   that.axios.post('/aladdin/user/check_permission', {'oper': that.userPhone,}).then(res => {
  //     if (res.data.code == 'ok') {
  //       that.$router.push(that.routerUrl)
  //     } else {
  //       that.$message({
  //         message: res.data.msg,
  //         type: 'warning'
  //       });
  //     }
  //   }).catch(res => {
  //   })
  // },

}

