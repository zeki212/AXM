<template>
  <div class="my_box">
    <van-pull-refresh v-model="isLoading" class="myHeight" @refresh="onRefresh">
      <!-- 头部 -->
      <div class="my_top">
          <div class="logo" @click="showLoginPopup">
              <img src="../../assets/img/account/logo.png" alt="">
              <span v-if="user.primaryAuthStatus==1"><img src="../../assets/img/my/border1.png" alt=""></span>
              <span v-else><img src="../../assets/img/my/border3.png" alt=""></span>
              <span v-if="user.authPayStatus==1"><img src="../../assets/img/my/border2.png" alt=""></span>
              <span v-else><img src="../../assets/img/my/border4.png" alt=""></span>
          </div>
          <p>{{mobile}}</p>
          <p>
              等级：
             <span v-if="user.level==0">普通矿工</span>  
             <span v-if="user.level==1">好心人</span>  
             <span v-if="user.level==2">志愿者</span>  
             <span v-if="user.level==3">大慈善家</span>  
             <span v-if="user.level==4">有义之士</span>  
          </p>
      </div>
      <div class="my_menu">
          <!-- <li @click="pushPath('/myMill')"> -->
          <li @click="pushPath('/myDeal')">
            <p><img src="../../assets/img/my/mill.png" alt=""></p>
            <span>激活矿工</span>
          </li>
          <li @click="pushPath('/taskCenter')">
            <p><img src="../../assets/img/my/tack.png" alt=""></p>
            <span>奖励中心</span>
          </li>
          <li @click="pushPath('/share')">
            <p><img src="../../assets/img/my/generalize.png" alt=""></p>
            <span>爱心推广</span>
          </li>
      </div>
      <div class="my_assets_info">
        <ol>
          <li>
            <p class="text_hide">AXM
              <!-- <span @click="selecs(1)">
                <img src="../../assets/img/my/wh.png" alt="tupian">
              </span> -->
            </p>
            <!-- <span class="text_hide">{{user.equipActive||'0'}}</span> -->
            <span class="text_hide">{{user.sweets ||'0'}}</span>
          </li>
          <li>
            <p class="text_hide">USDT资产
              <!-- <span @click="selecs(2)">
                <img src="../../assets/img/my/wh.png" alt="tupian">
              </span> -->
            </p>
            <!-- <span class="text_hide">{{user.sweets||'0'}}</span> -->
            <span class="text_hide">{{user.usdt ||'0'}}</span>
          </li>
          <li>
            <p class="text_hide">个人算力
              <!-- <span @click="selecs(3)">
                <img src="../../assets/img/my/wh.png" alt="tupian">
              </span> -->
            </p>
            <!-- <span class="text_hide">{{user.directNum||'0'}}</span> -->
            <span class="text_hide">{{user.equipActive ||'0'}}</span>
          </li>
        </ol>
        <ol>
          <li>
            <p class="text_hide">直推人数
              <!-- <span @click="selecs(4)">
                <img src="../../assets/img/my/wh.png" alt="tupian">
              </span> -->
            </p>
            <span class="text_hide">{{user.directNum||'0'}}</span>
          </li>
          <li>
            <p class="text_hide">团队算力
              <span>
                <!-- <img src="../../assets/img/my/wh.png" alt="tupian"> -->
              </span>
            </p>
            <span class="text_hide">{{user.teamActive||'0'}}</span>
          </li>
          <li>
            <p class="text_hide">团队人数
              <span>
                <!-- <img src="../../assets/img/my/wh.png" alt="tupian"> -->
              </span>
            </p>
            <!-- <span class="text_hide">{{user.teamNum||'0'}}</span> -->
            <span class="text_hide">{{user.teamNum||'0'}}</span>
          </li>
        </ol>
      </div>
      <div class="my_menu" style="margin-bottom: 5vw">
          <!-- <li @click="pushPath('/myDeal')"> -->
          <li @click="pushPath('/myMill')">
            <p><img src="../../assets/img/my/icon1.png" alt=""></p>
            <span>我的矿机</span>
          </li>
          <li @click="pushPath('/tradingOrder')">
            <p><img src="../../assets/img/my/icon2.png" alt=""></p>
            <span>交易订单</span>
          </li>
          <li @click="pushPath('/userInfo')">
            <p><img src="../../assets/img/my/icon3.png" alt=""></p>
            <span>个人账单</span>
          </li>
          <li @click="getName">
            <p><img src="../../assets/img/my/icon4.png" alt=""></p>
            <span>实名认证</span>
          </li>
          <li @click="pushPath('/laborUnion')">
            <p><img src="../../assets/img/my/icon5.png" alt=""></p>
            <span>爱心工会</span>
          </li>
          <li @click="pushPath('/safety')">
            <p><img src="../../assets/img/my/icon6.png" alt=""></p>
            <span>修改密码</span>
          </li>
          <li @click="pushPath('/announcement')">
            <p><img src="../../assets/img/my/icon7.png" alt=""></p>
            <span>系统公告</span>
          </li>
          <li @click="pushPath('/leaveWord')">
            <p><img src="../../assets/img/my/icon8.png" alt=""></p>
            <span>我要留言</span>
          </li>
          <!-- <li @click="pushPath('/personalData')"> -->
          <li @click="pushPath('/updateImg')">
            <p><img src="../../assets/img/my/icon10.png" alt=""></p>
            <span>支付绑定</span>
          </li>
          <li @click="showExitPopup()">
            <p><img src="../../assets/img/my/icon9.png" alt=""></p>
            <span>退出登录</span>
          </li>
      </div>
    </van-pull-refresh>
    <van-popup v-model="exitPopup" class="exit_popup" @click-overlay="goBack()">
      <div class="exit_popup_box">
        <span style="font-size: 4vw">确认退出登录吗？</span>
        <div class="exitup">
          <span @click="exit">确定</span>
          <span @click="goBack()">取消</span>
        </div>
      </div>
    </van-popup>
    <van-popup v-model="loginPopup" class="exit_popup" @click-overlay="goBack()">
      <div class="exit_popup_box">
        <span style="font-size: 4vw">是否切换帐号？</span>
        <div class="exitup">
          <p @click="exit">确定</p>
          <p @click="goBack()">取消</p>
        </div>
      </div>
    </van-popup>
    <van-popup v-model="hintPopup" class="hint_popup" @click-overlay="goBack()">
      <ul>
        <li>{{titles}}:</li>
        <li>{{content}}。</li>
        <li @click="goBack()">知道了</li>
      </ul>
    </van-popup>
  </div>
