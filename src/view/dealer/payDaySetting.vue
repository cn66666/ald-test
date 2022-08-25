<template>
  <div>
    <el-page-header @back="goBack" content="补充客户信息" style="margin: 1%">
    </el-page-header>
    <el-form :model="dealerInfo" status-icon :rules="rules" ref="addForm" label-width="130px" class="demo-ruleForm" style="margin-top: 20px">
      <el-form-item label="ERP账期" prop="companyCode" style="width: 50%">
        <el-input v-model="dealerInfo.erpDays" :disabled="change"></el-input>
      </el-form-item>
      <el-form-item label="ALD推荐账期" prop="companyName" style="width: 50%">
        <el-input v-model="dealerInfo.aldDays" :disabled="change"></el-input>
      </el-form-item>
      <el-form-item label="当前额度" prop="salePerson" style="width: 50%">
        <el-input v-model="dealerInfo.quota" :disabled="change"></el-input>
      </el-form-item>
      <el-form-item label="调整账期" prop="saleMoney" style="width: 50%">
        <el-input v-model="dealerInfo.changeDays">
          <template slot="append">天数</template>
        </el-input>
      </el-form-item>
      <el-form-item label="计算额度" prop="salePerson" style="width: 50%">
        <el-input v-model="dealerInfo.changeQuota" :disabled="change"></el-input>
      </el-form-item>
      <el-form-item label="额度日期" prop="salePerson" style="width: 50%">
        <el-input v-model="dealerInfo.quotaDays" :disabled="change"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" size="mini">试算额度</el-button>
        <el-button type="primary" size="mini" disabled>确定调整</el-button>
      </el-form-item>
    </el-form>
  </div>

</template>

<script>
export default {
  name: "PaydaySetting",
  data() {
    return {
      change: true,
      dealerInfo: {
      }
    };
  },
  methods: {

    goBack() {
      this.$router.go(-1)
    },
  }
}
</script>

<style scoped>

</style>
