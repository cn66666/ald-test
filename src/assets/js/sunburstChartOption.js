export default {
  getGqOption: function (gqDatas) {
    var data = [];
    for (var i = 0; i < gqDatas.length; i++) {
      var info = {}
      info.id = gqDatas[i]['id'];
      info.parent = gqDatas[i]['parent'];
      info.name = gqDatas[i]['name'];
      if (gqDatas[i]['value']){
        info.value = gqDatas[i]['value'];
      }
      data.push(info)
    }
    var option = {
      chart:{
        backgroundColor: 'rgba(0,0,0,0)'
      },
      credits: {
        enabled: false
      },
      exporting: {
        enabled:false
      },
      title: {
        text: ''
      },
      series: [{
        type: "sunburst",
        name: '股权结构图',
        data: data,
        allowDrillToNode: true,
        cursor: 'pointer',
        dataLabels: {
          formatter: function () {
            var shape = this.point.node.shapeArgs;
            var innerArcFraction = (shape.end - shape.start) / (2 * Math.PI);
            var perimeter = 2 * Math.PI * shape.innerR;
            var innerArcPixels = innerArcFraction * perimeter;
            if (innerArcPixels > 16) {
              return this.point.name;
            }
          }
        },
        levels: [{
          level: 2,
          colorByPoint: true,
          dataLabels: {
            rotationMode: 'parallel'
          }
        },
          {
            level: 3,
            colorVariation: {
              key: 'brightness',
              to: -0.5
            }
          }, {
            level: 4,
            colorVariation: {
              key: 'brightness',
              to: 0.5
            }
          }]

      }],
        tooltip: {
        headerFormat: "",
          pointFormat: '<b>{point.name}</b>的持股比例是：<b>{point.value}</b>%'
      }
    }
    console.log(data)
    return option
  }
}
