<!-- 首页 -->
<template>
  <div class="home">
    <!-- 头部 -->
    <van-pull-refresh v-model="isLoading" class="myHeight" @refresh="onRefresh">
      <div class="home_top">首页</div>
      <div class="home_notice">
        <img src="../../assets/img/home/banner.png" alt />
      </div>
      <!-- 导航 -->
      <div class="home_menu" @click="pushPath('/announcement')">
        <img src="../../assets/img/home/fire.png" alt />
        <marquee behavior direction="bottom">
          <div class="notices">{{newTitle}}</div>
        </marquee>
      </div>
      <div class="my_menu">
        <ol>
          <li @click="linkHerf">
            <p>
              <img src="../../assets/img/home/icon1.png" alt />
            </p>
            <span>充币</span>
          </li>
          <li @click="pushPath('/extract')">
            <p>
              <img src="../../assets/img/home/icon2.png" alt />
            </p>
            <span>提币</span>
          </li>
          <!-- <li @click="pushPath('/share')"> -->
          <li @click="pushPath('/transfer')">
            <p>
              <img src="../../assets/img/home/icon3.png" alt />
            </p>
            <span>划转</span>
          </li>
          <!-- <li @click="demes()"> -->
          <!-- <li @click="pushPath('/rush')"> -->
          <li @click="Over">
            <p>
              <img src="../../assets/img/home/icon4.png" alt />
            </p>
            <span>抢购</span>
          </li>
        </ol>
        <ol>
            <!-- <li @click="pushPath('/cityAgent')"> -->
            <li @click="soonOpen">
            <p>
              <img src="../../assets/img/home/icon5.png" alt />
            </p>
            <span>服务商</span>
          </li>
          <li @click="pushPath('/service')">
            <!-- <li @click="pushPath('/service')"> -->
            <p>
              <img src="../../assets/img/home/icon6.png" alt />
            </p>
            <span>商学院</span>
          </li>
          <li @click="pushPath('/publicity')">
            <!-- <li @click="pushPath('/publicity')"> -->
            <!-- <li @click="soonOpen()"> -->
            <p>
              <img src="../../assets/img/home/icon7.png" alt />
            </p>
            <span>公益资讯</span>
          </li>
          <li @click="Over">
            <!-- <li @click="pushPath('/browser')"> -->
            <p>
              <img src="../../assets/img/home/icon8.png" alt />
            </p>
            <span>慈善帮助</span>
          </li>
        </ol>
      </div>
      <div style="height:2vw;background:rgba(242,243,249,1);"></div>
      <!-- 主流币行情 -->
      <div class="currency">
        <div class="up">
          <span></span>
          <h3>主流币行情</h3>
        </div>
        <div class="down">
          <div class="title">
            <span>名称</span>
            <span>最新价</span>
            <span>涨跌幅</span>
          </div>
          <ul v-if="this.list.length>0">
            <li v-for="(item,index) in list" :key="index">
              <p>
                <!-- <img :src="item.icon" alt=""> -->
                <span>{{item.code}}<em style="fontSize:3vw;fontWeight:500;color:#999999;">/CNY</em></span>
              </p>
              <p>{{item.price}}</p>
              <p>
                <button v-if="item.chg<0"  style="backgroundColor:#d14b64;">{{item.chg}}</button>
                <button v-else>{{item.chg}}</button>
              </p>
            </li>
          </ul>
          <div v-else class="wu">暂无内容！</div>
        </div>
      </div>
      <van-popup class="popup_box" v-model="noticePopups" :close-on-click-overlay="cliSwitch" @click-overlay="clkOver()">
        <div class="notice_popup_box">
          <!-- <p v-text="textS"></p> -->
        </div>
        <div class="common_btns">
          <div style="width:100%;height:28vw;"></div>
          <van-button type="primary" :class="{conceals:forced==1}" size="large" @click="downloadLink()">立即更新</van-button>
          <van-button type="primary" :disabled="disabled" :class="{conceal:forced==1}" size="large" @click="clkOver()">取消</van-button>
        </div>
      </van-popup>
      <!-- 交易功能添加弹框 -->
      <van-popup v-model="show">
        <div class="pop">
          <img src="../../assets/img/home/kao2.png" alt="">
          <span>公告</span>
          <div class="textpop">
            <p>&nbsp;&nbsp;&nbsp;&nbsp;{{popupNotice}}</p>
            <button @click="closepop">好的</button>
          </div>
        </div>
      </van-popup>
    </van-pull-refresh>
  </div>
