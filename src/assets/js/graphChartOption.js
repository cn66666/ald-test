export default {
  getRelationOption: function (point_data, line_data) {
    var point_list = [];
    var line_list = [];
    for (var i = 0; i < point_data.length; i++) {
      var info = {};
      info.name = point_data[i]['name'];
      if (point_data[i]['zt'] === '') {

      } else {
        info.draggable = true;
      }
      if (point_data[i]['type'] === 2) {
        info.symbolSize = 50;
      } else {
        info.symbolSize = 100;
      }
      if (point_data[i]['zt'] === '') {
        info.itemStyle = {
          color: '#F1DD4B'
        }
      } else if (point_data[i]['type'] === 2) {
        info.itemStyle = {
          color: '#FF6817'
        }
      } else {
        info.itemStyle = {
          color: '#2A68FF'
        }
      }
      point_list.push(info)
    }

    for (var x = 0; x < line_data.length; x++) {
      var data = {};
      data.source = line_data[x]['from'];
      data.target = line_data[x]['name'];
      data.label = {
        show: true,
        formatter: line_data[x]['info']
      };
      line_list.push(data)
    }
    var option = {
      backgroundColor: '#f0f0f0',
      title: {
        text: ''
      },
      tooltip: {},
      animationDurationUpdate: 1500,
      animationEasingUpdate: 'quinticInOut',
      series: [
        {
          type: "graph",
          top: '10%',
          roam: true,
          // focusNodeAdjacency: true,
          force: {
            repulsion: 1000,
            edgeLength: [100, 200],
            layoutAlgorithm: true
          },
          layout: "force",
          symbolSize: 50,
          label: {
            show: true,
            width: 1,
            // overflow: "break",
          },
          edgeSymbol: ['circle', 'arrow'],
          edgeSymbolSize: [4, 10],
          edgeLabel: {
            show: true,
            align: 'center',
            fontSize: 10,
            color: '#6c6c6c',
          },
          data: point_list,
          links: line_list,
          lineStyle: {
            opacity: 0.9,
            width: 2,
            curveness: 0
          }
        }
      ]
    };
    return option
  }
}
