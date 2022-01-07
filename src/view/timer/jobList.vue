<template>
  <div>
    <el-row class="btn_row">
      <router-link to='/admin/timer/addJob'>
        <el-button style="float:right;" type="primary" size="mini">添加新任务</el-button>
      </router-link>
    </el-row>
    <el-tabs v-model="activeName" @tab-click="handleClick"
             class="info_table"
             style="width: 98%; margin: 0 1%" :row-style="{height: '30px'}">
      <el-tab-pane label="进行中" name="Runing">
        <el-table
          :data="runingTableData"
          style="width: 100%">
          <el-table-column
            prop="id"
            label="No."
            width="50%"
          >
          </el-table-column>
          <el-table-column
            prop="job_name"
            label="任务名称"
            width="150%">
          </el-table-column>
          <el-table-column
            prop="job_id"
            label="任务id"
            width="150%">
          </el-table-column>
          <el-table-column
            prop="job_type"
            label="类型"
            width="130%">
            <template slot-scope="scope">
              <span v-if="scope.row.job_type === 'cron'">指定时间循环任务</span>
              <span v-else-if="scope.row.job_type === 'date'">一次性任务</span>
              <span v-else-if="scope.row.job_type === 'interval'">间隔循环任务</span>
              <span v-else>未知错误</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="state_code"
            label="状态"
            width="80%">
            <template slot-scope="scope">
              <el-tag v-if="scope.row.state_code === 'Runing'">运行中</el-tag>
              <el-tag type="warning" v-else-if="scope.row.state_code === 'Pause'">已暂停</el-tag>
              <el-tag type="info" v-else-if="scope.row.state_code === 'Delete'">已删除</el-tag>
              <el-tag type="success" v-else-if="scope.row.state_code === 'Done'">已完成</el-tag>
              <el-tag type="danger" v-else>未知错误</el-tag>
            </template>
          </el-table-column>
          <el-table-column
            prop="update_time"
            label="最近操作时间"
            width="150%">
          </el-table-column>
          <el-table-column
            prop="next_time"
            label="下次执行时间"
            width="150%">
          </el-table-column>
          <el-table-column
            label="操作"
            style="width: 30%">
            <template slot-scope="scope">
              <el-button size="mini" round v-if="scope.row.state_code === 'Runing'" @click="pauseJob(scope.row.job_id)">暂停</el-button>
              <el-button size="mini" round v-else-if="scope.row.state_code === 'Pause'" @click="runingJob(scope.row.job_id)">运行</el-button>
              <el-button size="mini" round v-if="scope.row.state_code === 'Pause'" @click="changeJob(scope.row.job_id)">修改</el-button>
              <el-button size="mini" round v-if="scope.row.state_code !== 'Delete' && scope.row.state_code !== 'Done'" @click="deleteJob(scope.row.job_id)">删除</el-button>
              <el-button size="mini" round @click="checkJobLog(scope.row.job_id)">查看日志</el-button>
            </template>
          </el-table-column>
        </el-table>
        <div class="block" style="margin-top: 23px;margin-right: 79px;">
          <el-pagination
            @current-change="handleCurrentChange" :current-page.sync="runingLocalPage"
            layout="prev, pager, next"
            :page-count="runingTotal">
          </el-pagination>
        </div>
      </el-tab-pane>
      <el-tab-pane label="已完成" name="Done">
        <el-table
          :data="doneTableData"
          style="width: 100%">
          <el-table-column
            prop="id"
            label="No."
            width="50%"
          >
          </el-table-column>
          <el-table-column
            prop="job_name"
            label="任务名称"
            width="150%">
          </el-table-column>
          <el-table-column
            prop="job_id"
            label="任务id"
            width="150%">
          </el-table-column>
          <el-table-column
            prop="job_type"
            label="类型"
            width="130%">
            <template slot-scope="scope">
              <span v-if="scope.row.job_type === 'cron'">指定时间循环任务</span>
              <span v-else-if="scope.row.job_type === 'date'">一次性任务</span>
              <span v-else-if="scope.row.job_type === 'interval'">间隔循环任务</span>
              <span v-else>未知错误</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="state_code"
            label="状态"
            width="80%">
            <template slot-scope="scope">
              <el-tag v-if="scope.row.state_code === 'Runing'">运行中</el-tag>
              <el-tag type="warning" v-else-if="scope.row.state_code === 'Pause'">已暂停</el-tag>
              <el-tag type="info" v-else-if="scope.row.state_code === 'Delete'">已删除</el-tag>
              <el-tag type="success" v-else-if="scope.row.state_code === 'Done'">已完成</el-tag>
              <el-tag type="danger" v-else>未知错误</el-tag>
            </template>
          </el-table-column>
          <el-table-column
            prop="update_time"
            label="最近操作时间"
            width="150%">
          </el-table-column>
          <el-table-column
            prop="next_time"
            label="下次执行时间"
            width="150%">
          </el-table-column>
          <el-table-column
            label="操作"
            style="width: 30%">
            <template slot-scope="scope">
              <el-button size="mini" round v-if="scope.row.state_code === 'Runing'" @click="pauseJob(scope.row.job_id)">暂停</el-button>
              <el-button size="mini" round v-else-if="scope.row.state_code === 'Pause'" @click="runingJob(scope.row.job_id)">运行</el-button>
              <el-button size="mini" round v-if="scope.row.state_code !== 'Delete' && scope.row.state_code !== 'Done'" @click="deleteJob(scope.row.job_id)">删除</el-button>
              <el-button size="mini" round @click="checkJobLog(scope.row.job_id)">查看日志</el-button>
            </template>
          </el-table-column>
        </el-table>
        <div class="block" style="margin-top: 23px;margin-right: 79px;">
          <el-pagination
            @current-change="handleCurrentChange" :current-page.sync="doneLocalPage"
            layout="prev, pager, next"
            :page-count="doneTotal">
          </el-pagination>
        </div>
      </el-tab-pane>
      <el-tab-pane label="已删除" name="Delete">
        <el-table
          :data="deleteTableData"
          style="width: 100%">
          <el-table-column
            prop="id"
            label="No."
            width="50%"
          >
          </el-table-column>
          <el-table-column
            prop="job_name"
            label="任务名称"
            width="150%">
          </el-table-column>
          <el-table-column
            prop="job_id"
            label="任务id"
            width="150%">
          </el-table-column>
          <el-table-column
            prop="job_type"
            label="类型"
            width="130%">
            <template slot-scope="scope">
              <span v-if="scope.row.job_type === 'cron'">指定时间循环任务</span>
              <span v-else-if="scope.row.job_type === 'date'">一次性任务</span>
              <span v-else-if="scope.row.job_type === 'interval'">间隔循环任务</span>
              <span v-else>未知错误</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="state_code"
            label="状态"
            width="80%">
            <template slot-scope="scope">
              <el-tag v-if="scope.row.state_code === 'Runing'">运行中</el-tag>
              <el-tag type="warning" v-else-if="scope.row.state_code === 'Pause'">已暂停</el-tag>
              <el-tag type="info" v-else-if="scope.row.state_code === 'Delete'">已删除</el-tag>
              <el-tag type="success" v-else-if="scope.row.state_code === 'Done'">已完成</el-tag>
              <el-tag type="danger" v-else>未知错误</el-tag>
            </template>
          </el-table-column>
          <el-table-column
            prop="update_time"
            label="最近操作时间"
            width="150%">
          </el-table-column>
          <el-table-column
            prop="next_time"
            label="下次执行时间"
            width="150%">
          </el-table-column>
          <el-table-column
            label="操作"
            style="width: 30%">
            <template slot-scope="scope">
              <el-button size="mini" round v-if="scope.row.state_code === 'Runing'" @click="pauseJob(scope.row.job_id)">暂停</el-button>
              <el-button size="mini" round v-else-if="scope.row.state_code === 'Pause'" @click="runingJob(scope.row.job_id)">运行</el-button>
              <el-button size="mini" round v-if="scope.row.state_code !== 'Delete' && scope.row.state_code !== 'Done'" @click="deleteJob(scope.row.job_id)">删除</el-button>
              <el-button size="mini" round @click="checkJobLog(scope.row.job_id)">查看日志</el-button>
            </template>
          </el-table-column>
        </el-table>
        <div class="block" style="margin-top: 23px;margin-right: 79px;">
          <el-pagination
            @current-change="handleCurrentChange" :current-page.sync="deleteLocalPage"
            layout="prev, pager, next"
            :page-count="deleteTotal">
          </el-pagination>
        </div>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
