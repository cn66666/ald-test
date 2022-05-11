<template>
  <div>
    <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="140px" class="demo-ruleForm"  style="margin-top: 20px">
      <el-form-item label="定时类型" prop="runType">
        <el-select v-model="ruleForm.runType" placeholder="请选择任务类型" @change="changeId()">
          <el-option label="date/一次性任务" value="date"></el-option>
          <el-option label="interval/间隔循环任务" value="interval"></el-option>
          <el-option label="cron/指定时间循环任务" value="cron"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="任务类型" prop="jobType">
        <el-select v-model="ruleForm.jobType" placeholder="请选择任务类型" @change="changeId()">
          <el-option label="客户查询" value="dealerQuery"></el-option>
          <el-option label="司法诉讼拦截" value="lawQuery"></el-option>
          <el-option label="开票查询" value="invoiceQuery"></el-option>
          <el-option label="开票额度校验" value="invoiceQuotaChange"></el-option>
          <el-option label="订单查询" value="orderQuery"></el-option>
          <el-option label="订单维护" value="orderMaintain"></el-option>
          <el-option label="逾期拦截" value="overdueQuery"></el-option>
          <el-option label="滞纳金计算" value="overdueCount"></el-option>
          <el-option label="季度额度申请" value="quaterApply"></el-option>
          <el-option label="季度额度确认" value="quaterTakeEffect"></el-option>
          <el-option label="特批额度取消" value="quotaSpecial"></el-option>
          <el-option label="年度评分卡申请" value="scoreApply"></el-option>
          <el-option label="年度评分卡额度确认" value="scoreTakeEffect"></el-option>
          <el-option label="新客户申请评分卡" value="newDealerUpdate"></el-option>
          <el-option label="新客户评分卡生效" value="newDealerTakeEffect"></el-option>
          <el-option label="角色已使用权限次数清空" value="rolePermissionNum"></el-option>
<!--          <el-option label="历史订单及额度统计" value="oldOrderSupply"></el-option>-->
          <el-option label="每月开票历史查询" value="invoiceMonthQuery"></el-option>
          <el-option label="历史开票数据补录" value="invoiceQueryErpId"></el-option>
          <el-option label="客户评分卡重置" value="dealerScoreChange"></el-option>
          <el-option label="检测数据" value="checkInvoiceData"></el-option>
          <el-option label="变更数据" value="checkInvoiceQuota"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="时间填写" prop="dateTime">
        <el-date-picker v-if="timeChoose === true"
          v-model="ruleForm.dateTime"
          type="datetime"
          placeholder="选择日期时间" value-format="yyyy-MM-dd HH:mm:ss">
        </el-date-picker>
        <el-input v-else v-model="ruleForm.dateTime" style="width: 50%"></el-input>
        <el-popover
          placement="top-start"
          title="选择提示"
          width="200"
          trigger="hover"
          :content="infoContent">
          <el-button slot="reference" icon="el-icon-warning" circle></el-button>
        </el-popover>
      </el-form-item>
      <el-form-item label="任务id" prop="id">
        <el-input v-model="ruleForm.id" style="width: 30%" :disabled="true"></el-input>
        <span>-</span>
        <el-input v-model="ruleForm.id2" style="width: 30%"></el-input>
      </el-form-item>
      <el-form-item label="任务名称" prop="name">
        <el-input v-model="ruleForm.name"></el-input>
      </el-form-item>
      <el-form-item label="任务描述" prop="desc">
        <el-input type="textarea" v-model="ruleForm.desc"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" :disabled="addBtn" @click="submitForm('ruleForm', '立即创建')">立即创建</el-button>
        <el-button @click="resetForm('ruleForm')">重置</el-button>
      </el-form-item>
    </el-form>
  </div>


</template>
<script>
export default {
  data() {
    return {
      addBtn: false,
      timeChoose: false,
      infoContent: '请选择定时任务类型',
      formLabelWidth: '120px',
      ruleForm: {
        jobType: '',
        dateTime: '',
        id: '',
        id2: '',
        name: '',
        desc: '',
        runType: ''
      },
      rules: {
        id: [
          {required: true,},
        ],
        name: [
          {required: true,},
        ],
        jobType: [
          {required: true,},
        ],
        runType: [
          {required: true,},
        ],
        dateTime: [
          {required: true,},
        ],
      }
    };
  },
  methods: {
    submitForm(formName, btnType) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          var that = this;
          if (that.ruleForm.id2 === ''){
            this.$message({
              message: '请填写任务id',
              type: 'warning'
            });
            return false
          } else{
            var id = that.ruleForm.id + '-' + that.ruleForm.id2
          }
          that.addBtn = true;
          that.axios.post('/ald/timer/add_job', {
            'btnType': btnType,
            'id': id,
            'name': that.ruleForm.name,
            'desc': that.ruleForm.desc,
            'jobType': that.ruleForm.jobType,
            'dateTime': that.ruleForm.dateTime,
            'runType': that.ruleForm.runType,
          }).then(res=>{
            if (res.data.code==='ok'){
              that.$router.push('/admin/timer/jobList')
            } else {
              that.addBtn = false;
              this.$message({
                message: res.data.msg,
                type: 'warning'
              });
            }
          }).catch(res=>{
            that.addBtn = false;
            that.$message({
              message: '添加失败:' + res.data.data,
              type: 'warning'
            });
          })
        } else {
          return false;
        }
      });
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
    changeId(){
      var that = this
      that.timeChoose = false
      that.ruleForm.id = that.ruleForm.runType + '-' + that.ruleForm.jobType
      if (that.ruleForm.runType === 'date'){
        that.timeChoose = true
        that.infoContent = '时间请写入 datetime 类型的字符串, 例如: 2020-01-01 11:11:11'
      } else if (that.ruleForm.runType === 'interval'){
        that.infoContent = '时间请写入 秒、分、时、日、周、 类型的字符串, 例如间隔10秒执行一次 10 0 0 0 0 \n'
      } else if (that.ruleForm.runType === 'cron'){
        that.infoContent = '时间请写入 秒、分、时、日、周内星期、月、年、 类型的字符串,' +
          ' 例如:每天的11点到15点的第10分钟到15分钟，这5分钟的每第20秒执行  20 10-15 11-15 * * * *  \n'
      }
    }
  }
}
</script>
