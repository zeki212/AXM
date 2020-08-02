<template>
  <div class="mine_box">
    <my-header class="headerS" :showBack="true" title="我的矿机" />
    <div class="store">
      <ul>
        <li v-for="(item,index) in list"  :key="index">
          <div>
            <img v-if="item.equipId == 1" src="../../assets/img/store/1@2x.png" alt="">
            <img v-if="item.equipId == 2" src="../../assets/img/store/1@2x.png" alt="">
            <img v-if="item.equipId == 3" src="../../assets/img/store/2@2x.png" alt="">
            <img v-if="item.equipId == 4" src="../../assets/img/store/3@2x.png" alt="">
            <img v-if="item.equipId == 5" src="../../assets/img/store/4@2x.png" alt="">
            <img v-if="item.equipId == 6" src="../../assets/img/store/5@2x.png" alt="">
            <img v-if="item.equipId == 7" src="../../assets/img/store/6@2x.png" alt="">
            <img v-if="item.equipId == 8" src="../../assets/img/store/7@2x.png" alt="">
          </div>
          <div>
            <p>{{item.equipName}}</p>
            <p>
              <span>已出产周期：{{item.finishTimes*24}}小时</span> 
              <span>已产出：{{item.completeProfit}}</span>
            </p>
            <p>
              <span>总产量：{{item.totalProfit}}</span>
              <span>日产量：{{item.profit}}</span>
            </p>
          </div>
        </li>
      </ul>
      <div class="no_data" v-show="list.length==0">
        <img src="../../assets/img/home/zanwu.png" alt="">
      </div>
    </div>
    <div class="account_btn">
      <button @click="receive">一键收矿</button>
    </div>
  </div>
</template>

<script>
import { Toast, Dialog, Progress } from "vant";
import informations from '../../assets/js/prams'; // 获取当前设备

export default {
  data() {
    return {
      userInfo: JSON.parse(localStorage.getItem("userInfo")),
      version: this.$information.VERSION,
      list: '',
      equipId: '',
      active: 0,
      type: 1,
      isLoad: false,
      loading: false,
      finished: true,
      homes: '',
      uid: JSON.parse(localStorage.getItem("userInfo")).userId,
      source: informations.source
    };
  },
  watch: {
    active(val) {
      if (val == 0) {
        this.type = 1
      }
      if (val == 1) {
        this.type = 2
      }
      this.getMinerList();
    }
  },
  created() {
    if (this.$route.fullPath.indexOf("?") != -1) {
      this.goBack();
    }
  },
  mounted() {
    this.getHomePage();
    this.getMinerList();
  },

  methods: {
    // 一键领取
    receive() {
      var _this = this
      // if(this.list.length>0){
        profit();
      // }else{
      //   Toast({ message: "没有矿机可以收获", position: "center",duration:"1000"  });
      // }
      function profit() {
          let params = { version: _this.version };
          var formObject = encodeParams(params, _this.userInfo.userId, _this.userInfo.tokenId, _this.userInfo.appKey);
          _this.$ajax(_this.$api.receiveEarnings, { version: _this.version }, formObject.sign)
            .then(res => {
              if (res.code == 200) {
                _this.getHomePage()
                _this.getMinerList()
                Toast({ message: res.msg, position: "center",duration:"1000"  });
              } else {
                Toast({ message: res.msg, position: "center",duration:"1000"  });
              }
            })
      }
    },
    receiveEarnings(id) {
      var _this = this;
      profit(id);
      function profit(id) {
        let params = { version: _this.version, id: id };
        var formObject = encodeParams(params, _this.userInfo.userId, _this.userInfo.tokenId, _this.userInfo.appKey);
        _this.$ajax(_this.$api.receiveEarnings, { version: _this.version, id: id }, formObject.sign)
          .then(res => {
            if (res.code == 200) {
              this.getMinerList()
              Toast({ message: res.msg, position: "center",duration:"1000"  });
            } else {
              Toast({ message: res.msg, position: "center",duration:"1000"  });
            }
          })
      }
    },
    getMinerList() {
      let params = { version: this.version, status: this.type };
      var formObject = encodeParams(params, this.userInfo.userId, this.userInfo.tokenId, this.userInfo.appKey);
      this.$ajax(this.$api.getMinerList, { version: this.version, status: this.type }, formObject.sign)
        .then(res => {
          if (res.code == 200) {
            // if (res.data) {
              this.list = res.data.list;
            // }
          } else {
            Toast({ message: res.msg, position: "center",duration:"1000"  });
          }
        })
    },
    // 获取视频观看次数
    getHomePage() {
      let params = {userId: this.userInfo.userId};
      var formObject = encodeParams(params, this.userInfo.userId, this.userInfo.tokenId, this.userInfo.appKey);
      this.$ajax(this.$api.getHomePage, params, formObject.sign).then(res => {
        if (res.code == 200) {
          this.homes = res.data;
          localStorage.setItem('homes', JSON.stringify(res.data))
          if (res.data.noticeList) {
            this.noticeList = res.data.noticeList;
            localStorage.setItem('noticeList', JSON.stringify(res.data.noticeList))
          }
        } else {
          Toast({ message: res.msg, position: "center",duration:"1000"  });
        }
      })
    }
  },
  filters: {
    formatDate: function (value) {
      let date = new Date(value);
      let y = date.getFullYear();
      let MM = date.getMonth() + 1;
      MM = MM < 10 ? ('0' + MM) : MM;
      let d = date.getDate();
      d = d < 10 ? ('0' + d) : d;
      let h = date.getHours();
      h = h < 10 ? ('0' + h) : h;
      let m = date.getMinutes();
      m = m < 10 ? ('0' + m) : m;
      let s = date.getSeconds();
      s = s < 10 ? ('0' + s) : s;
      return y + '/' + MM + '/' + d;
    }
  }
};
</script>

