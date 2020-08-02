<template>
  <div class="mine_box">
    <my-header :showBack="true" title="划转" :showRight="true" rightText="明细" @rightAction="pushPath('/transferList')" />
    <div class="content">
      <!-- <div class="titles">
        <p style="fontSize:3.8vw;color:#333;fontWeight:bold;">AXM</p>
        <p @click="checked">
          <span>选择币种</span>  
          <img src="../../assets/img/my/you.png" alt="">
        </p>
      </div> -->
      <!-- 选择币种 -->
      <div class="mode">
        <p>选择币种</p>
        <div class="mode_bg">
          <van-button type="primary" size="large" @click="changeActive(1)" v-if="activeList==1" style="color:rgba(238,40,28,1);border:1px solid rgba(238,40,28,1);backgroundColor:#fff;">AXM</van-button>
          <van-button type="primary" size="large" @click="changeActive(1)" v-else>AXM</van-button>
          <van-button type="primary" size="large" @click="changeActive(2)" v-if="activeList==2" style="color:rgba(238,40,28,1);border:1px solid rgba(238,40,28,1);backgroundColor:#fff;">USDT</van-button>
          <van-button type="primary" size="large" @click="changeActive(2)" v-else>USDT</van-button>
        </div>
      </div>
      <ul class="extract">
        <li>
          <p>请输入账号</p>
          <input type="text" maxlength="11" v-model="toAccount" placeholder="输入对方账号">
        </li>
        <li>
          <p>数量</p>
          <input v-if="activeList==1" type="text" maxlength="11" v-model="num" placeholder="划转AXM数量">
          <input v-if="activeList==2" type="text" maxlength="11" v-model="num" placeholder="划转USDT数量">
          <span @click="getAll">全部</span>
          <span v-if="activeList==1">可用AXM: {{sweets.sweets}}</span>
          <span v-if="activeList==2">可用USDT: {{sweets.usdt}}</span>
        </li>
        <li v-if="flag">
          <p>手续费</p>
          <!-- <span style="font-size: 3.7vw;font-weight: bold">{{sweets.serviceFee*100||'0'}}% <em style="color: #58C89C;font-weight: 500;font-size:3.3vw">（根据市场行情调整）</em></span> -->
          <span v-if="activeList==1" style="font-size: 3.7vw;font-weight: bold">{{sweets.serviceFee*100+'%'}}</span>
          <span v-if="activeList==2" style="font-size: 3.7vw;font-weight: bold">0%</span>
          <span></span>
        </li>
      </ul>
      <div class="main_bgs">
        <van-button v-if="flag" type="primary" size="large" @click="extractAxm()">确认划转</van-button>
      </div>
      <!-- 密码输入框 -->
      <div class="password">
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
            <span v-if="activeList==1">扣除金额:&nbsp;&nbsp;{{parseInt(num)+num*sweets.serviceFee}}&nbsp;&nbsp;AXM</span> 
            <span v-if="activeList==2">扣除金额:&nbsp;&nbsp;{{num}}&nbsp;&nbsp;USDT</span> 
          </p>
          <!-- 数字键盘 -->
          <van-number-keyboard
            :show="showKeyboard"
            @input="onInput"
            @delete="onDelete"
            @blur="showKeyboard = true"
          />
        </van-popup>
      </div>
      
    </div>
  </div>
</template>

