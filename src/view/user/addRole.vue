<template>
  <div>
    <el-form :model="addForm" status-icon :rules="rules" ref="addForm" label-width="100px" class="demo-ruleForm" style="margin-top: 20px">
      <el-form-item label="角色名称" prop="roleName">
        <el-input v-model.number="addForm.roleName"></el-input>
      </el-form-item>
      <el-form-item label="添加权限" prop="roleList">
        <el-select v-model="addInfo.module" placeholder="请选择" @change="changeFunc()">
          <el-option
            v-for="item in perList"
            :key="item"
            :label="item"
            :value="item">
          </el-option>
        </el-select>
        <el-select v-model="addInfo.func" placeholder="请选择">
          <el-option
            v-for="item in funcList"
            :key="item"
            :label="item"
            :value="item">
          </el-option>
        </el-select>
        <el-button type="primary" @click="addPermission()">添加</el-button>
        <el-table class="el-table"
                  :data="addForm.permissions"
                  :span-method="objectSpanMethod"
                  border
                  style="width: 100%; margin-top: 20px">
          <el-table-column
            prop="module"
            label="模块">
          </el-table-column>
          <el-table-column
            prop="func"
            label="功能">
          </el-table-column>
          <el-table-column
            prop=""
            label="操作">
            <template slot-scope="scope">
              <el-button type="primary" size="mini" round @click="removePermission(scope.row.module, scope.row.func)">移除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-form-item>
      <el-form-item label="添加按钮" prop="btnList">
        <el-select v-model="addInfo.btn_permission" placeholder="请选择" @change="changeBtnPermission()">
          <el-option
            v-for="item in allBtnPermission"
            :key="item"
            :label="item"
            :value="item">
          </el-option>
        </el-select>
        <el-select v-model="addInfo.btn" placeholder="请选择">
          <el-option
            v-for="item in allBtnCaption"
            :key="item"
            :label="item"
            :value="item">
          </el-option>
        </el-select>
        <el-button type="primary" @click="addBtn()">添加</el-button>
        <el-table class="el-table"
                  :data="addForm.btns"
                  :span-method="objectSpanMethod"
                  border
                  style="width: 100%; margin-top: 20px">
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
              <el-button type="primary" size="mini" round @click="removeBtn(scope.row.permission, scope.row.caption)">移除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" :disabled="addInfoBtn" @click="submitForm('addForm')">提交</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  name: "addRole",
  data() {
    return {
      tableData: [],
      visible: false,
      addInfoBtn: false,
      addForm: {
        roleName: '',
        permissions: [],
        btns:[]
      },
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
      rules: {
        roleName: [
          { required: true, message: '请填写角色名称',},
        ],
      }
    };
  },
  mounted() {
    this.getPermissionList()
    this.getBtnList()
  },
  methods: {
    getPermissionList: function () {
      var that = this;
      that.axios.post('/ald/user/get_permission_list', {}).then(res => {
        if (res.data.code == 'ok') {
          that.allPerInfo = res.data.data
          for (var per in res.data.data){
            that.perList.push(res.data.data[per]['caption'])
          }
        }
      }).catch(res => {
      })
    },
    changeFunc: function (){
      var that = this;
      that.funcList = []
      that.addInfo.func = ''
      for (var per in that.allPerInfo){
        if (that.addInfo.module === that.allPerInfo[per]['caption']){
          for (var i = 0; i < that.allPerInfo[per]['func'].length; i++) {
            that.funcList.push(that.allPerInfo[per]['func'][i]['caption'])
          }
        }
      }
    },
    addPermission: function (){
      var that = this;
      if (that.addInfo.module !== '' && that.addInfo.func !== '') {
        that.addForm.permissions.push({
          'module': that.addInfo.module,
          'func': that.addInfo.func,
        })
        for (var per in that.allPerInfo){
          if (that.allPerInfo[per]['caption'] === that.addInfo.module){
            for (var l = 0; l < that.allPerInfo[per]['func'].length; l++) {
              if (that.allPerInfo[per]['func'][l]['caption'] === that.addInfo.func){
                that.allPerInfo[per]['func'].splice(l, 1)
                for (var i = 0; i < that.funcList.length; i++) {
                  if (that.funcList[i] === that.addInfo.func){
                    that.funcList.splice(i, 1)
                    that.addInfo.func = ''
                    break
                  }
                }
              }
            }
          }
        }
      }
    },
    removePermission: function (module, func){
      var that = this;
      for (var l = 0; l < that.addForm.permissions.length; l++) {
        if (that.addForm.permissions[l]['module'] === module && that.addForm.permissions[l]['func'] === func){
          that.addForm.permissions.splice(l, 1)
        }
      }
      for (var per in that.allPerInfo){
        if (that.allPerInfo[per]['caption'] === module){
          that.allPerInfo[per]['func'].push({'caption': func})
          if (that.addInfo.module === module){
            that.funcList.push(func)
          }
          break
        }
      }
    },
    objectSpanMethod({ row, column, rowIndex, columnIndex }) {
      // if (columnIndex === 0) {
      //   if (row.row !== '') {
      //     return {
      //       rowspan: row.row,
      //       colspan: 1
      //     };
      //   } else {
      //     return {
      //       rowspan: 0,
      //       colspan: 0
      //     };
      //   }
      // }
    },
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          var that = this;
          that.addInfoBtn = true;
          that.axios.post('/ald/user/add_role', {'addForm': this.addForm}).then(res=>{
            that.addInfoBtn = false;
            if (res.data.code=='ok'){
              that.$router.push('/admin/user/roleList')
            } else {
              this.$message({
                message: res.data.msg,
                type: 'warning'
              });
            }
          }).catch(res=>{
          })
        } else {
          return false;
        }
      });
    },
    getBtnList: function () {
      var that = this;
      that.allBtnInfo = {}
      that.allBtnPermission = []
      that.allBtnCaption = []
      that.axios.post('/ald/user/get_btn_list', {}).then(res => {
        if (res.data.code == 'ok') {
          that.allBtnInfo = res.data.data
          for (var btn in res.data.data){
            that.allBtnPermission.push(res.data.data[btn]['permission'])
          }
        }
      }).catch(res => {
      })
    },
    changeBtnPermission: function (){
      var that = this;
      that.allBtnCaption = []
      for (var btn in that.allBtnInfo) {
        if (that.allBtnInfo[btn]['permission'] === that.addInfo.btn_permission){
          var btns = that.allBtnInfo[btn]['btns']
          for (var l = 0; l < btns.length; l++) {
            that.allBtnCaption.push(btns[l]['caption'])
          }
          break
        }
      }
    },
    addBtn: function (){
      var that = this;
      if (that.addInfo.btn !== '') {
        that.addForm.btns.push({
          'caption': that.addInfo.btn,
          'permission': that.addInfo.btn_permission
        })
        for (var btn in that.allBtnInfo) {
          if (that.allBtnInfo[btn]['permission'] === that.addInfo.btn_permission){
            var btns = that.allBtnInfo[btn]['btns']
            for (var l = 0; l < btns.length; l++) {
              if (btns[l]['caption'] ===  that.addInfo.btn){
                that.allBtnInfo[btn]['btns'].splice(l, 1)
                that.changeBtnPermission()
              }
            }
            that.addInfo.btn = ''
            break
          }
        }
      }
    },
    removeBtn: function (permission, caption){
      var that = this;
      for (var l = 0; l < that.addForm.btns.length; l++) {
        if (that.addForm.btns[l]['permission'] === permission && that.addForm.btns[l]['caption'] === caption){
          that.addForm.btns.splice(l, 1)
        }
      }
      for (var btn in that.allBtnInfo){
        if (that.allBtnInfo[btn]['permission'] === permission){
          that.allBtnInfo[btn]['btns'].push({'caption': caption})
          that.changeBtnPermission()
          break
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
