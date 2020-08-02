<template>
  <div>
    <my-header class="headerS" :showBack="true" title="我的订单" />
    <div class="content">
      <!-- <van-tabs v-model="active" title-active-color="#333" title-inactive-color="#666666" line-height="0px">
        <van-tab title="委托订单">委托订单</van-tab>
        <van-tab title="卖出订单">卖出订单</van-tab>
        <van-tab title="已完成">已完成</van-tab>
      </van-tabs> -->
      <div class="tabtitle">
        <div>
            <span @click="getActiveList(1)" v-if="active==1" style="fontSize:4vw;color:#333;">委托订单</span>
            <span @click="getActiveList(1)" v-else>委托订单</span>
            <!-- <span @click="getActiveList(2)" v-if="active==2" style="fontSize:4vw;color:#333;">卖出订单</span>
            <span @click="getActiveList(2)" v-else>卖出订单</span> -->
            <span @click="getActiveList(3)" v-if="active==3" style="fontSize:4vw;color:#333;">已完成</span>
            <span @click="getActiveList(3)" v-else>已完成</span>
        </div>
      </div>
      <van-pull-refresh v-model="isLoading" class="myHeight" @refresh="onRefresh">
        <van-list v-model="loading" :finished="finished" @load="loadMore" :offset="20">
          <ul v-for="(item,index) in list" :key='index'>
            <li @click="getOrderX(item)">
              <p>
                <em v-if="item.orderType==1" style="color:#37A891;">买入</em>
                <em v-if="item.orderType==2" style="color:#EE281C;">卖出</em>
                <!-- <em v-if="active==3" style="color:#37A891;">卖入</em> -->
                &nbsp;AXM/USDT
                <span v-if="item.tradeStatus==1"><button @click="getCancelOrder(item.orderId)">取消订单</button></span>
                <!-- <span v-if="item.tradeStatus==1"><button>待匹配</button></span>
                <span v-if="item.tradeStatus==2"><button>待付款</button></span>
                <span v-if="item.tradeStatus==3"><button>待确认</button></span> -->
                <span v-if="item.tradeStatus==4">已完成</span>
                <span v-if="item.tradeStatus==5">已取消</span>
                <!-- <span v-if="item.tradeStatus==6"><button>申诉中</button></span> -->
              </p>
              <div class="cont">
                <div>
                  <p style="textAlign:left;">时间</p>
                  <p style="textAlign:left;">{{item.orderTime|formatDate('yyyy-MM-dd hh:mm:ss')}}</p>
                </div>
                <div>
                  <p>委托价（usdt）</p>
                  <p>{{item.price}}</p>
                </div>
                <div>
                  <p>委托量（axm）</p>
                  <p>{{item.num}}</p>
                </div>
              </div>
            </li>
          </ul>
        </van-list>
      </van-pull-refresh>
      <div class="no_data" v-show="isLoad&&list.length==0">
        <img src="../../assets/img/home/zanwu.png" alt="">
      </div>
    </div>
  </div>
</template>

<script>
import ClipboardJS from 'Clipboard'
import { Toast, Dialog, Progress, ImagePreview } from "vant";
export default {
  data(){
    return {
      active:1,
      pageNo:1,
      pageSize:10,
      list:'',
      isLoad: false,
      loading: false,
      isLoading: false,
      finished: true,
      userInfo:JSON.parse(localStorage.getItem("userInfo")),
      version: this.$information.VERSION,
    }
  },
  created(){
    // this.getTradeOrderList();
  },
  mounted(){
    this.getTradeOrderList();
  },
  methods:{
    // 订单详情
    getOrderX(item){
      if(item.tradeStatus == 4){
        this.$router.push({name:'orderX'});
        localStorage.orderList = JSON.stringify(item);
      }
    },
    // 获取订单类别信息
    getActiveList(id){
      this.active = id;
      this.getTradeOrderList();
    },
    // 取消订单
    getCancelOrder(id){
      console.log(id);
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
    // 获取订单信息
    getTradeOrderList() {
      let params = { version: this.version, pageNo: this.pageNo = 1, pageSize: this.pageSize, type: this.active };
      var formObject = encodeParams(params, this.userInfo.userId, this.userInfo.tokenId, this.userInfo.appKey);
      this.isLoad = false;
      this.$ajax(this.$api.getTradeOrderList, { version: this.version, pageNo: params.pageNo, pageSize: this.pageSize, type: this.active }, formObject.sign)
        .then(res => {
          this.loading = false;
          this.isLoad = true;
          if (res.code == 200) {
            if (res.data) {
              this.list = res.data.list;
              // this.list = res.data.list.filter(element => {
              //   element.imageUrl = ""
              //   return element
              // });
              this.finished = res.data.totalCount / res.data.pageSize < this.pageNo;
            }
          } else {
            Toast({ message: res.msg, position: "bottom" });
          }
        })
    },
    // 加载更多
    loadMore() {
      let params = { version: this.version, pageNo: this.pageNo += 1, pageSize: this.pageSize, type: this.active };
      var formObject = encodeParams(params, this.userInfo.userId, this.userInfo.tokenId, this.userInfo.appKey);
      this.isLoad = false;
      this.$ajax(this.$api.getTradeOrderList, { version: this.version, pageNo: params.pageNo, pageSize: this.pageSize, type: this.active }, formObject.sign)
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
    onRefresh() {
      setTimeout(() => {
        this.getTradeOrderList()
        // this.$toast('刷新成功');
        this.isLoading = false;
      }, 500);
    },
  }
}
</script>

<style lang="less" scoped>
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
    }
  }
  .myHeight{
    overflow: visible;
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
  ul{
    padding:3vw;
    li{
      height: 27vw;
      margin-bottom:5vw;
      border-bottom:1px solid rgba(229,229,229,1);
      >p{
        font-size:3.6vw;
        height: 6vw;
        line-height: 6vw;
        font-family:PingFang SC;
        font-weight:bold;
        margin-bottom:4vw;
        color:#333333;
        position:relative;
        span{
          position:absolute;
          top:0;
          right:4vw;
          z-index:100;
          font-size:2.5vw;
          font-family:PingFang SC;
          font-weight:bold;
          color:rgba(102,102,102,1);
          button{
            width:16vw;
            height:6vw;
            border:0;
            background:rgba(238,40,28,1);
            border-radius:1vw;
            font-family:PingFang SC;
            font-weight:500;
            color:rgba(255,255,255,1);
          }
        }
      }
      .cont{
        display: flex;
        align-content: center;
        justify-content:space-between;
        div{
          text-align: center;
          font-size:3.6vw;
          font-family:PingFang SC;
          font-weight:400;
          line-height: 8vw;
          color:rgba(102,102,102,1);
          p:last-child{
            color:#333333;
            font-weight:bold;
          }
        }
      }
    }
  }
}
</style>