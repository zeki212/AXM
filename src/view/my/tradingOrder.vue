<template>
  <div>
    <my-header :showBack="true" title="AXM订单" :showRight="true" />
    <div class="content">
      <div class="tabtitle">
        <div>
          <span @click="getActiveUsdt(1)" v-if="activeUsdt==1" style="fontSize:3.8vw;color:#333;">买单</span>
          <span @click="getActiveUsdt(1)" v-else>买单</span>
          <span @click="getActiveUsdt(2)" v-if="activeUsdt==2" style="fontSize:3.8vw;color:#333;">卖单</span>
          <span @click="getActiveUsdt(2)" v-else>卖单</span>
          <span
            @click="getActiveUsdt(3)"
            v-if="activeUsdt==3"
            style="fontSize:3.8vw;color:#333;"
          >已完成</span>
          <span @click="getActiveUsdt(3)" v-else>已完成</span>
        </div>   
      </div>
      <van-pull-refresh v-model="isLoading" class="myHeight" @refresh="onRefresh">
        <van-list v-model="loading" :finished="finished" @load="loadMore" :offset="20">
          <ul v-for="(item,index) in list" :key="index">
            <li>
              <p>
                <em v-if="activeUsdt==1" style="color:#37A891;">购买</em>
                <em v-if="activeUsdt==2" style="color:#EE281C;">出售</em>
                &nbsp;AXM
                <span v-if="item.tradeStatus==1" @click="cancelOrder(item.orderId)">取消订单</span>
                <span v-if="item.tradeStatus==2">待付款</span>
                <span v-if="item.tradeStatus==3">待确认</span>
                <span v-if="item.tradeStatus==4">已完成</span>
                <span v-if="item.tradeStatus==5">已取消</span>
                <span v-if="item.tradeStatus==6">申诉中</span>
              </p>
              <div class="cont" @click="goOrderDetail(item)">
                <div>
                  <p style="textAlign:left;">时间</p>
                  <p style="textAlign:left;">{{item.orderTime|formatDate('yyyy-MM-dd hh:mm:ss')}}</p>
                </div>
                <div>
                  <p>数量（RMB）</p>
                  <p>{{item.num}}</p>
                </div>
                <div>
                  <p>交易总额（CNY）</p>
                  <p>{{item.totalPrice}}</p>
                </div>
              </div>
            </li>
          </ul>
        </van-list>
      </van-pull-refresh>
      <div class="no_data" v-show="isLoad&&list.length==0">
        <img src="../../assets/img/home/zanwu.png" alt />
      </div>
    </div>
  </div>
</template>

