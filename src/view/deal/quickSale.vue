<template>
  <div>
    <my-header :showBack="true" title="快捷买卖U" :showRight="true" rightText="订单" @rightAction="pushPath('/usdtList')"/>
    <div class="content">
      <div class="tabtitle">
        <div>
            <span @click="getActiveList(2)" v-if="active==2" style="fontSize:4vw;color:#333;">我要买</span>
            <span @click="getActiveList(2)" v-else>我要买</span>
            <span @click="getActiveList(1)" v-if="active==1" style="fontSize:4vw;color:#333;">我要卖</span>
            <span @click="getActiveList(1)" v-else>我要卖</span>
            <span @click="buy">发布</span>
        </div>
      </div>
      <van-pull-refresh v-model="isLoading" class="myHeight" @refresh="onRefresh">
        <van-list v-model="loading" :finished="finished" @load="loadMore" :offset="20">
          <ul v-for="(item,index) in list" :key='index'>
            <li>
              <p>
                <img src="../../assets/img/deal/logo2.png" alt="">
                <span>{{item.buyerNickName}}</span>
                <img src="../../assets/img/deal/renv.png" alt="">
              </p>
              <div>
                <p>
                  <span>数量：{{item.num}}RMB</span>
                  <span>单价</span>
                </p>
                <p>
                  <span>总价：{{item.totalPrice}}</span>
                  <span>￥{{item.price}}</span>
                </p>
                <p></p>
              </div>
              <p>
                <img src="../../assets/img/deal/zhi.png" alt="">
                <button v-if="active==2" @click="buyUsdt(item)">购买</button>
                <button v-if="active==1" @click="sell(item)">出售</button>
              </p>
            </li>
          </ul>
        </van-list>
      </van-pull-refresh>
      <div class="no_data" v-show="isLoad&&list.length==0">
        <img src="../../assets/img/home/zanwu.png" alt="">
      </div>
    </div>
    <van-popup v-model="popupSell" class="popBuy" position="bottom" @click-overlay="goDown()">
      <div>
        <span>出售</span>
        <!-- <span @click="goDown">
          <img src="../../assets/img/deal/del.png" alt="">
        </span> -->
      </div>
      <ul>
        <li>
          <span>出售数量</span>
          <input type="text" v-model="sellNum" disabled placeholder="请输入出售数量">
        </li>
        <li>
          <span>单价</span>
          <!-- <input type="text" v-model="buyData.price" disabled> -->
          <input type="text" disabled :placeholder="buyData.price +'（不可输入）'">
        </li>
        <li>
          <span>验证码</span>
          <input type="text" maxlength="4" v-model="msgVerCode" placeholder="请输入验证码">
          <span v-if="!sendDisabled" style="right: 5vw;color:#EE281C;font-size: 3vw" @click="getSmsCode">获取验证码</span>
          <span v-if="sendDisabled" style="right: 5vw;color:#EE281C;font-size: 3vw">{{time}}s</span>
        </li>
        <li>
          <span>交易密码</span>
          <input type="password" maxlength="6" v-model="payPwdtow" placeholder="请输入交易密码">
        </li>
      </ul>
      <div class="buy_btn">
        <van-button type="primary" style="backgroundColor:#EE281C;color:#fff;width:100%;" size="large" @click="confirmSell">确认</van-button>
      </div>
    </van-popup>
    <van-popup v-model="popupBuyorder" class="popBuy" position="bottom" @click-overlay="goDown()">
      <div>
        <span>购买</span>
        <!-- <span @click="goDown">
          <img src="../../assets/img/deal/del.png" alt="">
        </span> -->
      </div>
      <ul>
        <li>
          <span>购买数量</span>
          <input type="text" v-model="buyNum" disabled placeholder="请输入购买数量">
        </li>
        <li>
          <span>单价</span>
          <!-- <input type="text" v-model="buyData.price" disabled> -->
          <input type="text" disabled :placeholder="buyData.price +'（不可输入）'">
        </li>
        <li>
          <span>验证码</span>
          <input type="text" maxlength="4" v-model="buyVerCode" placeholder="请输入验证码">
          <span v-if="!sendDisabled" style="right: 5vw;color:#EE281C;font-size: 3vw" @click="getSmsCode">获取验证码</span>
          <span v-if="sendDisabled" style="right: 5vw;color:#EE281C;font-size: 3vw">{{time}}s</span>
        </li>
        <li>
          <span>交易密码</span>
          <input type="password" maxlength="6" v-model="payBuyword" placeholder="请输入交易密码">
        </li>
      </ul>
      <div class="buy_btn">
        <van-button type="primary" style="backgroundColor:#EE281C;color:#fff;width:100%;" size="large" @click="confirmBuy">确认</van-button>
      </div>
    </van-popup>
    <van-popup v-model="popupBuy" class="popBuy" position="bottom" @click-overlay="goDownBuy()">
        <div>
          <p>
            <span @click="popType(1)" v-if="buyType==1" style="fontWeight:600;">发布买单</span>
            <span @click="popType(1)" v-else>发布买单</span>
            <span @click="popType(2)" v-if="buyType==2" style="fontWeight:600;">发布卖单</span>
            <span @click="popType(2)" v-else>发布卖单</span>
          </p>
        </div>
        <p>我的usdt：<em>{{user.usdt || '0'}}</em></p>
        <ul>
          <!-- 买单 -->
          <li v-if="buyType==1">
            <span>求购数量</span>：
            <input type="number" v-model="num" placeholder="请输入求购数量">
          </li>
          <!-- 卖单 -->
          <li v-if="buyType==2">
            <span>卖出数量</span>：
            <input type="number" v-model="num" placeholder="请输入卖出数量">
          </li>
          <li>
            <span>单价</span>：
            <input type="number" v-model="price" placeholder="请输入单价">
          </li>
          <li class="totalPrice">
            <span>总价</span>：
            <input type="text" v-model="multiple" disabled>
          </li>
          <li>
            <span>交易密码</span>：
            <input type="password" maxlength="6" v-model="payPwd" placeholder="请输入交易密码">
          </li>
        </ul>
        <div class="buy_btn">
          <van-button type="primary" size="large" @click="releaseOrder()">确认发布</van-button>
          <van-button type="primary" size="large"  @click="close">取消发布</van-button>
        </div>
      </van-popup>
  </div>
