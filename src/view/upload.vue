<template>
  <div>
    <el-row>
      <el-col :span="8"><div class="grid-content"></div></el-col>
      <el-col :span="8"  style="margin-top: 10%">
        <div class="grid-content">
          <span class="info">请上传{{uploadInfo.date}}的流水文件</span>
          <el-button type="primary">上传<i class="el-icon-upload el-icon--right"></i></el-button>
        </div>
      </el-col>
      <el-col :span="8"><div class="grid-content"></div></el-col>
    </el-row>
    <el-row>
      <el-col :span="8"><div class="grid-content"></div></el-col>
      <el-col :span="8">
        <div class="grid-content">
          <p class="remark">银行流水上传步骤及注意事项:</p>
          <p class="remark">1. 仅支持xls xlsx csv 格式文件</p>
          <p class="remark">2. 将上述流水文件压缩为.zip后缀压缩包</p>
          <p class="remark">3. 银行流水中务必包含指定日期内的账单,否则可能会被系统拒绝</p>
          <p class="remark">4. 允许多家银行同时上传</p>
        </div>
      </el-col>
      <el-col :span="8"><div class="grid-content"></div></el-col>
    </el-row>
    <el-row>
      <el-col :span="8"><div class="grid-content"></div></el-col>
      <el-col :span="8">
        <div class="grid-content">
          <el-button type="primary" style="margin-left: 30%">校验数据</el-button>
        </div>
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
      uploadInfo: {
        date: 'xx'
      }
    }
  },
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