</template>

<script>
import { Toast, Dialog, Progress } from "vant";
import informations from '../../assets/js/prams'; // 获取当前设备

export default {
  data() {
    return {
      isLoading: false,
      userInfo: JSON.parse(localStorage.getItem("userInfo")),
      version: this.$information.VERSION,
      user: '',
      heads: require('../../assets/img/my/title.png'),
      exitPopup: false,
      loginPopup:false,
      hintPopup: false,
      titles: '',
      mobile:JSON.parse(localStorage.getItem("phone")) || "请登录",
      content: '',
      uid: JSON.parse(localStorage.getItem("userInfo")).userId,
      source: informations.source
      // active: '',
    };
  },
  watch: {
    // active(val) {
    //   if (window.location.href.indexOf("?hintPopup") == -1) {
    //     window.location.href = window.location.href + "?hintPopup";
    //   }
    //   this.hintPopup = true;
    // },
    $route(val, oldval) {
      if (val.fullPath.indexOf("?") == -1) {
        this.exitPopup = false;
        this.hintPopup = false;
        this.loginPopup = false;
      }
    },
  },
  components: {
  },
  created() {
    if (this.$route.fullPath.indexOf('?') != -1) {
      this.goBack();
    }
  },
  mounted() {
    // if (!localStorage.getItem("token")) {
    //   Toast({ message: '请先登录!', position: "center" });
    //   this.pushPath('/login')
    // }
    this.$store.commit("updateNeedShowFooter", true);
    this.$store.commit("updateSelected", 3);
    this.getCustInfo();
    if (this.user == '') {
      this.user = JSON.parse(localStorage.getItem('user'));
    }
  },
  methods: {
    // 点击实名认证
    getName(){
      // 1.未实名，则跳转认证界面
        this.$router.push('/identification');
    },
    // 点击logo登录或者切换帐号登录
    showLoginPopup(){
      if (window.location.href.indexOf("?loginPopup") == -1) {
        window.location.href = window.location.href + "?loginPopup";
      }
      this.loginPopup = true;
    },
    showExitPopup() {
      if (window.location.href.indexOf("?exitPopup") == -1) {
        window.location.href = window.location.href + "?exitPopup";
      }
      this.exitPopup = true;
    },
    exit() {
      localStorage.setItem("token", "");
      this.$store.commit('updateLoginState', false)
      this.$router.replace("/login");
      // if (window.plus && this.source != 1) {  // 安卓退出清除userid
      //   plus.bloomAd.setUserId(null)
      // }
    },
    selecs(id) {
      if (id == 1) {
        this.titles = '个人算力';
        this.content = '个人矿机算力的总和';
      }
      if (id == 2) {
        this.titles = 'AXM';
        this.content = 'AXM的资产';
      }
      if (id == 3) {
        this.titles = '直推人数';
        this.content = '一代推广人数';
      }
      if (id == 4) {
        this.titles = '团队算力';
        this.content = '团队六代的矿机算力总和';
      }
      if (window.location.href.indexOf("?hintPopup") == -1) {
        window.location.href = window.location.href + "?hintPopup";
      }
      this.hintPopup = true;
    },
        // 一键领取
    activeGet() {
      var _this = this
      // if (!window.plus || this.source == 1) { // 如果是苹果就不弹广告，安卓必须看完广告才能领取收益
      //   profit();
      // } else {
      //   plus.bloomAd.setUserId(this.uid)
      //   plus.bloomAd.showRewardVideoAd("rv1",
      //   function(result) {
      //     if (result.event == 'onAdClose') {
      //       profit();
      //     }
      //   })
      // };
      profit();
      function profit() {
          let params = { version: _this.version };
          var formObject = encodeParams(params, _this.userInfo.userId, _this.userInfo.tokenId, _this.userInfo.appKey);
          _this.$ajax(_this.$api.receiveEarnings, { version: _this.version }, formObject.sign)
            .then(res => {
              if (res.code == 200) {
                _this.getHomePage();
                Toast({ message: res.msg, position: "center",duration:"1000"  });
              } else {
                Toast({ message: res.msg, position: "center",duration:"1000"  });
              }
            })
      }
    },
    signx() {
      var _this = this
      // if (!window.plus || this.source == 1) { // 如果是苹果就不弹广告，安卓必须看完广告才能领取收益
      //   profit();
      // } else {
      //   plus.bloomAd.setUserId(this.uid)
      //   plus.bloomAd.showRewardVideoAd("rv1",
      //   function(result) {
      //     if (result.event == 'onAdClose') {
      //       profit();
      //     }
      //   })
      // };
      profit();
      function profit() {
        let params = {};
        var formObject = encodeParams(params, _this.userInfo.userId, _this.userInfo.tokenId, _this.userInfo.appKey);
        _this.$ajax(_this.$api.signx, {}, formObject.sign).then(res => {
          if (res.code == 200) {
            _this.getCustInfo();
            Toast({ message: res.msg, position: "center",duration:"1000"  });
          } else {
            Toast({ message: res.msg, position: "center",duration:"1000"  });
          }
        })
      }
    },
    soonOpen() {
      Toast({ message: '暂未开放,敬请期待!', position: "center",duration:"1000"  });
    },
    onRefresh() {
      setTimeout(() => {
        this.getCustInfo();
        // this.$toast('刷新成功');
        this.isLoading = false;
      }, 500);
    },
    getCustInfo() {
      let params = {};
      var formObject = encodeParams(params, this.userInfo.userId, this.userInfo.tokenId, this.userInfo.appKey);
      this.$ajax(this.$api.getCustInfo, {}, formObject.sign).then(res => {
        if (res.code == 200) {
          this.user = res.data;
          localStorage.setItem('user', JSON.stringify(res.data))
        } else {
          Toast({ message: res.msg, position: "center",duration:"1000"  });
        }
      })
    },
    
  }
}