<style lang='less' scoped>
.no_data {
  margin: 11vh auto 0;
  img {
    width: 40vw;
  }
  div {
    margin-top: 2vh;
    font-size: 3.5vw;
    color: #999;
  }
}
// /deep/.header_box + div {
  // background: #fff;
// }
.font {
  color: #333;
  font-size: 12px;
}
/deep/.van-tabs__line {
  display: none;
  width: 12vw !important;
  height: 3px !important;
  background-color: #58c89c !important;
  // margin-left: 10.6% !important;
}
/deep/.van-tabs--line {
  padding-top: 10vw;
  // margin-bottom: 3vw;
}
// /deep/.van-tabs {
  // border-bottom: 1px solid rgb(153, 153, 153);
// }
/deep/.van-tab--active {
  color: #58c89c !important;
}
/deep/[class*="van-hairline"]:after {
  display: none !important;
}
/deep/.van-ellipsis {
  // font-weight: bold !important;
  font-size: 3.7vw;
}
.van-cell,
.van-cell-group {
  background-color: #fff;
}
/deep/.van-field__control {
  color: #333333;
}
.van-cell {
  padding: 10px 0;
}
/deep/.van-tabs--line .van-tabs__wrap {
  height: 11vw;
  margin: 0 3vw;
}
/deep/.van-tab {
  line-height: 11vw;
  background: #1c1c1d;
  color: #fff;
}
.store {
  ul {
    margin-top: 5vw;
    background: #fff;
    overflow-y: scroll;
    overflow-x: hidden;
    li {
      width: 95vw;
      height: 30vw;
      margin:0 auto;
      display: flex;
      align-items: center;
      justify-content: space-around;
      box-shadow:0px 4px 16px 0px rgba(129,129,129,0.07);
      border-radius:1vw;
      margin-bottom:3vw;
      p {
        color:#666666;
        font-size: 3.4vw;
        // opacity: 0.72;
        // margin-bottom: 0.5vw;
      }
      p:nth-child(1) {
        color:#333333;
        font-weight: bold;
        font-size: 4vw;
        margin-bottom: 3.5vw;
      }
      p:nth-child(2){
        width: 60vw;
        display: flex;
        font-size: 3.6vw;
        justify-content: space-between;
        margin-bottom:2.5vw;
      }
       p:nth-child(3){
        width: 60vw;
        font-size: 3.6vw;
        display: flex;
        justify-content: space-between;
        margin-bottom:2.5vw;
      }
      img {
        width: 25vw;
        height: 25vw;
      }
    }
  }
}
.account_btn {
  width: 20vw;
  height: 11vw;
  position: fixed;
  top:0;
  right:2vw;
  overflow: hidden;
  text-align: center;
  // margin: 0vw 13vw 3vw;
  button {
    width: 18vw;
    height: 8vw;
    border:0;
    color:#fff;
    background: #EE281C;
    font-size:4vw;
    border-radius: 1vw;
    margin-top:2.5vw;
  }
  p {
    position: absolute;
    right: 5vw;
    top: 50%;
    transform: translateY(-50%);
  }
}
</style>