<template>
  <div>
    <el-form :model="addForm" status-icon :rules="rules" ref="addForm" label-width="130px" class="demo-ruleForm" style="margin-top: 20px">
      <el-form-item label="角色名称" prop="caption" style="width: 50%">
        <el-input v-model="addForm.caption" :disabled="true"></el-input>
      </el-form-item>
      <el-form-item label="角色对应权限次数" prop="roleNum" style="width: 50%">
        <el-input v-model="addForm.roleNum">
          <template slot="append">次</template></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" :disabled="addBtn" @click="addRoleNum('addForm')">提交</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { Message } from 'element-ui';
export default {
  name: "addRoleNum",
  data() {
    return {
      addBtn: false,
      addForm: {
        roleId: '',
        caption: '',
        roleNum: ''
      },
      rules: {
        companyName: [
          { required: true, message: '请填写正确的数字',},
        ]
      }
    };
  },
  mounted() {
    var roleId = this.$route.query.roleId;
    var that = this;
    that.axios.post('/ald/user/role_num', {'roleId': roleId}).then(res=>{
      that.addBtn = false;
      if (res.data.code=='ok'){
        that.addForm.roleId = roleId;
        that.addForm.caption = res.data.data.caption;
        that.addForm.roleNum = res.data.data.have_num;
      } else {
        Message.warning(res.data.msg + ':' + res.data.data)
      }
    }).catch(res=>{
    })
  },
  methods: {
    addRoleNum(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          var that = this;
          that.addBtn = true;
          that.axios.post('/ald/user/change_role_num', {'addForm': that.addForm}).then(res=>{
            that.addBtn = false;
            if (res.data.code === 'ok'){
              that.$router.push('/admin/user/roleList')
            } else {
              that.addBtn = false;
              Message.warning(res.data.msg + ':' + res.data.data)
            }
          }).catch(res=>{
            that.addBtn = false;
            Message.warning('错误: 请联系管理员')
          })
        } else {
          return false;
        }
      });
    },
  }

}
</script>

<style scoped>
.el-table >>> tbody tr:hover > td{
  background-color: rgba(255,255,255, 1)!important;
  color: #000;
}
</style>