export default {
  name: "userList",
  data() {
    return {
      runingTableData: [],
      doneTableData: [],
      deleteTableData: [],
      activeName: 'Runing',
      runingLocalPage: 1,
      doneLocalPage: 1,
      deleteLocalPage: 1,
      runingTotal: 1,
      doneTotal: 1,
      deleteTotal: 1,
    }
  },
  mounted() {
    this.getJobList()
  },
  methods: {
    getJobList: function (){
      var that = this;
      if (that.activeName === 'Runing'){
        var page = that.runingLocalPage
      } else if (that.activeName === 'Done'){
        var page = that.doneLocalPage
      } else if (that.activeName === 'Delete'){
        var page = that.deleteLocalPage
      } else {
        return null
      }
      that.axios.post('/ald/timer/job_list', {'job_type': that.activeName,
        'page': page}).then(res=>{
        if (res.data.code=='ok'){
          if (that.activeName === 'Runing'){
            that.runingTableData = res.data.data.data_list;
            that.runingTotal = res.data.data.total
          } else if (that.activeName === 'Done'){
            that.doneTableData = res.data.data.data_list;
            that.doneTotal = res.data.data.total
          } else if (that.activeName === 'Delete'){
            that.deleteTableData = res.data.data.data_list;
            that.deleteTotal = res.data.data.total
          } else {
            return null
          }
        }
      }).catch(res=>{
      })
    },
    pauseJob: function (job_id){
      var that = this;
      that.axios.post('/ald/timer/pause_job', {'job_id': job_id}).then(res=>{
        if (res.data.code=='ok'){
          that.getJobList()
        } else {
          this.$message({
            message: '暂停失败,失败原因:' + res.data.msg,
            type: 'warning'
          });
        }
      }).catch(res=>{
      })
    },
    runingJob: function (job_id){
      var that = this;
      that.axios.post('/ald/timer/runing_job', {'job_id': job_id}).then(res=>{
        if (res.data.code=='ok'){
          that.getJobList()
        } else {
          this.$message({
            message: '暂停失败,失败原因:' + res.data.msg,
            type: 'warning'
          });
        }
      }).catch(res=>{
      })
    },
    deleteJob: function (job_id){
      var that = this;
      that.axios.post('/ald/timer/delete_job', {'job_id': job_id}).then(res=>{
        if (res.data.code=='ok'){
          that.getJobList()
        } else {
          this.$message({
            message: '暂停失败,失败原因:' + res.data.msg,
            type: 'warning'
          });
        }
      }).catch(res=>{
      })
    },
    checkJobLog: function (job_id){
      var that = this;
      that.$router.push('/admin/timer/jobLogList?jobId=' + job_id)
    },
    handleClick(tab, event) {
      this.getJobList()
    },
    handleCurrentChange(val) {
      var that = this;
      if (that.activeName === 'Runing'){
        this.runingLocalPage = val;
      } else if (that.activeName === 'Done'){
        this.doneLocalPage = val;
      } else if (that.activeName === 'Delete'){
        this.deleteLocalPage = val;
      } else {
        return null
      }
      that.getJobList();
    },
  }
}
</script>

<style scoped>

</style>
