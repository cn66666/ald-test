<template>
  <div>
    <el-row class="btn_row">
      <el-button type="primary" style="float:right;" size="mini" @click="addPermissionShow=true">添加新权限</el-button>
    </el-row>
    <el-table
      class="info_table"
      :data="tableData"
      style="width: 100%">
      <el-table-column
        prop="module_caption"
        label="模块名称">
      </el-table-column>
      <el-table-column
        prop="module"
        label="模块">
      </el-table-column>
      <el-table-column
        prop="func_caption"
        label="功能名称">
      </el-table-column>
      <el-table-column
        prop="func"
        label="功能">
      </el-table-column>
      <el-table-column
        label="操作">
        <template slot-scope="scope">
          <el-popover
            placement="top"
            width="160">
            <p>是否将该权限注销？</p>
            <div style="text-align: right; margin: 0">
              <el-button size="mini" type="text" @click="visible = false">取消</el-button>
              <el-button type="primary" size="mini" @click="deletePermissionInfo(scope.row.module, scope.row.func)">确定</el-button>
            </div>
            <el-button slot="reference" size="mini">注销</el-button>
          </el-popover>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog title="添加权限" :visible.sync="addPermissionShow">
      <el-form :model="addPermissionInfo">
        <el-form-item label="模块名称" :label-width="formLabelWidth">
          <el-input v-model="addPermissionInfo.module_caption" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="模块" :label-width="formLabelWidth">
          <el-input v-model="addPermissionInfo.module" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="功能名称" :label-width="formLabelWidth">
          <el-input v-model="addPermissionInfo.func_caption" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="功能" :label-width="formLabelWidth">
          <el-input v-model="addPermissionInfo.func" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addPermissionShow = false">取 消</el-button>
        <el-button type="primary" @click="addPermission()">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>

export default {
  name: "permissionList",
  data() {
    return {
      tableData: [],
      addPermissionShow: false,
      visible: false,
      formLabelWidth: '120px',
      addPermissionInfo: {
        module_caption: '',
        func_caption: '',
        module: '',
        func: ''
      }
    }
  },
  mounted() {
    this.getPermissionList()
  },
  methods: {
    getPermissionList: function () {
      var that = this;
      that.tableData = []
      that.axios.post('/ald/user/get_permission_list', {}).then(res => {
        if (res.data.code == 'ok') {
          for (var per in res.data.data){
            var info = res.data.data[per]
            for (var i = 0; i < info['func'].length; i++) {
              that.tableData.push({'module': per, 'module_caption': info['caption'], 'func': info['func'][i]['func'],
              'func_caption': info['func'][i]['caption']})
            }
          }
        }
      }).catch(res => {
      })
    },
    addPermission: function (){
      var that = this;
      if (that.addPermissionInfo.module_caption !== '' && that.addPermissionInfo.module !== ''
      && that.addPermissionInfo.func_caption !== '' && that.addPermissionInfo.func !== ''){
        that.axios.post('/ald/user/add_permission', {'info': that.addPermissionInfo}).then(res => {
          if (res.data.code == 'ok') {
            that.addPermissionShow = false
            that.getPermissionList()
          } else {
            that.$message({
              message: res.data.msg,
              type: 'warning'
            });
          }
        }).catch(res => {
        })
      }
    },
    deletePermissionInfo: function (module, func){
      var that = this;
      that.axios.post('/ald/user/delete_permission', {'module': module, 'func': func}).then(res => {
        if (res.data.code == 'ok') {
          that.getPermissionList()
        }
      }).catch(res => {
      })
    }
  }
}
</script>

<style scoped>

</style>