</template>

<script>
import { Toast, Dialog } from "vant";
export default {
  data(){
    return {
      active:2,
      buyType:1,
      isLoad: false,
      loading: false,
      isLoading: false,
      finished: true,
      price:'',
      user:JSON.parse(localStorage.getItem('user')),
      pageNo: 1,
      pageSize: 10,
      list:'',
      sellNum:'',
      buyNum:'',
      payPwdtow:'',
      payBuyword:'',
      msgVerCode:'',
      buyVerCode:'',
      popupBuyorder: false,
      popupSell:false,
      num:'',
      payPwd:'',
      popupBuy:false,
      buyData: '',
      quotation:'',
      time: 60, // 发送验证码倒计时
      sendDisabled: false,
      userInfo: JSON.parse(localStorage.getItem("userInfo")),
      version: this.$information.VERSION,
    }
  },
  computed:{
    multiple:function(){
      return parseInt(this.num)*this.price || 0.00;
    }
  },
  created(){
    this.getOrderListUsdt();
  },
  mounted(){
    if (this.quotation == '') {
      this.quotation = JSON.parse(localStorage.getItem('quotation'));
    }
  },
  methods:{
    // 切换买单卖单
    popType(type){
      this.buyType = type;
      this.num = '';
      this.price = '';
      this.payPwd = '';
    },
    goDown(){
      this.popupSell = false;
      this.sellNum = '';
      this.msgVerCode = '';
      this.payPwdtow = '';
    },
    goDownBuy(){
      this.buyType = 1;
      this.num = '';
      this.price = '';
      this.payPwd = '';
      this.popupBuy = false;
    },
    // 获取订单类别信息
    getActiveList(id){
      this.active = id;
      this.getOrderListUsdt();
    },
    getOrderListUsdt(){
      let params = { version: this.version, pageNo: this.pageNo = 1, pageSize: this.pageSize, type: this.active };
      var formObject = encodeParams(params, this.userInfo.userId, this.userInfo.tokenId, this.userInfo.appKey);
      this.isLoad = false;
      this.$ajax(this.$api.getOrderListUsdt, { version: this.version, pageNo: params.pageNo, pageSize: this.pageSize, type: this.active }, formObject.sign)
        .then(res => {
          this.loading = false;
          this.isLoad = true;
          if (res.code == 200) {
            if (res.data) {
              this.list = res.data.list;
              this.finished = res.data.totalCount / res.data.pageSize < this.pageNo;
            }
          } else {
            Toast({ message: res.msg, position: "center",duration:"1000" });
          }
        })
    },
    // 加载更多
    loadMore() {
      let params = { version: this.version, pageNo: this.pageNo += 1, pageSize: this.pageSize, type: this.active };
      var formObject = encodeParams(params, this.userInfo.userId, this.userInfo.tokenId, this.userInfo.appKey);
      this.isLoad = false;
      this.$ajax(this.$api.getTradeOrderListUsdt, { version: this.version, pageNo: params.pageNo, pageSize: this.pageSize, type: this.active }, formObject.sign)
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
            Toast({ message: res.msg, position: "bottom" });
          }
        })
    },
    // 发布
    buy() {
      this.popupBuy = true;
    },
    // 发布订单
    releaseOrder() {
      // 发布买单
      if(this.buyType==1){
        if (!this.num) {
          Toast({ message: "请输入求购数量!", position: "center",duration:"1000" });
          return;
        }
        if (!this.price) {
          Toast({ message: "请输入单价！", position: "center",duration:"1000" });
          return;
        }
        if (!this.payPwd) {
          Toast({ message: "请输入交易密码！", position: "center",duration:"1000" });
          return;
        }
        let params = {version:this.version,num: this.num, premium: 1, payPwd: this.payPwd, price: this.price};
        var formObject = encodeParams(params, this.userInfo.userId, this.userInfo.tokenId, this.userInfo.appKey);
        this.$ajax(this.$api.releaseBuyOrder, {version:this.version,num: this.num, premium: 1, payPwd: this.payPwd, price: this.price}, formObject.sign).then(res => {
          if (res.code == 200) {
            Toast({ message: res.msg, position: "center",duration:"1000" });
            this.goDownBuy();
            setTimeout(() => {
              // this.getOrderList();
              this.active = 1;
              this.getOrderListUsdt();
            }, 1000);
          } else {
            Toast({ message: res.msg, position: "top",duration:"1000" });
            this.goDownBuy();
          }
        })
      }
      // 发布卖单
      if(this.buyType==2){
        if (!this.num) {
          Toast({ message: "请输入卖出数量!", position: "center",duration:"1000" });
          return;
        }
        if (!this.price) {
          Toast({ message: "请输入单价！", position: "center",duration:"1000" });
          return;
        }
        if (!this.payPwd) {
          Toast({ message: "请输入交易密码！", position: "center",duration:"1000" });
          return;
        }
        let params = {version:this.version,num: this.num, premium: 1, payPwd: this.payPwd, price: this.price};
        var formObject = encodeParams(params, this.userInfo.userId, this.userInfo.tokenId, this.userInfo.appKey);
        this.$ajax(this.$api.releaseSellOrder, {version:this.version,num: this.num, premium: 1, payPwd: this.payPwd, price: this.price}, formObject.sign).then(res => {
          if (res.code == 200) {
            Toast({ message: res.msg, position: "center",duration:"1000" });
            this.goDownBuy();
            setTimeout(() => {
              // this.getOrderList();
              this.active = 2;
              this.getOrderListUsdt();
            }, 1000);
          } else {
            Toast({ message: res.msg, position: "top",duration:"1000" });
            this.goDownBuy();
          }
        })
      }
    },
    // 取消发布
    close(){
      this.popupBuy = false;
      this.num = '';
      this.payPwd = '';
    },
    // 发送验证码
    getSmsCode() {
      let params = { orderId: this.buyData.orderId, msgType: '6' };
      var formObject = encodeParams(params, this.userInfo.userId, this.userInfo.tokenId, this.userInfo.appKey);
      this.$ajax(this.$api.sendMsgCode, { orderId: this.buyData.orderId, msgType: '6' }, formObject.sign)
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
    },
    // 卖出
    sell(item) {
      // Toast({ message: "暂未开放，敬请期待！", position: "center",duration:"1000" });
      this.buyData = item;
      this.sellNum = item.num;
      if (window.location.href.indexOf("?popupSell") == -1) {
        window.location.href = window.location.href + "?popupSell";
      }
      this.msgVerCode = '';
      this.payPwdtow = '';
      this.popupSell = true;
      let _this = this;
      window.setTimeout(function () {
        _this.$store.commit("updateNeedShowFooter", false);
      }, 100)
    },
    // 购买
    buyUsdt(item) {
      // Toast({ message: "暂未开放，敬请期待！", position: "center",duration:"1000" });
      this.buyData = item;
      this.buyNum = item.num;
      if (window.location.href.indexOf("?popupSell") == -1) {
        window.location.href = window.location.href + "?popupSell";
      }
      this.buyVerCode = '';
      this.payBuyword = '';
      this.popupBuyorder = true;
      let _this = this;
      window.setTimeout(function () {
        _this.$store.commit("updateNeedShowFooter", false);
      }, 100)
    },
    // 售出确认
    confirmSell() {
      if (!this.msgVerCode) {
        Toast({ message: "请输入验证码！", position: "center",duration:"1000" });
        return;
      }
      if (!this.payPwdtow) {
        Toast({ message: "请输入交易密码！", position: "center",duration:"1000" });
        return;
      }
      let params = { msgVerCode: this.msgVerCode, payPwd: this.payPwdtow, orderId: this.buyData.orderId };
      var formObject = encodeParams(params, this.userInfo.userId, this.userInfo.tokenId, this.userInfo.appKey);
      this.$ajax(this.$api.confirmSellUsdt, { msgVerCode: this.msgVerCode, payPwd: this.payPwdtow, orderId: this.buyData.orderId }, formObject.sign).then(res => {
        if (res.code == 200) {
          Toast({ message: res.msg, position: "center",duration:"1000" });
          this.popupSell = false;
          this.msgVerCode = '';
          this.payPwdtow = '';
          this.getOrderListUsdt();
        } else {
          Toast({ message: res.msg, position: "center",duration:"1000" });
        }
      })
    },
    // 购买确认
    confirmBuy() {
      if (!this.buyVerCode) {
        Toast({ message: "请输入验证码！", position: "center",duration:"1000" });
        return;
      }
      if (!this.payBuyword) {
        Toast({ message: "请输入交易密码！", position: "center",duration:"1000" });
        return;
      }
      let params = { msgVerCode: this.buyVerCode, payPwd: this.payBuyword, orderId: this.buyData.orderId };
      var formObject = encodeParams(params, this.userInfo.userId, this.userInfo.tokenId, this.userInfo.appKey);
      this.$ajax(this.$api.confirmBuy, { msgVerCode: this.buyVerCode, payPwd: this.payBuyword, orderId: this.buyData.orderId }, formObject.sign).then(res => {
        if (res.code == 200) {
          Toast({ message: res.msg, position: "center",duration:"1000" });
          this.popupBuyorder = false;
          this.buyVerCode = '';
          this.payBuyword = '';
          this.getOrderListUsdt();
        } else {
          Toast({ message: res.msg, position: "center",duration:"1000" });
        }
      })
    },
    onRefresh() {
      setTimeout(() => {
        this.getOrderListUsdt()
        // this.$toast('刷新成功');
        this.isLoading = false;
      }, 500);
    },
  }
}
</script>

