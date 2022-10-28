<template>
  <div>
    <el-page-header @back="goBack" content="补充客户信息" style="padding-left: 15px; padding-top: 15px">
    </el-page-header>
    <el-form :model="addForm" status-icon :rules="rules" ref="addForm" label-width="130px" class="demo-ruleForm" style="margin-top: 20px">
      <el-form-item label="客户编号" prop="companyCode" style="width: 50%">
        <el-input v-model="addForm.companyCode" :disabled="change"></el-input>
      </el-form-item>
      <el-form-item label="客户名称" prop="companyName" style="width: 50%">
        <el-input v-model="addForm.companyName" :disabled="change"></el-input>
      </el-form-item>
      <el-form-item label="销售代表" prop="salePerson" style="width: 50%">
        <el-input v-model="addForm.salePerson" :disabled="change"></el-input>
      </el-form-item>
      <el-form-item label="客户分类" prop="companyType" style="width: 50%">
        <el-select v-model="addForm.companyType" placeholder="请选择客户分类" style="float: left" :disabled="isExport" @change="chooseExportFunction()">
          <el-option label="内销客户" value="内销客户"></el-option>
          <el-option label="出口客户" value="出口客户"></el-option>
        </el-select>
        <div v-show="showExport" style="float: left; margin-left: 10px">
          <el-button type="text" @click="showZxbForm=true">填写中信保数据</el-button>
        </div>
      </el-form-item>
      <el-form-item label="合作起始时间" prop="coopDate" style="width: 50%">
        <el-date-picker type="date" placeholder="选择日期" value-format="yyyy-MM-dd"
                        v-model="addForm.coopDate"></el-date-picker>
      </el-form-item>
      <el-form-item label="计划销售金额" prop="saleMoney" style="width: 50%">
        <el-input v-model="addForm.saleMoney">
          <template slot="append">万元</template>
        </el-input>
      </el-form-item>
      <el-form-item label="额度分类" prop="quotaType" style="width: 50%">
        <el-select v-model="addForm.quotaType" placeholder="请选择额度分类" :disabled="chooseExport">
          <el-option label="合作不满一年客户" value="新客户"></el-option>
          <el-option label="合作满一年客户" value="老客户"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <noPermissionBtn  v-if="addForm.quotaType === '新客户' && addForm.companyType === '内销客户'" btn-name="暂存"
                          btn-type="function" size="mini" :check-function='addDealer'
                         params-key='type' params-value='暂存'></noPermissionBtn>

        <noPermissionBtn v-if="addForm.quotaType === '新客户'" btn-name="提交申请" btn-type="function" size="mini" :check-function='addDealer'
                           params-key='type' params-value='新客户'></noPermissionBtn>

        <noPermissionBtn v-if="addForm.quotaType === '老客户'" btn-name="提交申请" btn-type="function" size="mini" :check-function='addDealer'
                           params-key='type' params-value='老客户'></noPermissionBtn>

        <el-button v-if="addForm.quotaType === ''" type="primary" size="mini">提交申请</el-button>

      </el-form-item>
    </el-form>

    <el-dialog title="中信保数据补充" :visible.sync="showZxbForm">
      <el-form :model="addForm.exportInfo" :rules="rules" ref="addForm">
        <el-form-item label="批复金额" :label-width="formLabelWidth">
          <el-input v-model="addForm.exportInfo.exportQuota" :disabled="change" style="width: 250px">
          </el-input>
        </el-form-item>
        <el-form-item label="成立时长" :label-width="formLabelWidth">
          <el-input v-model="addForm.exportInfo.createYear" type="number" min="0" style="width: 250px">
            <template slot="append">年</template>
          </el-input>
        </el-form-item>
        <el-form-item label="国家/地区" :label-width="formLabelWidth">
          <el-select v-model="addForm.exportInfo.country" placeholder="请选择国家/地区" style="width: 250px">
            <el-option v-for="country in countryList" :label="country.country" :value="country.country_code" :key="country.country_code"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="支付方式" :label-width="formLabelWidth">
          <el-select v-model="addForm.exportInfo.payType" placeholder="请选择支付方式" style="width: 250px">
            <el-option v-for="pay in payList" :label="pay" :value="pay" :key="pay"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="信用期限" :label-width="formLabelWidth">
          <el-input v-model="addForm.exportInfo.creditDay" style="width: 250px"></el-input>
        </el-form-item>
        <el-form-item label="拒收风险赔付比例" :label-width="formLabelWidth">
          <el-input v-model="addForm.exportInfo.riskRate" style="width: 250px">
            <template slot="append">%</template>
          </el-input>
        </el-form-item>
        <el-form-item label="其他商业风险(包含政治风险)赔付比例" :label-width="formLabelWidth">
          <el-input v-model="addForm.exportInfo.otherRiskRate" style="width: 250px">
            <template slot="append">%</template>
          </el-input>
        </el-form-item>
        <el-form-item label="是否存在理赔记录" :label-width="formLabelWidth">
          <el-select v-model="addForm.exportInfo.payLog" placeholder="请选择是否存在理赔记录" style="width: 250px">
            <el-option label="是" value="是"></el-option>
            <el-option label="否" value="否"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item :label-width="formLabelWidth">
            <el-button @click="showZxbForm=false" type="primary" size="mini">提交申请</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import noPermissionBtn from "../../components/noPermissionBtn";
