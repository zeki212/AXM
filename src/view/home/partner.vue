<template>
  <div class="mine_box">
    <my-header :showBack="true" title="城市合伙人" />
    <div class="content">
      <div class="title">
        <img src="../../assets/img/home/tu@2x.png" alt="">
        <ul>
          <li>
            <img src="../../assets/img/home/dw.png" alt="">
            {{user.city||'未知'}}
          </li>
          <li style="font-size: 3.7vw">数据统计:</li>
          <li>昨日该城市购买矿机收益: {{user.nodeSum}}</li>
          <li>昨日交易手续费收益: {{user.tradeFeeSum}}</li>
          <li>昨日全网矿机产出收益: {{user.equipProfitSum}}</li>
        </ul>
      </div>
      <div class="main_bgs">
        <van-button style="background: #fff;color: #333;" type="primary" size="large" @click="getProfits()">领取收益</van-button>
        <van-button type="primary" size="large" @click="showExitPopup()">我也要成为合伙人</van-button>
        <van-button type="primary" size="large" @click="showExitPopup()">转让城市合伙人</van-button>
      </div>
      <div class="task">
        <div>任务内容：<p class="top">{{user.taskInfo}}</p></div>
        <!-- <div>任务内容：<p class="bot">每日推荐<span>5</span>名上矿机</p></div> -->
      </div>
      <div class="fontS">转让规则：</br>
        1.合伙人有效期一年，每次转让有效期自动延长一个季度</br>
        2.转让请联系客服处理，转让需AXM作为手续费
      </div>
    </div>
    <van-popup v-model="exitPopup" class="exit_popup" @click-overlay="goBack()">
      <p>请联系VX: {{user.contact}}</p>
    </van-popup>
  </div>
</template>

<script>
import { Toast } from "vant";
export default {
  data() {
    return {
      userInfo: JSON.parse(localStorage.getItem("userInfo")),
      version: this.$information.VERSION,
      // city: '',
      user: '',
      exitPopup: false,
    };
  },
  watch: {
    $route(val, oldval) {
      if (val.fullPath.indexOf("?") == -1) {
        this.exitPopup = false;
      }
    },
  },
  created() {
    if (this.$route.fullPath.indexOf("?") != -1) {
      this.goBack();
    }
  },
  mounted() {
    // this.plug()
    this.getCityInfo();
  },

  methods: {
    getProfits() {
      let params = {};
      var formObject = encodeParams(params, this.userInfo.userId, this.userInfo.tokenId, this.userInfo.appKey);
      this.$ajax(this.$api.getProfits, {}, formObject.sign).then(res => {
        if (res.code == 200) {
          this.getCityInfo()
          Toast({ message: res.msg, position: "center",duration:"1000"  });
        } else {
          Toast({ message: res.msg, position: "center",duration:"1000"  });
        }
      })
    },
    showExitPopup() {
      if (window.location.href.indexOf("?exitPopup") == -1) {
        window.location.href = window.location.href + "?exitPopup";
      }
      this.exitPopup = true;
    },
    // plug() {
    //   var vm = this;
    //   AMap.plugin('AMap.CitySearch', function () {
    //     var citySearch = new AMap.CitySearch()
    //     citySearch.getLocalCity(function (status, result) {
    //       if (status === 'complete' && result.info === 'OK') {
    //         // 查询成功，result即为当前所在城市信息
    //         // console.log(result.city)
    //         vm.city = result.city;
    //       }
    //     })
    //   })
    // },
    getCityInfo() {
      let params = {};
      var formObject = encodeParams(params, this.userInfo.userId, this.userInfo.tokenId, this.userInfo.appKey);
      this.$ajax(this.$api.getCityInfo, {}, formObject.sign).then(res => {
        if (res.code == 200) {
          this.user = res.data;
        } else {
          Toast({ message: res.msg, position: "center",duration:"1000"  });
        }
      })
    },
  }
};
</script>

<style lang='less' scoped>
.title {
  position: relative;
  margin: 0 3vw;
  ul {
    width: 92%;
    transform: translateX(-50%);
    position: absolute;
    left: 50%;
    top: 3vw;
    // margin: 0 3vw;
    li:nth-child(1) {
      text-align: right;
      img {
        width: 3.5vw;
        height: 4.28vw;
      }
    }
    li {
      font-size: 3.3vw;
      line-height: 7vw;
    }
  }
}
.main_bgs {
  margin: 7.5vw 4vw 5vw;
  button {
    height: 12vw;
    line-height: 12vw;
    font-size: 3.7vw;
    background: #292929;
    margin: 1.5vw 0;
    border-radius: 1vw;
  }
}
.fontS {
  margin: 0 4vw 5vw;
  color: #C7C7C7;
  font-size: 3.3vw;
  line-height: 7vw;
}
.exit_popup {
  width: 70vw;
  background: #fff;
  padding: 15vw 6vw;
  color: #333;
  border-radius: 3vw;
  p {
    font-size: 3.7vw;
    text-align: center;
  }
}
.task {
  margin: 0 4vw 5vw;
  font-size: 3.3vw;
  line-height: 7vw;
  div {
    display: flex;
    flex-wrap: nowrap;
    align-items: center;
    .top {
      color:#FF654D;
    }
    .bot {
      color:#00B7EE;
    }
  }
}
</style>