<template>
  <div class="mine_box">
    <!-- <my-header class="headerS" :showBack="true" title="爱心工会" /> -->
    <div class="cont">
      <!-- 头部 -->
      <div class="header">
        <div @click="goBack"></div>
        <p><img @click="goBack" src="../../assets/img/home/back.png" alt=""></p>
        <span>爱心工会</span>
      </div>
      <!-- 人数 -->
      <div class="man">
        <div>
          <p>20</p>
          <p>直推人数</p>
        </div>
        <div>
          <p>150</p>
          <p>团队人数</p>
        </div>
        <div>
          <p>80</p>
          <p>团队算力</p>
        </div>
      </div>
    </div>
    <div class="content">
      <van-tabs v-model="active" title-active-color='#FF4444'>
        <van-tab title="全部"></van-tab>
        <van-tab title="已实名"></van-tab>
        <van-tab title="未实名"></van-tab>
      </van-tabs>
      <van-list v-model="loading" :finished="finished" @load="loadMore" :offset="20">
      <ul class="wallet" v-for="(item,index) in list" :key="index">
        <li>
          <p>{{item.detail}}</p>
          <p>{{item.createTime|formatDate('yyyy-MM-dd hh:mm:ss')}}</p>
        </li>
        <li style="color: #58C89C" v-if="item.value>0">+{{item.value}}</li>
        <li style="color: red" v-else>{{item.value}}</li>
      </ul>
      </van-list>
      <div class="no_data" v-show="isLoad&&list.length==0">
        <img src="../../assets/img/home/zanwu.png" alt="">
      </div>
    </div>
  </div>
</template>

<script>
import { Toast, Dialog, Progress } from "vant";
export default {
  data() {
    return {
      userInfo: JSON.parse(localStorage.getItem("userInfo")),
      version: this.$information.VERSION,
      pageNo: 1,
      pageSize: 10,
      type: 1,
      list: '',
      active: 0,
      isLoad: false,
      loading: false,
      finished: true,
    };
  },
  watch: {
    active(val) {
      this.pageNo = 1
      this.finished = true
      if (val == 0) {
        this.type = 1
      }
      if (val == 1) {
        this.type = 6
      }
      if (val == 2) {
        this.type = 5
      }
      this.getProfitRecord();
    }
  },
  created() {
    if (this.$route.fullPath.indexOf("?") != -1) {
      this.goBack();
    }
  },
  mounted() {
    this.getProfitRecord();
  },

  methods: {
    // goBack(){
      // this.router.go(-1);
      // console.log(111,this.router);
    // },
    getProfitRecord() {
      let params = { version: this.version, pageNo: this.pageNo = 1, pageSize: this.pageSize, type: this.type };
      var formObject = encodeParams(params, this.userInfo.userId, this.userInfo.tokenId, this.userInfo.appKey);
      this.isLoad = false;
      this.$ajax(this.$api.getProfitRecord, { version: this.version, pageNo: params.pageNo, pageSize: this.pageSize, type: this.type }, formObject.sign)
        .then(res => {
          this.loading = false;
          this.isLoad = true;
          if (res.code == 200) {
            if (res.data) {
              this.list = res.data.list;
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
      this.$ajax(this.$api.getProfitRecord, { version: this.version, pageNo: params.pageNo, pageSize: this.pageSize, type: this.type }, formObject.sign)
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
    },
  }
};
</script>

<style lang='less' scoped>
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
  // background: #0e0e0e;
}
.font {
  color: #333;
  font-size: 12px;
}
/deep/.van-tabs__line {
  // width: 12vw !important;
  // height: 3px !important;
  // background-color: #58c89c !important;
  // margin-left: 10.6% !important;
}
/deep/.van-tabs--line {
  // padding-top: 10vw;
  margin-bottom: 3vw;
}
/deep/.van-tabs {
  width: 95vw;
  margin:0 auto;
  margin-top:3vw;
  box-shadow:0px 1px 13px 0px rgba(148,148,148,0.3);
  // border-bottom: 1px solid rgb(153, 153, 153);
}
/deep/.van-tab--active {
  color: #FF4444 !important;
}
/deep/[class*="van-hairline"]:after {
  display: none !important;
}
/deep/.van-ellipsis {
  // font-weight: bold !important;
  font-size: 3.7vw;
}
.cont{
  width: 100vw;
  height: 53vw;
  overflow: hidden;
  background: url(../../assets/img/home/mybanner.png) no-repeat;
  background-size: cover;
  .header{
    height: 8vw;
    line-height: 8vw;
    text-align: center;
    position:relative;
    div{
      width: 8vw;
      height: 8vw;
      position:absolute;
      top:0vw;
      left:0vw;
    }
    p{
      img{
        width: 2vw;
        height: 4vw;
        position:absolute;
        top:2vw;
        left:2vw;
      }
    }
    
    span{
      // width:135px;
      // height:32px;
      font-size:4vw;
      font-family:PingFang SC;
      font-weight:500;
      color:#fff;
      // line-height:70px;
    }
  }
  .man{
    width: 100vw;
    display: flex;
    color:#fff;
    font-size: 2.6vw;
    margin-top:20vw;
    align-items: center;
    justify-content: space-around;
    div{
      text-align: center;
      p:nth-child(1){
        margin-bottom:3vw;
        font-size: 2.8vw;
      }
    }
  }
}
.footer_btn {
  background-color: #f4f4f4;
  border: 0;
}
.wallet {
  margin: 1.5vw 3vw;
  padding: 3vw 6vw 3vw 3vw;
  // background: #1c1c1d;
  display: flex;
  align-items: center;
  justify-content: space-between;
  color: #fff;
  position: relative;
  > li:nth-child(1) {
    font-size: 3.5vw;
    > p:nth-child(2) {
      font-size: 3vw;
      margin-top: 1vw;
      opacity:0.72;
    }
  }
  > li:nth-child(2) {
    font-size: 3.5vw;
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
  // background: #1c1c1d;
  color: #333;
}
</style>