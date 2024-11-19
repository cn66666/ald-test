export default {
  getInsureFormOption: function (date, data) {
    var option = {
      xAxis: {
        type: 'category',
        data: date
      },
      yAxis: {
        type: 'value'
      },
      series: [
        {
          data: data,
          type: 'bar'
        }
      ]
    };
    return option
  }
}
