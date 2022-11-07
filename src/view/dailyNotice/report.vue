<template>
    <div class="subpage paper-page" v-if="showReport===true">
      <div class="sub-header">
        <div class="sub-box">
          <div class="logo"  @click="toIndex()"></div>
        </div>
      </div>
      <div class="container">
        <div class="caption">
          <el-row>
            <el-col :span="18">
              <h2>完整日报{{ report.create_time }}<span>{{report.company_name}}</span></h2>
            </el-col>
            <el-col :span="6" class="times">
              日报数据截止统计时间 {{ report.report.hour }}：00
            </el-col>
          </el-row>
        </div>
        <div class="box">
          <h3>额度日报</h3>
          <div class="idea">
            <p>剩余额度：<span>{{report.report.quota_report.quota_surplus}} 万元</span></p>
            <p>额度类型：<span>{{report.report.quota_report.quota_type}}</span></p>
            <p>额度有效期：<span>{{report.report.quota_report.quota_date}} 天</span></p>
          </div>
        </div>
        <div class="box">
          <h3>发票日报</h3>
          <div class="idea">
            <p>代付款发票：<span>{{report.report.invoice_report.lens}} 张</span></p>
            <p>发票金额：<span>{{report.report.invoice_report.sum}} 万元</span></p><br>
            <p>{{ report.report.config.config.invoice }}日内到期发票列表：<span>{{report.report.invoice_report.list_num}} 张</span></p>
          </div>
          <el-table
            :data="report.report.invoice_report.invoice_list"
            class="table-style"
            border>
            <el-table-column
              prop="invoice_code"
              label="发票号码">
            </el-table-column>
            <el-table-column
              prop="no_money"
              label="未结金额">
            </el-table-column>
            <el-table-column
              prop="due_date"
              label="到期日">
            </el-table-column>
          </el-table>
        </div>
        <div class="box">
          <h3>逾期统计</h3>
          <div class="idea" >
            <p>逾期总天数：<span>{{report.report.overdue_count_report.overdue_days}}天</span></p>
            <p>逾期总金额：<span>{{report.report.overdue_count_report.overdue_money}} 万元</span></p><br>
            <p>逾期发票列表：<span>{{report.report.overdue_count_report.overdue_count}} 笔</span></p>
          </div>
          <el-table
            :data="report.report.month_overdue.all_overdue"
            :span-method="objectSpanMethod"
            class="table-style"
            border>
            <el-table-column
              prop="month"
              label="逾期月份">
            </el-table-column>
            <el-table-column
              prop="count"
              label="笔数">
            </el-table-column>
            <el-table-column
              prop="invoice_code"
              label="发票号码">
            </el-table-column>
            <el-table-column
              prop="no_money"
              label="未结金额">
            </el-table-column>
            <el-table-column
              prop="due_date"
              label="到期日">
            </el-table-column>
            <el-table-column
              prop="late_day"
              label="逾期天数">
            </el-table-column>
            <el-table-column
              prop="overdue_money"
              label="产生滞纳金">
            </el-table-column>
          </el-table>
        </div>
        <div class="box">
          <h3>7日内额度占用统计</h3>
          <div class="idea">
            <p>7日内履行单数量：<span>{{report.report.fulfil_info.count}} 笔</span></p>
            <p>7日内履行单占用金额：<span>{{report.report.fulfil_info.sum}} 万元</span></p>
          </div>
          <el-table
            :data="report.report.fulfil_info.datas"
            class="table-style"
            border>
            <el-table-column
              prop="fulfil_code"
              label="履行单号">
            </el-table-column>
            <el-table-column
              prop="order_code"
              label="销售单号">
            </el-table-column>
            <el-table-column
              prop="fulfil_money"
              label="占用金额">
            </el-table-column>
            <el-table-column
              prop="create_time"
              label="占用时间">
            </el-table-column>
          </el-table>
        </div>
      </div>
    </div>
</template>

<script>

export default {
  name: "paper",
  data() {
    return {
      code: '',
      showReport: false,
      report: {},
      all_overdue: []
    }
  },
  mounted() {
    var that = this;
    that.code = this.$route.query.code;
    that.getReportInfo(that.code)
  },
  methods: {
    objectSpanMethod ({ row, column, rowIndex, columnIndex }) {
      if(columnIndex === 0||columnIndex===1){
        const _row = this.all_overdue[rowIndex]
        const _col = _row>0?1:0;
        //该形式为行合并
        return{
          rowspan:_row,
          colspan:_col
        }
      }
    },

    getReportInfo: function (code) {
      var that = this;
      that.axios.post('/ald/notice/report', {'code': code}).then(res=>{
        if (res.data.code==='ok'){
          that.showReport = true
          that.report = res.data.data
          if (that.report.report.month_overdue.all_overdue !== []){
            that.all_overdue = []
            let contactDot = 0;
            that.report.report.month_overdue.all_overdue.forEach( (item,index) => {
              //遍历tableData数据，给spanArr存入一个1，第二个item.id和前一个item.id是否相同，相同就给
              //spanArr前一位加1，spanArr再存入0，因为spanArr为n的项表示n项合并，为0的项表示该项不显示,后面有spanArr打印结果
              if(index===0){
                that.all_overdue.push(1)
              }else{
                if(item.id === that.report.report.month_overdue.all_overdue[index-1].id){
                  that.all_overdue[contactDot] += 1;
                  that.all_overdue.push(0)
                }else{
                  contactDot = index
                  that.all_overdue.push(1)
                }
              }
            })
          }
        }
      }).catch(res=>{
      })
    },
    toIndex: function (){
      var that = this;
      that.$router.push('/admin')

    }
  }
}
</script>

<style scoped lang="stylus">
@import "./report.styl";
</style>
