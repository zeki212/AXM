<template>
  <div class="mine_box">
    <!-- <my-header class="headerS" :showBack="true" title="我的公会" /> -->
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
          <p>{{user.directNum||'0'}}</p>
          <p>直推人数</p>
        </div>
        <div>
          <p>{{user.teamNum||'0'}}</p>
          <p>团队人数</p>
        </div>
        <div>
          <p>{{user.teamActive}}</p>
          <p>团队算力</p>
        </div>
      </div>
      <!-- 我的上级 -->
      <div class="dear">
        我的上级：{{user.refereeMobile}}
      </div>
    </div>
    <div class="content">
      <!-- <van-tabs v-model="active" title-active-color='#FF4444'>
        <van-tab title="全部"></van-tab>
        <van-tab title="已实名"></van-tab>
        <van-tab title="未实名"></van-tab>
      </van-tabs> -->
      <van-list v-model="loading" :finished="finished" @load="loadMore" :offset="20">
        <ul class="wallet" v-for="(item,index) in list" :key="index">
          <li>
            <div class="wallleft">
              <p>帐号：{{item.mobile}}</p>
              <p v-if="item.level==0">
                等级：普通矿工
                <span style="marginLeft:10vw;">个人算力：{{item.equipActive}}</span>
              </p>
              <p v-if="item.level==1">
                等级：好心人
                <span style="marginLeft:10vw;">个人算力：{{item.equipActive}}</span>
              </p>
              <p v-if="item.level==2">
                等级：志愿者
                <span style="marginLeft:10vw;">个人算力：{{item.equipActive}}</span>
              </p>
              <p v-if="item.level==3">
                等级：大慈善家
                <span style="marginLeft:10vw;">个人算力：{{item.equipActive}}</span>
              </p>
              <p v-if="item.level==4">
                等级：有义之士
                <span style="marginLeft:10vw;">个人算力{{item.equipActive}}</span>
              </p>
              <!-- <p>{{item.registerTime|formatDate('yyyy-MM-dd hh:mm:ss')}}</p> -->
              <p v-if="item.authPayStatus==1">
                状态：<span>已激活</span>/
                <span v-if="item.primaryAuthStatus == 1">已认证</span>
                <span v-else>未认证</span>
              </p>
              <p v-else>
                状态：<span>未激活</span>/
                <span v-if="item.primaryAuthStatus == 1">已认证</span>
                <span v-else>未认证</span>
              </p>
            </div>
          </li>
        </ul>
      </van-list>
      <div class="no_data" v-show="isLoad&&list.length==0">
        <img src="../../assets/img/home/zanwu.png" alt="">
      </div>
    </div>
  </div>
</template>

