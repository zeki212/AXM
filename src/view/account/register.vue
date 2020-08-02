<template>
  <div class="register">
    <div>
      <div class="register_box">
        <p @click="pushPath('/login')">
          <img src="../../assets/img/account/left.png" alt="">
        </p>
        <div class="logo">
          <p style="color:#333333;fontSize:6vw;lineHeight:10vw;">嗨，欢迎来到AXM</p>
          <p>加入爱的大家庭</p>
        </div>
        <ol class="account_box">
          <!-- <li class="van-hairline--bottom" @click="pushPath('/selectCity')">
            <span><img src="../../assets/img/account/city.png" alt=""></span>
            <p><input type="text" v-model.trim="cityName" disabled placeholder="请选择注册城市"></p>
          </li> -->
          <p>手机号</p>
          <li class="van-hairline--bottom" style="padding: 2vh 5px 1vh;">
            <!-- <span><img src="../../assets/img/account/phone.png" alt=""></span> -->
            <p><input maxlength="11" type="text" v-model.trim="phone" placeholder="手机号"></p>
          </li>
          <p>图片验证码</p>
          <li class="van-hairline--bottom" ref="loginBox">
            <!-- <span><img src="../../assets/img/account/code.png" alt=""></span> -->
            <p><input type="text" v-model.trim="imageCode" placeholder="请输入图片验证码"></p>
            <span @click="getRegisterCode">
              <img :src="image" alt="">
            </span>
          </li>
          <!-- <div v-show="phone.length==11" id="captcha" class="captchas"></div> -->
          <p>短信验证码</p>
          <li class="van-hairline--bottom" ref="loginBox">
            <!-- <span><img src="../../assets/img/account/code.png" alt=""></span> -->
            <p><input type="text" v-model.trim="code" maxlength="6" placeholder="请输入短信验证码"></p>
            <span v-if="!sendDisabled" @click="getSmsCode" style="color:#FF4444;">获取验证码</span>
            <span v-if="sendDisabled" style="color:#FF4444;">{{time}}s</span>
          </li>
          <p>登录密码</p>
          <li class="van-hairline--bottom">
            <!-- <span><img src="../../assets/img/account/pay.png" alt=""></span> -->
            <p><input :type="passwordType" v-model.trim="password" placeholder="请设置登录密码"></p>
            <i class="iconfont icon-eye-close" style="color:#EE281C;" v-show="passwordType=='password'" @click="showPassword(1)"></i>
            <i class="iconfont icon-eye-open" style="color:#EE281C;" v-show="passwordType=='text'" @click="showPassword(1)"></i>
          </li>
          <p>交易密码</p>
          <li class="van-hairline--bottom">
            <!-- <span><img src="../../assets/img/account/pay.png" alt=""></span> -->
            <p><input :type="payPassType" maxlength="6" v-model.trim="payPass" placeholder="请设置交易密码"></p>
            <i class="iconfont icon-eye-close" style="color:#EE281C;" v-show="payPassType=='password'" @click="showPassword(2)"></i>
            <i class="iconfont icon-eye-open" style="color:#EE281C;" v-show="payPassType=='text'" @click="showPassword(2)"></i>
          </li>
          <p>邀请人号码</p>
          <li class="van-hairline--bottom">
            <!-- <span><img src="../../assets/img/account/yq.png" alt=""></span> -->
            <p><input type="text" v-model.trim="parentPhone" maxlength="11" :readonly="parentNumberReadonly" placeholder="请输入邀请人手机号码"></p>
          </li>
          
        </ol>
        <!-- <div class="agreement_box">
          <span>点击"注册"即表示您接受<em>《服务协议》</em></span>
        </div> -->
        <div class="account_btn">
          <van-button type="primary" size="large" @click="register()">注 册</van-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { Toast } from "vant";
