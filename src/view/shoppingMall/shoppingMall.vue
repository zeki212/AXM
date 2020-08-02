<!-- 矿机商城 -->
<template>
  <div class="home">
    <!-- 头部 -->
    <div class="home_top">
      <!-- <p></p> -->
      <p>爱心矿机</p>
      <!-- <p>
        <img src="../../assets/img/store/wh.png" alt="">
      </p> -->
    </div>
    <van-pull-refresh v-model="isLoading" @refresh="onRefresh">
      <div class="store">
        <ul v-for="(item,index) in list" :key="index">
          <li>
            <img v-if="item.equipId == 1" src="../../assets/img/store/1@2x.png" alt="">
            <img v-if="item.equipId == 2" src="../../assets/img/store/2@2x.png" alt="">
            <img v-if="item.equipId == 3" src="../../assets/img/store/2@2x.png" alt="">
            <img v-if="item.equipId == 4" src="../../assets/img/store/3@2x.png" alt="">
            <img v-if="item.equipId == 5" src="../../assets/img/store/4@2x.png" alt="">
            <img v-if="item.equipId == 6" src="../../assets/img/store/5@2x.png" alt="">
            <img v-if="item.equipId == 7" src="../../assets/img/store/6@2x.png" alt="">
            <img v-if="item.equipId == 8" src="../../assets/img/store/7@2x.png" alt="">
          </li>
          <li>
            <!-- <p>{{item.equipName}}</p> -->
            <p>{{item.equipName}}</p>
            <p>算力：{{item.equipActive}}</p>
            <p>租金：{{item.needSweets}} AXM</p>
            <p>总产：{{item.totalProfit}} AXM</p>
          </li>
          <li style="textAlign:center;">
            <van-button v-if="item.status == 1" type="primary" class="butS" size="large" @click="rent(item.equipId,item.needSweets)">租用</van-button>
            <van-button v-else type="primary" style="background: #cccccc" class="butS" size="large" >暂未开放</van-button>
            <p style="marginTop:3vw;">运行时长：{{item.period*24}}小时</p>
          </li>
        </ul>
      </div>
      <div class="no_data" v-show="list.length==0">
        <img src="../../assets/img/home/zanwu.png" alt="">
      </div>
      <van-popup v-model="popupText" class="exit_popup"  @click-overlay="goBack()">
        <div class="exit_popup_box">
          <span style="font-size: 4vw">确定消耗{{prices}}AXM租用矿机?</span>
          <span @click="goBack"><img src="../../assets/img/deal/guanbi.png" alt=""></span>
          <div class="exitup">
            <p @click="exchangeMiner">确定</p>
            <p @click="goBack()">取消</p>
          </div>
        </div>
      </van-popup>
    </van-pull-refresh>
  </div>
</template>

<script>
import { Toast, Dialog, Progress } from "vant";

