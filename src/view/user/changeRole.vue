<template>
  <div>
    <el-row class="btn_row">
      <el-button size="mini" @click="showAddPermission=true">添加权限</el-button>
    </el-row>
    <el-table class="el-table"
      :data="permissionTable"
      :span-method="objectSpanMethod"
      border
              style="width: 98%; margin: 0 1%" :row-style="{height: '30px'}">
      <el-table-column
        prop="module_caption"
        label="模块">
      </el-table-column>
      <el-table-column
        prop="func_caption"
        label="功能">
      </el-table-column>
      <el-table-column
        prop=""
        label="操作">
        <template slot-scope="scope">
          <el-popover
            placement="top"
            width="160">
            <p>是否将该权限注销？</p>
            <div style="text-align: right; margin: 0">
              <el-button size="mini" type="text" @click="visible = false">取消</el-button>
              <el-button type="primary" size="mini" @click="deleteRolePermission(scope.row.id)">确定</el-button>
            </div>
            <el-button slot="reference" size="mini">注销</el-button>
          </el-popover>
        </template>
      </el-table-column>
    </el-table>
    <br>
    <el-row class="btn_row">
      <el-button size="mini" @click="showAddBtn=true">添加按钮</el-button>
    </el-row>
    <el-table class="el-table"
              :data="btnTable"
              border
              style="width: 98%; margin: 0 1%" :row-style="{height: '30px'}">
      <el-table-column
        prop="permission"
        label="模块">
      </el-table-column>
      <el-table-column
        prop="caption"
        label="按钮">
      </el-table-column>
      <el-table-column
        prop=""
        label="操作">
        <template slot-scope="scope">
          <el-popover
            placement="top"
            width="160">
            <p>是否将该按钮注销？</p>
            <div style="text-align: right; margin: 0">
              <el-button size="mini" type="text" @click="visible = false">取消</el-button>
              <el-button type="primary" size="mini" @click="deleteRoleBtn(scope.row.id)">确定</el-button>
            </div>
            <el-button slot="reference" size="mini">注销</el-button>
          </el-popover>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog title="添加用户权限" :visible.sync="showAddPermission">
      <el-form :model="addInfo">
        <el-form-item label="模块" :label-width="formLabelWidth">
          <el-select v-model="addInfo.module" placeholder="请选择" @change="changeFunc()">
            <el-option
              v-for="item in perList"
              :key="item.module"
              :label="item.caption"
              :value="item.module">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="功能" :label-width="formLabelWidth">
          <el-select v-model="addInfo.func" placeholder="请选择">
            <el-option
              v-for="item in funcList"
              :key="item.func"
              :label="item.caption"
              :value="item.func">
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="showAddPermission = false">取 消</el-button>
        <el-button type="primary" @click="addPermission()">确 定</el-button>
      </div>
    </el-dialog>

    <el-dialog title="添加用户按钮" :visible.sync="showAddBtn">
      <el-form :model="addInfo">
        <el-form-item label="模块" :label-width="formLabelWidth">
          <el-select v-model="addInfo.btn_permission" placeholder="请选择" @change="changeBtnPermission()">
            <el-option
              v-for="item in allBtnPermission"
              :key="item"
              :label="item"
              :value="item">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="按钮" :label-width="formLabelWidth">
          <el-select v-model="addInfo.btn" placeholder="请选择">
            <el-option
              v-for="item in allBtnCaption"
              :key="item"
              :label="item"
              :value="item">
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="showAddBtn = false">取 消</el-button>
        <el-button type="primary" @click="addBtn()">确 定</el-button>
      </div>
    </el-dialog>
  </div>

</template>

