<template>
  <div class="mine_box">
    <my-header class="headerS" :showBack="true" title="激活矿工" />
    <ol class="account_box">
      <p>请输入帐号</p>
      <li class="van-hairline--bottom" style="margin-bottom:5.8vh;">
        <p><input type="text" maxlength="11" v-model.trim="phone" placeholder="在这里输入手机号"></p>
      </li>
      <p>激活所需</p>
      <li class="van-hairline--bottom">
        <p>
          <input type="number" disabled v-model="user.activeFee">
          <span>AXM</span>
        </p>
        <p class="posibottom">可用AXM: {{user.sweets}}</p>
      </li>
      <button @click="getType">确定激活</button>
    </ol>
    <!-- 密码输入框 -->
    <!-- <div class="password"> -->
      <van-popup v-model="show"  position="bottom" :style="{ height: '62%' }">
        <div class="head">
          <div @click="close"></div>
          <img src="../../assets/img/deal/guanbi.png" alt="">
          <span>资金密码</span>
        </div>
        <p class="pass">请输入6位数的资金密码</p>
        <van-password-input
          :value="value"
          :error-info="errorInfo"
          info=""
          :focused="showKeyboard"
          @focus="showKeyboard = true"
        />
        <p class="del">
          <span>扣除金额:&nbsp;&nbsp;{{user.activeFee}}&nbsp;&nbsp;AXM</span> 
        </p>
        <!-- 数字键盘 -->
        <van-number-keyboard
          :show="showKeyboard"
          @input="onInput"
          @delete="onDelete"
          @blur="showKeyboard = true"
        />
      </van-popup>
    <!-- </div> -->
  </div>
</template>