</template>

<script>
import { Toast, Dialog, Progress, Popup } from "vant";
import informations from "../../assets/js/prams"; // 获取当前设备

export default {
  components: {},
  data() {
    return {
      show:false,
      bgColor:"red",
      isActive:false,
      userInfo: JSON.parse(localStorage.getItem("userInfo")),
      version: this.$information.VERSION,
      textS: "是否立即更新新版本?",
      forced: "",
      pkgUrl: "",
      disabled:false,
      cliSwitch: true,
      isLoading: false,
      noticePopups: false,
      homes: "",
      popupNotice:'',
      newTitle:"",
      noticeList: "",
      uid: JSON.parse(localStorage.getItem("userInfo")).userId,
      source: informations.source,
      type: "",
      list:JSON.parse(sessionStorage.getItem("list")) || []
    };
  },
  computed: {},
  watch: {
    $route(val, oldval) {
      if (val.fullPath.indexOf("?") == -1) {
        this.noticePopups = false;
      }
    }
  },
  created() {
    this.getCustInfo();
    this.getHomePage();
    // 获取行情
    if(this.list.length<1){
      this.getHomePriceList();
    }
    if (this.$route.fullPath.indexOf("?") != -1) {
      this.goBack();
    }
    this.$store.commit("updateNeedShowFooter", true);
    this.$store.commit("updateSelected", 0);
  },
  mounted() {
    this.getNoticeList();
    // this.versionUpdate(); // APP版本更新 H5打包需要注释此行代码
    if (this.homes == "") {
      this.homes = JSON.parse(localStorage.getItem("homes"));
    }
    setTimeout(() => {
      if (this.popupNotice) {
        if(sessionStorage.getItem('shownum') || sessionStorage.getItem('shownum')>1){
          this.show = false;
        }else{
          this.show = true;
          var shownum = 1;
          shownum++;
          sessionStorage.setItem('shownum',shownum);
        }
      }else{
        this.show = false;
      }
    }, 1000);
    if (this.noticeList == "") {
      this.noticeList = JSON.parse(localStorage.getItem("noticeList"));
    }
  },
  methods: {
    // 关闭弹窗公告
    closepop(){
      this.show = false;
    },
    // 获取最新公告
    getNoticeList() {
      let params = { version: this.version,type: '1' };
      var formObject = encodeParams(params, this.userInfo.userId, this.userInfo.tokenId, this.userInfo.appKey);
      this.$ajax(this.$api.getNoticeList, { version: this.version,type: '1' }, formObject)
        .then(res => {
          if (res.code == 200) {
            if (res.data.length>0) {
              this.newTitle = res.data[0].title;
            }
          } else {
            Toast({ message: res.msg, position: "center",duration:"1000"  });
          }
        })
    },
    // 敬请期待
    Over(){
      Toast({ message:"暂未开放，敬请期待！", position: "center",duration:"1000"  });
    },
    demes() {
      window.location.href =
        "https://www.yitaifang.com/tokens/0xcb0fa6b496e79290be1e79a89344f16a81af3faa";
    },
    // 首页数据
    getHomePage() {
      let params = { userId: this.userInfo.userId };
      var formObject = encodeParams(
        params,
        this.userInfo.userId,
        this.userInfo.tokenId,
        this.userInfo.appKey
      );
      this.$ajax(this.$api.getHomePage, params, formObject.sign).then(res => {
        if (res.code == 200) {
          this.homes = res.data;
          if(res.data.popupNotice){
            this.popupNotice = res.data.popupNotice;
          }
          localStorage.setItem("homes", JSON.stringify(res.data));
          if (res.data.noticeList) {
            this.noticeList = res.data.noticeList;
            localStorage.setItem(
              "noticeList",
              JSON.stringify(res.data.noticeList)
            );
          }
        } else {
          Toast({ message: res.msg, position: "center",duration:"1000"  });
        }
      });
    },
    // 获取行情
    getHomePriceList() {
      this.$ajax(this.$api.getHomePriceList).then(res => {
        if (res.code == 200) {
          // console.log(res.data);
          this.list = res.data.list;
          sessionStorage.list = JSON.stringify(res.data.list);
        } else {
          Toast({ message: res.msg, position: "center",duration:"1000"  });
        }
      });
    },
    downloadLink() {
      location.href = this.pkgUrl;
      Toast({ message: "更新后,请退出重新打开APP!", position: "center",duration:"1000"  });
    },
    clkOver() {
      if (this.forced == 0) {
        this.goBack();
        this.noticePopups = false;
      }
    },
    onRefresh() {
      setTimeout(() => {
        this.getHomePage();
        this.getHomePriceList();
        // this.$toast('刷新成功');
        this.isLoading = false;
      }, 500);
    },
    versionUpdate() {
      var u = navigator.userAgent;
      var isAndroid = u.indexOf("Android") > -1 || u.indexOf("Adr") > -1; //android终端
      var isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios终端
      var source;
      if (isiOS) {
        source = 1;
      }
      if (isAndroid) {
        source = 2;
      }
      const baseUrl = this.$api.baseURL;
      const _this = this;
      let userId = this.userInfo.userId;
      let tokenId = this.userInfo.tokenId;
      let appKey = this.userInfo.appKey;
      let params = {
        source: source,
        version: this.version
      };
      var formObject = encodeParams(params, userId, tokenId, appKey);
      $.ajax({
        type: "post",
        url: baseUrl + "/api/anon/app/getNewVersion",
        data: {
          source: params.source,
          version: params.version
        },
        beforeSend: function(xhr) {
          xhr.setRequestHeader("sign", formObject.sign);
          xhr.setRequestHeader("userId", userId);
          xhr.setRequestHeader("tokenid", tokenId);
        },
        success: function(data) {
          if (data.code == 200) {
            if (data.data.pkgUrl) {
              if (!sessionStorage.getItem("noticePopups")) {
                if (data.data.version != _this.version) {
                  _this.pkgUrl = data.data.pkgUrl;
                  _this.forced = data.data.forced;
                  if (window.location.href.indexOf("?noticePopups") == -1) {
                    window.location.href =
                      window.location.href + "?noticePopups";
                  }
                  if (_this.forced == 1) {
                    _this.cliSwitch = false;
                    _this.disabled = true;
                    _this.textS = "请更新新版本！";
                  }
                  _this.noticePopups = true;
                }
                sessionStorage.setItem("noticePopups", "true");
              }
            }
          }
        },
        error: function(data) {}
      });
    },
    soonOpen() {
      Toast({ message: "暂未开放,敬请期待!", position: "center",duration:"1000"  });
    },
    // 一键领取this
    activeGet() {
      var _this = this;
      // if (!window.plus || this.source == 1) { // 如果是苹果或者H5就不弹广告，安卓必须看完广告才能领取收益
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
        var formObject = encodeParams(
          params,
          _this.userInfo.userId,
          _this.userInfo.tokenId,
          _this.userInfo.appKey
        );
        _this
          .$ajax(
            _this.$api.receiveEarnings,
            { version: _this.version },
            formObject.sign
          )
          .then(res => {
            if (res.code == 200) {
              _this.getHomePage();
              Toast({ message: res.msg, position: "center",duration:"1000"  });
            } else {
              Toast({ message: res.msg, position: "center",duration:"1000"  });
            }
          });
      }
    },
    getCustInfo() {
      let params = {};
      var formObject = encodeParams(
        params,
        this.userInfo.userId,
        this.userInfo.tokenId,
        this.userInfo.appKey
      );
      this.$ajax(this.$api.getCustInfo, {}, formObject.sign).then(res => {
        if (res.code == 200) {
          this.type = res.data.type;
          localStorage.setItem("user", JSON.stringify(res.data));
        } else {
          Toast({ message: res.msg, position: "center",duration:"1000"  });
        }
      });
    },
    // 暂时只对服务商开放！ type ：1
    linkHerf() {
      // if (this.type == 1) {
        this.$router.push("/topUp");
      // } else {
      //   Toast({ message: '暂时只对服务商开放！', position: "center",duration:"1000"  });
      // }
    }
  }
};
</script>
<style lang='less' scoped>
@import "../../assets/css/config";
.conceal {
  display: none !important;
}
.van-cell, .van-cell-group, .van-popup{
  background-color: transparent;
}
.van-popup--center{
  top:40%;
}
.notices {
  color: #333;
  display: inline-block;
  // width: 33vw;
  padding-right: 80vw;
}
.notices:last-child {
  padding-right: 0 !important;
}
.notices {
  display: inline-block;
  // width: 33vw;
  padding-right: 80vw;
}
.notices:last-child {
  padding-right: 0 !important;
}
marquee {
  width: 59vw;
  display: inline-block;
  color: #fff;
  font-size: 3.5vw;
  line-height: 4.5vw;
  margin: 0 4vw;
}
.conceals {
  width: 45% !important;
  margin: 0 !important;
}
.pop{
  width: 80vw;
  // height: 50vw;
  position:relative;
  background-color:transparent;
  img{
    width: 100%;
  }
  >span{
    // width:72px;
    // height:34px;
    position:absolute;
    top: 30vw;
    left: 38vw;
    font-size:3.6vw;
    font-family:PingFang SC;
    font-weight:bold;
    color:rgba(51,51,51,1);
    // line-height:106px;
  }
  .textpop{
    width: 79vw;
    margin-left: 2px;
    background-color: #fff;
    p{
      width: 55vw;
      font-size:3vw;
      margin-left:12vw;
      font-family:PingFang SC;
      font-weight:bold;
      letter-spacing: 2px;
      color:rgba(101,101,101,1);
      line-height:7vw;
    }
    button{
      width:55vw;
      height:7vw;
      border:0;
      margin:5vw auto;
      margin-left:13vw;
      font-size:3vw;
      font-family:PingFang SC;
      font-weight:bold;
      color:rgba(255,255,255,1);
      color:#fff;
      background:rgba(237,49,31,1);
      border-radius:3.5vw;
    }
  }
}
.popup_box {
  width: 70vw;
  height: 49vw;
  border-radius: 12px;
  background: url(../../assets/img/home/popup.png) no-repeat;
  background-size: cover;
  // background-color: #fbfbfb;
  overflow: visible;
  .notice_popup_box {
    p {
      margin-top: 5vw;
      color: #fff;
      font-weight: bold;
      font-size: 4vw;
      width: 100%;
      // text-align: center;
    }
  }
  .common_btns {
    width: 100%;
    margin-top: 8vw;
    text-align: center;
    > .van-button--primary {
      background: -webkit-linear-gradient(
        #FF6729,
        #FF3527
      ) !important; /* Safari 5.1 - 6.0 */
      background: -o-linear-gradient(
        #FF6729,
        #FF3527
      ) !important; /* Opera 11.1 - 12.0 */
      background: -moz-linear-gradient(
        #FF6729,
        #FF3527
      ) !important; /* Firefox 3.6 - 15 */
      background: linear-gradient( #FF6729,#FF3527) !important; /* 标准的语法 */
      border-radius: 3vw;
      width: 35%;
      margin: 0 3%;
      // margin-top:40%;
      display: inline-block;
      height: 9vw;
      line-height: 8vw;
    }
  }
}
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
// .myHeight {
// margin-bottom: 11vw;
// height: auto;
// overflow-y: auto;
// }
.succeed {
  background-color: transparent;
  p {
    position: relative;
    span {
      text-align: center;
      position: absolute;
      left: 14vw;
      top: 18vw;
      color: #fc890e;
      font-weight: bold;
      letter-spacing: 1px;
      font-size: 3.5vw;
    }
  }
}
.textS {
  width: 70vw;
  overflow: visible;
  border-radius: 3vw;
  border-top: 1px solid #00b59b;
  // background: url("../../assets/imgs/home/pop1.png");
  // background-size: 100% 100%;
  // background-position: center center;
  ul {
    text-align: center;
    // padding: 8vw 10vw;
    li:nth-child(1) {
      img {
        position: relative;
        top: -6vw;
        left: -18vw;
        width: 120%;
      }
      span {
        position: absolute;
        top: 2vw;
        left: 32vw;
        color: #00b59b;
        font-weight: bold;
        font-size: 4.5vw;
      }
    }
    li:nth-child(2) {
      text-indent: 5vw;
      font-size: 3.5vw;
      padding: 0 5vw;
      line-height: 6.5vw;
    }
    li:nth-child(3) {
      img {
        position: relative;
        bottom: -6vw;
        left: -7.2vw;
        width: 121%;
      }
      .butS {
        position: absolute;
        left: 18vw;
        bottom: 4vw;
        background: #ffffff;
        color: #00b59b;
        height: 9vw;
        line-height: 8vw;
        width: 35vw;
        text-align: center;
        border-radius: 30vw;
        > span {
          font-size: 3.5vw;
        }
      }
    }
  }
}
.details_popup {
  border-radius: 10px;
  width: 42vw;
  overflow: visible;
}
.affiche {
  padding: 5vw 3vw;
  position: relative;
  li:nth-child(1) {
    font-weight: bold;
    text-align: center;
    letter-spacing: 1px;
    margin-bottom: 10px;
    font-size: 3.5vw;
    color: #00b59b;
  }
  li:nth-child(2) {
    text-align: center;
  }
}
.buleS {
  background: -webkit-linear-gradient(
    #00b573,
    #00c2d5
  ) !important; /* Safari 5.1 - 6.0 */
  background: -o-linear-gradient(
    #00b573,
    #00c2d5
  ) !important; /* Opera 11.1 - 12.0 */
  background: -moz-linear-gradient(
    #00b573,
    #00c2d5
  ) !important; /* Firefox 3.6 - 15 */
  background: linear-gradient(#00b573, #2ccad8) !important; /* 标准的语法 */
  height: 8vw;
  line-height: 7vw;
  width: 30vw;
  text-align: center;
  border-radius: 30vw;
  position: absolute;
  bottom: -2vh;
  left: 6vw;
  > span {
    font-size: 3.5vw;
  }
}
.home {
  overflow-y: auto;
  bottom: 11vw;
  height: auto;
}
// 头部
.home_top {
  margin: 2vw 0;
  text-align: center;
  font-size: 4.5vw;
  font-weight: bold;
  letter-spacing: 1px;
}
.home_notice {
  margin: 3vw 12px;
  // background-image: url(../assets/img/home/banner.png);
  // background-repeat: no-repeat;
  // background-size:cover;
}

// 导航
.home_menu {
  margin: 0 12px;
  // background: rgba(28, 28, 29, 1);
  padding: 3vw 2vw;
  display: flex;
  align-items: center;
  // display: flex;
  // align-items: bottom;
  img {
    width: 15.6vw;
    height: 4.5vw;
    margin-right: 2.2vw;
    vertical-align: bottom;
  }
  > span:nth-child(2) {
    width:80vw;
    white-space: nowrap;
    overflow: hidden;
	  text-overflow: ellipsis;
    font-size: 3.8vw;
    font-family: Adobe Heiti Std;
    font-weight: normal;
    color: rgba(109, 111, 120, 1);
  }
}
.my_assets_info {
  // border-radius: 2vw;
  background: rgba(28, 28, 29, 1);
  margin: 3vw 12px;
  ol {
    display: flex;
    i {
      width: 1px;
      margin: 6.3vw 0;
      background: #64cfa4;
    }
    li {
      flex: 1;
      padding: 4vw 5px;
      box-sizing: border-box;
      text-align: center;
      background-repeat: no-repeat;
      background-size: 100% 100%;
      max-width: calc(~"(99vw - 24px)/4");
      min-width: calc(~"(99vw - 24px)/4");
      p {
        font-size: 3.2vw;
        // font-weight: bold;
        color: #64cfa4;
      }
      span {
        display: block;
        margin-top: 3vw;
        font-size: 3vw;
        color: #64cfa4;
      }
    }
  }
}
.van-pull-refresh {
  overflow: visible;
}
.my_assets_infos {
  // border-radius: 2vw;
  background: rgba(28, 28, 29, 1);
  margin: 0 3vw 3vw;
  ol {
    display: flex;
    i {
      width: 1px;
      margin: 6.3vw 0;
      background: #64cfa4;
    }
    li {
      flex: 1;
      padding: 4vw 5px;
      box-sizing: border-box;
      text-align: center;
      background-repeat: no-repeat;
      background-size: 100% 100%;
      max-width: calc(~"93vw/2");
      min-width: calc(~"93vw/2");
      p {
        font-size: 3.2vw;
        // font-weight: bold;
        color: #64cfa4;
      }
      span {
        display: block;
        margin-top: 3vw;
        font-size: 3vw;
        color: #64cfa4;
      }
    }
  }
}
.my_menu {
  margin: 3vw 12px;
  // background: rgba(28, 28, 29, 1);
  ol {
    overflow: hidden;
    // margin-bottom: 2vw;
    border-radius: 2vw;
    li {
      float: left;
      width: calc(~"(100vw - 24px)/4");
      padding: 3.5vw 0;
      text-align: center;
      p {
        width: 8vw;
        margin: auto;
        img {
          width: 9.4vw;
          height: 8.9vw;
        }
      }
      span {
        // display: block;
        // color: #64cfa4;
        // margin-top: 3vw;
        // font-size: 3.5vw;
        // font-weight: bold;
        // width:53px;
        // height:27px;
        font-size: 3.8vw;
        font-family: PingFang SC;
        font-weight: bold;
        color: rgba(116, 116, 116, 1);
        // line-height:23px;
      }
    }
  }
}
.van-button__text {
  font-size: 3.5vw;
}
.notices {
  display: inline-block;
  // width: 33vw;
  padding-right: 80vw;
}
.notices:last-child {
  padding-right: 0 !important;
}
.notices {
  display: inline-block;
  // width: 33vw;
  padding-right: 80vw;
}
.notices:last-child {
  padding-right: 0 !important;
}
marquee {
  width: 59vw;
  display: inline-block;
  color: #fff;
  font-size: 3.5vw;
  line-height: 4.5vw;
  margin: 0 4vw;
}
.currency {
  overflow: hidden;
  .up {
    margin: 3vw 12px;
    span {
      display: block;
      width: 1.4vw;
      height: 4.7vw;
      float: left;
      margin-right: 1vw;
      background: rgba(236, 43, 24, 1);
      border: 2px solid rgba(255, 255, 255, 1);
      border-radius: 2px;
    }
    h3 {
      // width:148px;
      // height:29px;
      font-size: 3.5vw;
      font-family: PingFang SC;
      color: rgba(0, 0, 0, 1);
      line-height: 6vw;
    }
  }
  .down{
    width: 90vw;
    // height: 50vw;
    padding:3vw;
    // background-color: pink;
    margin:0 auto;
    .title{
      color:#333;
      font-size: 4vw;
      display: flex;
      align-content: center;
      justify-content: space-between;
      padding-bottom:3vw;
      font-weight: bold;
    }
    .wu{
      height: 15vw;
      font-size: 4vw;
      color: #A3A1A1;
      line-height: 15vw;
      text-align: center;
      // height: 46vh;
      // background: url(../../assets/img/home/zanwu.png) no-repeat;
      // background-size: cover;
      // background-color: #F2F3F9;
    }
    ul{
      font-size: 2vw;
      li{
        height: 10vw;
        height: 15vw;
        display: flex;
        align-items: center;
        line-height: 15vw;
        border-bottom:1px solid #E5E5E5;
        // justify-content: space-between;
        p{
          // width: 30vw;
          font-size: 4vw;
          height: 10vw;
          overflow: hidden;
          line-height: 10vw;
          text-align: left;
          img{
            width: 5vw;
            height: 5vw;
            margin-top:2.2vw;
            vertical-align: top;
          }
          span{
            font-weight: bold;
          }
          button{
            width: 15vw;
            height: 7vw;
            border:0;
            color:#fff;
            background-color: #03ad90;
            line-height: 5vw;
            border-radius: 3vw;
          }
        }
        p:nth-of-type(1){
          float:left;
          width: 38vw;
        }
        p:nth-of-type(2){
          float:left;
          width: 35vw;
          margin-right:2vw;
        }
      }
    }
  }
}
</style>
