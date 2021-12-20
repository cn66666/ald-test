<template>
  <div>
    <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="140px" class="demo-ruleForm">
      <el-form-item label="定时类型" prop="runType">
        <el-select v-model="ruleForm.runType" placeholder="请选择任务类型" @change="changeId()">
          <el-option label="date/一次性任务" value="date"></el-option>
          <el-option label="interval/间隔循环任务" value="interval"></el-option>
          <el-option label="cron/指定时间循环任务" value="cron"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="任务类型" prop="jobType">
        <el-select v-model="ruleForm.jobType" placeholder="请选择任务类型" @change="changeId()">
          <el-option label="年度评分计算" value="yearScore"></el-option>
          <el-option label="季度额度调整" value="quarterQuota"></el-option>
          <el-option label="月度诉讼查询" value="monthLaw"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="时间填写" prop="dateTime">
        <el-input v-model="ruleForm.dateTime" style="width: 50%"></el-input>
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
        <el-button type="primary" :disabled="addBtn" @click="submitForm('ruleForm')">立即创建</el-button>
        <el-button @click="resetForm('ruleForm')">重置</el-button>
      </el-form-item>
    </el-form>
  </div>


</template>
<script>
export default {
  data() {
    return {
      userPhone: localStorage.getItem('userPhone'),
      addBtn: false,
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
    submitForm(formName) {
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
            var id = this.ruleForm.id + '-' + this.ruleForm.id2
          }
          that.addBtn = true;
          that.axios.post('/ald/timer/add_job', {
            'oper': this.userPhone,
            'id': id,
            'name': this.ruleForm.name,
            'desc': this.ruleForm.desc,
            'jobType': this.ruleForm.jobType,
            'dateTime': this.ruleForm.dateTime,
            'runType': this.ruleForm.runType,
          }).then(res=>{
            if (res.data.code=='ok'){
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
            this.$message({
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
      that.ruleForm.id = that.ruleForm.runType + '-' + that.ruleForm.jobType
      if (that.ruleForm.runType === 'date'){
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
