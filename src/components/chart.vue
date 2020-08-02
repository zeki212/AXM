<template>
  <section class="chart_box">
    <!-- <div class="chart_title van-hairline--bottom">
      <label for="">近一周价格走势</label>
    </div> -->
    <div class="chart_content" ref="chartBox" style="margin: auto;"></div>
    <!-- <div class="price">
      <p>当前指导价格：{{(Math.floor((rateUsd * chartData.currentPrice)*100)/100).toFixed(2)}}$ ≈ {{chartData.currentPrice||'0'}}CNY</p>
      <p>
        <span>求购总量：{{chartData.tradeDemandSum||'0'}}</span>
        <span>24小时交易总量：{{chartData.tradeVolume||'0'}}</span>
      </p>
    </div> -->
    <!-- <p>涨幅 %</p>
    <p>时间</p> -->
  </section>
</template>

<script>
import echarts from "echarts";
export default {
  data() {
    return {
      // market: localStorage.getItem('currentPrice'),
      year: '',
      rateUsd: '',
    }
  },
  name: "chart",
  props: {
    chartData: {
      type: Object
    },
    title: {
      type: String
    },
    type: {
      type: String
    },

    // market:{
    //   type:String
    // }
  },
  created() {
    this.renminbi()
  },
  mounted() {
    var date = new Date;
    this.year = date.getFullYear();
    let w = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
    this.$refs.chartBox.style.width = (w) + 'px' - '6vw';
    this.$refs.chartBox.style.height = (w) * 2 / 4 + 'px';
    const chart = echarts.init(this.$refs.chartBox);
    chart.setOption({
      // backgroundColor: '#1C1C1D',
      grid: {
        x: '50px',
        top: '20px',
        bottom: "40px"
      },
      // animation: false,
      tooltip: {
        trigger: 'axis'
      },
      xAxis: {
        type: "category",
        boundaryGap: false,
        axisTick: {
          //坐标轴刻度相关设置
          show: true, //是否显示坐标轴刻度。
          inside: false, //坐标轴刻度是否朝内，默认朝外。
          length: 1 //坐标轴刻度的长度。
        },
        data: this.chartData.date,
        splitLine: {
          //坐标轴在 grid 区域中的分隔线。
          show: true,
          lineStyle: {
            color: '#9EA3AB',
            opacity: 0.1,
            // type: 'dashed'
          }
        },
        axisLabel: {
          // rotate: 20,字体倾斜
        },
        axisLine: {
          lineStyle: {
            color: '#9EA3AB',
            opacity: 0.1,
          }
        }
      },
      yAxis: {
        type: "value",
        scale: true,
        // splitNumber: 4,
        axisTick: {
          show: true,
          length: 1
        },
        axisLine: {
          lineStyle: {
            color: '#9EA3AB',
            opacity: 0.1,
          }
        },
        splitLine: {
          lineStyle: {
            color: '#9EA3AB',
            opacity: 0.1,
            // type: 'dashed'
          }
        }
      },
      series: [
        {
          name: this.type,
          type: "line",
          data: this.chartData.value,
          // label: {  //数字显示
          //   normal: {
          //     show: true,
          //     position: 'top'
          //   }
          // },
          areaStyle: {
            normal: {
              color: {
                type: 'linear',
                x: 0,
                y: 0,
                x2: 0,
                y2: 1,
                colorStops: [{
                  offset: 0, color: '#F6483A' // 0% 处的颜色
                }, {
                  offset: 1, color: '#FFFFFF' // 100% 处的颜色
                }],
                globalCoord: false // 缺省为 false
              }
            }
          },
          // 流线圆圈设置
          itemStyle: {
            width: 8,
            // color: '#50ACFE',
            opacity: 0.6,
          },
          // smooth:true
        }
      ],
      lineStyle: {
        width: 1,
        type: "solid",
        color: "#F6483A",
      },
    });
  },
  methods: {
    renminbi() {
      let vm = this;
      $.ajax({
        type: 'get',
        url: "https://api.coincap.io/v2/rates/chinese-yuan-renminbi",
        data: {},
        beforeSend: function (xhr) {
        },
        success: function (data) {
            vm.rateUsd = data.data.rateUsd;
        },
        error: function (data) {
        }
      })
    },
  },
}
</script>

<style lang="less" scoped>
[class*="van-hairline"]:after {
  display: none;
}
.chart_box {
  // background: #1C1C1D;
  margin: 0 3vw;
  // >p:nth-child(4) {
  //   color: #fff;
  //   position: absolute;
  //   top: 8vw;
  //   left: 7vw;
  //   font-size: 2.5vw;
  // }
  .chart_title {
    // display: flex;
    // justify-content: space-around;
    padding: 15px 0 0 8vw;
    color: #333;
    line-height: 20px;
    // margin-top: 10px;
    label {
      font-size: 3.7vw;
      em {
        color: #f44;
      }
      i {
        color: #04bd60;
      }
    }
  }
}
.price {
  padding: 0 8vw 3.5vw;
  font-size: 3vw;
  p:nth-child(1) {
    margin-bottom: 2vw;
  }
  p:nth-child(2) {
    display: flex;
    justify-content: space-between;
  }
}
</style>
