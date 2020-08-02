<template>
  <div class="forget_password">
    <p class="back" @click="goBack">
      <img src="../../assets/img/account/left.png" alt="">
    </p>
    <div class="logo">
      <p style="color:#333333;fontSize:6vw;lineHeight:10vw;">嗨，忘记密码了吧？</p>
      <p style="fontSize:3.4vw;">一定要记好密码哟</p>
    </div>
    <ol class="account_box">
      <p>手机号码</p>
      <li class="van-hairline--bottom" style="padding: 2vh 5px 1vh;">
        <span>+86</span>
        <span style="margin-left:2.6vw;margin-right:1.9vw;">
          <img src="../../assets/img/account/down.png" alt="">
        </span>
        <p><input type="text" maxlength="11" v-model.trim="phone" placeholder="在这里输入手机号"></p>
      </li>
      <!-- <div v-show="phone.length==11" id="captcha" class="captchas"></div> -->
      <p>验证码</p>
      <li class="van-hairline--bottom" ref="loginBox">
        <!-- <span><img src="../../assets/img/account/code.png" alt=""></span> -->
        <p><input type="text" v-model.trim="code" maxlength="6" placeholder="请输入验证码"></p>
        <span class="scode" v-if="!sendDisabled" @click="getSmsCode">获取验证码</span>
        <span class="scode" v-if="sendDisabled">{{time}}s</span>
      </li>
      <p>设置登录密码</p>
      <li class="van-hairline--bottom">
        <!-- <span><img src="../../assets/img/account/pay.png" alt=""></span> -->
        <p><input :type="passwordType" v-model.trim="password" placeholder="请设置登陆密码"></p>
        <i class="iconfont icon-eye-close" style="color:#EE281C;" v-show="passwordType=='password'" @click="showPassword"></i>
        <i class="iconfont icon-eye-open" style="color:#EE281C;" v-show="passwordType=='text'" @click="showPassword"></i>
      </li>
    </ol>
    <div class="account_btn">
      <van-button type="primary" size="large" @click="retrieve">确 定</van-button>
    </div>
  </div>
</template>

<script>
import { Toast } from 'vant'

export default {
  name: 'forgetPassword',
  data() {
    return {
      customerNumber: '',
      phone: '',
      password: '',
      againPass: '',
      confirmPassword: '',
      code: '',
      time: 60, // 发送验证码倒计时
      sendDisabled: false,
      passwordType: 'password',
    }
  },
  mounted() {
  },
  methods: {
    // 是否显示密码？
    showPassword() {
        if (this.passwordType == 'password') {
          this.passwordType = 'text';
        } else {
          this.passwordType = 'password';
        }
    },
    //发送验证码
    getSmsCode() {
      if (this.$validator.isPhone(this.phone)) {
        this.$ajax(this.$api.sms, { mobile: this.phone, msgType: '2' }, {})
          .then(res => {
            if (res.code == 200) {
              Toast({ message: res.msg, position: "center",duration:"1000" });
              let vm = this;
              // console.log(vm);
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
          .catch(error => {
          });
      } else {
        Toast({ message: "手机号格式错误！", position: "center",duration:"1000" });
      }
    },
    //立即找回
    retrieve() {
      if (!this.$validator.isPhone(this.phone)) {
        Toast({ message: "请填写正确的手机号码！", position: "center",duration:"1000" });
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
      this.$ajax(this.$api.forgetPassword, {
        mobile: this.phone,
        msgVerCode: this.code,
        password: this.password,
      }, {})
        .then(res => {
          if (res.code == 200) {
            Toast({ message: res.msg, position: "center",duration:"1000" });
            this.$router.replace("/login");
          } else {
            Toast({ message: res.msg, position: "center",duration:"1000" });
          }
        })
    }
  }
}
</script>

<style lang="less" scoped>
@import "../../assets/css/config";
/deep/[class*="van-hairline"]:after {
  display: none !important;
}
.forget_password {
  padding: 0 5%;
  box-sizing: border-box;
  // background: #fff;
  height: auto;
  color: #fff;
  .logo {
    font-size:2.4vw;
    font-family:PingFang SC;
    font-weight:bold;
    color:rgba(167,167,167,1);
    line-height:3vh;
    padding: 6.7vh 7vw 9vh;
  }
  > p:nth-child(3) {
    color: #dfd7d7;
    letter-spacing: 1px;
    margin-top: 10px;
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
.back {
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
  padding: 5vh 0 0;
  color: #fff;
  font-size: 21px;
}
.account_box {
  padding: 0 7vw;
  color: #666666;
  > p {
    color: #666666;
    font-size: 3.7vw;
    padding: 0 5px;
  }
  li {
    display: flex;
    align-items: center;
    padding: 2vh 5px 1vh;
    margin-bottom:5.8vh;
    border-bottom:2px solid rgba(246,246,246,1);;
    span:nth-child(1) {
      max-width: 7vw;
    }
    span {
      // flex: 1;
      // max-width: 4vw;
      // margin-right: 10px;
      img{
        width: 1.2vw;
        height: 0.6vh;
      }
    }
    .scode{
      width:20.7vw;
      height:3vh;
      line-height: 3vh;
      text-align: center;
      border-radius:2.6vw;
      border:1px solid rgba(191,191,191,1);
    }
    span:nth-child(3) {
      // color: #58c89c;
      color: red;
      font-weight: bold;
      font-size: 3.5vw;
      padding: 5px 12px;
      border-radius: 5vw;
      text-align: center;
    }
    p {
      flex: 1;
      font-size: 3.5vw;
    }
    input {
      height: 8vw;
      border: none;
      width: 100%;
      padding: 0 5px;
      box-sizing: border-box;
      color:#333;
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

.account_btn {
  margin: 7vh 7vw 5vh;
  text-align: center;
}
</style>