let Base64 = require('js-base64').Base64;
export default {
  name: "register",
  data() {
    return {
      payPass: '',
      type: 1,
      customerNumber: "",
      phone: "",
      password: "",
      code: "",
      parentPhone: "",
      againPass: "",
      parentNumberReadonly: false,
      time: 60, // 发送验证码倒计时
      sendDisabled: false,
      agreeRadio: true,
      passwordType: 'password',
      payPassType: 'password',
      againPassType: 'password',


      agreePopup: false,
      uuid: '',
      image: '',
      imageCode: '',
      cityName:'武汉市' || sessionStorage.getItem('city'),
    };
  },
  created() {
    if (this.$route.fullPath.indexOf("?") != -1) {
      this.goBack();
    }
  },
  watch: {
    $route(val, oldval) {
      if (oldval.fullPath.indexOf("?") != -1) {
        this.agreePopup = false;
      }
    },
  },
  mounted() {
    this.getRegisterCode()
  },
  methods: {
    getRegisterCode() {
      this.$ajax(this.$api.getRegisterCode, {}, {})
        .then(res => {
          if (res.code == 200) {
            this.uuid = res.data.uuid;
            this.image = res.data.image;
          } else {
            Toast({ message: res.message, position: "center",duration:"1000" });
          }
        })
    },
    showPassword(type) {
      if (type == 1) {
        if (this.passwordType == 'password') {
          this.passwordType = 'text';
        } else {
          this.passwordType = 'password';
        }
      } else {
        if (this.payPassType == 'password') {
          this.payPassType = 'text';
        } else {
          this.payPassType = 'password';
        }
      }
    },
    showAgainword() {
      if (this.againPassType == 'password') {
        this.againPassType = 'text';
      } else {
        this.againPassType = 'password';
      }
    },
    //发送验证码
    getSmsCode() {
      if (!this.$validator.isPhone(this.phone)) {
        Toast({ message: "请填写正确的手机号码！", position: "center",duration:"1000" });
        return;
      }
      if (!this.imageCode) {
        Toast({ message: "请输入图片验证码！", position: "center",duration:"1000" });
        return;
      }
      if (this.$validator.isPhone(this.phone)) {
        this.$ajax(this.$api.sms, { mobile: this.phone, msgType: '1',imageCode: this.imageCode,uuid: this.uuid }, {})
          .then(res => {
            if (res.code == 200) {
              Toast({ message: res.msg, position: "center",duration:"1000" });
              //倒计时
              let vm = this;
              vm.sendDisabled = true;
              let interval = window.setInterval(function () {
                if ((vm.time--) <= 0) {
                  vm.time = 60;
                  vm.sendDisabled = false;
                  window.clearInterval(interval);
                }
              }, 1000);
            } else {
              Toast({ message: res.msg, position: "center",duration:"1000" });
            }
          })
      } else {
        Toast({ message: "请检查手机号码是否输入正确！", position: "center",duration:"1000" });
      }
    },
    //打开客户协议页
    openAgreement() {
      // return;
      if (window.location.href.indexOf("?agreePopup") == -1) {
        window.location.href = window.location.href + "?agreePopup";
      }
      this.agreePopup = true;
    },
    validatePwd(pwd) {
      var reg = /^[0-9]{6}$/;
      if (reg.test(pwd)) {
        return true;
      } else {
        return false;
      }
    },
    //注册
    register() {
      if (!this.$validator.isPhone(this.phone)) {
        Toast({ message: "请填写正确的手机号码！", position: "center",duration:"1000" });
        return;
      }
      if (!this.cityName) {
        Toast({ message: "请选择注册城市！", position: "center",duration:"1000" });
        return;
      }
      if (!this.code) {
        Toast({ message: "请填写短信验证码！", position: "center",duration:"1000" });
        return;
      }

      if (!this.$validator.isPassword(this.password)) {
        Toast({ message: "请填写6-12位数字或字母组成的登录密码！", position: "center",duration:"1000" });
        return;
      }
      if (!this.validatePwd(this.payPass)) {
        Toast({ message: "请输入6位数的交易密码！", position: "center",duration:"1000" });
        return;
      }
      if (!this.parentPhone) {
        Toast({ message: "请填写邀请码！", position: "center",duration:"1000" });
        return;
      }
      this.$ajax(this.$api.register, {
        // customerNumber:this.customerNumber,
        mobile: this.phone,
        msgVerCode: this.code,
        password: this.password,
        inviteCode: this.parentPhone,
        payPwd: this.payPass,
        cityName: this.cityName
      }, {})
        .then(res => {
          if (res.code == 200) {
            Toast({ message: res.msg, position: "center",duration:"1000" });
            localStorage.setItem("phone", this.phone);
            //密码加密
            localStorage.setItem(Base64.encode('password'), Base64.encode(this.password))
            this.$router.replace('/login');
          } else {
            Toast({ message: res.msg, position: "center",duration:"1000" });
          }
        })
    },


  }
};
</script>

