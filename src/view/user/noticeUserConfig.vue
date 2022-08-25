<template>
  <div>
    <el-page-header @back="goBack" content="客户通知配置" style="margin: 1%">
    </el-page-header>
    <el-row style="margin-left: 5%">
      <h3>{{ noticeInfo.company_name }}</h3>
    </el-row>
    <div style="margin: 1% 5%">
      <div style="min-height: 30px">
        <h4 style="float: left">配置业务负责人</h4>
        <el-button style="width: 100px; float: left; margin-left: 20px" type="primary" size="mini"
        @click="showAddForm('business')">添加负责人</el-button>
      </div>
      <el-table
        :data="noticeInfo.business_leader"
        border
        style="width: 100%; margin-top: 20px">
        <el-table-column
          prop="user_name"
          label="负责人名称" width="200">
        </el-table-column>
        <el-table-column
          prop="user_remark"
          label="负责人岗位" width="200">
        </el-table-column>
        <el-table-column
          prop="user_phone"
          label="联系方式">
        </el-table-column>
        <el-table-column
          prop=""
          label="操作">
          <template slot-scope="scope">
            <el-button style="width: 100px; float: left; margin-left: 20px" type="primary" size="mini"
                       @click="pushNoticeConfig(scope.row.id)">配置</el-button>
            <el-button style="width: 100px; float: left; margin-left: 20px" type="primary" size="mini"
                       @click="showChangeForm('business', scope.row)">修改</el-button>
            <el-button style="width: 100px; float: left; margin-left: 20px" type="primary" size="mini"
                       @click="deleteShowFunc('business', scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div style="margin: 1% 5%">
      <div style="min-height: 30px">
        <h4 style="float: left">配置跟单负责人</h4>
        <el-button style="width: 100px; float: left; margin-left: 20px" type="primary" size="mini"
                   @click="showAddForm('order')">添加负责人</el-button>
      </div>
      <el-table
        :data="noticeInfo.order_leader"
        border
        style="width: 100%; margin-top: 20px">
        <el-table-column
          prop="user_name"
          label="负责人名称" width="200">
        </el-table-column>
        <el-table-column
          prop="user_remark"
          label="负责人岗位" width="200">
        </el-table-column>
        <el-table-column
          prop="user_phone"
          label="联系方式">
        </el-table-column>
        <el-table-column
          prop=""
          label="操作">
          <template slot-scope="scope">
            <el-button style="width: 100px; float: left; margin-left: 20px" type="primary" size="mini"
                       @click="pushNoticeConfig(scope.row.id)">配置</el-button>
            <el-button style="width: 100px; float: left; margin-left: 20px" type="primary" size="mini"
                       @click="showChangeForm('order', scope.row)">修改</el-button>
            <el-button style="width: 100px; float: left; margin-left: 20px" type="primary" size="mini"
                       @click="deleteShowFunc('order', scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div style="margin: 1% 5%">
      <div style="min-height: 30px">
        <h4 style="float: left">配置财务负责人</h4>
        <el-button style="width: 100px; float: left; margin-left: 20px" type="primary" size="mini"
                   @click="showAddForm('finance')">添加负责人</el-button>
      </div>
      <el-table
        :data="noticeInfo.finance_leader"
        border
        style="width: 100%; margin-top: 20px">
        <el-table-column
          prop="user_name"
          label="负责人名称" width="200">
        </el-table-column>
        <el-table-column
          prop="user_remark"
          label="负责人岗位" width="200">
        </el-table-column>
        <el-table-column
          prop="user_phone"
          label="联系方式">
        </el-table-column>
        <el-table-column
          prop=""
          label="操作">
          <template slot-scope="scope">
            <el-button style="width: 100px; float: left; margin-left: 20px" type="primary" size="mini"
                       @click="pushNoticeConfig(scope.row.id)">配置</el-button>
            <el-button style="width: 100px; float: left; margin-left: 20px" type="primary" size="mini"
                       @click="showChangeForm('finance', scope.row)">修改</el-button>
            <el-button style="width: 100px; float: left; margin-left: 20px" type="primary" size="mini"
                       @click="deleteShowFunc('finance', scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <el-dialog :title="addTitle" :visible.sync="showAdd" style="width: 100%">
      <el-form>
        <el-form-item label="负责人名称" label-width="100px">
          <el-input v-model="addForm.userName" style="width: 80%"></el-input>
        </el-form-item>
        <el-form-item label="联系方式" label-width="100px">
          <el-input v-model="addForm.userPhone" style="width: 80%"></el-input>
        </el-form-item>
        <el-form-item label="钉钉信息" label-width="100px">
          <el-input v-model="addForm.userdd" style="width: 80%"></el-input>
        </el-form-item>
        <el-form-item label="负责人岗位" label-width="100px">
          <el-input v-model="addForm.userRemark" style="width: 80%"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer" style="margin-left: 20px; height: 50px">
        <el-button style="float: left" type="primary" @click="addDealerNoticeUser()">添加负责人</el-button>
      </div>
    </el-dialog>

    <el-dialog :title="changeTitle" :visible.sync="showChange" style="width: 100%">
      <el-form>
        <el-form-item label="负责人名称" label-width="100px">
          <el-input v-model="changeForm.userName" style="width: 80%"></el-input>
        </el-form-item>
        <el-form-item label="联系方式" label-width="100px">
          <el-input v-model="changeForm.userPhone" style="width: 80%"></el-input>
        </el-form-item>
        <el-form-item label="钉钉信息" label-width="100px">
          <el-input v-model="changeForm.userdd" style="width: 80%"></el-input>
        </el-form-item>
        <el-form-item label="负责人岗位" label-width="100px">
          <el-input v-model="changeForm.userRemark" style="width: 80%"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer" style="margin-left: 20px; height: 50px">
        <el-button style="float: left" type="primary" @click="changeDealerNoticeUser()">修改负责人</el-button>
      </div>
    </el-dialog>

    <el-dialog title="删除负责人" :visible.sync="deleteShow" style="width: 100%">
      <h4 style="margin-left: 20px;">{{deleteTitle}}</h4>
      <div slot="footer" class="dialog-footer" style="margin-left: 20px; height: 20px">
        <el-button style="float: left" type="primary" size="mini" @click="deleteDealerNoticeUser()">确认删除</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "noticeUserConfig",
  data() {
    return {
      formLabelWidth: '120px',
      dealerId: null,
      noticeInfo: {},
      showAdd: false,
      showChange: false,
      addTitle: '',
      changeTitle: '',
      addForm: {
        userType: '',
        userName: '',
        userPhone: '',
        userdd: '',
        userRemark: '',
      },
      changeForm: {
        id: '',
        userType: '',
        userName: '',
        userPhone: '',
        userdd: '',
        userRemark: '',
      },
      deleteShow: false,
      deleleInfo: {},
      deleteTitle: ''
    };
  },
  mounted() {
    var that = this;
    that.dealerId = this.$route.query.dealerId;
    that.getDealerNoticeConfig()
  },
  methods: {
    goBack() {
      this.$router.go(-1)
    },
    getDealerNoticeConfig: function (){
      var that = this;
      that.axios.post('/ald/notice/notice_user', {'dealerId': that.dealerId}).then(res=>{
        if (res.data.code==='ok'){
          that.noticeInfo = res.data.data;
        }
      }).catch(res=>{
      })
    },
    showAddForm: function (addType) {
      var that = this;
      that.addForm.userType = addType
      if (addType === 'business'){
        that.addTitle = '新增业务负责人'
      } else if (addType === 'order'){
        that.addTitle = '新增跟单负责人'
      } else if (addType === 'finance'){
        that.addTitle = '新增财务负责人'
      }
      that.showAdd = true
    },
    addDealerNoticeUser: function () {
      var that = this;
      if (that.addForm.userName === ''){
        return
      }
      else if (that.addForm.userPhone === ''){
        return
      }
      else if (that.addForm.userdd === ''){
        return
      }
      else if (that.addForm.userRemark === ''){
        return
      }
      that.axios.post('/ald/notice/add_notice_user', {'dealerId': that.dealerId, addForm: that.addForm}).then(res=>{
        if (res.data.code==='ok'){
          that.showAdd = false
          location.reload()
        }
      }).catch(res=>{
      })
    },
    showChangeForm: function (addType, data) {
      var that = this;
      if (addType === 'business'){
        that.addTitle = '修改业务负责人'
      } else if (addType === 'order'){
        that.addTitle = '修改跟单负责人'
      } else if (addType === 'finance'){
        that.addTitle = '修改财务负责人'
      }
      that.changeForm.userType = addType
      that.changeForm.id = data.id
      that.changeForm.userName = data.user_name
      that.changeForm.userPhone = data.user_phone
      that.changeForm.userdd = data.user_dd
      that.changeForm.userRemark = data.user_remark
      that.showChange = true
    },
    changeDealerNoticeUser: function () {
      var that = this;
      if (that.changeForm.userName === ''){
        return
      }
      else if (that.changeForm.userPhone === ''){
        return
      }
      else if (that.changeForm.userdd === ''){
        return
      }
      else if (that.changeForm.userRemark === ''){
        return
      }
      that.axios.post('/ald/notice/change_notice_user', {'dealerId': that.dealerId, changeForm: that.changeForm}).then(res=>{
        if (res.data.code==='ok'){
          that.showAdd = false
          location.reload()
        }
      }).catch(res=>{
      })
    },
    deleteShowFunc: function (addType, data) {
      var that = this;
      if (addType === 'business'){
        var t = '业务负责人'
      } else if (addType === 'order'){
        var t = '跟单负责人'
      } else if (addType === 'finance'){
        var t = '财务负责人'
      } else {
        return
      }
      that.deleteShow = true
      that.deleleInfo = data
      that.deleteTitle = '是否删除' + t + ': ' + data.user_name + '删除后该负责人将不在收到通知,请谨慎操作'
    },
    deleteDealerNoticeUser: function () {
      var that = this;
      that.axios.post('/ald/notice/delete_notice_user', {'dealerId': that.dealerId, userId: that.deleleInfo.id}).then(res=>{
        if (res.data.code==='ok'){
          that.showAdd = false
          location.reload()
        }
      }).catch(res=>{
      })
    },
    pushNoticeConfig: function (userId) {
      var that = this;
      that.$router.push('/admin/user/noticeConfig?userId=' + userId)
    }
  }
}
</script>

<style scoped>

</style>
