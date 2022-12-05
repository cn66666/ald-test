<template>
  <div>
    <el-row class="filter_row">
      <div class="demo-input-suffix" style="float:left;margin: 2px 3px 2px 3px; ">
        <el-input  style="width: 200px; float:left;"
                   placeholder="客户名称" v-model="queryType.companyName">
        </el-input>
      </div>
      <div class="demo-input-suffix" style="float:left;margin: 2px 3px 2px 3px; ">
        <el-input  style="width: 200px; float:left;"
                   placeholder="负责人名称" v-model="queryType.userName">
        </el-input>
      </div>
      <div class="demo-input-suffix" style="float:left;margin: 2px;">
        <el-button style="float:left; width: 100px; height: 36px" type="primary" @click="getNoticeList()">查询</el-button>
        <el-button style="float:left; width: 100px; height: 36px" type="primary" @click="reset()">重置</el-button>
        <el-button style="float:left; width: 100px; height: 36px" type="primary" @click="showBatchUpdate=true">批量修改</el-button>
        <el-button style="float:left; width: 200px; height: 36px" type="primary" @click="uploadShow=true">初始化中信保数据</el-button>
      </div>
    </el-row>
    <el-table
      class="info_table"
      :data="tableData"
      style="width: 98%; margin: 0 1%" :row-style="{height: '30px'}">
      <el-table-column
        prop="company_name"
        label="客户名称" width="270%">
        <template slot-scope="scope">
          <el-tooltip effect="dark" :content="scope.row.company_name" placement="top">
            <router-link :to='"/admin/dealer/dealerInfo?dealerId=" + scope.row.id'>
              <el-button type="text">{{scope.row.company_name}}</el-button>
            </router-link>
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column
        prop="business_leader"
        label="业务负责人"
        width="200">
      </el-table-column>
      <el-table-column
        prop="order_leader"
        label="跟单负责人"
        width="200">
      </el-table-column>
      <el-table-column
        prop="finance_leader"
        label="财务负责人"
        width="200">
      </el-table-column>
      <el-table-column
        prop=""
        label="操作">
        <template slot-scope="scope">
          <el-button style="width: 100px" type="primary" size="mini" @click="pushDailyNoticeConfig(scope.row.id)">日报配置</el-button>
          <el-button style="width: 100px" type="primary" size="mini" @click="pushNoticeUserConfig(scope.row.id)">负责人配置</el-button>
          <el-button style="width: 100px" type="primary" size="mini" @click="pushNoticeLogList(scope.row.id)">日志</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div style="text-align: right;margin-top: 23px;margin-right: 79px;">
      <el-pagination @current-change="handleCurrentChange" :current-page.sync="localPage"
                     layout="prev, pager, next" :page-count="total">
      </el-pagination>
    </div>

    <el-dialog title="批量修改" :visible.sync="showBatchUpdate" width="30%">
      <el-form>
        <el-form-item label="原负责人联系方式" label-width="150px">
          <el-input v-model="changeForm.oldPhone"  style="width: 70%"></el-input>
        </el-form-item>
        <el-form-item label="新负责人名称" label-width="150px">
          <el-input v-model="changeForm.newName"  style="width: 70%"></el-input>
        </el-form-item>
        <el-form-item label="新联系方式" label-width="150px">
          <el-input v-model="changeForm.newPhone"  style="width: 70%"></el-input>
        </el-form-item>
        <el-form-item label="新负责人岗位" label-width="150px">
          <el-input v-model="changeForm.newRemark"  style="width: 70%"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" size="mini" @click="showBatchUpdate=false">关闭</el-button>
        <el-button type="primary" size="mini" @click="batchUpdate()">修改</el-button>
      </div>
    </el-dialog>
    <el-dialog title="初始化数据上传" :visible.sync="uploadShow">
      <el-upload
        class="upload-demo"
        ref="upload"
        action="/ald/notice/upload_notice_info"
        :data="{}"
        :multiple="false"
        :on-preview="handlePreview"
        :on-remove="handleRemove"
        :on-success="uploadDone"
        :file-list="fileList"
        :limit="1"
        :auto-upload="false">
        <el-button size="small" type="primary">选择文件<i class="el-icon-s-order el-icon--right"></i></el-button>
        <div slot="tip" class="el-upload__tip">
          <p class="remark">初始化消息通知数据上传,仅支持xls格式文件上传</p>
        </div>
      </el-upload>
      <div style="height: 10px; margin-top: 5px">
        <el-button style="float: right" type="primary" size="small" @click="submitUpload">上传文件
          <i class="el-icon-upload el-icon--right"></i></el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {Message} from "element-ui";

export default {
  name: "noticeList",
  data() {
    return {
      tableData: [],
      total: 0,
      localPage: 1,
      queryType: {'companyName': '', 'userName': ''},
      showBatchUpdate: false,
      uploadShow: false,
      fileList: [],
      changeForm: {
        'oldPhone':'',
        'newName': '',
        'newPhone': '',
        'newRemark': '',
      }
    }
  },
  mounted() {
    var that = this;
    that.getNoticeList()
  },
  methods: {
    reset: function () {
      location.reload()
    },
    handleCurrentChange(val) {
      var that = this;
      that.localPage = val;
      that.getNoticeList();
    },
    getNoticeList: function (){
      var that = this;
      that.axios.post('/ald/notice/notice_list', {'page': that.localPage, 'queryType': that.queryType}).then(res=>{
        if (res.data.code=='ok'){
          that.tableData = res.data.data.data_list;
          that.total = res.data.data.total
        }
      }).catch(res=>{
      })
    },
    pushDailyNoticeConfig: function (dealerId) {
      var that = this;
      that.$router.push('/admin/user/dailyNoticeConfig?dealerId=' + dealerId)
    },
    pushNoticeUserConfig: function (dealerId) {
      var that = this;
      that.$router.push('/admin/user/noticeUserConfig?dealerId=' + dealerId)
    },
    pushNoticeLogList: function (dealerId) {
      var that = this;
      that.$router.push('/admin/user/noticeLogList?dealerId=' + dealerId)
    },
    batchUpdate: function (){
      var that = this;
      if (that.changeForm.oldPhone === ''){
        Message.warning('失败: 原负责人联系方式不能为空')
        return
      }
      if (that.changeForm.newName !== '' || that.changeForm.newPhone !== '' || that.changeForm.newRemark !== '' ){
        if (that.changeForm.newName === '' || that.changeForm.newPhone === '' || that.changeForm.newRemark === ''){
          Message.warning('失败: 新负责人信息不能为空')
          return
        }
      }
      that.axios.post('/ald/notice/update_user', that.changeForm).then(res=>{
        if (res.data.code=='ok'){
          Message.success('修改成功')
          location.reload()
        }else {
          Message.warning('失败: ' + res.data.data)
        }
      }).catch(res=>{
      })
    },
    handleRemove(file, fileList) {
    },
    handlePreview(file) {
    },
    uploadDone(response, file, fileList){
      var that = this;
      if (response.code === 'ok'){
        location.reload()
      }else {
        that.$message({
          message: response.data,
          type: 'warning'
        });
      }
    },
    submitUpload() {
      var that = this;
      that.$refs.upload.submit();
    },
  }
}
</script>

<style scoped>

>>> .el-input__inner{
  height: 36px;
}
</style>