<script>
import ClipboardJS from 'Clipboard'
import { Toast, Dialog, Progress } from "vant";
export default {
  data() {
    return {
      userInfo: JSON.parse(localStorage.getItem("userInfo")),
      version: this.$information.VERSION,
      pageNo: 1,
      pageSize: 10,
      type: -1,
      list: '',
      active: 0,
      isLoad: false,
      loading: false,
      finished: true,
      user: '',
    };
  },
  watch: {
    active(val) {
      this.pageNo = 1
      this.finished = true
      if (val == 0) {
        this.type = -1
      }
      if (val == 1) {
        this.type = 1
      }
      if (val == 2) {
        this.type = '0'
      }
      // this.getTeam();
    }
  },
  created() {
    if (this.$route.fullPath.indexOf("?") != -1) {
      this.goBack();
    }
  },
  mounted() {
    this.getTeam();
  },

  methods: {
    getTeam() {
      let params = { version: this.version, pageNo: this.pageNo = 1, pageSize: this.pageSize, primaryAuthStatus: this.type };
      var formObject = encodeParams(params, this.userInfo.userId, this.userInfo.tokenId, this.userInfo.appKey);
      this.isLoad = false;
      this.$ajax(this.$api.getTeam, { version: this.version, pageNo: params.pageNo, pageSize: this.pageSize, primaryAuthStatus: this.type }, formObject.sign)
        .then(res => {
          this.loading = false;
          this.isLoad = true;
          if (res.code == 200) {
            if (res.data) {
              this.user = res.data;
              this.list = res.data.list;
              this.finished = res.data.totalCount / res.data.pageSize < this.pageNo;
            }
          } else {
            Toast({ message: res.msg, position: "center",duration:"1000"  });
          }
        })
    },
    loadMore() {
      let params = { version: this.version, pageNo: this.pageNo += 1, pageSize: this.pageSize, primaryAuthStatus: this.type };
      var formObject = encodeParams(params, this.userInfo.userId, this.userInfo.tokenId, this.userInfo.appKey);
      this.isLoad = false;
      this.$ajax(this.$api.getTeam, { version: this.version, pageNo: params.pageNo, pageSize: this.pageSize, primaryAuthStatus: this.type }, formObject.sign)
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
    promote() {
      if (this.user.refereeMobile != "") {
        const clipboard = new ClipboardJS('.copy_btn');
        clipboard.on('success', function (e) {
          e.clearSelection();
          Toast({
            message: '复制成功!',
            position: "center",duration:"1000" 
          });
        });
        clipboard.on('error', function (e) {
          Toast({
            message: '复制失败,请升级浏览器!',
            position: "center",duration:"1000" 
          });
        });
      }
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
  background: #0e0e0e;
}
.font {
  color: #333;
  font-size: 12px;
}
/deep/.van-tabs__line {
  display: none;
  // width: 12vw !important;
  // height: 3px !important;
  // background-color: #58c89c !important;
  // margin-left: 10.6% !important;
}
/deep/.van-tabs--line {
  padding-top: 10vw;
  margin-bottom: 8vw;
}
/deep/.van-tabs {
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
  font-size: 4.2vw;
}
.footer_btn {
  background-color: #f4f4f4;
  border: 0;
}
.cont{
  width: 100vw;
  height: 53vw;
  // overflow: hidden;
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
    font-size: 3.6vw;
    margin-top:20vw;
    align-items: center;
    justify-content: space-around;
    div{
      text-align: center;
      p:nth-child(1){
        margin-bottom:3vw;
        font-size: 3.8vw;
      }
    }
  }
  .dear{
    color:#fff;
    margin-top: 2vw;
    font-size: 3.6vw;
    // text-align: right;
    margin-left:9.3vw;
    padding-right: 10vw;
  }
}
.titles {
  background: #1c1c1d;
  margin: 0 3vw 3vw;
  padding: 6vw 0 6vw 6vw;
  display: flex;
  align-items: center;
  > img {
    width: 22vw;
    height: 22vw;
  }
  p {
    display: flex;
    align-items: center;
    margin: 2.5vw 0;
    font-size: 3.5vw;
    img {
      width: 4vw;
      height: 4vw;
      margin-left: 2vw;
    }
    em {
      color: #58c89c;
      font-weight: bold;
    }
  }
  > div {
    margin-left: 5vw;
  }
}
.content{
  // overflow: auto;
  padding-bottom: 3vw;
  .wallet {
    margin: 2vw 3vw;
    font-size:3.6vw;
    font-family:PingFang SC;
    font-weight:500;
    color:rgba(51,51,51,1);
    border-radius: 3vw;
    li{
      // width:710px;
      // height:219px;
      padding:3vw 5vw;
      background:rgba(255,255,255,1);
      box-shadow:0px 1px 13px 0px rgba(148,148,148,0.3);
      border-radius:2vw;
      display: flex;
      align-content: center;
      justify-content: space-between;
      .wallleft{
        p{
          font-size: 3.8vw;
          line-height: 7vw;
        }
      }
      .wallright{
        height: 20vw;
        // overflow: hidden;
        line-height: 15vw;
        img{
          width: 15vw;
          height: 7vw;
          margin-top:2vw;
          vertical-align: middle;
        }
      }
    }
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
  margin: 3vw 3vw;
  box-shadow:0px 1px 13px 0px rgba(148,148,148,0.3);
}
/deep/.van-tab {
  line-height: 11vw;
  // background: #1c1c1d;
  color: #333;
}
</style>