<script>
export default {
  name: "changeRole",
  data() {
    return {
      visible: false,
      showAddPermission: false,
      showAddBtn: false,
      formLabelWidth: '120px',
      roleId: null,
      permissionTable: [],
      btnTable: [],
      addInfo: {
        module: '',
        func: '',
        btn_permission: '',
        btn: '',
      },
      allBtnInfo: [],
      allBtnPermission: [],
      allBtnCaption: [],
      allPerInfo: {},
      perList: [],
      funcList: [],
    }
  },
  created() {
    this.roleId = this.$route.query.roleId;
  },
  mounted() {
    this.getRolePermission()
  },
  methods: {
    getRolePermission: function () {
      var that = this;
      that.perList = []
      that.allBtnPermission = []
      that.axios.post('/ald/user/get_role_permission', {
        'roleId': this.roleId}).then(res => {
        if (res.data.code == 'ok') {
          that.permissionTable = res.data.data.table
          that.btnTable = res.data.data.btns
          that.allPerInfo = res.data.data.all_permission
          that.allBtnInfo = res.data.data.all_btn
          for (var per in res.data.data.all_permission){
            that.perList.push({'caption': res.data.data.all_permission[per]['caption'], 'module': per})
          }
          for (var btn in res.data.data.all_btn){
            var info = res.data.data.all_btn[btn]
            that.allBtnPermission.push(info['permission'])
          }
          that.addInfo.func = ''
          that.addInfo.btn = ''
        } else {
          this.$message({
            message: res.data.msg,
            type: 'warning'
          });
        }
      }).catch(res => {
      })
    },

    deleteRolePermission: function (permission_id) {
      var that = this;
      that.axios.post('/ald/user/delete_role_permission', {'permission_id': permission_id,
        'roleId': this.roleId}).then(res => {
        if (res.data.code == 'ok') {
          that.getRolePermission()
          that.visible = false
        } else {
          this.$message({
            message: res.data.msg,
            type: 'warning'
          });
        }
      }).catch(res => {
      })
    },

    changeFunc: function (){
      var that = this;
      that.funcList = []
      that.addInfo.func = ''
      for (var per in that.allPerInfo){
        var caption = that.allPerInfo[per]['caption']
        var funcs = that.allPerInfo[per]['func']
        if (that.addInfo.module === per){
          for (var i = 0; i < funcs.length; i++) {
            that.funcList.push({'caption': funcs[i]['caption'], 'func': funcs[i]['func']})
          }
        }
      }
    },

    addPermission: function (){
      var that = this;
      if (that.addInfo.module !== '' && that.addInfo.func !== '') {
        that.axios.post('/ald/user/add_role_permission', {'roleId': this.roleId,
          'info': that.addInfo
        }).then(res => {
          if (res.data.code == 'ok') {
            that.showAddPermission = false
            that.getRolePermission()
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

    changeBtnPermission: function (){
      var that = this;
      that.allBtnCaption = []
      that.addInfo.btn = ''
      for (var btn in that.allBtnInfo){
        var permission = that.allBtnInfo[btn]['permission']
        var btns = that.allBtnInfo[btn]['btns']
        if (permission === that.addInfo.btn_permission){
          for (var i = 0; i < that.allBtnInfo[btn]['btns'].length; i++) {
            that.allBtnCaption.push(btns[i]['caption'])
          }
        }
      }
    },

    addBtn: function (){
      var that = this;
      if (that.addInfo.btn_permission !== '' && that.addInfo.btn !== '') {
        that.axios.post('/ald/user/add_role_btn', {'roleId': this.roleId,
          'info': that.addInfo
        }).then(res => {
          if (res.data.code == 'ok') {
            that.showAddBtn = false
            that.getRolePermission()
          } else {
            this.$message({
              message: res.data.msg,
              type: 'warning'
            });
          }
        }).catch(res => {
        })
      }
    },

    deleteRoleBtn: function (roleBtnId) {
      var that = this;
      that.axios.post('/ald/user/delete_role_btn', {'roleBtnId': roleBtnId,
        'roleId': this.roleId}).then(res => {
        if (res.data.code == 'ok') {
          that.getRolePermission()
          that.visible = false
        } else {
          this.$message({
            message: res.data.msg,
            type: 'warning'
          });
        }
      }).catch(res => {
      })
    },
  }
}
</script>

<style scoped>
.el-table >>> tbody tr:hover > td{
  background-color: rgba(255,255,255, 1)!important;
  color: #000;
}
</style>
