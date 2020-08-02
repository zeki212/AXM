<template>
  <div class="mine_box">
    <my-header class="headerS" :showBack="true" title="抢购记录" />
    <div class="content">
      <van-list  v-model="loading" :finished="finished" @load="loadMore" :offset="20">
        <ul v-for="(item,index) in list" :key="index">
          <li>
            <p>抢购记录</p>
            <div class="one">
              <div>
                <p>状态</p>
                <p v-if="item.status==1">已完成</p>
                <p v-else>未完成</p>
              </div>
              <div>
                <p>时间</p>
                <p>{{item.createTime|formatDate('yyyy-MM-dd hh:mm:ss')}}</p>
              </div>
              <div style="textAlign:left;">
                <p>数量</p>
                <p>{{item.num}}</p>
              </div>
            </div>
          </li>
        </ul>
      </van-list>
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
  mounted() {
    this.getExtractRecordList();
  },
  methods:{
    getExtractRecordList() {
      let params = { version: this.version, pageNo: this.pageNo = 1, pageSize: this.pageSize, type: this.type };
      var formObject = encodeParams(params, this.userInfo.userId, this.userInfo.tokenId, this.userInfo.appKey);
      this.isLoad = false;
      this.$ajax(this.$api.getExtractRecordList, { version: this.version, pageNo: params.pageNo, pageSize: this.pageSize, type: this.type }, formObject.sign)
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
      this.$ajax(this.$api.getExtractRecordList, { version: this.version, pageNo: params.pageNo, pageSize: this.pageSize, type: this.type }, formObject.sign)
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
    width: 40vw;
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
      // p{
      //   // width:101px;
      //   // height:27px;
      //   font-size:2.6vw;
      //   font-family:PingFang SC;
      //   font-weight:bold;
      //   color:rgba(51,51,51,1);
      // }
      .one{
        display: flex;
        margin-top:4vw;
        align-items: center;
        justify-content: space-between;
        div{
          color:#333333;
          text-align: center;
          font-family:PingFang SC;
          font-size: 2.4vw;
          font-weight: bold;
          p:nth-child(1){
            font-weight:500;
            color:#666666;
            font-size: 2.2vw;
            margin-bottom:3vw;
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