<script>
import ClipboardJS from 'Clipboard'
import { Toast, Dialog, Progress, ImagePreview } from "vant";
export default {
  data() {
    return {
      phone:"",
      dearphone:'',
      value:"",
      show:false,
      user:JSON.parse(localStorage.getItem('user')),
      errorInfo:"",
      showKeyboard: true,
      statesw: '1',
      userInfo: JSON.parse(localStorage.getItem("userInfo")),
      version: this.$information.VERSION,
      source: this.$information.source,
      pageNo: 1,
      pageSize: 10,
      type: 1,
      list: '',
      active: 0,
      isLoad: false,
      loading: false,
      finished: true,
      files: '',
      popupText: false,
      popupUser: false,
      compText: false,
      equipId: '',
      payPwd: '',
      userId: '',
      users: '',
      complaintDetail: '',
    };
  },
  watch: {
    $route(val, oldval) {
      if (val.fullPath.indexOf("?") == -1) {
        this.popupText = false;
        this.popupUser = false;
        this.compText = false;
      }
    },
    active(val) {
      this.pageNo = 1
      this.finished = true
      if (val == 0) {
        this.type = 1
      }
      if (val == 1) {
        this.type = 2
      }
      this.getTradeOrderList();
    }
  },
  created() {
    if (this.$route.fullPath.indexOf("?") != -1) {
      this.goBack();
    }
  },
  mounted() {
    // 获取用户信息
    this.getCustInfo();
    // this.getTradeOrderList();
  },

  methods: {
    close(){
      this.show = false;
    },
    onInput(key) {
      this.value = (this.value + key).slice(0, 6);
      if (this.value.length === 6) {
        // this.errorInfo = '密码错误';
        let params = {toAccount:this.phone,num:this.user.activeFee,payPwd:this.value};
        var formObject = encodeParams(params, this.userInfo.userId, this.userInfo.tokenId, this.userInfo.appKey);
        this.$ajax(this.$api.activeTransfer, {toAccount:this.phone,num:this.user.activeFee,payPwd:this.value},formObject.sign).then(res => {
          if (res.code == 200) {
            Toast({ message: res.msg, position: "center",duration:"1000"  });
            this.show = false;
            this.phone = '';
            this.value = "";
          } else {
            this.show = false;
            this.value = "";
            Toast({ message: res.msg, position: "center",duration:"1000"  });
          }
        })
      } else {
        this.errorInfo = '';
      }
    },
    onDelete() {
      this.value = this.value.slice(0, this.value.length - 1);
    },
    // 确定激活
    getType(){
      if (!this.$validator.isPhone(this.phone)) {
        Toast({ message: "请正确填写对方手机号！", position: "center",duration:"1000"  });
        return;
      }
      this.show = true;
    },
    showTradingImg(voucherImg) {
      let arr = [];
      arr.push(voucherImg)
      ImagePreview(arr);
    },
    // 确认打款
    confirmPay(item) {
      if (!item.imageUrl) {
        Toast({ message: "请先上传图片!", position: "center",duration:"1000"  });
        return;
      }
      let params = { voucherUrl: item.imageUrl, orderId: item.orderId };
      var formObject = encodeParams(params, this.userInfo.userId, this.userInfo.tokenId, this.userInfo.appKey);
      this.$ajax(this.$api.confirmPay, { voucherUrl: item.imageUrl, orderId: item.orderId }, formObject.sign).then(res => {
        if (res.code == 200) {
          this.getTradeOrderList();
          Toast({ message: res.msg, position: "center",duration:"1000"  });
        } else {
          Toast({ message: res.msg, position: "center",duration:"1000"  });
        }
      })
    },
    // 确认放行
    confirmRecive() {
      if (!this.payPwd) {
        Toast({ message: "请输入交易密码!", position: "center",duration:"1000"  });
        return;
      }
      let params = { paypwd: this.payPwd, orderId: this.equipId };
      var formObject = encodeParams(params, this.userInfo.userId, this.userInfo.tokenId, this.userInfo.appKey);
      this.$ajax(this.$api.confirmRecive, { paypwd: this.payPwd, orderId: this.equipId }, formObject.sign).then(res => {
        if (res.code == 200) {
          Toast({ message: res.msg, position: "center",duration:"1000"  });
          this.payPwd = '';
          this.getTradeOrderList();
          this.goBack();
        } else {
          Toast({ message: res.msg, position: "center",duration:"1000"  });
        }
      })
    },
    comp(id) {
      if (window.location.href.indexOf("?compText") == -1) {
        window.location.href = window.location.href + "?compText";
      }
      this.equipId = id;
      this.compText = true;
    },
    rent(id) {
      if (window.location.href.indexOf("?popupText") == -1) {
        window.location.href = window.location.href + "?popupText";
      }
      this.equipId = id;
      this.popupText = true;
    },
    // 对方信息
    popUser(id) {
      if (window.location.href.indexOf("?popupUser") == -1) {
        window.location.href = window.location.href + "?popupUser";
      }
      this.userId = id;
      this.popupUser = true;
      this.getOtherUserInfo()
    },
    getOtherUserInfo() {
      let params = { orderId: this.userId };
      var formObject = encodeParams(params, this.userInfo.userId, this.userInfo.tokenId, this.userInfo.appKey);
      this.$ajax(this.$api.getOtherUserInfo, { orderId: this.userId }, formObject.sign).then(res => {
        if (res.code == 200) {
          this.users = res.data;
        } else {
          Toast({ message: res.msg, position: "center",duration:"1000"  });
        }
      })
    },
    // 获取用户信息，激活所需币值
    getCustInfo() {
      let params = {};
      var formObject = encodeParams(params, this.userInfo.userId, this.userInfo.tokenId, this.userInfo.appKey);
      this.$ajax(this.$api.getCustInfo, {}, formObject.sign).then(res => {
        if (res.code == 200) {
          // console.log(res);
          this.user = res.data;
        } else {
          Toast({ message: res.msg, position: "center",duration:"1000"  });
        }
      })
    },
    orderCanael(id) {
      let params = { version: this.version, orderId: id };
      var formObject = encodeParams(params, this.userInfo.userId, this.userInfo.tokenId, this.userInfo.appKey);
      this.$ajax(this.$api.cancelOrder, { version: this.version, orderId: id }, formObject.sign)
        .then(res => {
          if (res.code == 200) {
            this.getTradeOrderList();
            Toast({ message: res.msg, position: "center",duration:"1000"  });
          } else {
            Toast({ message: res.msg, position: "center",duration:"1000"  });
          }
        })
    },
    getTradeOrderList() {
      let params = { version: this.version, pageNo: this.pageNo = 1, pageSize: this.pageSize, type: this.type };
      var formObject = encodeParams(params, this.userInfo.userId, this.userInfo.tokenId, this.userInfo.appKey);
      this.isLoad = false;
      this.$ajax(this.$api.getTradeOrderList, { version: this.version, pageNo: params.pageNo, pageSize: this.pageSize, type: this.type }, formObject.sign)
        .then(res => {
          this.loading = false;
          this.isLoad = true;
          if (res.code == 200) {
            if (res.data) {
              this.list = res.data.list.filter(element => {
                element.imageUrl = ""
                return element
              });
              this.finished = res.data.totalCount / res.data.pageSize < this.pageNo;
            }
          } else {
            Toast({ message: res.msg, position: "center",duration:"1000"  });
          }
        })
    },
    loadMore() {
      let params = { version: this.version, pageNo: this.pageNo += 1, pageSize: this.pageSize, type: this.type };
      var formObject = encodeParams(params, this.userInfo.userId, this.userInfo.tokenId, this.userInfo.appKey);
      this.isLoad = false;
      this.$ajax(this.$api.getTradeOrderList, { version: this.version, pageNo: params.pageNo, pageSize: this.pageSize, type: this.type }, formObject.sign)
        .then(res => {
          this.loading = false;
          if (res.code == 200) {
            if (res.data && res.data.list.length > 0) {
              this.list = this.list.concat(res.data.list);
              this.finished = res.data.totalCount / res.data.pageSize < this.pageNo;
            } else {
              this.finished = true;
            }
          } else {
            Toast({ message: res.msg, position: "center",duration:"1000"  });
          }
        })
    }
  }
};
</script>