import {Message} from "element-ui";
export default {
  name: "addDealer",
  components: {noPermissionBtn},
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
      showZxbForm: false,
      formLabelWidth: '300px',
      countryList: [],
      payList: ['LC', 'DP', 'DA', 'OA'],
      isExport: false,
      showExport: false,
      chooseExport: false,
      addForm: {
        dealerId: '',
        companyCode: '',
        companyName: '',
        companyType: '',
        coopDate: null,
        salePerson: '',
        saleMoney: '',
        quotaType: '',
        exportInfo: {
          createYear: 0,
          country: '',
          payType: '',
          creditDay: 0,
          riskRate: 0,
          otherRiskRate: 0,
          payLog: '',
          exportQuota: 0,
        }
      },
      change: false,
      rules: {
        companyType: [
          { required: true, message: '请选择客户分类',},
        ],
        coopDate: [
          { required: true, message: '请填写合作起始时间',},
        ],
        saleMoney: [
          { required: true, validator: validatePass,},
        ],
        quotaType: [
          { required: true, message: '请选择额度分类',},
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
          that.addForm.dealerId = that.dealerId;
          that.addForm.companyCode = res.data.data.company_code;
          that.addForm.companyName = res.data.data.company_name;
          that.addForm.coopDate = res.data.data.coop_date;
          that.addForm.salePerson = res.data.data.sale_person;
          that.addForm.saleMoney = res.data.data.sale_money;
          that.addForm.companyType = res.data.data.company_type;
          that.addForm.quotaType = '新客户';
          if (res.data.data.export_info.country){
            that.isExport = true;
            that.showExport = true
            that.chooseExport = true
            that.addForm.quotaType = '老客户';
            that.addForm.companyType = '出口客户';
            that.addForm.exportInfo.country = res.data.data.export_info.country;
            that.addForm.exportInfo.payType = res.data.data.export_info.payType;
            that.addForm.exportInfo.creditDay = res.data.data.export_info.creditDay;
            that.addForm.exportInfo.riskRate = res.data.data.export_info.riskRate;
            that.addForm.exportInfo.otherRiskRate = res.data.data.export_info.otherRiskRate;
            that.addForm.exportInfo.exportQuota = res.data.data.export_info.exportQuota;
          }
          that.countryList = res.data.data.countryList
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
      if (that.addForm.companyType === ''){
        Message.warning("失败:请填写客户类型")
        that.addBtn = false;
        return
      }
      if (that.addForm.coopDate === ''){
        Message.warning("失败:请选择合作起始时间")
        that.addBtn = false;
        return
      }
      if (that.addForm.saleMoney === ''){
        Message.warning("失败:请填写销售金额")
        that.addBtn = false;
        return
      }

      that.axios.post('/ald/dealer/add_dealer', {'addForm': that.addForm, 'type': type, 'change': that.change}).then(res=>{
        if (res.data.code === 'ok'){
          if (that.addForm.companyType === '内销客户'){
            if (that.addForm.quotaType === '老客户'){
              that.$router.push('/admin/dealer/scoreList')
            }else {
              that.$router.push('/admin/dealer/applyList')
            }
          }else {
            that.$router.push('/admin/dealer/scoreList')
          }
        } else {
          Message.warning(res.data.msg + ':' + res.data.data)
          that.addBtn = false;
        }
      }).catch(res=>{
      })
    },
    goBack() {
      this.$router.go(-1)
    },
    chooseExportFunction: function () {
      var that = this;
      if(that.addForm.companyType === '内销客户'){
        that.showExport = false
        that.chooseExport = false
        that.addForm.quotaType = ''
      } else if (that.addForm.companyType === '出口客户'){
        that.showExport = true
        that.chooseExport = true
        that.addForm.quotaType = '老客户'
      }
    }
  }

}
</script>

<style scoped>
.el-table >>> tbody tr:hover > td{
  background-color: rgba(255,255,255, 1)!important;
  color: #000;
}
</style>
