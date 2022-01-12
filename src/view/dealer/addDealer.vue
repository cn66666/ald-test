<template>
  <div>
    <el-form :model="addForm" status-icon :rules="rules" ref="addForm" label-width="130px" class="demo-ruleForm" style="margin-top: 20px">
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
        <el-input v-model="addForm.saleMoney">
          <template slot="append">元</template></el-input>
      </el-form-item>
      <el-form-item label="经销商分类" prop="quotaType" style="width: 50%">
        <el-select v-model="addForm.quotaType" placeholder="请选择">
          <el-option label="新客户申请" value="新客户"></el-option>
          <el-option label="老客户录入" value="老客户"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button v-if="addForm.quotaType === '新客户'" type="primary" size="mini" :disabled="addBtn" @click="addDealer('暂存')">暂存</el-button>

        <push-function-btn v-if="addForm.quotaType === '新客户'" btn-name="新客户提交申请" btn-type="function" size="mini"
                           check-btn="addNewDealer" check-role="applyList" :check-function='addDealer'
                           params-key='type' params-value='新客户'></push-function-btn>

        <push-function-btn v-if="addForm.quotaType === '老客户'" btn-name="老客户提交申请" btn-type="function" size="mini"
                           check-btn="addOldDealer" check-role="applyList" :check-function='addDealer'
                           params-key='type' params-value='老客户'></push-function-btn>

      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import PushFunctionBtn from "../../components/pushFunctionBtn";
export default {
  name: "addDealer",
  components: {PushFunctionBtn},
  data() {
    var validatePass = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请填写销售金额'));
      } else {
        if (value !== '') {
          try {
            var res = parseFloat(value)
            if (isNaN(res)){
              callback(new Error('请填写正确的销售金额'));
            }
            if (value !== res.toString()){
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
      dealerId: null,
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
    var that = this;
    that.dealerId = that.$route.query.dealerId;
    if (that.dealerId){
      // 查询经销商信息进行修改
      that.axios.post('/ald/dealer/dealer_apply_info', {'dealerId': that.dealerId}).then(res=>{
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
    addDealer: function (type){
      var that = this;
      that.addBtn = true;
      that.axios.post('/ald/dealer/add_dealer', {'addForm': that.addForm, 'type': type, 'change': that.change}).then(res=>{
        that.addBtn = false;
        if (res.data.code === 'ok'){
          if (that.addForm.quotaType === '老客户'){
            that.$router.push('/admin/dealer/scoreList')
          }else {
            that.$router.push('/admin/dealer/applyList')
          }
        } else {
          that.addBtn = false;
          this.$message({
            message: res.data.msg + ':' + res.data.data,
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
.el-table >>> tbody tr:hover > td{
  background-color: rgba(255,255,255, 1)!important;
  color: #000;
}
</style>
