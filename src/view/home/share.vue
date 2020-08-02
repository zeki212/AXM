<!-- 推广二维码 -->
<template>
  <div class="popularize">
    <my-header :showBack="true" title="我的推广" :showRight="true" @rightAction="pushPath('/record')" />
    <div class="popularize_content" ref="imageTofile">
      <!-- <img src="../../assets/img/home/shabg.png" alt=""> -->
      <img src="../../assets/img/account/shijie.png" alt="">
      <!-- 推广人 -->
      <div class="populman">
        <div class="popright">
          <img :src="imgQr" alt="">
        </div>
        <div class="popleft">
          <p>
            <img src="../../assets/img/account/tui1.png" alt="">
            <span>推广人：{{user.mobile.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2')}}</span>
            <button class="copy_btn" :data-clipboard-text="url" @click="promote()">点击复制推广链接</button>
          </p>
          <!-- <p>
            <img style="width:3.6vw;height:3.6vw;" src="../../assets/img/account/tui2.png" alt="">
            <span>您的邀请码：123456</span>
          </p> -->
        </div>
      </div>
      <!-- 推广链接 -->
      <!-- <div class="puplian">
          <p>
            推广链接：
            <span>{{url}}</span>
          </p>
      </div> -->
      <!-- <div class="popularize_box">
        <img :src="imgQr" alt="">
        <p>
          <span>推广链接：{{url}}</span>
          <span class="copy_btn" :data-clipboard-text="url" @click="promote()">
            <img src="../../assets/img/home/fuzhi.png" alt="">
          </span>
        </p>
      </div> -->
    </div>
  </div>
</template>

<script>
import qrcode from "qrcode";
import ClipboardJS from 'Clipboard'
import { Toast } from "vant";
// import html2canvas from 'html2canvas'
import { Indicator } from "mint-ui";
export default {
  data() {
    return {
      url: '',
      imgQr: '',
      user:JSON.parse(localStorage.getItem("userInfo")),
      userInfo: JSON.parse(localStorage.getItem("userInfo")),
    };
  },
  watch: {
  },
  mounted() {
    this.url = `${this.$api.webUrl}/#/reg/${JSON.parse(localStorage.getItem('userInfo')).mobile}`
    this.createQr();
  },
  methods: {
    createQr() {
      var opts = {
        errorCorrectionLevel: "H",
        type: "image/png",
        rendererOpts: {
          quality: 0.3
        }
        // color: {dark: '#fff', light: '#3f52b4'}
      };

      qrcode.toDataURL(
        this.url,
        opts,
        (err, url) => {
          if (err) throw err;
          // console.log(url);
          this.imgQr = url;
        }
      );
    },
    promote() {
      if (this.url != "") {
        const clipboard = new ClipboardJS('.copy_btn');
        clipboard.on('success', function (e) {
          e.clearSelection();
          Toast({
            message: "复制成功!",
            position: "center",
            duration:"1000" 
          });
        });
        clipboard.on('error', function (e) {
          Toast({
            message: "复制失败,请升级浏览器!",
            position: "center",
            duration:"1000" 
          });
        });
      }
    }
  }
}

</script>
<style lang='less' scoped>
@import "../../assets/css/config";
.popularize {
  // height: auto;
  overflow-y: auto;
  background: #fff;
  .popularize_content {
    // background-image: url("../../assets/img/my/bg@2x.png");
    // background-size: 100% 100%;
    // background-repeat: no-repeat;
    height: auto;
    text-align: center;
    >img{
      width: 95vw;
      height: 112vw;
      margin-bottom:6.4vw;
    }
    .populman{
      width: 90vw;
      height: 16.8vw;
      display: flex;
      margin:0 auto;
      align-items: center;
      margin-bottom:6vw;
      justify-content: space-between;
      .popleft{
        margin-left:5vw;
        p{
          text-align: left;
          span{
            // width:248px;
            // height:23px;
            font-size:4vw;
            font-family:PingFang SC;
            font-weight:500;
            color:rgba(51,51,51,1);
            // line-height:12px;
          }
          img{
            width: 3.9vw;
            height: 2.9vw;
            margin-right:2vw;
          }
          button{
            border:0;
            margin-top:6vw;
            padding:1.5vw;
            color:#fff;
            font-size: 3vw;
            background-color: #FF5028;
            border-radius: 2vw;
          }
        }
      }
      .popright{
        img{
          width: 28.8vw;
          height: 28.8vw;
        }
      }
    }
    .puplian{
      p{
        // width:501px;
        // height:26px;
        padding:0 1vw;
        font-size:2.4vw;
        font-family:PingFang SC;
        font-weight:500;
        color:rgba(51,51,51,1);
        button{
          height:6vw;
          color:#fff;
          border:0;
          background:#D7D7D7;
          border-radius:1vw;
        }
      }
    }
  }
  // @media only screen and (device-width: 375px) and (device-height: 812px) and (-webkit-device-pixel-ratio: 3) {
  //   .popularize_content {
  //     background-image: url("../../assets/imgs/my/yaoqing3.png")!important;
  //   }
  // }
  .popularize_box {
    width: 100%;
    // padding: 0 5vw;
    position: absolute;
    top: 138vw;
    left: 0;
    text-align: center;
    >img {
      width: 30vw;
      height: 30vw;
    }
    >p {
      color: #389938;
      width: 96vw;
      margin: 0 auto;
      font-size: 3.2vw;
      font-weight: bold;
      >span:nth-child(1) {
        display: inline-block;
        // width: 96vw;
        word-break:break-all;
      }
      img {
        width: 4vw;
        height: 4vw;
        margin-left: 1vw;
      }
    }
  }
}
</style>