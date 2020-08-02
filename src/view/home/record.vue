<template>
  <div class="mine_box">
    <my-header class="headerS" :showBack="true" title="历史记录" />
    <div class="content">
      <van-list  v-model="loading" :finished="finished" @load="loadMore" :offset="20">
        <ul v-for="(item,index) in list" :key="index">
          <li>
            <p v-if="item.type==1">普通充币</p>
            <p v-if="item.type==2">普通提币</p>
            <div class="one">
              <div style="textAlign:left;">
                <p>数量</p>
                <p>{{item.num}}</p>
              </div>
              <div>
                <p>状态</p>
                <p v-if="item.status==1">已完成</p>
                <p v-else>未完成</p>
              </div>
              <div>
                <p>时间</p>
                <p>{{item.createTime|formatDate('yyyy-MM-dd hh:mm:ss')}}</p>
              </div>
            </div>
          </li>
        </ul>
      </van-list>
      <div class="no_data" v-show="isLoad&&list.length==0">
        <img src="../../assets/img/home/zanwu.png" alt="">
      </div>
        <!-- <ul class="details" v-for="(item,index) in list" :key="index">
          <li>充值来源：{{item.address}}</li>
          <li>数量：{{item.num}}</li>
          <li>类型：{{item.remark | types}}</li>
          <li>时间：{{item.createTime|formatDate('yyyy-MM-dd hh:mm:ss')}}</li>
          <li v-if="item.status==1">状态：成功</li> -->
          <!-- <li v-if="active==1">原因：提币地址不正确</li> -->
        <!-- </ul> -->
      <!-- <van-tabs v-model="active" title-active-color='#58C89C'>
        <van-tab title="充币"></van-tab>
        <van-tab title="提币"></van-tab>
      </van-tabs> -->
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
      pushType:sessionStorage.pushType,
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
        this.type = 2
      }
      // this.getExtractRecordList();
    }
  },
  created() {
    if (this.$route.fullPath.indexOf("?") != -1) {
      this.goBack();
    }
  },
  beforeRouteEnter (to, from, next) {
    // ...
    if(from.name=='extract'){
      sessionStorage.pushType=2;
    }
    if(from.name=='topUp'){
      sessionStorage.pushType=1;
    }
    next()
  },
  mounted() {
    // console.log(this.$route.params.type);
    // this.pushType = this.$route.params.type;
    this.getTransferInfo();
  },
  methods: {
    getTransferInfo() {
      let params = {pageNo:this.pageNo,type:this.pushType,pageSize:this.pageSize};
      var formObject = encodeParams(params, this.userInfo.userId, this.userInfo.tokenId, this.userInfo.appKey);
      this.isLoad = false;
      this.$ajax(this.$api.getTransferInfo, {pageNo:params.pageNo,type:this.pushType,pageSize:this.pageSize}, formObject.sign)
        .then(res => {
          this.loading = false;
          this.isLoad = true;
          // console.log(res);
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
      let params = { version: this.version, pageNo: this.pageNo += 1, pageSize: this.pageSize, type: this.pushType };
      var formObject = encodeParams(params, this.userInfo.userId, this.userInfo.tokenId, this.userInfo.appKey);
      this.isLoad = false;
      this.$ajax(this.$api.getTransferInfo, { version: this.version, pageNo: params.pageNo, pageSize: this.pageSize, type: this.pushType }, formObject.sign)
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
  },
  filters: {
    types(type) {
      if(type == "1") { 
        return 'AXM'
      } else if (type == "2") {
        return '钻石'
      }
    }
  }
};
</script>

<style lang='less' scoped>
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
.content{
  ul{
    width: 95vw;
    margin:0 auto;
    overflow: hidden;
    li{
      margin-top:4vw;
      padding-bottom:3vw;
      border-bottom:1px solid rgba(229,229,229,1);
      p{
        // width:101px;
        // height:27px;
        font-size:3.6vw;
        font-family:PingFang SC;
        font-weight:bold;
        color:rgba(51,51,51,1);
      }
      .one{
        display: flex;
        margin-top:4vw;
        align-items: center;
        justify-content: space-between;
        div{
          color:#333333;
          text-align: center;
          font-family:PingFang SC;
          font-weight:500;
          font-size: 3.4vw;
          p:nth-child(1){
            color:#666666;
            font-size: 3.5vw;
            margin-bottom:5vw;
          }
        }
      }
    }
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
  width: 10vw !important;
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
.details {
  margin: 3vw;
  background: #1C1C1D;
  padding: 2vw 2vw 3vw;
  li {
    line-height: 5vw;
    font-size: 3.2vw;
    color: #8F8F8F;
  }
}
</style>