<template>
  <div>
    <el-row>
      <router-link to='/admin/user/addRole'>
        <el-button style="float:right;" type="primary" size="mini">添加新角色</el-button>
      </router-link>
    </el-row>
    <el-table
      :data="tableData"
      style="width: 100%">
      <el-table-column
        prop="id"
        label="No.">
      </el-table-column>
      <el-table-column
        prop="caption"
        label="角色名称">
      </el-table-column>
      <el-table-column
        label="操作">
        <template slot-scope="scope">
          <el-button size="mini" round @click="changeRole(scope.row.id)">修改权限</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>

</template>

<script>
export default {
  name: "roleList",
  data() {
    return {
      tableData: [],
      visible: false,
    }
  },
  mounted() {
    var that = this;
    that.$utils.getRoleList(that)
  },
  methods: {
    changeRole: function (roleId) {
      var that = this;
      that.$router.push('/admin/user/changeRole?roleId=' + roleId)
    }
  },
}
</script>

<style scoped>

</style>