<style lang='less' scoped>
// .password{
  .head{
    width: 100vw;
    height: 12vw;
    line-height: 12vw;
    position:relative;
    text-align: center;
    border-bottom:1px solid rgba(220,220,220,1);
    div{
      width: 12vw;
      height: 12vw;
      position:absolute;
      top:0;
      left:0;
    }
    span{
      font-size:3.2vw;
      font-family:PingFang SC;
      font-weight:bold;
      color:rgba(52,52,52,1);
      // line-height:21px;
    }
    img{
      width: 2.8vw;
      height: 2.8vw;
      position:absolute;
      top:5vw;
      left:5vw;
    }
  }
  .van-password-input__info{
    text-align: right!important;
    font-size:3vw;
    font-family:PingFang SC;
    font-weight:400;
    color:rgba(238,40,28,1);
  }
  .pass{
    // width:315px;
    height:8vw;
    line-height: 8vw;
    text-align: center;
    font-size:3vw;
    font-family:PingFang SC;
    font-weight:400;
    color:rgba(102,102,102,1);
    // line-height:21px;
  }
  .del{
    height: 10vw;
    color:#EE281C;
    text-align: right;
    padding-right:4vw;
    line-height: 10vw;
  }
// }
.account_box {
  width: 95vw;
  margin:0 auto;
  margin-top:8vw;
  color: #666666;
  overflow: hidden;
  >p {
    // width:128px;
    // height:24px;
    font-size:3.6vw;
    font-family:PingFang SC;
    font-weight:bold;
    padding:0 5px;
    color:rgba(51,51,51,1);
  }
  button{
    width: 95vw;
    height: 12vw;
    color:#fff;
    border:0;
    font-size:4vw;
    font-family:PingFang SC;
    font-weight:bold;
    color:rgba(255,255,255,1);
    margin-top:17vw;
    border-radius:1vw;
    background-color: #EE281C;
  }
  li {
    display: flex;
    align-items: center;
    padding: 2vh 5px 1vh;
    position:relative;
    // justify-content: space-between;
    border-bottom:2px solid rgba(246,246,246,1);
    .posibottom{
      // width:193px;
      // height:22px;
      position:absolute;
      left:0;
      bottom:-7vw;
      font-size:3.4vw;
      font-family:PingFang SC;
      font-weight:500;
      color:rgba(153,153,153,1);
    }
    p:nth-of-type(1){
      display: flex;
      align-items: center;
      justify-content: space-between;
      font-size:3vw;
      font-family:PingFang SC;
      font-weight:bold;
      color:rgba(51,51,51,1);
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
    p {
      flex: 1;
      font-size: 3.5vw;
    }
    input {
      height: 8vw;
      border: none;
      width: 100%;
      font-size: 3vw;
      // padding: 0 5px;
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
.popUsers {
  width: 90vw;
  background: #ffffff;
  border-radius: 2vw;
  ul {
    padding: 5vw 8vw;
    li {
      font-size: 3vw;
      line-height: 7vw;
      color: #333333;
      display: flex;
      justify-content: space-between;
      img {
        width: 3.5vw;
        height: 3.5vw;
      }
    }
    p {
      color: #58c89c;
      font-size: 3vw;
      margin-top: 5vw;
      text-align: center;
    }
    .buttos {
      margin-top: 4vw;
      text-align: center;
      button {
        background: #58c89c;
        color: #fff;
        border: 0;
        width: 35vw;
        height: 10vw;
        font-size: 4vw;
        border-radius: 1vw;
      }
    }
  }
}
.textX {
  width: 80vw;
  background: #182129;
  border: 1px solid rgba(88, 200, 156, 1);
  li:nth-child(1) {
    font-size: 4vw;
    text-align: center;
    margin: 4.5vw 0 4vw;
  }
  li:nth-child(2) {
    margin: 0 3vw 1vw;
    textarea {
      width: 70vw;
      height: 15vw;
      background: #10161b;
      border: 1px solid rgba(88, 200, 156, 1);
      color: #58c89c;
      font-size: 3.2vw;
      padding: 2vw;
    }
    textarea::-webkit-input-placeholder {
      color: #cccccc;
    }
    textarea::-moz-placeholder {
      /* Mozilla Firefox 19+ */
      color: #cccccc;
    }
    textarea:-moz-placeholder {
      /* Mozilla Firefox 4 to 18 */
      color: #cccccc;
    }
    textarea:-ms-input-placeholder {
      /* Internet Explorer 10-11 */
      color: #cccccc;
    }
  }
  li:nth-child(3) {
    font-size: 3vw;
    color: #58c89c;
    margin: 0 3vw 5vw;
  }
  li:nth-child(4) {
    display: flex;
    span {
      box-sizing: border-box;
      text-align: center;
      display: inline-block;
      width: 40vw;
      font-size: 3.5vw;
      padding: 3vw 0;
      color: #58c89c;
      border-top: 1px solid rgba(88, 200, 156, 1);
    }
  }
}
.textS {
  width: 70vw;
  background: #182129;
  border: 1px solid rgba(88, 200, 156, 1);
  li:nth-child(1) {
    font-size: 4vw;
    text-align: center;
    margin: 4.5vw 0 4vw;
  }
  li:nth-child(2) {
    font-size: 3.2vw;
    color: #58c89c;
    margin-left: 3vw;
    margin-bottom: 4vw;
  }
  li:nth-child(3) {
    margin: 0 3vw 3vw;
    input {
      width: 60vw;
      background: #10161b;
      border: 1px solid rgba(88, 200, 156, 1);
      color: #58c89c;
      font-size: 3.2vw;
      height: 8vw;
      padding: 0 2vw;
    }
  }
  li:nth-child(4) {
    display: flex;
    span {
      box-sizing: border-box;
      text-align: center;
      display: inline-block;
      width: 35vw;
      font-size: 3.5vw;
      padding: 3vw 0;
      color: #58c89c;
      border-top: 1px solid rgba(88, 200, 156, 1);
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
/deep/.header_box + div {
  background: #0e0e0e;
}
.font {
  color: #333;
  font-size: 12px;
}
/deep/.van-tabs__line {
  width: 12vw !important;
  height: 3px !important;
  background-color: #58c89c !important;
  // margin-left: 10.6% !important;
}
/deep/.van-tabs--line {
  padding-top: 10vw;
  margin-bottom: 3vw;
}
/deep/.van-tabs {
  // border-bottom: 1px solid rgb(153, 153, 153);
}
/deep/.van-tab--active {
  color: #58c89c !important;
}
/deep/[class*="van-hairline"]:after {
  display: none !important;
}
/deep/.van-ellipsis {
  // font-weight: bold !important;
  font-size: 3.7vw;
}
.footer_btn {
  background-color: #f4f4f4;
  border: 0;
}
.wallet {
  margin: 1.5vw 3vw;
  padding: 1.5vw 3vw;
  background: #1c1c1d;
  display: flex;
  align-items: center;
  justify-content: space-between;
  color: #fff;
  position: relative;
  > li:nth-child(1) {
    font-size: 3.2vw;
    > p {
      line-height: 6vw;
    }
    > p:nth-child(1) {
      font-size: 3vw;
    }
    .imgAdd {
      img {
        width: 25vw;
      }
      span {
        line-height: 6vw;
      }
      input {
        display: none;
      }
    }
  }
  > li:nth-child(2) {
    text-align: bottom;
    > p {
      width: 17vw;
      margin: 1.5vw 0 1.5vw 16vw;
      padding: 0.7vw 0;
      text-align: center;
      border-radius: 1vw;
      font-size: 3.3vw;
    }
    > .reminder {
      font-size: 3vw;
      position: absolute;
      right: 3vw;
      bottom: 2vw;
      // top: 25vw;
    }
  }
}
.van-cell,
.van-cell-group {
  background-color: #fff;
}
/deep/.van-field__control {
  color: #333333;
}
.van-cell {
  padding: 10px 0;
}
/deep/.van-button {
  height: 30px;
  line-height: 30px;
  width: 20%;
  float: right;
  border-radius: 5px;
  font-size: 14px;
  margin: 0 5px;
}
/deep/.van-tabs--line .van-tabs__wrap {
  height: 11vw;
  margin: 0 3vw;
}
/deep/.van-tab {
  line-height: 11vw;
  background: #1c1c1d;
  color: #fff;
}
.loadings {
  transform: translate(-50%, -50%);
  position: absolute;
  top: 50%;
  left: 50%;
}
</style>