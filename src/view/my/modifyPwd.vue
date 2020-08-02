<template>
  <div class="modify_password">
    <my-header :showBack="true" :title="title"></my-header>
    <div class="modPwd">
      <div>
        <van-cell-group>
          <van-field v-model="phone" label="手机号" placeholder="手机号" readonly="readonly" />
          <van-field type="number" v-model.trim="code" v-if="smsType===4" label="手机验证码" placeholder="请输入手机验证码" @click-icon="code = ''">
            <van-button slot="button" size="small" v-show="!isSendMsg" type="primary" @click="getSmsCode()">获取验证码</van-button>
            <van-button slot="button" size="small" v-show="isSendMsg" type="primary">{{time}}s</van-button>
          </van-field>
          <van-field type="password" v-model.trim="oldPwd" v-if="smsType===3" label="原密码" :placeholder="this.oldPwdPlaceholder" @click-icon="oldPwd = ''" />
          <van-field type="password" v-model.trim="newPwd" label="新密码" placeholder="请输入新的密码" v-if="smsType===3" @click-icon="newPwd = ''" />
          <van-field type="password" v-model.trim="newPwdTwo" label="新密码" v-if="smsType===4" placeholder="请输入新的交易密码" @click-icon="newPwdTwo = ''" />
          <van-field type="password" v-model.trim="confirmPassword" label="确认密码" placeholder="再次确认新密码" @click-icon="confirmPassword = ''" />
        </van-cell-group>
      </div>
      <div class="botmS">
        <van-button type="primary" size="large" @click="modify">确认修改</van-button>
      </div>
    </div>
  </div>
</template>
<script>
import { Toast } from "vant";
export default {
  name: "modifyPwd",
  data() {
    return {
      phone: JSON.parse(localStorage.getItem("userInfo")).mobile,
      userInfo: JSON.parse(localStorage.getItem("userInfo")),
      source: this.$information.source,
      code: "",
      newPwd: "",
      newPwdTwo: "",
      oldPwd: "",
      title: "",
      oldPwdPlaceholder: "",
      newPwdPlaceholder: "",
      confirmPassword: "",
      smsType: 3,
      canChange: true,
      isSendMsg: false,
      time: 60
    };
  },

  mounted() {
    let type = this.$route.params.type;
    this.showModifyPassword(type);
  },
  methods: {
    showModifyPassword(type) {
      if (type == 1) {
        this.smsType = 3, //修改登录密码
        this.title = '修改登录密码';
        this.oldPwdPlaceholder = '原登录密码';
      } else {
        this.smsType = 4, //修改安全密码
        this.title = '修改资金密码';
        // this.oldPwdPlaceholder = '原资金密码';
      }
    },
    //检查是否已经注册和验证码是否正确
    getSmsCode() {
      this.$ajax(this.$api.sms, { mobile: this.phone, msgType: '3' }, {}).then(res => {
        if (res.code == 200) {
          this.isSendMsg = true;
          Toast({ message: res.msg, position: "center",duration:"1000"  });
          //倒计时
          let vm = this;
          let interval = window.setInterval(() => {
            if (vm.time-- <= 0) {
              vm.time = 60;
              vm.isSendMsg = false;
              window.clearInterval(interval);
            }
          }, 1000);
        } else {
          Toast({ message: res.msg, position: "center",duration:"1000"  });
        }
      });
    },
    //验证安全密码格式
    validatePwd(pwd) {
      var reg = /^[0-9]{6}$/;
      if (reg.test(pwd)) {
        return true;
      } else {
        return false;
      }
    },
    //验证登录密码格式
    validateLoginPwd(pwd) {
      if (pwd.length >= 6 && pwd.length <= 12) {
        return true;
      } else {
        return false;
      }
    },
    modify: function () {
      if (this.smsType == 3) {
        if (!this.validateLoginPwd(this.newPwd)) {
          //验证密码格式是否正确
          Toast({
            message: "密码为6-12位且至少包括大小写字母、符号和数字的两种组合!",
            position: "center",duration:"1000" 
          });
          return;
        }
        if (this.confirmPassword != this.newPwd) {
          Toast({ message: "两次密码不一致", position: "center",duration:"1000"  });
          return;
        }
      } else {
        if (!this.code) {
          Toast({
            message: "请输入您的验证码!",
            position: "center",duration:"1000" 
          });
          return;
        }
        if (!this.validatePwd(this.newPwdTwo)) {
          //验证安全密码格式是否正确
          Toast({
            message: '交易密码格式不正确!',
            position: "center",duration:"1000" 
          });
          return;
        }
        if (this.confirmPassword != this.newPwdTwo) {
          Toast({ message: "两次密码不一致!", position: "center",duration:"1000"  });
          return;
        }
      }
      //修改登录密码
      if (this.smsType == "3") {
        let params = { account: this.phone, oldPwd: this.oldPwd, password: this.newPwd };
        var formObject = encodeParams(params, this.userInfo.userId, this.userInfo.tokenId, this.userInfo.appKey);
        this.$ajax(this.$api.updateLoginPwd, { account: this.phone, oldPwd: this.oldPwd, password: this.newPwd }, formObject.sign).then(res => {
          if (res.code == 200) {
            this.$router.replace('/login')
            Toast({  message: res.msg,  position: "center",duration:"1000"   });
          } else {
            Toast({  message: res.msg,  position: "center",duration:"1000"   });
          }
        });
      } else {
        //修改安全密码
        let params = { account: this.phone, paypwd: this.newPwdTwo, msgVerCode: this.code };
        var formObject = encodeParams(params, this.userInfo.userId, this.userInfo.tokenId, this.userInfo.appKey);
        this.$ajax(this.$api.updatePayPwd, { account: this.phone, paypwd: this.newPwdTwo, msgVerCode: this.code }, formObject.sign).then(res => {
          if (res.code == 200) {
            Toast({  message: res.msg,  position: "center",duration:"1000"   });
            this.goBack();
          } else {
            Toast({  message: res.msg,  position: "center",duration:"1000"   });
          }
        });
      }
    }
  }
};
</script>
<style lang="less" scoped>
.modPwd {
  // background: #0E0E0E;
}
.password_popup {
  width: 100%;
  height: 100%;
}
.van-cell:not(:last-child):after {
  display: none;
}
[class*="van-hairline"]:after {
  display: none;
}
.van-cell {
  // background-color: #0E0E0E;
  border-bottom: 1px solid rgba(229,229,229,1);
  padding: 2.5vh 5vw;
}
/deep/.van-cell__title {
  color: #333;
  font-size: 3.7vw;
  // font-weight: bold;
}
.botmS {
  text-align: center;
  // margin-bottom: 20vh;
  button {
    background: #EE281C;
    color: #fff;
    margin-top: 10vh;
    width: 90vw;
    border-radius: 1vw;
  }
}
/deep/.van-button--primary {
  border-radius: 5vw;
  background: #EE281C;
  // color: #58C89C;
}
/deep/.van-button:before {
  // background-color: #EE281C;
}
/deep/.van-field__control {
  color: #878787;
  // font-size: 3.7vw;
}
</style>