<script>
import { Toast } from "vant";
export default {
  data() {
    return {
      show: false,
      toAccount:"",
      value: '',
      activeList:1,
      payPwd:"",
      errorInfo:"",
      showKeyboard: true,
      userInfo: JSON.parse(localStorage.getItem("userInfo")),
      version: this.$information.VERSION,
      sweets: '',
      qrCode: sessionStorage.getItem('qrCode'),
      num: '',
      idNo: '',
      active: 0,
      rechargeType: '1',
      flag: true
    };
  },
  watch: {
    active(val) {
      if (val == 0) {
        this.rechargeType = '1'
        this.flag = true
      }
      if (val == 1) {
        this.rechargeType = '2'
        this.flag = false
      }
    }
  },
  created() {
    if (this.$route.fullPath.indexOf("?") != -1) {
      this.goBack();
    }
  },
  mounted() {
    this.getCustInfo();
  },

  methods: {
    getAll(){
      if(this.activeList==2){
        this.num = this.sweets.usdt;
      }
      if(this.activeList==1){
        this.num = this.sweets.sweets;
      }
    },
    // 选择币种
    changeActive(id){
      this.activeList = id;
      this.num = '';
      this.toAccount = '';
    },
    close(){
      this.show = false;
    },
    onInput(key) {
      let coinType = this.activeList;
      this.value = (this.value + key).slice(0, 6);
      if (this.value.length === 6) {
        // this.errorInfo = '密码错误';
        let params = {toAccount:this.toAccount,num:this.num,payPwd:this.value,coinType:coinType};
        var formObject = encodeParams(params, this.userInfo.userId, this.userInfo.tokenId, this.userInfo.appKey);
        this.$ajax(this.$api.transferCoin, {toAccount:this.toAccount,num:this.num,payPwd:this.value,coinType:coinType},formObject.sign).then(res => {
          if (res.code == 200) {
            Toast({ message: res.msg, position: "center",duration:"1000"  });
            this.show = false;
            this.toAccount = '';
            this.num = '';
            this.value = "";
            this.getCustInfo();
          } else {
            this.show = false;
            this.num = '';
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
    checked(){
      Toast({ message:"暂未开放其他币种！", position: "center",duration:"1000"  });
    },
    getCustInfo() {
      let params = {};
      var formObject = encodeParams(params, this.userInfo.userId, this.userInfo.tokenId, this.userInfo.appKey);
      this.$ajax(this.$api.getCustInfo, {}, formObject.sign).then(res => {
        if (res.code == 200) {
          this.sweets = res.data;
        } else {
          Toast({ message: res.msg, position: "center",duration:"1000"  });
        }
      })
    },
    extractAxm() {
      if (!this.$validator.isPhone(this.toAccount)) {
        Toast({ message: "请正确输入对方帐号！", position: "center",duration:"1000"  });
        return;
      }
      if (!this.num) {
        Toast({ message: "请输入提币数量！", position: "center",duration:"1000"  });
        return;
      }
      this.show = true;
      // if (!this.qrCode) {
      //   Toast({ message: "请输入提币地址！", position: "center",duration:"1000"  });
      //   return;
      // }
      // if (!this.idNo) {
      //   Toast({ message: "请输入身份证号！", position: "center",duration:"1000"  });
      //   return;
      // }
      // if (!this.payPwd) {
      //   Toast({ message: "请输入交易密码！", position: "center",duration:"1000"  });
      //   return;
      // }
    }
  }
};
</script>

<style lang='less' scoped>
/deep/.header_box + div {
  // background: #0e0e0e;
}
.password{
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
      font-size:4vw;
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
    input{
      border: 0px;
      // max-width: 100%;
    }
  }
}
.titles {
  width:90vw;
  height:12vw;
  color:#333;
  line-height: 12vw;
  margin:0 auto;
  margin-top:5vw;
  display:flex;
  padding:0 10px;
  margin-bottom:7vw;
  align-items: center;
  justify-content:space-between;
  background:rgba(247,246,251,1);
  border-radius:1vw;
  p{
    font-size:3vw;
    font-family:PingFang SC;
    font-weight:500;
    color:rgba(153,153,153,1);
    img{
      width: 1.2vw;
      height: 2.2vw;
    }
  }
}
.mode{
  width: 100%;
  padding-top:3vw;
  border-top:1px solid rgba(229,229,229,1);
  p{
    font-size:3vw;
    font-family:PingFang SC;
    font-weight:bold;
    margin-bottom:2vw;
    margin-left:3vw;
    color:rgba(51,51,51,1);
  }
  div{
    margin-left:2vw;
  }
  button{
    width: 20vw;
    height: 8vw;
    line-height: 7vw;
    font-size:3vw;
    font-family:PingFang SC;
    font-weight:bold;
    color:#333333;
    background: #EEEEEE;
    border-radius:1vw;
  }
  // button:nth-of-type(2){
  //   width: 20vw;
  //   height: 8vw;
  //   line-height: 8vw;
  //   font-size:3vw;
  //   font-family:PingFang SC;
  //   font-weight:bold;
  //   background: #fff;
  //   border-radius:1vw;
  // }
}
.foot{
  width: 95vw;
  margin:0 auto;
  margin-top:8vw;
  p{
    display: flex;
    align-items: center;
    font-size:3vw;
    line-height: 8vw;
    font-family:PingFang SC;
    font-weight:bold;
    color:rgba(102,102,102,1);
    justify-content: space-between;
  }
}
.extract {
  margin: 3vw;
  // background: #1c1c1d;
  li {
    height: 18vw;
    margin-top:10vw;
    position:relative;
    // display: flex;
    // justify-content: space-between;
    border-bottom: 1px solid rgba(229,229,229,1);
    p{
      // width:223px;
      // height:25px;
      font-size:3.5vw;
      font-family:PingFang SC;
      font-weight:bold;
      margin-bottom:5vw;
      position:relative;
      color:rgba(51,51,51,1);
    }
    > span:nth-child(1) {
      width: 30vw;
      display: inline-block;
      font-size: 4vw;
    }
    span:nth-of-type(2){
      font-size:3vw;
      font-family:PingFang SC;
      font-weight:500;
      position:absolute;
      left:0;
      bottom:-5vw;
      color:rgba(153,153,153,1);
    }
    input {
      width: 100%;
      height: 8vw;
      font-size: 3.3vw;
      // background: #1c1c1d;
      border: 0;
      font-weight: bold;
      color: #333;
    }
    >span:nth-child(3) {
      position:absolute;
      top: 11vw;
      right: 2vw;
    } 
    /* WebKit browsers */
    input::-webkit-input-placeholder {
      color: #999999;
      font-weight: bold;
    }
    /* Mozilla Firefox 4 to 18 */
    input:-moz-placeholder {
      color: #999999;
      font-weight: bold;
    }
    /* Mozilla Firefox 19+ */
    input::-moz-placeholder {
      color: #999999;
      font-weight: bold;
    }
    /* Internet Explorer 10+ */
    input:-ms-input-placeholder {
      color: #999999;
      font-weight: bold;
    }
  }
}
.main_bgs {
  margin: 15vw 5.5vw 5vw;
  button {
    background: #EE281C;
    font-size: 4vw;
    border-radius: 1vw;
  }
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
  // background: #1c1c1d;
  display: flex;
  flex-wrap: nowrap;
  // justify-content: center;
  align-items: center;
}
/deep/.van-hairline--top-bottom:after {
  border-width:0;
}
/deep/.van-tabs__line {
  display: none;
}
</style>