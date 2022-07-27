<template>
  <div>
    <el-row class="filter_row">
      <div class="demo-input-suffix" style="float:left;margin: 2px;">
        <el-button type="primary" @click="uploadShow=true">上传中信保数据</el-button>
      </div>
    </el-row>
    <el-table
      class="info_table"
      :data="exportList"
      style="width: 98%; margin: 0 1%" :row-style="{height: '30px'}">
      <el-table-column
        prop="company_name"
        label="客户名称">
      </el-table-column>
      <el-table-column
        prop="country"
        label="国家/地区">
      </el-table-column>
      <el-table-column
        prop="pay_type"
        label="支付方式">
      </el-table-column>
      <el-table-column
        prop="credit_day"
        label="信用期限">
      </el-table-column>
      <el-table-column
        prop="quota_money"
        label="批复金额">
      </el-table-column>
      <el-table-column
        prop="quota_date"
        label="批复日期">
      </el-table-column>
      <el-table-column
        prop="risk_rate"
        label="风险比例">
      </el-table-column>
      <el-table-column
        prop="other_risk_rate"
        label="其他风险比例">
      </el-table-column>
      <el-table-column
        prop="apply_money"
        label="申请金额">
      </el-table-column>
      <el-table-column
        prop=""
        label="是否有效运出">
        <template slot-scope="scope">
          <span v-if="scope.row.is_egress === true">是</span>
          <span v-else>否</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="create_time"
        label="创建时间">
      </el-table-column>
      <el-table-column
        prop="update_time"
        label="更新时间">
      </el-table-column>
    </el-table>
    <div style="float: right;margin-top: 23px;margin-right: 79px;">
      <el-pagination @current-change="handleCurrentChange" :current-page.sync="localPage"
                     layout="prev, pager, next" :page-count="total">
      </el-pagination>
    </div>

    <el-dialog title="中信保数据上传" :visible.sync="uploadShow">
      <el-upload
        class="upload-demo"
        ref="upload"
        action="/ald/dealer/upload_export"
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
          <p class="remark">中信保导出数据上传,仅支持xls格式文件上传</p>
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
export default {
  name: "exportInfoList",
  data() {
    return {
      uploadShow: false,
      exportList: [],
      total: 1,
      localPage: 1,
      queryType: {},
      fileList: []
    }
  },
  mounted() {
    var that = this;
    that.getExportList()
  },
  methods: {
    handleCurrentChange(val) {
      var that = this;
      that.localPage = val;
      that.getExportList();
    },
    getExportList: function (){
      var that = this;
      that.axios.post('/ald/dealer/export_list', {'page': that.localPage}).then(res=>{
        if (res.data.code=='ok'){
          that.exportList = res.data.data.data_list;
          that.total = res.data.data.total
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
          message: "上传失败,请检查该客户状态或刷新页面",
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

</style>
