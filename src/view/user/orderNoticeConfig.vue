<template>
  <div>
    <el-page-header @back="goBack" content="跟单负责人配置详情" style="margin: 1%">
    </el-page-header>
    <div style="margin: 1% 3%; height: 100px; width: 90%">
      <h2>跟单负责人: {{userName}}</h2>
      <br>
      <div style="float:left;">
        <span style="line-height: 40px; margin: 0 80px 0 0">通知接受范围</span>
        <el-time-picker
          is-range
          v-model="configData.setTime"
          range-separator="至"
          start-placeholder="开始时间"
          end-placeholder="结束时间"
          placeholder="选择时间范围"
          format="HH:mm"
          value-format="HH:mm">
        </el-time-picker>
      </div>
      <div style="float:left; margin-left: 100px">
        <el-button style="width: 100px" type="primary" size="mini" @click="saveConfig()">保存</el-button>
      </div>
    </div>
    <div style="margin: 1% 3%;  width: 90%">
      <div style="min-height: 30px">
        <h4 style="float: left">通知配置</h4>
      </div>
      <el-table
        :data="noticeDec"
        border
        style="width: 100%; margin-top: 20px">
        <el-table-column
          prop="id"
          label="序号" width="50">
        </el-table-column>
        <el-table-column
          prop="title"
          label="通知内容" width="150">
        </el-table-column>
        <el-table-column
          prop="content"
          label="通知描述" width="400">
        </el-table-column>
        <el-table-column
          prop="type"
          label="通知方式" width="100">
        </el-table-column>
        <el-table-column
          prop=""
          label="操作">
          <template slot-scope="scope">
            <el-button v-if="checkOpenType('notice', scope.row.name) === true" style="width: 100px" type="primary" size="mini" @click="openConfig('notice', scope.row.name)">开启</el-button>
            <el-button v-else-if="checkOpenType('notice', scope.row.name) === false" style="width: 100px" type="primary" size="mini" @click="openConfig('notice', scope.row.name)">关闭</el-button>
            <el-button v-if="scope.row.config === true" style="width: 100px" type="primary" size="mini" @click="configChoose('notice', scope.row.name)">设置</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <el-dialog title="剩余额度消息设置" :visible.sync="quotaNoticeShow" style="width: 100%">
      <el-form>
        <el-form-item label="剩余额度小于该比例时进行提醒" >
          <el-input v-model="configData.notice.config.quotaRate" style="width: 20%" type="number" min="1" max="50">
            <template slot="append">%</template></el-input>
        </el-form-item>
        <el-form-item label="剩余额度小于该金额时进行提醒" >
          <el-input v-model="configData.notice.config.quotaMoney" style="width: 20%">
            <template slot="append">万元</template></el-input>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "noticeConfig",
  data() {
    return {
      userId: null,
      userType: '',
      userName: '',
      configData: {
        'setTime': '',
        'notice': {
          'open': {
            'intercept': true,
            'surplusQuota': true,
            'quotaChange': true,
            'specialQuotaChange': true,
            'remove': true,
          },
          'config':{
            'quotaRate': 50,
            'quotaMoney': 10
          }
        }
      },
      noticeDec: [
        {
          'id': 1,
          'name': 'intercept',
          'title': '拦截通知',
          'content': '客户被拦截时,进行通知',
          'type': '钉钉',
          'open': true,
          'config': false
        },
        {
          'id': 2,
          'name': 'surplusQuota',
          'title': '剩余额度通知',
          'content': '剩余额度在不足时,进行通知',
          'type': '钉钉',
          'open': true,
          'config': true
        },
        {
          'id': 3,
          'name': 'quotaChange',
          'title': '额度变更通知',
          'content': '额度变更时,进行通知',
          'type': '钉钉',
          'open': true,
          'config': false
        },
        {
          'id': 4,
          'name': 'specialQuotaChange',
          'title': '特批额度通知',
          'content': '特批额度生效时,进行通知',
          'type': '钉钉',
          'open': true,
          'config': false
        },
        {
          'id': 5,
          'name': 'remove',
          'title': '移除拦截通知',
          'content': '客户被移除拦截清单时,进行通知',
          'type': '钉钉',
          'open': true,
          'config': false
        },
      ],
      quotaNoticeShow: false,
    }
  },
  mounted() {
    var that = this;
    that.userId = this.$route.query.userId;
    that.getNoticeUserConfig()
  },
  methods: {
    goBack() {
      this.$router.go(-1)
    },
    getNoticeUserConfig: function () {
      var that = this;
      that.axios.post('/ald/notice/notice_user_config', {'userId': that.userId}).then(res=>{
        if (res.data.code==='ok'){
          that.userName = res.data.data.user_name;
          that.userType = res.data.data.user_type;
          that.configData = res.data.data.config;
        }
      }).catch(res=>{
      })
    },
    openConfig: function (type, name) {
      var that = this;
      if (that.configData[type]['open'][name] === true){
        that.configData[type]['open'][name] = false
      } else {
        that.configData[type]['open'][name] = true
      }
    },
    checkOpenType: function (type, name) {
      var that = this;
      if (that.configData[type]['open'][name] === true){
        return true
      } else {
        return false
      }
    },
    configChoose: function (type, name) {
      var that = this;
      if (type === 'notice'){
        if (name === 'surplusQuota'){
          that.quotaNoticeShow = true
        }
      }
    },
    saveConfig: function () {
      var that = this;
      that.axios.post('/ald/notice/save_user_config', {'userId': that.userId, 'config': that.configData}).then(res=>{
        if (res.data.code==='ok'){
          that.$router.go(-1)
        }
      }).catch(res=>{
      })
    }
  }
}
</script>

<style scoped>

</style>