</script>

<style lang='less' scoped>
@import "../../assets/css/config";
// .myHeight {
// }
.my_box {
  overflow-y: auto;
  bottom: 11vw;
  height: auto;
  background-color: #FCF9FC;
}
.home_top {
  margin: 2vw 0;
  text-align: center;
  font-size: 4.5vw;
  font-weight: bold;
  letter-spacing: 1px;
}
.my_top{
  height: 52.6vw;
  overflow: hidden;
  background: url(../../assets/img/my/banner.png) no-repeat;
  background-size: cover;
  .logo{
    margin-top:10vw;
    position:relative;
    text-align: center;
    img{
      width: 17.4vw;
    }
    span:nth-of-type(1){
      position:absolute;
      top:0;
      right:36vw;
    }
    span:nth-of-type(2){
      position:absolute;
      top:5vw;
      right:33vw;
    }
    span{
      img{
        width: 10.4vw;
        height: 4.7vw;
      }
    }
  }
  p{
    margin-top:2.5vw;
    text-align: center;
    font-size:3.5vw;
    font-family:PingFang SC;
    font-weight:500;
    line-height: 3.7vw;
    color:rgba(255,255,255,1);
  }
}
.accountInfo {
  background: #1c1c1d;
  margin: 0 3vw;
  // background: -webkit-linear-gradient(left, rgb(247, 124, 75) , rgb(243, 76, 10)); /* Safari 5.1 - 6.0 */
  // background: -o-linear-gradient(right, rgb(247, 124, 75) , rgb(243, 76, 10)); /* Opera 11.1 - 12.0 */
  // background: -moz-linear-gradient(right, rgb(247, 124, 75) , rgb(243, 76, 10)); /* Firefox 3.6 - 15 */
  // background: linear-gradient(to right, rgb(247, 124, 75) , rgb(243, 76, 10)); /* 标准的语法 */
  .my_top {
    display: flex;
    align-items: center;
    padding: 4vw 7vw 5vw;
    position: relative;
    p {
      flex: 1;
      max-width: 22vw;
      height: 22vw;
      border-radius: 100%;
      overflow: hidden;
      box-shadow: 0 0 1px #f7f7f7;
      overflow: hidden;
      background-position: 50%;
      background-repeat: no-repeat;
      background-size: cover;
    }
    ol {
      margin-top: 5vw;
      flex: 1;
      margin-left: 4vw;
      line-height: 7vw;
      color: #fefefe;
      li {
        font-size: 3.2vw;
      }
      li:nth-child(4) {
        margin-top: 1vw;
        span {
          display: inline-block;
          line-height: 5.5vw;
          font-size: 3vw;
          width: 15vw;
          border-radius: 2.5vw;
          text-align: center;
        }
      }
    }
  }
}
.my_assets_info {
  // border-radius: 2vw;
  background-color: #fff;
  margin: 3vw 0;
  ol {
    display: flex;
    align-items: center;
    justify-content: space-around;
    li {
      flex: 1;
      padding: 4vw 5px;
      box-sizing: border-box;
      text-align: center;
      background-repeat: no-repeat;
      background-size: 100% 100%;
      max-width: calc(~"93vw/3");
      min-width: calc(~"93vw/3");
      p {
        font-size: 3.5vw;
        // font-weight: bold;
        color: #333;
        span {
          margin-left: 1vw;
          position: absolute;
        }
        img {
          width: 3vw;
          height: 3vw;
          margin-bottom: 2vw;
        }
      }
      > span {
        display: block;
        margin-top: 3vw;
        font-size: 4vw;
        color: #333;
      }
    }
  }
}
.my_menu {
  margin: 3vw 0;
  background-color: #fff;
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  justify-content: space-between;
  overflow: hidden;
  background-color: #fff;
  // margin-bottom: 2vw;
  margin-bottom: 1px;
  li {
    list-style:none;
    width: calc(~"(100vw - 6vw - 2px)/3");
    padding: 3.5vw 0;
    text-align: center;
    p {
      // width: 5.3vw;
      // margin: auto;
      img{
        width: 7.7vw;
        height: 7.2vw;
      }
    }
    span {
      display: block;
      color: #333;
      margin-top: 3vw;
      font-size: 3.5vw;
      // font-weight: bold;
    }
  }
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
  background-color: #fff;
  text-align: center;
}
.exit_popup_box > span {
  display: block;
  border-radius: 5px;
  margin-top: 6vw;
  font-weight: 550;
  font-size: 4.5vw;
}
.exitup{
  display: flex;
  align-content: center;
  margin-top: 10vw;
  line-height: 10vw;
  font-size: 4vw;
  justify-content: space-around;
  p{
    font-size: 4vw;
  }
}
.hint_popup {
  width: 80vw;
  background: #fff;
  border-radius: 2vw;
  ul {
    padding: 3vw 9vw;
    li:nth-child(1) {
      font-size: 3.7vw;
      color: #333333;
      font-weight: bold;
      margin-bottom: 1.5vw;
    }
    li:nth-child(2) {
      font-size: 3.2vw;
      line-height: 5vw;
      color: #333333;
    }
    li:nth-child(3) {
      text-align: right;
      font-size: 3.7vw;
      color: #58c89c;
      margin-top: 1vw;
    }
  }
}
// /deep/.van-overlay {
//   background-color: transparent !important;
// }
</style>