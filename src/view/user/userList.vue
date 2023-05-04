<template>
  <div>
    <el-row class="filter_row">
      <div class="demo-input-suffix" style="float:left;margin: 2px;">
        <el-input  style="width: 200px; float:left;"
                   placeholder="用户名称" v-model="queryType.userName">
        </el-input>
      </div>
      <div class="demo-input-suffix" style="float:left;margin: 2px;">
        <el-select v-model="queryType.roleType" placeholder="请选择角色类型">
          <el-option
            v-for="item in roleType"
            :key="item"
            :label="item"
            :value="item">
          </el-option>
        </el-select>
      </div>
      <div class="demo-input-suffix" style="float:left;margin: 2px;">
        <el-button style="height: 36px;float:left; width: 100px" type="primary" @click="getUserList()">查询</el-button>
        <el-button style="height: 36px;float:left; width: 100px" type="primary" @click="reset()">重置</el-button>
        <el-button style="height: 36px;float:left; width: 100px" type="primary" @click="download()">下载excel</el-button>
      </div>
      <router-link to='/admin/user/addUser'>
        <el-button style="float:right;" type="primary">添加新用户</el-button>
      </router-link>
    </el-row>
    <el-table
      class="info_table"
      :data="userData"
      style="width: 98%; margin: 0 1%" :row-style="{height: '30px'}">
      <el-table-column
        prop="id"
        label="No."
        width="70%">
      </el-table-column>
      <el-table-column
        prop="role"
        label="角色"
        width="100%">
      </el-table-column>
      <el-table-column
        prop="name"
        label="用户名称"
        width="100%">
      </el-table-column>
      <el-table-column
        prop="create_time"
        label="创建日期"
        width="200%">
      </el-table-column>
      <el-table-column
        prop="phone"
        label="手机号"
        width="200%">
      </el-table-column>
      <el-table-column
        prop="code"
        label="工号"
        width="200%">
      </el-table-column>
      <el-table-column
        prop="is_delete"
        label="状态"
        width="70%">
        <template slot-scope="scope">
          <i class="el-icon-delete" v-if="scope.row.is_delete"></i>
          <i class="el-icon-check" v-else></i>
        </template>
      </el-table-column>
      <el-table-column
        prop="create_time"
        label="注销日期"
        width="200%">
        <template slot-scope="scope">
          <span v-if="scope.row.is_delete">{{scope.row.update_time}}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="操作">
        <template slot-scope="scope">
          <el-popover
            placement="top"
            width="160"
            v-if="scope.row.is_delete === false">
            <p>是否将该用户注销？</p>
            <div style="text-align: right; margin: 0">
              <el-button size="mini" type="text" @click="visible = false">取消</el-button>
              <el-button type="primary" size="mini" @click="deleteUserInfo(scope.row.id)">确定</el-button>
            </div>
            <el-button slot="reference" size="mini">注销</el-button>
          </el-popover>
          <el-button v-if="scope.row.is_delete === false" size="mini" round
                     @click="changeUser(scope.row.id, scope.row.phone, scope.row.code, scope.row.name)">修改账号</el-button>
          <el-button v-if="scope.row.is_delete === false" size="mini" round
                     @click="clearLoginLog(scope.row.id)">清除登录次数</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div style="text-align: right;margin-top: 23px;margin-right: 79px;">
      <el-pagination @current-change="handleCurrentChange" :current-page.sync="localPage"
                     layout="prev, pager, next" :page-count="total">
      </el-pagination>
    </div>
    <el-dialog title="修改用户配置" :visible.sync="showChangeUser">
      <el-form :model="userInfo">
        <el-form-item label="当前手机号" :label-width="formLabelWidth">
          <el-input v-model="userInfo.phone" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="当前工号" :label-width="formLabelWidth">
          <el-input v-model="userInfo.code" autocomplete="off"></el-input>
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
      total: 1,
      localPage: 1,
      queryType: {
      },
      roleType: ['管理员', '普通用户', '业务', '财务'],
      userInfo: {
        userId: '',
        oldPhone: '',
        oldCode: '',
        phone: '',
        code: '',
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
    handleCurrentChange(val) {
      var that = this;
      that.localPage = val;
      that.getUserList();
    },
    getUserList: function (){
      var that = this;
      that.axios.post('/ald/user/get_user_list', {'page': that.localPage, 'queryType': that.queryType}).then(res=>{
        if (res.data.code==='ok'){
          that.userData = res.data.data.data_list
          that.total = res.data.data.total
        }
      }).catch(res=>{
      })
    },
    reset: function () {
      location.reload()
    },
    deleteUserInfo: function (userId){
      var that = this;
      that.axios.post('/ald/user/delete_user', {'userId': userId}).then(res=>{
        if (res.data.code==='ok'){
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
    changeUser: function (userId, phone, code, name){
      var that = this;
      that.userInfo.userId = userId
      that.userInfo.name = name
      that.userInfo.oldPhone = phone
      that.userInfo.phone = phone
      that.userInfo.oldCode = code
      that.userInfo.code = code
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
        'userId': that.userInfo.userId,
        'name': that.userInfo.name,
        'user': that.userInfo.phone,
        'code': that.userInfo.code,
        'pwd': that.userInfo.pass,
        'oldPhone': that.userInfo.oldPhone,
        'oldCode': that.userInfo.oldCode,
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
    clearLoginLog: function (userId){
      var that = this;
      that.axios.post('/ald/user/clear_login', {'userId': userId}).then(res=>{
        if (res.data.code=='ok'){
          this.$message({
            message: '清除成功',
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
    download: function (){
      var that = this;
      var data = 'data=' + JSON.stringify(that.queryType);
      var now = that.$utils.getNowDate()
      var file_name = '用户列表' + now + '.xls'
      that.axios({
        method: "get",
        url: '/ald/downloads/userList?' + data + '&timestamp=' + new Date().getTime(),
        responseType: 'blob'
      }).then((res) => {
        let blob = new Blob([res.data])
        let objectUrl = URL.createObjectURL(blob);
        let link = document.createElement("a");
        link.href = objectUrl;
        link.setAttribute("download", file_name);
        document.body.appendChild(link);
        link.click();
      })
    },
  }
}
</script>

<style scoped>

</style>