export default {
  components: {},
  data() {
    return {
      userInfo: JSON.parse(localStorage.getItem("userInfo")),
      version: this.$information.VERSION,
      list:JSON.parse(sessionStorage.getItem("minerlist")) || '',
      prices:"",
      isLoading: false,
      popupText: false,
      userAvailableAxm: '',
      coin: '', // 钻石数量
      equipId: '',
      payPwd: '',
    };
  },
  computed: {},
  watch: {
    $route(val, oldval) {
      if (val.fullPath.indexOf("?") == -1) {
        this.popupText = false;
      }
    },
  },
  created() {
    if (this.$route.fullPath.indexOf('?') != -1) {
      this.goBack();
    }
    this.$store.commit("updateNeedShowFooter", true);
    this.$store.commit("updateSelected", 1);
    if(this.list.length<1){
      this.getMinerList()
    }
  },
  mounted() {
    
  },
  methods: {
    exchangeMiner() {
      let params = { version: this.version, equipId: this.equipId};
      var formObject = encodeParams(params, this.userInfo.userId, this.userInfo.tokenId, this.userInfo.appKey);
      // console.log(params);
      this.$ajax(this.$api.exchangeMiner, { version: this.version, equipId: this.equipId}, formObject.sign)
        .then(res => {
          // console.log(res);
          if (res.code == 200) {
            Toast({ message: res.msg, position: "center",duration:"1000"  });
            this.payPwd = '';
            this.goBack();
          } else {
            this.popupText = false;
            Toast({ message: res.msg, position: "center",duration:"1000"  });
          }
        })
    },
    rent(id,needSweets) {
      if (window.location.href.indexOf("?popupText") == -1) {
        window.location.href = window.location.href + "?popupText";
      }
      this.prices = needSweets;
      this.equipId = id;
      this.popupText = true;
    },
    onRefresh() {
      setTimeout(() => {
        // this.$toast('刷新成功');
        this.getMinerList()
        this.isLoading = false;
      }, 500);
    },
    getMinerList() {
      let params = { version: this.version, status: '0' };
      var formObject = encodeParams(params, this.userInfo.userId, this.userInfo.tokenId, this.userInfo.appKey);
      this.$ajax(this.$api.getMinerList, { version: this.version, status: '0' }, formObject.sign)
        .then(res => {
          if (res.code == 200) {
            if (res.data) {
              this.userAvailableAxm = res.data.userAvailableAxm;
              this.coin = res.data.coin;
              this.list = res.data.list;
              sessionStorage.minerlist = JSON.stringify(res.data.list);
            }
          } else {
            Toast({ message: res.msg, position: "center",duration:"1000"  });
          }
        })
    },
  }
};
</script>
<style lang='less' scoped>
@import "../../assets/css/config";
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
.home {
  overflow-y: auto;
  bottom: 11vw;
  height: auto;
  background-color: #f3f3f3;
}
// 头部
.home_top {
  // margin: 2vw 0;
  height: 10vw;
  line-height: 10vw;
  text-align: center;
  padding: 0 4.5vw;
  font-size: 4.5vw;
  font-weight: bold;
  letter-spacing: 1px;
  background-color: #fff;
  // display: flex;
  // justify-content: space-between;
  // > p:nth-child(1) {
  //   width: 5vw;
  // }
  // img {
  //   width: 4vw;
  //   height: 4vw;
  // }
}
.van-pull-refresh {
  overflow: visible;
}
.store {
  // padding-bottom: 9vh;
  // height: auto;
  // margin: 2vw 0;
  padding:0 2vw;
  overflow: hidden;
  background-color: rgba(243,243,243,1);
  ul {
    overflow: hidden;
    margin-top:2vw;
    margin-bottom: 2vw;
    background: rgba(255,255,255,1);
    display: flex;
    align-items: center;
    padding: 2vw 1.5vw 1.5vw;
    position: relative;
    li {
      display: inline-block;
      font-size: 3vw;
      p {
        opacity: 0.72;
        margin-bottom: 0.5vw;
      }
      p:nth-child(1) {
        font-size: 3.7vw;
        opacity: 1;
        margin-bottom: 1.5vw;
      }
      img {
        width: 25vw;
        height: 25vw;
      }
    }
    li:nth-child(2) {
      margin-left: 3vw;
    }
    li:nth-child(3) {
      transform: translateY(-50%);
      position: absolute;
      right: 5vw;
      top: 50%;
    }
  }
}
.van-button--primary {
  background: #EE281C;
  height: 7.5vw;
  line-height: 7.5vw;
  font-size: 3.3vw;
  width: 20vw;
  border-radius: 1.5vw;
}
.exit_popup {
  width: 75%;
  margin-bottom: 10px;
  border-radius: 3vw;
  box-shadow: 0px 4px 10px 0px rgba(202, 202, 202, 0.3);
}
.exit_popup_box {
  height: 35vw;
  overflow: hidden;
  position: relative;
  background-color: #fff;
  text-align: center;
  span:nth-of-type(1){
    display: block;
    border-radius: 5px;
    margin-top: 6vw;
    font-weight: 550;
    font-size: 4.5vw;
  }
  span:nth-of-type(2){
    position:absolute;
    top: 1vw;
    right: 2vw;
    img{
      width: 3vw;
      height: 3vw;
    }
  }
}
.exitup{
  display: flex;
  align-content: center;
  margin-top: 10vw;
  line-height: 10vw;
  justify-content: space-around;
  p{
    font-size: 4vw;
  }
}
</style>
