<template>
  <div>
    <el-form :model="addForm" status-icon :rules="rules" ref="addForm" label-width="130px" class="demo-ruleForm">
      <el-form-item label="去年完成情况" prop="doneRate" style="width: 50%">
        <el-input v-model="addForm.doneRate">
          <template slot="append">%</template></el-input>
      </el-form-item>
      <el-form-item label="今年业务规划" prop="saleMoney" style="width: 50%">
        <el-input v-model="addForm.saleMoney">
          <template slot="append">元</template></el-input>
      </el-form-item>
      <el-form-item label="结算时长" prop="endDay" style="width: 50%">
        <el-input v-model="addForm.endDay">
          <template slot="append">天</template></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" :disabled="addBtn" @click="addScore('addForm')">提交</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  name: "addDealer",
  data() {
    var validatePass = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请填写正确内容'));
      } else {
        try {
          var res = parseFloat(value)
          if (isNaN(res)){
            callback(new Error('请填写正确内容'));
          }
          if (value !== res.toString()){
            callback(new Error('请填写正确内容'));
          }
          callback();
        }
        catch(err){
          callback(new Error('请填写正确内容'));
        }
      }
    };
    return {
      addBtn: false,
      addForm: {
        applyType: '',
        saleMoney: 0,
        endDay: 0,
        doneRate: 0,
      },
      rules: {
        saleMoney: [
          {required: true, validator: validatePass,},
        ],
        endDay: [
          {required: true, validator: validatePass,},
        ],
        doneRate: [
          {required: true, validator: validatePass,},
        ],
      }
    };
  },
  mounted() {
    var that = this;
    that.dealer_id = that.$route.query.dealerId;
    if (that.dealer_id){
      // 查询评分卡申请信息进行修改
      that.axios.post('/ald/dealer/score_apply_info', {'dealerId': that.dealer_id}).then(res=>{
        that.addBtn = false;
        if (res.data.code=='ok'){
          that.addForm.applyType = res.data.data;
        } else {
          this.$message({
            message: res.data.msg + ':' + res.data.data,
            type: 'warning'
          });
        }
      }).catch(res=>{
      })
    }
  },
  methods: {
    addScore(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          var that = this;
          that.addBtn = true;
          that.axios.post('/ald/dealer/add_score_apply', {'addForm': that.addForm, 'dealerId': that.dealer_id}).then(res=>{
            that.addBtn = false;
            if (res.data.code === 'ok'){
              that.$router.push('/admin/dealer/scoreList')
            } else {
              that.addBtn = false;
              this.$message({
                message: res.data.msg + ':' + res.data.data,
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
  }

}
</script>

<style scoped>
.el-table >>> tbody tr:hover > td{
  background-color: rgba(255,255,255, 1)!important;
  color: #000;
}
</style>
