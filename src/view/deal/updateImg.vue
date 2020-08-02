<template>
  <div>
    <my-header class="headerS" :showBack="true" title="上传收款信息" />
    <!-- 信息 -->
    <div class="content">
      <ul>
        <li>
          <p>手机号</p>
          <input type="text" v-model="mobile" disabled placeholder="输入手机号" />
        </li>
        <li v-show="show">
          <p>验证码</p>
          <input type="text" maxlength="4" v-model="msgVerCode" placeholder="输入验证码" />
          <span
            v-if="!sendDisabled"
            style="right: 5vw;color:#EE281C;font-size: 3vw"
            @click="getSmsCode"
          >获取验证码</span>
          <span v-if="sendDisabled" style="right: 5vw;color:#EE281C;font-size: 3vw">{{time}}s</span>
        </li>
        <li>
          <p>支付宝账号</p>
          <input type="text" v-model="alipayAccount" placeholder="输入您的账号" />
        </li>
        <li>
          <p>上传收款码</p>
          <div v-if="fileimg||!show" class="former">
            <p @click="showTradingImg(fileimg)"><img :src="fileimg" alt=""></p>
          </div>
          <div v-else>
            <label for="uploadImg1" class="img_box">
              <p v-if="imageUrl" id="imgBox1">
                <img :src="imageUrl" alt />
              </p>
              <div class="imgBoxs" v-if="!imageUrl">
                <img src="../../assets/img/deal/jia.png" alt />
              </div>
              <input type="file" @change="addImg" accept="image/*" ref="fileInfo" id="uploadImg1" />
            </label>
          </div>
        </li>
        <li v-show="show">
          <button @click="bindAlipayCode">确认</button>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import { Toast, ImagePreview } from "vant";