<style lang="less" scoped>
.myHeight{
  overflow: visible;
}
.content{
  .tabtitle{
    width: 100%;
    height: 5vw;
    margin-bottom:5vw;
    padding:3vw;
    overflow: hidden;
    border-bottom:1px solid rgba(229,229,229,1);
    // background-color: pink;
    div{
      width: 100%;
      height: 20vw;
      position:absolute;
      top:0;
      left:0;
      padding:3vw;
      z-index: 100;
      span{
        font-size:3.8vw;
        font-family:PingFang SC;
        font-weight:bold;
        margin-right:4vw;
        color:rgba(102,102,102,1);
        // line-height:106px;
      }
      span:last-child{
        position:absolute;
        top: 3vw;
        right: 6vw;
      }
    }
  }
  ul{
    li{
      width:95vw;
      height:30vw;
      margin:2vw auto;
      background:rgba(255,255,255,1);
      box-shadow:0px 0px 3vw 0px rgba(0, 0, 0, 0.08);
      border-radius:1vw;
      >p:first-child{
        margin-bottom:3vw;
        padding:1.5vw 0 0 3vw;
        img:first-child{
          width: 5vw;
        }
        span{
          font-size:3.5vw;
          font-family:PingFang SC;
          font-weight:500;
          color:rgba(51,51,51,1);
          // line-height:106px;
        }
        img:last-child{
          width: 2.8vw;
          height: 2.3vw;
        }
      }
      div{
        margin-bottom:2.5vw;
        padding:0 2.3vw 0 4vw;
        p{
          display: flex;
          line-height: 5.2vw;
          align-content: center;
          justify-content: space-between;
          span{
            font-size:3.5vw;
            font-family:PingFang SC;
            font-weight:500;
            color:rgba(153,153,153,1);
          }
        }
      }
      p:last-child{
        padding:0 2.3vw 0 4.3vw;
        display: flex;
        align-content: center;
        justify-content: space-between;
        img{
          width: 5.1vw;
          height: 4.8vw;
        }
        button{
          width:14vw;
          height:5vw;
          border:0;
          color:#fff;
          font-size:3.3vw;
          font-family:PingFang SC;
          font-weight:500;
          background:rgba(238,40,28,1);
          border-radius:1vw;
        }
      }
    }
  }
}
.popBuy {
  width: 100%;
  background: #fff;
  color: #333333;
  border-radius: 3vw 3vw 0 0;
  >div{
    >p{
      height: 12vw;
      line-height: 12vw;
      display: flex;
      align-content: center;
      justify-content: space-around;
      border-bottom:1px solid #E5E5E5;
    }
  }
  >p{
    font-size:3.5vw;
    font-family:PingFang SC;
    font-weight:500;
    padding:0 11vw;
    color:rgba(102,102,102,1);
    line-height:8vw;
  }
  > div:nth-child(1) {
    position: relative;
    text-align: center;
    padding: 2vw 0;
    font-family:PingFang SC;
    font-weight:500;
    color:rgba(51,51,51,1);
    // line-height:30px;
    font-size: 4.2vw;
    // span:nth-child(2) {
    //   transform: translateY(-50%);
    //   position: absolute;
    //   top: 45%;
    //   right: 2vw;
    //   img {
    //     width: 4vw;
    //     height: 4vw;
    //   }
    // }
  }
  > ul {
    padding: 2vw 10vw;
    li {
      padding: 2.5vw 1vw;
      // border-bottom: 1px solid #eee;
      display: flex;
      align-items: center;
      > span:nth-child(1) {
        display: inline-block;
        width: 25vw;
        text-align-last: justify;
        font-size: 3.9vw;
      }
      input {
        width: 80vw;
        height: 8vw;
        border: 0;
        // color:#333;
        margin-left: 3vw;
        font-size: 3vw;
        padding-left:2vw;
        background: #fff;
        border-radius: 2vw;
        border:1px solid rgba(170,170,170,1);
      }
    }
    .totalPrice{
      input[disabled]{
        color:#333;
        opacity:1
      }
    }
    li:nth-child(3) {
      position: relative;
      > span:nth-child(3) {
        transform: translateY(-50%);
        position: absolute;
        top: 50%;
        right: 3vw;
        img {
          width: 3.5vw;
          height: 3.5vw;
        }
      }
    }
  }
  .buy_btn {
    margin: 3vw 10vw 3vw;
    display: flex;
    font-size: 3.9vw;
    line-height: 11vw;
    align-content: center;
    justify-content:space-between;
    button:first-child{
      width: 38vw;
      height: 11vw;
      border-radius: 5vw;
      background: #EE281C;
    }
    button:last-child{
      width: 38vw;
      height: 11vw;
      color:#333;
      border-radius: 5vw;
      background: rgba(220,220,220,1);
    }
  }
}
.no_data {
    margin: 11vh auto 0;
    img {
      width: 55vw;
    }
    div {
      margin-top: 2vh;
      font-size: 3.5vw;
      color: #999;
    }
  }
</style>
