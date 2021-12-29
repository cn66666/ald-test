<template>
  <div v-if="uploadPage">
    <el-row>
      <el-col :span="8"><div class="grid-content"></div></el-col>
      <el-col :span="8" style="margin-top: 10%">
        <p class="info">请上传客户:{{ name }}近半年的流水文件</p>
        <br>
        <br>
        <el-upload
          class="upload-demo"
          ref="upload"
          action="/ald/dealer/upload"
          :data="{'code': code}"
          :multiple="false"
          :on-preview="handlePreview"
          :on-remove="handleRemove"
          :on-success="uploadDone"
          :file-list="fileList"
          :limit="1"
          :auto-upload="false">
          <el-button size="small" type="primary">点击上传<i class="el-icon-s-order el-icon--right"></i></el-button>
          <div slot="tip" class="el-upload__tip">
            <p class="remark">银行流水上传步骤及注意事项:</p>
            <p class="remark">1. 仅支持xls xlsx csv 格式文件</p>
            <p class="remark">2. 将上述流水文件压缩为.zip后缀压缩包</p>
            <p class="remark">3. 银行流水中务必包含指定日期内的账单,否则可能会被系统拒绝</p>
            <p class="remark">4. 允许多家银行同时上传</p>
          </div>
        </el-upload>
      </el-col>
      <el-col :span="8"><div class="grid-content"></div></el-col>
    </el-row>
    <el-row>
      <el-col :span="8"><div class="grid-content"></div></el-col>
      <el-col :span="8">
        <p v-if="errorShow" style="color: red">{{errorInfo}}</p>
        <el-button type="primary" @click="submitUpload" :loading="uploading">上传数据<i class="el-icon-upload el-icon--right"></i></el-button>
      </el-col>
      <el-col :span="8"><div class="grid-content"></div></el-col>
    </el-row>
  </div>
  <div v-else-if="errorPage">
    <el-row>
      <el-col :span="8"><div class="grid-content"></div></el-col>
      <el-col :span="8"  style="margin-top: 10%">
        <span class="info" style="width: 100%">错误的客户文件上传页面,请确认网址是否正确</span>
      </el-col>
      <el-col :span="8"><div class="grid-content"></div></el-col>
    </el-row>
  </div>
  <div v-else-if="analysisPage">
    <el-row>
      <el-col :span="8"><div class="grid-content"></div></el-col>
      <el-col :span="8"  style="margin-top: 10%">
        <span class="info" style="width: 100%">客户文件上传完成,正在解析中...</span>
      </el-col>
      <el-col :span="8"><div class="grid-content"></div></el-col>
    </el-row>
  </div>
  <div v-else-if="okPage">
    <el-row>
      <el-col :span="8"><div class="grid-content"></div></el-col>
      <el-col :span="8"  style="margin-top: 10%">
        <span class="info" style="width: 100%">客户已经完成文件上传,请关闭该页面</span>
      </el-col>
      <el-col :span="8"><div class="grid-content"></div></el-col>
    </el-row>
  </div>
</template>

<script>
export default {
  name: "index",
  data() {
    return {
      uploadPage: false,
      errorPage: false,
      analysisPage: false,
      okPage: false,
      name: '',
      errorInfo: '',
      errorShow: '',
      fileList: [],
      code: '',
      uploading: false,
      error_info: ''
    }
  },
  mounted() {
    this.code = this.$route.query.code;
    if (this.code !== "null"){
      this.getCodeInfo()
    } else {
      this.errorPage = true
    }
  },
  methods: {
    submitUpload() {
      this.uploading = true
      this.$refs.upload.submit();
    },
    uploadDone(response, file, fileList){
      this.uploading = false
      if (response.code === 'ok'){
        location.reload()
      }else {
        this.$message({
          message: "上传失败,请检查该客户状态或刷新页面",
          type: 'warning'
        });
      }
    },
    handleRemove(file, fileList) {
    },
    handlePreview(file) {
    },
    getCodeInfo: function (){
      var that = this;
      that.axios.post('/ald/dealer/get_code', {'code': that.code,}).then(res=>{
        if (res.data.code=='ok'){
          var state_code = res.data.data.state_code
          if (state_code === 'need'){
            that.uploadPage = true
            that.errorPage = false
            that.analysisPage = false
            that.okPage = false
          } else if (state_code === 'analysis'){
            that.uploadPage = false
            that.errorPage = false
            that.analysisPage = true
            that.okPage = false
          } else if (state_code === 'error') {
            that.uploadPage = true
            that.errorPage = false
            that.analysisPage = false
            that.okPage = false
            that.errorInfo = '上传文件不符合要求,需要重新上传'
            that.errorShow = true
          } else if (state_code === 'ok') {
            that.uploadPage = false
            that.errorPage = false
            that.analysisPage = false
            that.okPage = true
          }
          that.name = res.data.data.name
        }else {
          that.errorPage = true
        }
      }).catch(res=>{
      })
    },
  }
}
</script>

<style>
.el-row {
  margin-bottom: 20px;
  &:last-child {
   margin-bottom: 0;
 }
}
.el-col {
  border-radius: 4px;
}
.grid-content {
  border-radius: 4px;
  min-height: 36px;
}
.row-bg {
  padding: 10px 0;
  background-color: #f9fafc;
}
.info {
  font-size: 20px;
  font-weight: bolder;
}
.remark {
  font-weight: bolder;
}
</style>
