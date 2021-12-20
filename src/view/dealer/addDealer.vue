<template>
  <div>
    <el-form :model="addForm" status-icon :rules="rules" ref="addForm" label-width="130px" class="demo-ruleForm">
      <el-form-item label="经销商名称" prop="companyName" style="width: 50%">
        <el-input v-model="addForm.companyName" :disabled="change"></el-input>
      </el-form-item>
      <el-form-item label="经销商类型" prop="companyType" style="width: 50%">
        <el-select v-model="addForm.companyType" placeholder="请选择">
          <el-option label="自主品牌" value="自主品牌"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="合作起始时间" prop="coopDate" style="width: 50%">
        <el-date-picker type="date" placeholder="选择日期" value-format="yyyy-MM-dd"
                        v-model="addForm.coopDate"></el-date-picker>
      </el-form-item>
      <el-form-item label="销售代表" prop="salePerson" style="width: 50%">
        <el-input v-model="addForm.salePerson"></el-input>
      </el-form-item>
      <el-form-item label="销售金额" prop="saleMoney" style="width: 50%">
        <el-input v-model="addForm.saleMoney"></el-input>
      </el-form-item>
      <el-form-item label="经销商分类" prop="quotaType" style="width: 50%">
        <el-select v-model="addForm.quotaType" placeholder="请选择">
          <el-option label="新客户申请" value="新客户"></el-option>
          <el-option label="老客户录入" value="老客户"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button v-if="addForm.quotaType == '新客户'" type="primary" :disabled="addBtn" @click="addDealer('addForm', '暂存')">暂存</el-button>
        <el-button type="primary" :disabled="addBtn" @click="addDealer('addForm', '提交')">提交</el-button>
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
        callback(new Error('请填写销售金额'));
      } else {
        if (this.addForm.saleMoney !== '') {
          try {
            var res = parseFloat(this.addForm.saleMoney)
            if (isNaN(res)){
              callback(new Error('请填写正确的销售金额'));
            }
            callback();
          }
          catch(err){
            callback(new Error('请填写正确的销售金额'));
          }
        }
      }
    };
    return {
      addBtn: false,
      addForm: {
        companyName: '',
        companyType: '',
        coopDate: null,
        salePerson: '',
        saleMoney: '',
        quotaType: '',
      },
      change: false,
      rules: {
        companyName: [
          { required: true, message: '请填写经销商名称',},
        ],
        companyType: [
          { required: true, message: '请选择经销商类型',},
        ],
        coopDate: [
          { required: true, message: '请填写合作起始时间',},
        ],
        salePerson: [
          { required: true, message: '请填写销售代表',},
        ],
        saleMoney: [
          { required: true, validator: validatePass,},
        ],
        quotaType: [
          { required: true, message: '请选择经销商分类',},
        ],
      }
    };
  },
  mounted() {
    var dealerId = this.$route.query.dealerId;
    if (dealerId){
      // 查询经销商信息进行修改
      var that = this;
      that.axios.post('/ald/dealer/dealer_info', {'dealerId': dealerId}).then(res=>{
        that.addBtn = false;
        if (res.data.code=='ok'){
          that.addForm.companyName = res.data.data.company_name;
          that.addForm.companyType = res.data.data.company_type;
          that.addForm.coopDate = res.data.data.coop_date;
          that.addForm.salePerson = res.data.data.sale_person;
          that.addForm.saleMoney = res.data.data.sale_money;
          that.addForm.quotaType = '新客户';
          that.change = true
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
    addDealer(formName, addType) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          var that = this;
          that.addBtn = true;
          that.axios.post('/ald/dealer/add_dealer', {'addForm': that.addForm, 'type': addType, 'change': that.change}).then(res=>{
            that.addBtn = false;
            if (res.data.code=='ok'){
              that.$router.push('/admin/dealer/applyList')
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