export default {
  data() {
    return {
      time: 60, // 发送验证码倒计时
      sendDisabled: false,
      // 上传图片文件
      file: "",
      file1: "",
      fileimg:'',
      myInfo: "",
      msgVerCode: "",
      user: "",
      imageUrl: "",
      alipayAccount: "",
      realname: "",
      show: false,
      bindInfo: "",
      mobile: JSON.parse(localStorage.getItem("phone")),
      source: this.$information.source,
      version: this.$information.VERSION,
      userInfo: JSON.parse(localStorage.getItem("userInfo")),
    };
  },
  created() {
    this.getCustInfo();
    this.getBindUserInfo();
  },
  mounted() {},
  methods: {
    // 点击图片，放大显示
    showTradingImg(voucherImg) {
      let arr = [];
      arr.push(voucherImg);
      ImagePreview(arr);
    },
    getCustInfo() {
      let params = {};
      var formObject = encodeParams(
        params,
        this.userInfo.userId,
        this.userInfo.tokenId,
        this.userInfo.appKey
      );
      this.$ajax(this.$api.getCustInfo, {}, formObject.sign).then((res) => {
        if (res.code == 200) {
          this.myInfo = res.data;
          // if (res.data.primaryAuthStatus == 1) {
          //   this.user = res.data;
          //   this.idNo = res.data.idNo;
          //   this.name = res.data.realName;
          //   this.disabled = true;
          // }
          // if (res.data.primaryAuthStatus == 0) {
          //   this.user = res.data;
          //   this.idNo = res.data.idNo;
          //   this.name = res.data.realName;
          // }
        } else {
          Toast({ message: res.msg, position: "center", duration: "1000" });
        }
      });
    },
    // 发送验证码
    getSmsCode() {
      this.$ajax(this.$api.sms, { mobile: this.mobile, msgType: "4" }).then(
        (res) => {
          if (res.code == 200) {
            Toast({ message: res.msg, position: "center", duration: "1000" });
            //倒计时
            let vm = this;
            vm.sendDisabled = true;
            let interval = window.setInterval(function () {
              if (vm.time-- <= 0) {
                vm.time = 60;
                vm.sendDisabled = false;
                window.clearInterval(interval);
              }
            }, 1000);
          } else {
            Toast({ message: res.msg, position: "center", duration: "1000" });
          }
        }
      );
    },
    // 上传截图
    getObjectURL(file) {
      let url = null;
      if (window.createObjectURL != undefined) {
        // basic
        url = window.createObjectURL(file);
      } else if (window.URL != undefined) {
        // mozilla(firefox)
        url = window.URL.createObjectURL(file);
      } else if (window.webkitURL != undefined) {
        // webkit or chrome
        url = window.webkitURL.createObjectURL(file);
      }
      return url;
    },
    // 上传截图
    addImg() {
      // console.log(this.$refs.fileInfo.files[0]);
      let refDom = fileInfo;
      let fileInfo = this.$refs.fileInfo.files[0];
      let fileSize = parseFloat(
        parseInt(fileInfo["size"]) / 1024 / 1024
      ).toFixed(2);
      if (fileSize > 18) {
        Toast({ message: "上传图片过大!", position: "bottom" });
        return;
      }
      // this.$refs[refDom].value = '';
      if (fileInfo) {
        let vm = this,
          a = new FileReader();
        a.onload = function (e) {
          vm.imageUrl = e.target.result;
        };
        a.readAsDataURL(fileInfo);
        vm.statesw = "2";
        let objUrl = this.getObjectURL(fileInfo);
        // this.$refs.img.src = objUrl;
        const baseUrl = vm.$api.baseURL;
        let userId = vm.userInfo.userId;
        let tokenId = vm.userInfo.tokenId;
        let appKey = vm.userInfo.appKey;
        let params = {
          type: 3,
          version: vm.version,
          file: fileInfo,
          source: vm.source,
        };
        var formObject = encodeParams(params, userId, tokenId, appKey);
        var formData = new FormData();
        formData.append("file", fileInfo);
        formData.append("type", "3");
        formData.append("version", vm.version);
        formData.append("source", vm.source);
        $.ajax({
          url: "https://api.yuediankeji.com/api/anon/uploadPhoto",
          type: "post",
          data: formData,
          cache: false,
          processData: false,
          contentType: false,
          beforeSend: function (xhr) {
            xhr.setRequestHeader("sign", formObject.sign);
            xhr.setRequestHeader("userId", userId);
            xhr.setRequestHeader("tokenid", tokenId);
          },
          success: function (res) {
            if (res.code == 200) {
              // Toast({ message: '已上传图片,请点击付款按钮!', position: "bottom" });
              // item.imgs = res.data.imageUrl
              vm.file1 = res.data.imageUrl;
            }
            // Indicator.close();
          },
          error: function (e) {
            Toast({ message: e.msg, position: "bottom" });
            // Indicator.close();
            // errorState(e);
            // reject(e);
          },
          complete: function () {
            vm.statesw = "1";
          },
        });
      }
    },
    // 提交
    bindAlipayCode() {
      if (!this.msgVerCode) {
        Toast({
          message: "请输入验证码！",
          position: "center",
          duration: "1000",
        });
        return;
      }
      if (!this.alipayAccount) {
        Toast({
          message: "请输入支付宝账户！",
          position: "center",
          duration: "1000",
        });
        return;
      }
      if (!this.imageUrl) {
        Toast({
          message: "请上传收款码!",
          position: "center",
          duration: "1000",
        });
        return;
      }
      let params = {
        version: this.version,
        account: this.alipayAccount,
        imageUrl: this.file1,
        msgVerCode: this.msgVerCode,
      };
      var formObject = encodeParams(
        params,
        this.userInfo.userId,
        this.userInfo.tokenId,
        this.userInfo.appKey
      );
      this.$ajax(
        this.$api.bindAlipayCode,
        {
          version: this.version,
          account: this.alipayAccount,
          imageUrl: this.file1,
          msgVerCode: this.msgVerCode,
        },
        formObject.sign
      ).then((res) => {
        if (res.code == 200) {
          // this.myInfo = res.data;
          this.getBindUserInfo();
          Toast({ message: res.msg, position: "center", duration: "1000" });
        } else {
          Toast({ message: res.msg, position: "center", duration: "1000" });
        }
      });
    },
    // 支付绑定状态
    getBindUserInfo() {
      let params = {};
      var formObject = encodeParams(
        params,
        this.userInfo.userId,
        this.userInfo.tokenId,
        this.userInfo.appKey
      );
      this.$ajax(this.$api.getBindUserInfo, {}, formObject.sign).then((res) => {
        if (res.code == "200") {
          if (res.data) {
            this.alipayAccount = res.data.alipayAccount;
            this.imageUrl = res.data.alipayCode;
            this.fileimg = res.data.alipayCode;
            if (!res.data.alipayCode) {
              this.show = true;
            }
          } else {
            Toast({ message: res.msg, position: "bottom" });
          }
        }
      });
    },
  },
};
</script>

