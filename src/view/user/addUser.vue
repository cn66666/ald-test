<template>
  <div>
    <el-form :model="ruleForm" status-icon :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm" style="margin-top: 20px">
      <el-form-item label="账户名称" prop="name">
        <el-input v-model="ruleForm.name"></el-input>
      </el-form-item>
      <el-form-item label="工号" prop="工号">
        <el-input v-model="ruleForm.code"></el-input>
      </el-form-item>
      <el-form-item label="手机号" prop="phone">
        <el-input v-model.number="ruleForm.phone"></el-input>
      </el-form-item>
      <el-form-item label="密码" prop="pass">
        <el-input type="password" v-model="ruleForm.pass" autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item label="确认密码" prop="checkPass">
        <el-input type="password" v-model="ruleForm.checkPass" autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item label="修改角色" :label-width="formLabelWidth">
        <el-select v-model="ruleForm.roleId" placeholder="请选择">
          <el-option
            v-for="item in tableData"
            :key="item.id"
            :label="item.caption"
            :value="item.id">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" :disabled="addBtn" @click="submitForm('ruleForm')">提交</el-button>
        <el-button :disabled="addBtn" @click="resetForm('ruleForm')">重置</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  name: 'addUser',
  data() {
    var checkPhone = (rule, value, callback) => {
      if (!value) {
        return callback(new Error('手机号不能为空'));
      }
      setTimeout(() => {
        if (!/^1[0-9]{10}$/.test(value)) {
          callback(new Error('请输入正确手机号'));
        } else {
          callback();
        }
      }, 1000);
    };
    var validatePass = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入密码'));
      } else {
        if (this.ruleForm.checkPass !== '') {
          this.$refs.ruleForm.validateField('checkPass');
        }
        callback();
      }
    };
    var validatePass2 = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请再次输入密码'));
      } else if (value !== this.ruleForm.pass) {
        callback(new Error('两次输入密码不一致!'));
      } else {
        callback();
      }
    };
    return {
      addBtn: false,
      tableData: [],
      formLabelWidth: '120px',
      ruleForm: {
        code: '',
        pass: '',
        checkPass: '',
        phone: '',
        name: '',
        roleId: ''
      },
      rules: {
        pass: [
          { validator: validatePass, trigger: 'blur' }
        ],
        checkPass: [
          { validator: validatePass2, trigger: 'blur' }
        ]
      }
    };
  },
  mounted() {
    var that = this;
    that.$utils.getRoleList(that)
  },
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          var that = this;
          that.addBtn = true;
          that.axios.post('/ald/user/add_user', {
            'code': this.ruleForm.code,
            'name': this.ruleForm.name,
            'user': this.ruleForm.phone,
            'pwd': this.ruleForm.pass,
            'roleId': this.ruleForm.roleId}).then(res=>{
            that.addBtn = false;
            if (res.data.code=='ok'){
              that.$router.push('/admin/user/userList')
            } else {
              this.$message({
                message: res.data.msg,
                type: 'warning'
              });
            }
          }).catch(res=>{
          })
        } else {
          return false;
        }
      });
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    }
  }
}
</script>

<style scoped>

</style>
