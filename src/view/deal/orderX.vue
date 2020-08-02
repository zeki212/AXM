<template>
  <div class="box">
    <my-header :showBack="true" title="委托详情"/>
    <div class="banner">
      <div class="banleft">
        <p v-if="orderList.tradeStatus==4">订单已完成</p>
        <p v-if="orderList.tradeStatus==5">订单已取消</p>
        <p>
          成交时间：
          <span>{{users.finishTime|formatDate('yyyy-MM-dd hh:mm:ss')}}</span> 
        </p>
      </div>
      <div class="banright">
        <img src="../../assets/img/deal/book.png" alt="">
      </div>
    </div>
    <div class="cont">
      <div class="newOne">
        <p>
          <img src="../../assets/img/deal/name.png" alt="">
          信息
        </p>
        <div>
          <p v-if="users.buyerMobile">
            <span>买家</span>
            <span>{{users.buyerMobile}}</span>
          </p>
          <p v-if="users.sellerMobile">
            <span>卖家</span>
            <span>{{users.sellerMobile}}</span>
          </p>
        </div>
      </div>
      <div class="newTwo">
        <p>
          <img src="../../assets/img/deal/list.png" alt="">
          订单信息
        </p>
        <div>
          <p>
            <span>成交数量</span>
            <span>{{users.num}}</span>
          </p>
          <p>
            <span>成交单价</span>
            <span>{{users.price}}RMB</span>
          </p>
          <p>
            <span>成交总价</span>
            <span>{{users.payAmt.toFixed(2)}}RMB</span>
            <!-- <span>{{users.payAmt}}u&nbsp;≈&nbsp;￥{{(users.payAmt*7).toFixed(2)}}</span> -->
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {Toast} from "vant";
export default {
  data(){
    return {
      orderList:'',
      users:'',
      userInfo:JSON.parse(localStorage.getItem("userInfo")),
      version: this.$information.VERSION,
    }
  },
  created(){
    this.orderList = JSON.parse(localStorage.getItem("orderList"));
  },
  mounted(){
    this.getTradeDetailAxm();
  },
  methods:{
    // 获取订单信息
    getTradeDetailAxm(){
      let params = { orderId: this.orderList.orderId };
      var formObject = encodeParams(params, this.userInfo.userId, this.userInfo.tokenId, this.userInfo.appKey);
      this.$ajax(this.$api.getTradeDetailAxm, { orderId: this.orderList.orderId }, formObject.sign).then(res => {
        if (res.code == 200) {
          this.users = res.data;
        } else {
          Toast({ message: res.msg, position: "center",duration:"1000"  });
        }
      })
    }
  }
}
</script>

<style lang="less" scoped>
.banner{
  width:100%;
  height:27vw;
  display: flex;
  font-family:PingFang SC;
  font-weight:500;
  color:rgba(255,255,255,1);
  padding-top:7.3vw;
  // position:relative;
  align-content: center;
  justify-content: space-between;
  background:linear-gradient(84deg,rgba(238,40,28,1) 0%,rgba(255,128,120,1) 100%);
  .banleft{
    font-size:4vw;
    line-height: 7.2vw;
    margin-left:10vw;
    p:last-child{
      font-size: 3vw;
      font-weight: 400;
    }
  }
  .banright{
    img{
      width: 15.3vw;
      height: 12.5vw;
      margin-right:10vw;
    }
  }
}
.cont{
  position:relative;
}
.newOne{
  width: 90vw;
  height: 30vw;
  position: absolute;
  top: 25vw;
  left: 5vw;
  z-index:1;
  padding:3.5vw 0vw 0vw 1.6vw;
  background:rgba(255,255,255,1);
  box-shadow:0px 0px 8px 0px rgba(0, 0, 0, 0.1);
  border-radius:2vw;
  >p:first-child{
    line-height: 5vw;
    font-size:3.7vw;
    font-family:PingFang SC;
    font-weight:500;
    margin-bottom:4vw;
    color:rgba(51,51,51,1);
    img{
      width: 4.3vw;
      height: 4.5vw;
      vertical-align: top;
    }
  }
  >div{
    width: 79vw;
    margin:0 auto;
    padding-top:3.2vw;
    border-top:3px dashed  rgba(244,244,244,1);
    p{
      display: flex;
      margin-left:2vw;
      line-height: 5.5vw;
      font-size:3.5vw;
      font-family:PingFang SC;
      font-weight:500;
      color:rgba(51,51,51,1);
      align-content: center;
      justify-content: space-between;
    }
  }
}
.newTwo{
  width: 90vw;
  height: 33vw;
  position: absolute;
  top: 65vw;
  left: 5vw;
  z-index:1;
  padding:3.5vw 0vw 0vw 1.6vw;
  background:rgba(255,255,255,1);
  box-shadow:0px 0px 8px 0px rgba(0, 0, 0, 0.1);
  border-radius:2vw;
  >p:first-child{
    line-height: 5vw;
    font-size:3.7vw;
    font-family:PingFang SC;
    font-weight:500;
    margin-bottom:4vw;
    color:rgba(51,51,51,1);
    img{
      width: 4.3vw;
      height: 4.5vw;
      vertical-align: top;
    }
  }
  >div{
    width: 79vw;
    margin:0 auto;
    padding-top:3.2vw;
    border-top:3px dashed  rgba(244,244,244,1);
    p{
      display: flex;
      margin-left:2vw;
      line-height: 5.5vw;
      font-size:3.5vw;
      font-family:PingFang SC;
      font-weight:500;
      color:rgba(51,51,51,1);
      align-content: center;
      justify-content: space-between;
    }
  }
}
</style>