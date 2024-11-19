export default {
  getDealFormOption: function (data) {
    var series = [
      {
        data: data.fulfil_money_list,
        type: 'bar',
        stack: 'a',
        name: 'a'
      },
      {
        data: data.invoice_money_list,
        type: 'bar',
        stack: 'a',
        name: 'b'
      },
      {
        data: data.return_money_list,
        type: 'bar',
        stack: 'a',
        name: 'c'
      },
      {
        data: data.overdue_money_list,
        type: 'bar',
        stack: 'a',
        name: 'd'
      },
    ];
    const stackInfo = {};
    for (let i = 0; i < series[0].data.length; ++i) {
      for (let j = 0; j < series.length; ++j) {
        const stackName = series[j].stack;
        if (!stackName) {
          continue;
        }
        if (!stackInfo[stackName]) {
          stackInfo[stackName] = {
            stackStart: [],
            stackEnd: []
          };
        }
        const info = stackInfo[stackName];
        const data = series[j].data[i];
        if (data && data !== '-') {
          if (info.stackStart[i] == null) {
            info.stackStart[i] = j;
          }
          info.stackEnd[i] = j;
        }
      }
    }
    for (let i = 0; i < series.length; ++i) {
      const data = series[i].data;
      const info = stackInfo[series[i].stack];
      for (let j = 0; j < series[i].data.length; ++j) {
        // const isStart = info.stackStart[j] === i;
        const isEnd = info.stackEnd[j] === i;
        const topBorder = isEnd ? 20 : 0;
        const bottomBorder = 0;
        data[j] = {
          value: data[j],
          itemStyle: {
            borderRadius: [topBorder, topBorder, bottomBorder, bottomBorder]
          }
        };
      }
    }
    var option = {
      xAxis: {
        type: 'category',
        data: data.months_list
      },
      yAxis: {
        type: 'value'
      },
      series: series
    };
    return option
  }
}
