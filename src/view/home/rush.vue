<template>
  <div class="mine_box">
    <my-header :showBack="true" title="抢购" rightText="记录" :showRight="true" @rightAction="pushPath('/rushList')" />
    <div class="content">
      <div class="number">
        <p>今日可抢AXM数量：5000</p>
        <ul>
          <li>
            <p>AXM个数</p>
            <div>
              <input type="text" maxlength="11" v-model="num" placeholder="输入您想抢购的数量">
              <span @click="getAXM">抢购</span>
            </div>
            <p>资产最大可抢数: <span style="color:#333333;fontWeight:bold;">780</span></p>
          </li>
          <li>
            <p>单价/usdt</p>
            <div>
              <input type="number" v-model="price" disabled>
              <span>USDT</span>
            </div>
            <p>可用usdt: 200</p>
          </li>
        </ul>
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
            :focused="showKeyboard"
            @focus="showKeyboard = true"
          />
          <p class="del">
            <span>扣除金额:&nbsp;&nbsp;{{(parseInt(num)*price).toFixed(2)}}&nbsp;&nbsp;USDT</span> 
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
      <div class="news">
        <p>
          <span></span>
          <span>公示栏</span>
        </p>
        <div class="cont">
          <p>
            <span>{{phoneNum.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2')}}</span>
            <span>抢购成功&nbsp;&nbsp;<em style="color:#EE281C;">+2.6</em></span>
          </p>
          <p>
            <span>{{phoneNum.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2')}}</span>
            <span>抢购成功&nbsp;&nbsp;<em style="color:#EE281C;">+2.6</em></span>
          </p>
        </div>
        <van-notice-bar left-icon="volume-o" :scrollable="false">
          <van-swipe
            vertical
            class="notice-swipe"
            :autoplay="3000"
            :show-indicators="false"
          >
            <van-swipe-item style="width:200px;">
              <span style="margin-right:22vw;">{{phoneNum.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2')}}</span>
              <span>抢购成功&nbsp;&nbsp;<em style="color:#EE281C;">+2.6</em></span>
            </van-swipe-item>
            <van-swipe-item style="width:200px;">
              <span style="margin-right:22vw;">{{phoneNum.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2')}}</span>
              <span>抢购成功&nbsp;&nbsp;<em style="color:#EE281C;">+2.6</em></span>
            </van-swipe-item>
            <van-swipe-item style="width:200px;">
              <span style="margin-right:22vw;">{{phoneNum.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2')}}</span>
              <span>抢购成功&nbsp;&nbsp;<em style="color:#EE281C;">+2.6</em></span>
            </van-swipe-item>
          </van-swipe>
        </van-notice-bar>
      </div>
    </div>
  </div>
</template>

<script>
import { Toast } from "vant";
export default {
  data() {
    return {
      num:"",
      show:false,
      value:"",
      showKeyboard: true,
      price:0.35,
      phoneNum:'13349952496'
    };
  },
  watch: {
  
  },
  created() {
    if (this.$route.fullPath.indexOf("?") != -1) {
      this.goBack();
    }
  },
  mounted() {
    
  },

  methods: {
    //抢购
    getAXM(){
      if(!this.num){
        Toast({message:"数量不能为空",position:"center",duration:"1000" })
      }else{
        this.show = true;
      }
    },
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
        Toast({message:"抢购成功",position:"center",duration:"1000" })
        } else {
          this.errorInfo = '';
        }
    }
  }
};
</script>

<style lang='less' scoped>
/deep/.header_box + div {
  // background: #0e0e0e;
}
/* WebKit browsers */
input::-webkit-input-placeholder {
  color: #C8C8C8;
}
/* Mozilla Firefox 4 to 18 */
input:-moz-placeholder {
  color: #C8C8C8;
}
/* Mozilla Firefox 19+ */
input::-moz-placeholder {
  color: #C8C8C8;
}
/* Internet Explorer 10+ */
input:-ms-input-placeholder {
  color: #C8C8C8;
}
.notice-swipe {
  height: 40px;
  // line-height: 40px;
}
.number{
  width:90vw;
  height:45vh;
  margin:0 auto;
  margin-top:3vw;
  padding:2.5vw;
  background:rgba(255,255,255,1);
  box-shadow:0px 4px 24px 0px rgba(4,0,0,0.13);
  border-radius:1vw;
  >p{
    font-size:4vw;
    font-family:PingFang SC;
    font-weight:bold;
    margin-left:1vw;
    margin-bottom:10vw;
    color:rgba(238,40,28,1);
  }
  ul>li{
    height: 18vw;
    position:relative;
    margin-bottom:15vw;
    border-bottom:1px solid rgba(229,229,229,1);
    div{
      display:flex;
      align-content: center;
      justify-content: space-between;
      span{
        line-height: 10vw;
      }
    }
    >p{
      font-size:3.6vw;
      font-family:PingFang SC;
      font-weight:500;
      margin-bottom:3vw;
      color:rgba(51,51,51,1);
    }
    p:nth-of-type(2){
      font-size:3.5vw;
      font-family:PingFang SC;
      font-weight:500;
      position:absolute;
      left:0;
      bottom:-10vw;
      color:rgba(153,153,153,1);
    }
    input{
      width: 80vw;
      height: 10vw;
      border:0;
      color:#333;
      font-weight: 550;
    }
    >span{
      font-size:4vw;
      font-family:PingFang SC;
      font-weight:500;
      color:rgba(51,51,51,1);
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
.news{
  width:90vw;
  height:35vh;
  margin:0 auto;
  margin-top:5vw;
  padding:2vw;
  background:rgba(255,255,255,1);
  box-shadow:0px 4px 24px 0px rgba(4,0,0,0.13);
  border-radius:1vw;
  >p{
    line-height: 5vw;;
    margin-bottom:5vw;
    span:nth-of-type(1){
      float:left;
      width:1vw;
      height:5vw;
      margin-right:2vw;
      background-color: #FF6628;
    }
    span:nth-of-type(2){
      font-size:4vw;
      font-family:PingFang SC;
      font-weight:bold;
      color:rgba(238,40,28,1);
    }
  }
  .cont{
    >p{
      display: flex;
      font-size:4vw;
      font-family:PingFang SC;
      font-weight:500;
      line-height: 7vw;
      color:rgba(51,51,51,1);
      align-items: center;
      justify-content: space-between;
    }
  }
}
</style>