<style lang="less" scoped>
.content {
  width: 100vw;
  ul {
    width: 95vw;
    margin: 0 auto;
    li {
      height: 20vw;
      position: relative;
      border-top: 1px solid rgba(229, 229, 229, 1);
      > p {
        // height:25px;
        font-size: 3.8vw;
        font-family: PingFang SC;
        font-weight: bold;
        margin: 3vw auto;
        color: rgba(51, 51, 51, 1);
      }
      > input {
        width: 100%;
        height: 8vw;
        border: 0;
      }
      > span {
        position: absolute;
        top: 13vw;
        right: 2vw;
        font-size: 3.5vw;
        font-family: PingFang SC;
        font-weight: 400;
        color: rgba(238, 40, 28, 1);
      }
      div {
        width: 50vw;
        height: 65vw;
        line-height: 65vw;
        margin: 6vw auto;
        text-align: center;
        background: rgba(245, 245, 245, 1);
        border-radius: 2vw;
        .img_box {
          display: block;
          align-items: center;
          width: 100%;
          height: 100%;
          overflow: hidden;
          position: relative;
          // margin-right: 10px;
          &:nth-child(3) {
            margin-right: 0;
          }
          #imgBox1 {
            width: 99%;
            height: 99%;
            margin: 0;
            display: flex;
            justify-content: center;
            align-items: center;
            border: 1px dashed #8e8e8e;
            border-radius: 3vw;
            background-color: #fff;
            img {
              width: auto;
              max-width: 100%;
              max-height: 100%;
              margin: auto;
              display: block;
            }
          }
          .imgBoxs {
            margin: 0;
            p {
              img {
                // width: 30%;
              }
            }
          }
          input {
            display: none;
          }
          div {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            display: flex;
            justify-content: center;
            align-items: center;

            img {
              margin: auto;
              display: block;
            }
            span {
              display: block;
              margin-top: 10px;
            }
          }
        }
        img {
          width: 8vw;
          margin: 0;
        }
      }
      .former {
        width: 50vw;
        height: 65vw;
        // margin: 15px 13vw 0;
        text-align: center;
        p {
          width: 100%;
          height: 100% !important;
          margin: 0;
          display: flex;
          justify-content: center;
          background-color: #fff;
          align-items: center;
          border: 1px dashed #8e8e8e;
          border-radius: 3vw;
        }
        img {
          width: auto;
          max-width: 100%;
          max-height: 100%;
          // margin: auto;
          display: block;
        }
      }
      button {
        width: 100%;
        height: 10vw;
        font-size: 3.5vw;
        font-family: PingFang SC;
        font-weight: bold;
        border: 0;
        color: rgba(255, 255, 255, 1);
        background: rgba(238, 40, 28, 1);
        border-radius: 1vw;
      }
    }
    li:nth-of-type(3) {
      border-bottom: 1px solid rgba(229, 229, 229, 1);
    }
    li:nth-of-type(4) {
      height: 85vw;
    }
    li:nth-of-type(5) {
      height: 0vw;
    }
  }
}
/* WebKit browsers */
input::-webkit-input-placeholder {
  color: #999999;
  font-size: 3.5vw;
}
/* Mozilla Firefox 4 to 18 */
input:-moz-placeholder {
  color: #999999;
  opacity: 1;
  font-size: 3.5vw;
}
/* Mozilla Firefox 19+ */
input::-moz-placeholder {
  color: #999999;
  opacity: 1;
  font-size: 3.5vw;
}
/* Internet Explorer 10+ */
input:-ms-input-placeholder {
  color: #999999;
  font-size: 3.5vw;
}
</style>