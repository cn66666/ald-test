<template>
  <div>
    <el-row class="btn_row">
      <el-button style="float:right;" type="primary" size="mini" @click="addBtnShow=true">添加新按钮</el-button>
    </el-row>
    <el-table
      class="el-table"
      :data="tableData"
      :span-method="objectSpanMethod"
      border
      style="width: 98%; margin: 0 1% 1% 1%" :row-style="{height: '30px'}">
      <el-table-column
        prop="permission"
        label="权限名称">
      </el-table-column>
      <el-table-column
        prop="caption"
        label="按钮简称">
      </el-table-column>
      <el-table-column
        prop="btn"
        label="按钮名称">
      </el-table-column>
      <el-table-column
        label="操作">
        <template slot-scope="scope">
          <el-popover
            placement="top"
            width="160">
            <p>是否将该按钮注销？</p>
            <div style="text-align: right; margin: 0">
              <el-button size="mini" type="text" @click="visible = false">取消</el-button>
              <el-button type="primary" size="mini" @click="deleteBtnInfo(scope.row.id)">确定</el-button>
            </div>
            <el-button slot="reference" size="mini">注销</el-button>
          </el-popover>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog title="添加按钮" :visible.sync="addBtnShow">
      <el-form :model="addBtnInfo">
        <el-form-item label="按钮英文名称" :label-width="formLabelWidth">
          <el-input v-model="addBtnInfo.btn" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="按钮中文简称" :label-width="formLabelWidth">
          <el-input v-model="addBtnInfo.caption" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="权限名称" :label-width="formLabelWidth">
          <el-select v-model="addBtnInfo.permission" placeholder="请选择">
            <el-option
              v-for="item in perList"
              :key="item['id']"
              :label="item['func_caption']"
              :value="item['id']">
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addBtnShow = false">取 消</el-button>
        <el-button type="primary" @click="addBtn()">确 定</el-button>
      </div>
    </el-dialog>
  </div>

</template>

<script>
export default {
  name: "btnList",
  data() {
    return {
      tableData: [],
      perList: [],
      visible: false,
      addBtnShow: false,
      formLabelWidth: '120px',
      addBtnInfo: {
        btn: '',
        caption: '',
        permission: ''
      }
    }
  },
  mounted() {
    var that = this;
    that.getBtnList()
    that.getPermissionList()
  },
  methods: {
    getBtnList: function () {
      var that = this;
      that.tableData = []
      that.axios.post('/ald/user/get_btn_list', {}).then(res => {
        if (res.data.code == 'ok') {
          that.tableData = res.data.data
        }
      }).catch(res => {
      })
    },

    getPermissionList: function () {
      var that = this;
      that.perList = []
      that.axios.post('/ald/user/get_permission_list', {}).then(res => {
        if (res.data.code == 'ok') {
          console.log(res.data.data)
          for (var per in res.data.data){
            console.log(per)
            that.perList.push({'id': res.data.data[per]['id'], 'func_caption': res.data.data[per]['func_caption']})
          }
          console.log(that.perList)
        }
      }).catch(res => {
      })
    },

    addBtn: function () {
      var that = this;
      that.perList = []
      that.axios.post('/ald/user/add_btn', {'addBtnInfo': that.addBtnInfo}).then(res => {
        if (res.data.code == 'ok') {
          that.addBtnShow = false
          that.getBtnList()
        } else {
          this.$message({
            message: res.data.msg,
            type: 'warning'
          });
        }
      }).catch(res => {
      })
    },

    deleteBtnInfo: function (btn_id){
      var that = this;
      that.axios.post('/ald/user/delete_btn', {'btn_id': btn_id}).then(res => {
        if (res.data.code == 'ok') {
          that.getBtnList()
        }
      }).catch(res => {
      })
    },

    objectSpanMethod({ row, column, rowIndex, columnIndex }) {
      if (columnIndex === 0) {
        if (row.row !== '') {
          return {
            rowspan: row.row,
            colspan: 1
          };
        } else {
          return {
            rowspan: 0,
            colspan: 0
          };
        }
      }
    },
  },
}
</script>

<style scoped>

.el-table >>> tbody tr:hover > td{
  background-color: rgba(255,255,255, 1)!important;
  color: #000;
}
</style>
