<template>
  <div class="mine_box">
    <my-header :showBack="true" title="提币" rightText='记录' :showRight="true" @rightAction="pushPath('/record')" />
    <div class="content">
      <div class="titles">
        <p style="fontSize:3.8vw;color:#333;fontWeight:bold;">USDT</p>
        <p @click="checked">
          <span>选择币种</span>  
          <img src="../../assets/img/my/you.png" alt="">
        </p>
      </div>
      <!-- 提币方式 -->
      <div class="mode">
        <p>提币方式</p>
        <div class="mode_bg">
          <van-button type="primary" size="large" v-if="modetype=='axm'" @click="getAXM('axm')" :style="styleObject">AXM</van-button>
          <van-button type="primary" size="large" @click="getAXM('axm')" v-else>AXM</van-button>
          <van-button type="primary" size="large" v-if="modetype=='usdt'" :style="styleObject" @click="getAXM('usdt')">USDT</van-button>
          <van-button type="primary" size="large" v-else @click="getAXM('usdt')">USDT</van-button>
        </div>
      </div>
      <ul class="extract">
        <li>
          <p>提币地址（ERC20）</p>
          <input type="text" v-model="qrCode" placeholder="请输入提币地址">
        </li>
        <li>
          <p>数量</p>
          <input type="number" oninput="if(value.length > 11)value = value.slice(0, 11)" v-model="num"  placeholder="请输入提币数量">
          <span class="posiSpan" v-if="modetype=='usdt'">可用usdt:{{sweets.usdt}}</span>
          <span class="posiSpan" v-if="modetype=='axm'">可用axm:{{sweets.sweets}}</span>
        </li>
        <li v-if="modetype=='usdt'">
          <p>手续费</p>
          <span style="font-size: 3.7vw;font-weight: bold">{{sweets.withdrawalFee}}</span>
          <span style="font-weight: bold">USDT</span>
        </li>
        <li v-if="modetype=='axm'">
          <p>手续费</p>
          <span style="font-size: 3.7vw;font-weight: bold">???</span>
          <span style="font-weight: bold">AXM</span>
        </li>
      </ul>
      <div class="foot">
        <p>
          <span>到账数量：</span>
          <span v-if="this.num.length>0" style="width:75vw;textAlign:right;color:#333333;">{{num}}&nbsp;USDT</span>
          <span v-else style="width:75vw;textAlign:right;color:#333333;">0.00&nbsp;USDT</span>
        </p>
        <p v-if="modetype=='usdt'">
          <span>扣除资产：</span>
          <span v-if="this.num.length>0"  style="width:75vw;textAlign:right;color:#333333;">
            {{parseInt(num)+parseInt(sweets.withdrawalFee)}}
            USDT
          </span>
          <span v-else style="width:75vw;textAlign:right;color:#333333;">
            0.00&nbsp;USDT
          </span>
        </p>
        <p v-if="modetype=='axm'">
          <span>扣除资产：</span>
          <span v-if="this.num.length>0"  style="width:75vw;textAlign:right;color:#333333;">
            ???
            USDT
          </span>
          <!-- <span v-if="this.num.length>0"  style="width:75vw;textAlign:right;color:#333333;">
            {{parseInt(num)+parseInt(sweets.withdrawalFee)}}
            USDT
          </span> -->
          <span v-else style="width:75vw;textAlign:right;color:#333333;">
            ???&nbsp;AXM
            <!-- 0.00&nbsp;AXM -->
          </span>
        </p>
      </div>
      <div class="main_bgs">
        <van-button type="primary" size="large" @click="usdtTransfer()">提币</van-button>
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
            <span>扣除金额:&nbsp;&nbsp;{{parseInt(num)+parseInt(sweets.withdrawalFee)}}&nbsp;&nbsp;USDT</span> 
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
      value:"",
      modetype:"usdt",
      errorInfo:"",
      showKeyboard: true,
      userInfo: JSON.parse(localStorage.getItem("userInfo")),
      version: this.$information.VERSION,
      sweets: '',
      qrCode: sessionStorage.getItem('qrCode'),
      num: '',
      idNo: '',
      payPwd: '',
      // active: 0,
      rechargeType: '1',
      // flag: true,
      styleObject:{
        color:'rgba(238,40,28,1)',
        backgroundColor:'#fff',
        border:'1px solid rgba(238,40,28,1)'
      }
    };
  },
  // computed: {
  //   deUsdt(){
  //     return (parseInt(this.num)+this.num*this.sweets.withdrawalFee) || 0
  //   }
  // },
  filters:{

  },
  watch: {
    // active(val) {
    //   if (val == 0) {
    //     this.rechargeType = '1'
    //     this.flag = true
    //   }
    //   if (val == 1) {
    //     this.rechargeType = '2'
    //     this.flag = false
    //   }
    // }
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
    close(){
      this.show = false;
      this.value = "";
    },
    onDelete() {
      this.value = this.value.slice(0, this.value.length - 1);
    },
    onInput(key) {
      this.value = (this.value + key).slice(0, 6);
      if (this.value.length === 6) {
        // this.errorInfo = '密码错误';
        let params = {address:this.qrCode,num:this.num,payPwd:this.value};
        var formObject = encodeParams(params, this.userInfo.userId, this.userInfo.tokenId, this.userInfo.appKey);
        this.$ajax(this.$api.usdtTransfer,{address:this.qrCode,num:this.num,payPwd:this.value},formObject.sign).then(res => {
          if (res.code == 200) {
            Toast({ message: res.msg, position: "center",duration:"1000"  });
            this.show = false;
            this.qrCode = '';
            this.num = '';
            this.value = '';
            this.getCustInfo();
          } else {
            this.show = false;
            this.num = '';
            this.value = '';
            Toast({ message: res.msg, position: "center",duration:"1000"  });
          }
        })
        } else {
          this.errorInfo = '';
        }
    },
    checked(){
      Toast({ message:"暂未开放其他币种！", position: "center",duration:"1000"  });
    },
    getAXM(type){
      // this.modetype = type;
      Toast({ message:"预计8月开放AXM提币功能！", position: "center",duration:"1000"  });
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
    // 点击提币，弹出密码框
    usdtTransfer() {
      if (!this.qrCode) {
        Toast({ message: "请输入提币地址！", position: "center",duration:"1000"  });
        return;
      }
      if (!this.num) {
        Toast({ message: "请输入提币数量！", position: "center",duration:"1000"  });
        return;
      }
      this.show = true;
    }
  }
};
</script>