<style lang="less" scoped>
@import "../../assets/css/config";
// /deep/.nc_bg {
//   background: -webkit-linear-gradient(
//     #00b59b,
//     rgb(94, 245, 222)
//   ) !important; /* Safari 5.1 - 6.0 */
//   background: -o-linear-gradient(
//     #00b59b,
//     rgb(94, 245, 222)
//   ) !important; /* Opera 11.1 - 12.0 */
//   background: -moz-linear-gradient(
//     #00b59b,
//     rgb(94, 245, 222)
//   ) !important; /* Firefox 3.6 - 15 */
//   background: linear-gradient(
//     #00b59b,
//     rgb(94, 245, 222)
//   ) !important; /* 标准的语法 */
// }
// /deep/.nc_scale {
//   background: #fff !important;
//   box-shadow: 0 0 1vw #c4c3c3;
//   height: 10vw !important;
// }
// /deep/.nc-container .nc_scale .scale_text {
//   line-height: 10vw;
// }
// /deep/.nc-container .nc_scale .scale_text {
//   font-size: 3vw;
// }
// /deep/.nc-container .nc_scale span {
//   line-height: 10vw !important;
//   height: 10vw !important;
// }
// /deep/.nc-container .nc_scale span:nth-child(2) {
//   width: 11vw !important;
//   box-shadow: 0 0 1vw #c4c3c3;
//   // box-sizing: border-box;
//   border: 0 !important;
// }
// .captchas {
//   margin-top: 5vw;
// }
// /deep/.captchas > div {
//   width: auto !important;
// }
/deep/[class*="van-hairline"]:after {
  display: none !important;
}
.register {
  // background: #fff;
  height: auto;
  .logo {
    font-size:3.4vw;
    font-family:PingFang SC;
    font-weight:bold;
    color:rgba(167,167,167,1);
    line-height:3vh;
    padding: 6.7vh 7vw 9vh;
  }
}
/deep/.van-button--primary {
   width: 33vw;
  height: 6.1vh;
  line-height: 6.1vh;
  background:#EE281C;
  color: #fff;
  // border:1px solid rgba(88,200,156,1);
  border-radius: 10vw;
}
/* WebKit browsers */
input::-webkit-input-placeholder {
  color:rgba(204,204,204,1);
  font-size: 3vw;
}
/* Mozilla Firefox 4 to 18 */
input:-moz-placeholder {
  color:rgba(204,204,204,1);
  opacity: 1;
  font-size: 3vw;
}
/* Mozilla Firefox 19+ */
input::-moz-placeholder {
  color:rgba(204,204,204,1);
  opacity: 1;
  font-size: 3vw;
}
/* Internet Explorer 10+ */
input:-ms-input-placeholder {
  color:rgba(204,204,204,1);
  font-size: 3vw;
}
.register_box {
  min-height: 100%;
  border-radius: 4px;
  padding: 0 5vw;
  // background-color: rgba(156, 167, 251, 0.25);
  > p:nth-child(1) {
    color: #333333;
    text-align: left;
    font-weight: bold;
    letter-spacing: 1px;
    margin-top: 10px;
    img {
      width: 2.5vw;
    }
  }
  .title {
    position: absolute;
    top: 3%;
    left: 50%;
    transform: translate(-50%, -50%);
    letter-spacing: 5px;
    color: #fff;
  }
  > p:nth-child(3) {
    position: absolute;
    top: 12vh;
    color: #999999;
    letter-spacing: 1px;
  }
}
.account_btn {
  padding: 2vh 7vw 3vh;
  text-align: center;
}

.agreement_box {
  margin-top: 4.5vh;
  padding: 0 7vw;
  color: #666666;
  opacity: 0.63;
  font-size: 3vw;
  text-align: center;
  i {
    font-size: 18px;
    color: #fff;
  }
  span {
    margin-left: 5px;
    em {
      color: #666;
    }
  }
}

.agree_popup {
  width: 100%;
  height: 100%;
  .agree_box {
    padding: 10px;
    margin-top: 6px;
    background: #0e0e0e;
    box-sizing: border-box;
  }
  h4 {
    color: #fff;
    font-weight: bold;
    font-size: 3.5vw;
  }
  span {
    line-height: 5vw;
    display: block;
    color: #fff;
    font-weight: bold;
    font-size: 4vw;
    margin-bottom: 10px;
  }
  p {
    color: #fff;
    line-height: 5vw;
    margin-top: 2vw;
    text-indent: 2em;
    font-size: 3.5vw;
  }
}
.account_box {
  padding: 0 7vw;
  color: #fff;
  > p {
    color: #333333;
    font-size: 3.7vw;
    padding: 0 5px;
  }
  li {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 2vh 5px 1vh;
    margin-bottom:5.8vh;
    border-bottom: 1px solid #F6F6F6;
    span:nth-child(1) {
      max-width: 7vw;
    }
    span {
      flex: 1;
      max-width: 19vw;
      color: #58c89c;
      font-weight: bold;
      // img {
      //   width: 4vw;
      // }
    }
    span:nth-child(3) {
      color: #58c89c;
      // font-weight: bold;
      font-size: 3.5vw;
      padding: 5px 12px;
      border-radius: 5vw;
      text-align: center;
      img {
        width: 16vw;
      }
    }
    input {
      height: 8vw;
      border: none;
      width: 100%;
      // padding: 0 5px;
      box-sizing: border-box;
      color: #333;
      background: rgba(0, 0, 0, 0);
    }
    i {
      max-width: 25px;
      flex: 1;
      color: #58c89c;
      font-size: 25px;
      line-height: 30px;
      img {
        display: block;
      }
    }
  }
}
</style>
