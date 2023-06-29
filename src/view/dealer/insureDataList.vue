<template>
  <div>
    <el-row class="filter_row">
      <div class="demo-input-suffix" style="float:left; margin: 2px 3px 2px 3px; ">
        <el-input  style="width: 200px; float:left; height: 36px"
                   placeholder="ERP编号" v-model="queryType.erpCode">
        </el-input>
      </div>
      <div class="demo-input-suffix" style="float:left; margin: 2px 3px 2px 3px; ">
        <el-input  style="width: 200px; float:left; height: 36px"
                   placeholder="客户名称" v-model="queryType.insureName">
        </el-input>
      </div>
      <div class="demo-input-suffix" style="float:left;margin: 2px 3px 2px 3px; ">
        <el-select v-model="queryType.insureState" style="float:left;width: 200px;" placeholder="请选择保险类型">
          <el-option
            v-for="item in insureState"
            :key="item.query"
            :label="item.type"
            :value="item.query">
          </el-option>
        </el-select>
      </div>
      <div class="demo-input-suffix" style="float:left;margin: 2px;">
        <el-button style="float:left; width: 100px;" type="primary" @click="getInsureDataList()">查询</el-button>
        <el-button style="float:left; width: 100px;" type="primary" @click="reset()">重置</el-button>
        <el-button type="primary" @click="uploadShow=true">上传中信保/人保数据</el-button>
      </div>
    </el-row>
    <el-table
      class="info_table"
      :data="insureDataList"
      style="width: 98%; margin: 0 1%" :row-style="{height: '30px'}">
      <el-table-column
        prop="company_code"
        label="ERP编号" width="100%">
        <template slot-scope="scope">
          <span>{{scope.row.company_code}}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="company_name"
        label="客户名称" width="230%">
      </el-table-column>
      <el-table-column
        prop="insure_type"
        label="保险类型" width="100%">
        <template slot-scope="scope">
          <span v-if="scope.row.insure_type === true">人保</span>
          <span v-else>中信保</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="quota_money"
        label="批复金额" width="100%">
      </el-table-column>
      <el-table-column
        prop="quota_date"
        label="批复日期" width="120%">
      </el-table-column>
      <el-table-column
        prop="country"
        label="国家/地区" width="100%">
      </el-table-column>
      <el-table-column
        prop="pay_type"
        label="支付方式" width="100%">
      </el-table-column>
      <el-table-column
        prop="credit_day"
        label="信用期限" width="100%">
      </el-table-column>
      <el-table-column
        prop="risk_rate"
        label="拒收风险赔付比例" width="150%">
      </el-table-column>
      <el-table-column
        prop="other_risk_rate"
        label="其他商业风险(包含政治风险)赔付比例" width="150%">
      </el-table-column>
      <el-table-column
        prop="apply_money"
        label="申请金额" width="100%">
      </el-table-column>
      <el-table-column
        prop=""
        label="有效运出" width="100%">
        <template slot-scope="scope">
          <span v-if="scope.row.is_egress === true">是</span>
          <span v-else>否</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="create_time"
        label="创建时间" width="150%">
      </el-table-column>
      <el-table-column
        prop="update_time"
        label="更新时间" width="150%">
      </el-table-column>
      <el-table-column
        prop=""
        label="操作" width="150%" fixed="right">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" @click="showUpdate(scope.row.company_code, scope.row.id)">编辑erp编号</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div style="text-align: right;margin-top: 23px;margin-right: 79px;">
      <el-pagination @current-change="handleCurrentChange" :current-page.sync="localPage"
                     layout="prev, pager, next" :page-count="total">
      </el-pagination>
    </div>

    <el-dialog title="保险数据上传" :visible.sync="uploadShow">
      <el-upload
        class="upload-demo"
        ref="upload"
        action="/ald/dealer/upload_insure"
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
          <p class="remark">保险导出数据上传,仅支持xls格式文件上传</p>
        </div>
      </el-upload>
      <div style="height: 10px; margin-top: 5px">
        <el-button style="float: right" type="primary" size="small" @click="submitUpload">上传文件
          <i class="el-icon-upload el-icon--right"></i></el-button>
      </div>
    </el-dialog>

    <el-dialog title="修改ERP编号" :visible.sync="showUpdateCode" width="30%">
      <el-form>
        <el-form-item label="ERP编号" label-width="150px">
          <el-input v-model="updateForm.erpCode" style="width: 70%"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" size="mini" @click="showUpdateCode=false">关闭</el-button>
        <el-button type="primary" size="mini" @click="updateDealerErpCode()" :loading="loading">更新</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {Message} from "element-ui";
export default {
  name: "insureDataList",
  data() {
    return {
      loading: false,
      uploadShow: false,
      insureDataList: [],
      total: 1,
      localPage: 1,
      queryType: {},
      fileList: [],
      showUpdateCode: false,
      updateForm:{
        insureId: '',
        erpCode: '',
      },
      insureState: [
        {'type': '全部', 'query': '全部'},
        {'type': '人保', 'query': '人保'},
        {'type': '中信保', 'query': '中信保'},
      ],
    }
  },
  mounted() {
    var that = this;
    that.getInsureDataList()
  },
  methods: {
    handleCurrentChange(val) {
      var that = this;
      that.localPage = val;
      that.getInsureDataList();
    },
    getInsureDataList: function (){
      var that = this;
      that.axios.post('/ald/dealer/insure_data_list', {'page': that.localPage, 'queryType': that.queryType}).then(res=>{
        if (res.data.code==='ok'){
          that.insureDataList = res.data.data.data_list;
          that.total = res.data.data.total
        }
      }).catch(res=>{
      })
    },
    handleRemove(file, fileList) {
    },
    handlePreview(file) {
    },
    reset: function () {
      location.reload()
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
    showUpdate(company_code, insureId){
      var that = this;
      that.updateForm.insureId = insureId
      that.updateForm.erpCode = company_code
      that.showUpdateCode = true
    },
    updateDealerErpCode(){
      var that = this;
      that.loading = true
      that.axios.post('/ald/dealer/update_insure_info', {'update_form': that.updateForm}).then(res=>{
        if (res.data.code==='ok'){
          location.reload()
        } else {
          that.loading = false
          Message.warning(res.data.msg + ':' + res.data.data)
        }
      }).catch(res=>{
      })
    },
  }
}
</script>

<style scoped>

</style>
