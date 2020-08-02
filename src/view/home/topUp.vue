<template>
  <div class="mine_box">
    <my-header
      :showBack="true"
      title="充币"
      rightText="记录"
      :showRight="true"
      @rightAction="pushPath('/record')"
    />
    <div class="content">
      <!-- <div class="titles">
        <span>币种:</span>
        <van-tabs v-model="active" title-active-color='#58C89C'>
          <van-tab title="AXM"></van-tab>
          <van-tab title="钻石"></van-tab>
        </van-tabs>
      </div>-->
      <div class="myCode">
        <div @click="showTradingImg(imgQr)"><img :src="imgQr" alt /></div>
        <p class="btn1">
          <!-- <button><a :href="imgQr" @click="saveImage" download="erweima" style="color:#EE281C;">保存二维码</a></button> -->
          <button @click="showTradingImg(imgQr)">保存二维码</button>
        </p>
        <p>充值地址</p>
        <p class="copy_btn" :data-clipboard-text="url">{{url}}</p>
        <p class="btn2">
          <button id="btn_Share" @click="copy">复制</button>
        </p>
      </div>
      <div class="fonts">
        注意：
        <br />1.请勿向上述地址充值任何ERC20-USDT非资产，否则资产将不可找回。
        <br />2.您充值至上述地址后，需要整个网络节点的确认，12次网络确认后到账，12次网络确认后可提币。
        <br />3.您的充值地址不会发生改变，但是为了保证自身数字资产的安全，请每次充值来此复制地址！
      </div>
    </div>
  </div>
</template>

<script>
import ClipboardJS from "Clipboard";
import qrcode from "qrcode";
import { Toast,ImagePreview } from "vant";
import html2canvas from 'html2canvas'
export default {
  data() {
    return {
      showImg:false,
      userInfo: JSON.parse(localStorage.getItem("userInfo")),
      version: this.$information.VERSION,
      imgQr: sessionStorage.imgUrl || "",
      url: sessionStorage.url || "",
      active: 0
    };
  },
  watch: {
    active(val) {
      if (val == 0) {
        // this.type = 1
      }
      if (val == 1) {
        // this.type = 2
      }
      // this.getMinerList();
    }
  },
  created() {
    if (this.$route.fullPath.indexOf("?") != -1) {
      this.goBack();
    }
  },
  mounted() {
    this.recharge();
  },

  methods: {
    showTradingImg(imgUrl){
      ImagePreview([
        imgUrl
      ])
    },
    // 保存二维码到相册
    saveImage() {
      // Toast({message:'二维码保存成功',position:'center',duration:'1000'})
      // console.log(this.imgQr);
      if(!window.plus) return;
        plus.gallery.save(this.imgQr, function () {
        plus.nativeUI.alert("保存图片到相册成功");
      },function(){
        plus.nativeUI.alert("保存失败");
      });
    },
    // 点击复制按钮
    copy() {
      if (this.url != "") {
        var that = this;
        var clipboard = new ClipboardJS("#btn_Share", {
          text: function() {
            return that.url;
          }
        });
        clipboard.on("success", function(e) {
          Toast({
            message: "复制成功!",
            position: "center",duration:"1000" 
          });
        });
        clipboard.on("error", function(e) {
          Toast({
            message: "复制失败,请升级浏览器!",
            position: "center",duration:"1000" 
          });
        });
      }
    },
    createQr() {
      var opts = {
        errorCorrectionLevel: "H",
        type: "image/png",
        rendererOpts: {
          quality: 0.3
        }
        // color: {dark: '#fff', light: '#3f52b4'}
      };
      qrcode.toDataURL(this.url, opts, (err, url) => {
        if (err) throw err;
        this.imgQr = url;
        sessionStorage.imgUrl = url;
      });
    },
    recharge() {
      let params = {};
      var formObject = encodeParams(
        params,
        this.userInfo.userId,
        this.userInfo.tokenId,
        this.userInfo.appKey
      );
      this.$ajax(this.$api.recharge, {}, formObject.sign).then(res => {
        // console.log(res);
        if (res.code == 200) {
          this.url = res.data;
          sessionStorage.url = res.data;
          this.createQr();
        } else {
          Toast({ message: res.msg, position: "center",duration:"1000"  });
        }
      });
    }
  }
};
</script>

<style lang='less' scoped>
.titles {
  position: relative;
  margin: 0 3vw;
  background: #1c1c1d;
  font-size: 3.7vw;
  font-weight: bold;
  span {
    position: absolute;
    left: 3vw;
    z-index: 2;
    top: 50%;
    transform: translateY(-50%);
  }
  > span:nth-child(2) {
    text-align: center;
    color: #58c89c;
  }
}
.myCode {
  text-align: center;
  margin: 2vw 3vw;
  // background: #1c1c1d;
  font-size: 3vw;
  >div{
    width: 48vw;
    height: 48vw;
    margin: 10vw auto 3.6vw;
    img {
      width: 100%;
    }
  }
  .btn1 {
    button {
      width: 35vw;
      height: 8vw;
      font-size: 3.6vw;
      font-family: PingFang SC;
      font-weight: bold;
      color: rgba(238, 40, 28, 1);
      line-height: 8vw;
      background: rgba(255, 238, 236, 1);
      border: 1px solid rgba(255, 212, 216, 1);
      border-radius: 1vw;
    }
  }
  .btn2 {
    button {
      width: 20vw;
      height: 8vw;
      border: 0;
      background: rgba(240, 54, 37, 1);
      border-radius: 1vw;
      font-size: 3.6vw;
      font-family: PingFang SC;
      font-weight: bold;
      color: rgba(255, 255, 255, 1);
      line-height: 5.5vw;
    }
  }
  > p:nth-child(2) {
    font-size: 4vw;
    color: #b2b2b2;
    margin-bottom: 2.5vw;
  }
  > p:nth-child(3) {
    color: #b2b2b2;
    font-size: 3.4vw;
    padding-bottom: 3.5vw;
  }
  .copy_btn {
    // width:521px;
    // height:20px;
    font-size: 3.6vw;
    font-family: PingFang SC;
    font-weight: bold;
    color: rgba(51, 51, 51, 1);
    // line-height:106px;
    margin-bottom: 4.5vw;
  }
}
.fonts {
  margin: 3vw 7vw;
  color: #666666;
  font-size: 3vw;
  line-height: 8vw;
}
/deep/.van-tabs {
  z-index: 1;
  .van-tab {
    flex: unset;
    width: 15%;
  }
  span {
    font-size: 3.7vw;
    font-weight: 700;
  }
}
/deep/.van-tabs__nav {
  background: #1c1c1d;
  display: flex;
  flex-wrap: nowrap;
  justify-content: center;
  align-items: center;
}
/deep/.van-hairline--top-bottom:after {
  border-width: 0;
}
/deep/.van-tabs__line {
  display: none;
}
</style>