<script>
import { Toast, Dialog, Progress, ImagePreview } from "vant";
export default {
  data() {
    return {
      activeUsdt: 1,
      isLoad: false,
      loading: false,
      isLoading: false,
      finished: true,
      list: "",
      pageNo: 1,
      pageSize: 10,
      userInfo: JSON.parse(localStorage.getItem("userInfo")),
      version: this.$information.VERSION,
    };
  },
  created() {
    this.getTradeOrderList();
  },
  methods: {
    // 前往订单详情
    goOrderDetail(item) {
      if (item.tradeStatus == 2 || item.tradeStatus == 3) {
        this.$router.push({ name: "orderDetail" });
        sessionStorage.orderDetail = JSON.stringify(item);
      }
    },
    getActiveUsdt(id) {
      this.activeUsdt = id;
      this.list = '';
      this.getTradeOrderList();
    }, 
    // 取消订单
    cancelOrder(id) {
      let params = { version: this.version, orderId: id };
      var formObject = encodeParams(
        params,
        this.userInfo.userId,
        this.userInfo.tokenId,
        this.userInfo.appKey
      );
      this.$ajax(
        this.$api.cancelOrder,
        { version: this.version, orderId: id },
        formObject.sign
      ).then((res) => {
        if (res.code == 200) {
          this.getTradeOrderList();
          Toast({ message: res.msg, position: "bottom" });
        } else {
          Toast({ message: res.msg, position: "bottom" });
        }
      });
    },
    // 获取订单信息
    getTradeOrderList() {
      let params = {
        version: this.version,
        pageNo: (this.pageNo = 1),
        pageSize: this.pageSize,
        type: this.activeUsdt,
      };
      var formObject = encodeParams(
        params,
        this.userInfo.userId,
        this.userInfo.tokenId,
        this.userInfo.appKey
      );
      this.isLoad = false;
      this.$ajax(
        this.$api.getTradeOrderList,
        {
          version: this.version,
          pageNo: params.pageNo,
          pageSize: this.pageSize,
          type: this.activeUsdt,
        },
        formObject.sign
      ).then((res) => {
        this.loading = false;
        this.isLoad = true;
        if (res.code == 200) {
          if (res.data) {
            // console.log(res);
            this.list = res.data.list;
            // this.list = res.data.list.filter(element => {
            //   element.imageUrl = ""
            //   return element
            // });
            this.finished =
              res.data.totalCount / res.data.pageSize < this.pageNo;
          }
        } else {
          Toast({ message: res.msg, position: "bottom" });
        }
      });
    },
    // 加载更多
    loadMore() {
      let params = {
        version: this.version,
        pageNo: (this.pageNo += 1),
        pageSize: this.pageSize,
        type: this.activeUsdt,
      };
      var formObject = encodeParams(
        params,
        this.userInfo.userId,
        this.userInfo.tokenId,
        this.userInfo.appKey
      );
      this.isLoad = false;
      this.$ajax(
        this.$api.getTradeOrderList,
        {
          version: this.version,
          pageNo: params.pageNo,
          pageSize: this.pageSize,
          type: this.activeUsdt,
        },
        formObject.sign
      ).then((res) => {
        this.loading = false;
        if (res.code == 200) {
          if (res.data && res.data.list.length > 0) {
            this.list = this.list.concat(res.data.list);
            this.finished =
              res.data.totalCount / res.data.pageSize < this.pageNo;
          } else {
            this.finished = true;
          }
        } else {
          Toast({ message: res.msg, position: "bottom" });
        }
      });
    },
    onRefresh() {
      setTimeout(() => {
        this.getTradeOrderList();
        // this.$toast('刷新成功');
        this.isLoading = false;
      }, 500);
    },
  },
};
</script>

<style lang="less" scoped>
.content {
  width: 100%;
  .tabtitle {
    width: 100%;
    height: 5vw;
    margin-bottom: 5vw;
    padding: 3vw 0;
    position: relative;
    overflow: hidden;
    border-bottom: 1px solid rgba(229, 229, 229, 1);
    // background-color: pink;
    div {
      width: 100%;
      height: 20vw;
      position: absolute;
      top: 0;
      left: 0;
      padding: 3vw 0 3vw 3vw;
      z-index: 100;
      span {
        font-size: 3.5vw;
        font-family: PingFang SC;
        font-weight: bold;
        margin-right: 4vw;
        color: rgba(102, 102, 102, 1);
        // line-height:106px;
        img {
          width: 2.5vw;
          height: 1.5vw;
          margin-left: 1vw;
        }
      }
    }
  }
  .myHeight {
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
  ul {
    padding: 3vw;
    li {
      height: 27vw;
      margin-bottom: 5vw;
      border-bottom: 1px solid rgba(229, 229, 229, 1);
      > p {
        font-size: 3.6vw;
        height: 6vw;
        line-height: 6vw;
        font-family: PingFang SC;
        font-weight: bold;
        margin-bottom: 4vw;
        color: #333333;
        position: relative;
        span {
          position: absolute;
          top: 0;
          right: 4vw;
          font-size: 3vw;
          font-family: PingFang SC;
          font-weight: bold;
          color: rgba(238, 40, 28, 1);
          // button{
          //   width:16vw;
          //   height:6vw;
          //   border:0;
          //   background:rgba(238,40,28,1);
          //   border-radius:1vw;
          //   font-family:PingFang SC;
          //   font-weight:500;
          //   color:rgba(255,255,255,1);
          // }
        }
      }
      .cont {
        display: flex;
        align-content: center;
        justify-content: space-between;
        div {
          text-align: center;
          font-size: 3.6vw;
          font-family: PingFang SC;
          font-weight: 400;
          line-height: 8vw;
          color: rgba(102, 102, 102, 1);
          p:last-child {
            color: #333333;
            font-weight: bold;
          }
        }
      }
    }
  }
}
</style>