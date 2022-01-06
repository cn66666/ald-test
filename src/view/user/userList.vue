<template>
  <div>
    <el-row class="btn_row">
      <router-link to='/admin/user/addUser'>
        <el-button style="float:right;" type="primary" size="mini">添加新用户</el-button>
      </router-link>
    </el-row>
    <el-table
      :data="userData"
      style="width: 98%; margin: 0 1%" :row-style="{height: '30px'}">
      <el-table-column
        prop="id"
        label="No."
        style="width: 10%">
      </el-table-column>
      <el-table-column
        prop="role"
        label="角色"
        style="width: 15%">
      </el-table-column>
      <el-table-column
        prop="name"
        label="账号名称"
        style="width: 30%">
      </el-table-column>
      <el-table-column
        prop="phone"
        label="手机号"
        style="width: 30%">
      </el-table-column>
      <el-table-column
        prop="is_delete"
        label="状态"
        style="width: 15%">
        <template slot-scope="scope">
          <i class="el-icon-delete" v-if="scope.row.is_delete"></i>
          <i class="el-icon-check" v-else></i>
        </template>
      </el-table-column>
      <el-table-column
        label="操作"
        style="width: 20%">
        <template slot-scope="scope">
          <el-popover
            placement="top"
            width="160"
            v-if="scope.row.is_delete === false">
            <p>是否将该用户注销？</p>
            <div style="text-align: right; margin: 0">
              <el-button size="mini" type="text" @click="visible = false">取消</el-button>
              <el-button type="primary" size="mini" @click="deleteUserInfo(scope.row.phone)">确定</el-button>
            </div>
            <el-button slot="reference" size="mini">注销</el-button>
          </el-popover>
          <el-button v-if="scope.row.is_delete === false"
                     size="mini" round @click="changeUser(scope.row.phone, scope.row.name)">修改账号</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog title="修改用户配置" :visible.sync="showChangeUser">
      <el-form :model="userInfo">
        <el-form-item label="当前手机号" :label-width="formLabelWidth">
          <el-input v-model="userInfo.phone" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="当前名称" :label-width="formLabelWidth">
          <el-input v-model="userInfo.name" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="新密码" :label-width="formLabelWidth">
          <el-input v-model="userInfo.pass" autocomplete="off" type="password"></el-input>
        </el-form-item>
        <el-form-item label="重新输入新密码" :label-width="formLabelWidth">
          <el-input v-model="userInfo.checkPass" autocomplete="off" type="password"></el-input>
        </el-form-item>
        <el-form-item label="修改角色" :label-width="formLabelWidth">
          <el-select v-model="userInfo.roleId" placeholder="请选择">
            <el-option
              v-for="item in tableData"
              :key="item.id"
              :label="item.caption"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="showChangeUser = false">取 消</el-button>
        <el-button type="primary" @click="changeUserMode()">确 定</el-button>
      </div>
    </el-dialog>
  </div>

</template>

<script>
export default {
  name: "userList",
  data() {
    return {
      userData: [],
      visible: false,
      showChangeUser: false,
      formLabelWidth: '120px',
      userInfo: {
        oldPhone: '',
        phone: '',
        name: '',
        pass: '',
        checkPass: '',
        roleId: ''
      },
      tableData: []
    }
  },
  mounted() {
    var that = this;
    that.getUserList();
    that.$utils.getRoleList(that)
  },
  methods: {
    getUserList: function (){
      var that = this;
      that.axios.post('/ald/user/get_user_list', {}).then(res=>{
        if (res.data.code=='ok'){
          that.userData = res.data.data
        }
      }).catch(res=>{
      })
    },
    deleteUserInfo: function (user){
      var that = this;
      that.axios.post('/ald/user/delete_user', {'user': user}).then(res=>{
        if (res.data.code=='ok'){
          this.visible = false;
          this.getUserList();
          this.$message({
            message: '注销成功',
            type: 'success'
          });
        }else {
          this.$message({
            message: res.data.msg,
            type: 'warning'
          });
        }
      }).catch(res=>{
      })
    },
    changeUser: function (phone, name){
      var that = this;
      that.userInfo.name = name
      that.userInfo.oldPhone = phone
      that.userInfo.phone = phone
      that.showChangeUser = true
    },
    changeUserMode: function (){
      var that = this;
      if (that.userInfo.phone == ''){
        that.$message({
          message: '请填入手机号',
          type: 'warning'
        });
        return
      }
      if (that.userInfo.name == ''){
        that.$message({
          message: '请填入用户名',
          type: 'warning'
        });
        return
      }
      if (that.userInfo.pass != ''){
        if (that.userInfo.checkPass == ''){
          that.$message({
            message: '请填入密码',
            type: 'warning'
          });
          return
        }
        if (that.userInfo.pass != that.userInfo.checkPass){
          that.$message({
            message: '请填入正确的密码',
            type: 'warning'
          });
          return
        }
      }
      that.axios.post('/ald/user/change_user', {
        'name': that.userInfo.name,
        'user': that.userInfo.phone,
        'pwd': that.userInfo.pass,
        'oldPhone': that.userInfo.oldPhone,
        'roleId': that.userInfo.roleId
        }).then(res=>{
        if (res.data.code=='ok'){
          location.reload();
        } else {
          that.$message({
            message: res.data.msg,
            type: 'warning'
          });
        }
      }).catch(res=>{
      })
    },
  }
}
</script>

<style scoped>

</style>