<style lang='less' scoped>
/deep/.header_box + div {
  // background: #0e0e0e;
}
.titles {
  width:90vw;
  height:12vw;
  color:#333;
  line-height: 12vw;
  margin:0 auto;
  margin-top: 5vw;
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
  width: 95vw;
  margin:0 auto;
  p{
    font-size:3vw;
    font-family:PingFang SC;
    font-weight:bold;
    margin-bottom:2vw;
    color:rgba(51,51,51,1);
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
  //   color:rgba(238,40,28,1);
  //   background: #fff;
  //   border:1px solid rgba(238,40,28,1);
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
    font-size:3.5vw;
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
      color:rgba(51,51,51,1);
    }
    > span:nth-child(1) {
      width: 30vw;
      display: inline-block;
      font-size: 4vw;
    }
    .posiSpan{
      position:absolute;
      left: 0;
      bottom:-5vw;
      font-size:3.5vw;
      font-family:PingFang SC;
      font-weight:500;
      color:rgba(153,153,153,1);
    }
    input {
      width: 100%;
      font-size: 3.3vw;
      height: 8vw;
      // background: #1c1c1d;
      border: 0;
      font-weight: bold;
      color: #333;
    }
    /* WebKit browsers */
    input::-webkit-input-placeholder {
      color: #8f8f8f;
    }
    /* Mozilla Firefox 4 to 18 */
    input:-moz-placeholder {
      color: #8f8f8f;
    }
    /* Mozilla Firefox 19+ */
    input::-moz-placeholder {
      color: #8f8f8f;
    }
    /* Internet Explorer 10+ */
    input:-ms-input-placeholder {
      color: #8f8f8f;
    }
    >span:nth-child(3) {
        float: right;
        img {
        width: 5vw;
        height: 5vw;
      }
    } 
  }
}
.password{
  position:relative;
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
    input{
      border: 0px;
      // max-width: 100%;
    }
  }
}
.main_bgs {
  margin: 5vw 5.5vw 5vw;
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