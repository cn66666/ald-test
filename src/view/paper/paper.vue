<template>
    <div class="subpage paper-page">
      <div class="sub-header">
        <div class="sub-box">
          <div class="logo"></div>
        </div>
      </div>
      <div class="container">
        <div class="caption">
          <el-row>
            <el-col :span="18">
              <h2>完整日报2022.6.6<span>米技炫尚智能家用电器（上海）有限公司</span></h2>
            </el-col>
            <el-col :span="6" class="times">
              日报数据截止统计时间   8：00
            </el-col>
          </el-row>
        </div>
        <div class="box">
          <h3>额度日报</h3>
          <div class="idea">
            <p>剩余额度：<span>34567.11 元</span></p>
            <p>额度类型：<span>一年期额度</span></p>
            <p>额度有效期：<span>89 天</span></p>
          </div>
        </div>
        <div class="box">
          <h3>发票日报</h3>
          <div class="idea">
            <p>代付款发票：<span>30 张</span></p>
            <p>发票金额：<span>898.54 万</span></p><br>
            <p>7日内到期发票列表：<span>5 张</span></p>
          </div>
          <el-table
            :data="tableData"
            class="table-style"
            border>
            <el-table-column
              prop="number"
              label="发票号码">
            </el-table-column>
            <el-table-column
              prop="money"
              label="未结金额">
            </el-table-column>
            <el-table-column
              prop="date"
              label="到期日">
            </el-table-column>
            <el-table-column
              prop="number"
              label="发票号码">
            </el-table-column>
            <el-table-column
              prop="money"
              label="未结金额">
            </el-table-column>
            <el-table-column
              prop="date"
              label="到期日">
            </el-table-column>
          </el-table>
        </div>
        <div class="box">
          <h3>逾期统计</h3>
          <div class="idea">
            <p>逾期总天数：<span>123 天</span></p>
            <p>逾期总金额：<span>68898.11 万</span></p><br>
            <p>逾期发票列表：<span>6 笔</span></p>
          </div>
          <el-table
            :data="tableData2"
            :span-method="objectSpanMethod"
            class="table-style"
            border>
            <el-table-column
              prop="month"
              label="逾期月份">
            </el-table-column>
            <el-table-column
              prop="amount"
              label="笔数">
            </el-table-column>
            <el-table-column
              prop="number"
              label="发票号码">
            </el-table-column>
            <el-table-column
              prop="money"
              label="未结金额">
            </el-table-column>
            <el-table-column
              prop="date"
              label="到期日">
            </el-table-column>
            <el-table-column
              prop="number"
              label="发票号码">
            </el-table-column>
            <el-table-column
              prop="day"
              label="逾期天数">
            </el-table-column>
            <el-table-column
              prop="money"
              label="产生滞纳金">
            </el-table-column>
          </el-table>
        </div>
        <div class="box">
          <h3>7日内额度占用统计</h3>
          <div class="idea">
            <p>7日内履行单数量：<span>30 笔</span></p>
            <p>7日内履行单占用金额：<span>8987.54 万</span></p>
          </div>
          <el-table
            :data="tableData3"
            class="table-style"
            border>
            <el-table-column
              prop="number"
              label="履行单号">
            </el-table-column>
            <el-table-column
              prop="number"
              label="销售单号">
            </el-table-column>
            <el-table-column
              prop="money"
              label="占用金额">
            </el-table-column>
            <el-table-column
              prop="date"
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
      tableData: [{
        number: '8774857',
        date: '2022.6.7',
        money: '29887.34'
      }, {
        number: '8774857',
        date: '2022.6.7',
        money: '29887.34'
      }, {
        number: '8774857',
        date: '2022.6.7',
        money: '29887.34'
      }],
      tableData2: [{
        month: '4月前',
        amount: '1笔',
        number: '8774857',
        date: '2022.6.7',
        day: '100天',
        money: '29887.34'
      }, {
        month: '4月前',
        amount: '1笔',
        number: '8774857',
        date: '2022.6.7',
        day: '100天',
        money: '29887.34'
      }, {
        month: '4月前',
        amount: '1笔',
        number: '8774857',
        date: '2022.6.7',
        day: '100天',
        money: '29887.34'
      }, {
        month: '4月前',
        amount: '1笔',
        number: '8774857',
        date: '2022.6.7',
        day: '100天',
        money: '29887.34'
      }, {
        month: '4月前',
        amount: '1笔',
        number: '8774857',
        date: '2022.6.7',
        day: '100天',
        money: '29887.34'
      }, {
        month: '4月前',
        amount: '1笔',
        number: '8774857',
        date: '2022.6.7',
        day: '100天',
        money: '29887.34'
      }, {
        month: '4月前',
        amount: '1笔',
        number: '8774857',
        date: '2022.6.7',
        day: '100天',
        money: '29887.34'
      }],
      tableData3: [{
        number: 'JOV93884',
        date: '2022.6.6 18:23',
        money: '132837.99'
      }, {
        number: 'JOV93884',
        date: '2022.6.6 18:23',
        money: '132837.99'
      }, {
        number: 'JOV93884',
        date: '2022.6.6 18:23',
        money: '132837.99'
      }]
    }
  },
  mounted() {
  },
  methods: {
    objectSpanMethod({ row, column, rowIndex, columnIndex }) {
      if (columnIndex === 0) {
        if (rowIndex % 2 === 0) {
          return {
            rowspan: 2,
            colspan: 1
          };
        } else {
          return {
            rowspan: 0,
            colspan: 0
          };
        }
      }
    }
  }
}
</script>

<style scoped lang="stylus">
@import "./paper.styl";
</style>
