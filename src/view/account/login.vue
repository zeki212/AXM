<!-- login -->
<template>
  <div class="login" :style="{height:loginHight}">
    <div class="login_box">
      <div class="logo">
        <img src="../../assets/img/account/logo.png" alt="">
        <p>
          <img src="../../assets/img/account/left (2).png" alt="">
          <span>AXM爱心传递世界</span>
          <img src="../../assets/img/account/right.png" alt="">
        </p>
      </div>
      <!-- <h2>登录</h2> -->
      <ol class="account_box">
        <p>手机号</p>
        <li class="van-hairline--bottom" style="margin-bottom:5.8vh;">
          <span>+86</span>
          <span style="margin-left:2.6vw;margin-right:1.9vw;">
            <img src="../../assets/img/account/down.png" alt="">
          </span>
          <p><input type="text" maxlength="11" v-model.trim="phone" placeholder="在这里输入手机号"></p>
        </li>
        <p>登录密码</p>
        <li class="van-hairline--bottom">
          <!-- <span>
            <img src="../../assets/img/account/pay.png" alt="">
          </span> -->
          <p><input :type="passwordType" v-model.trim="password" placeholder="请输入登录密码"></p>
          <i class="iconfont icon-eye-close" style="color:#EE281C;"  v-show="passwordType=='password'" @click="showPassword"></i>
          <i class="iconfont icon-eye-open" style="color:#EE281C;" v-show="passwordType=='text'" @click="showPassword"></i>
        </li>
      </ol>
      <div class="account_menu">
        <span></span>
        <span @click="pushPath('/forgetPassword')">忘记密码</span>
      </div>
      <div class="account_btn">
        <van-button type="primary" size="large" @click="login()">登 录</van-button>
      </div>
      <p class="positionS"  @click="pushPath('/register')">前往注册</p>
    </div>
  </div>
</template>

<script>
let Base64 = require('js-base64').Base64;
import { Toast } from "vant";
export default {
  data() {
    return {
      phone: '',
      password: '',
      passwordType: 'password',
      //验证码随机生成的数字
      identifyCodeArr: "1234567890",
      //生成的四位数
      identifyCode: "",
      loginHight: '100vh',
      exportPopup: false,
      mnemonicWord: ''
    };
  },
  computed: {},
  watch: {
    '$route'(val, oldval) {
      if (oldval.fullPath.indexOf('?') != -1) {
        this.exportPopup = false;
      }
    },
  },
  created() {
    if (this.$route.fullPath.indexOf('?') != -1) {
      this.goBack();
    }
    this.phone = localStorage.getItem('phone');
    if (localStorage.getItem(Base64.encode('password'))) {
      this.password = Base64.decode(localStorage.getItem(Base64.encode('password')));
    }
  },
  mounted() {
    this.identifyCode = "";
    // this.makeCode(this.identifyCodeArr, 4);
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
    //登录
    login() {
      if (!this.phone) {
        Toast({ message: "请填写账号！", position: "center",duration:"1000" });
        return;
      }
      if (!this.$validator.isPassword(this.password)) {
        Toast({ message: "登录密码格式应为6-12位数字或字母！", position: "center",duration:"1000" });
        return;
      }
      this.$ajax(this.$api.login, { mobile: this.phone, password: this.password }, {}).then(
        res => {
          if (res.code == 200) {
            //本地缓存token
            localStorage.setItem("token", res.data.tokenId);
            localStorage.setItem("phone", this.phone);
            localStorage.setItem('userInfo', JSON.stringify(res.data));
            localStorage.setItem('userId', res.data.userId);
            //密码加密
            localStorage.setItem(Base64.encode('password'), Base64.encode(this.password))
            //判断有无重定向地址 有就跳没有就跳默认地址
            if (this.$router.history.current.query.redirect) {
              this.$router.push(this.$router.history.current.query.redirect);
            } else {
              this.$router.replace('/home')
            }
            this.$store.commit('updateLoginState', true)
          } else {
            localStorage.setItem("token", "");
            Toast({ message: res.msg, position: "center",duration:"1000" });
            this.password = '';
            // this.refreshCode();
          }
        })
    },

  },
}
</script>
<style lang='less' scoped>
@import "../../assets/css/config";
/deep/[class*="van-hairline"]:after {
  display: none;
}
/deep/.van-button:before {
  display: none;
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
  font-size: 3.5vw;
}
.positionS {
  color: #666666;
  font-size: 2.8vw;
  text-align: center;
  letter-spacing: 1px;
  text-decoration:underline;
}
.login {
  background-color: #fff;
  // color: #fff;
  padding: 11vh 12vw 0;
  box-sizing: border-box;
  overflow-y: auto;
  .login_box {
    h2 {
      letter-spacing: 2px;
      margin-bottom: 25vw;
    }
    .title_desc {
      padding: 2vh 0;
      color: @fontColor;
    }
  }
  .logo {
    padding-bottom: 11vh;
    text-align: center;
    img {
      width: 33%;
      display: block;
      margin: 0 auto;
    }
    p{
      display: flex;
      font-size:4vw;
      line-height: 7vw;
      font-weight:bold;
      font-family:PingFang SC;
      color:rgba(51,51,51,1);
      // line-height:106px;
      align-items: center;
      justify-content: space-between;
      img{
        width: 56px;
        height: 2px;
      }
    }
  }
}
.account_box {
  color: #666666;
  >p {
    font-weight:500;
    font-size: 2.6vw;
    padding: 0 5px;
    color:rgba(51,51,51,1);
    font-family:PingFang SC;
  }
  li {
    display: flex;
    align-items: center;
    padding: 2vh 5px 1vh;
    // justify-content: space-between;
    border-bottom:2px solid rgba(246,246,246,1);
    span {
      // flex: 1;
      // max-width: 4vw;
      // margin-right: 10px;
      img{
        width: 1.2vw;
        height: 0.6vh;
      }
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
      color: #58C89C;
      font-size: 5vw;
      line-height: 30px;
      img {
        display: block;
      }
    }
  }
}
.account_btn {
  margin: 6vh 0 3vh;
  text-align: center;
}
.account_menu {
  display: flex;
  justify-content: space-between;
  margin-top: 3vw;
  span {
    font-size: 3vw;
    padding: 0 5px;
    color: #666666;
    display: inline-block;
    // text-decoration:underline;
    opacity:0.63;
  }
}
.download_app {
  text-align: center;
  margin-bottom: 3vh;
  span {
    display: inline-block;
    padding: 4px 10px;
    color: #fff;
    font-size: 12px;
  }
}

.export_popup {
  width: 100%;
  height: 100%;
  .popup_tip {
    padding: 15px;
  }
  .text_area {
    padding: 15px;
    textarea {
      background-color: @blockColor;
      width: 100%;
      height: 200px;
      padding: 10px;
      box-sizing: border-box;
      border-color: @lineColor;
      resize: none;
    }
  }
}
</style>