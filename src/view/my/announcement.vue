<!-- 新闻公告 -->
<template>
  <div>
    <my-header :showBack="true" title="系统公告" />
    <div class="content">
      <div class="record">
        <van-pull-refresh v-model="isLoading" class="myHeight" @refresh="onRefresh">
          <!-- <van-list v-model="loading" :finished="finished" @load="loadMore" :offset="20"> -->
            <ul v-for="(item,index) in list" @click="showDetailsPopup(item)" :key="index">
              <li>
                <div>
                  <p>{{item.title}}</p>
                  <p>{{item.notifyTime}}</p>
                </div>
              </li>
              <!-- <van-icon name="arrow" /> -->
            </ul>
            <div class="no_data" v-show="list.length==0">
              <img src="../../assets/img/home/zanwu.png" alt="">
            </div>
          <!-- </van-list> -->
        </van-pull-refresh>
      </div>
    </div>
    <van-popup v-model="detailsPopup" position="bottom" class="details_popup">
      <my-header :showBack="true" title="公告详情" />
      <ul>
        <li>{{notice.title}}</li>
        <li v-html="notice.content"></li>
        <li>{{notice.notifyTime}}<br>AXM官方宣</li>
      </ul>
    </van-popup>
  </div>
</template>

<script>
export default {
  data() {
    return {
      userInfo: JSON.parse(localStorage.getItem("userInfo")),
      version: this.$information.VERSION,
      pageNo: 1,
      pageSize: 10,
      detailsPopup: false,
      list: [],
      notice: '',
      isLoad: false,
      loading: false,
      finished: true,
      isLoading:false
    };
  },
  components: {},
  watch: {
    '$route'(val, oldval) {
      if (oldval.fullPath.indexOf('?') != -1) {
        this.detailsPopup = false;
      }
    },
  },

  mounted() {
    this.getNoticeList();
  },

  methods: {
     getNoticeList() {
      let params = { version: this.version,type: '1' };
      var formObject = encodeParams(params, this.userInfo.userId, this.userInfo.tokenId, this.userInfo.appKey);
      this.isLoad = false;
      this.$ajax(this.$api.getNoticeList, { version: this.version,type: '1' }, formObject)
        .then(res => {
          if (res.code == 200) {
            if (res.data) {
              this.list = res.data;
            }
          } else {
            Toast({ message: res.msg, position: "center",duration:"1000"  });
          }
        })
    },
    showDetailsPopup(item) {
      if (window.location.href.indexOf("?detailsPopup") == -1) {
        window.location.href = window.location.href + "?detailsPopup";
      }
      this.detailsPopup = true;
      this.notice = item;
    },
    onRefresh() {
      setTimeout(() => {
        this.getNoticeList()
        // this.$toast('刷新成功');
        this.isLoading = false;
      }, 500);
    },
  }
}

</script>
<style lang='less' scoped>
@import "../../assets/css/config";
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
.van-pull-refresh{
  overflow: visible;
}
.content {
  background: #F9F9F9;
}
.record {
  ul {
    background-color: rgba(255,255,255,1);
    border-radius: 1.5vw;
    margin: 4vw 15px;
    padding: 3.5vw 4vw;
    // padding-top: 8px;
    border-radius:1vw;
    // box-shadow:0px 6px 10px 0px rgba(0, 0, 0, 0.02);
    display: flex;
    justify-content: space-between;
    display: -webkit-flex;
    // border-bottom: 1px solid #e5e5e5;
    li:nth-child(1) {
      div {
        display: inline-block;
        p:nth-child(1) {
          width: 80vw;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          color: #333;
          // font-weight: bold;
          font-size: 4vw;
          margin-bottom: 2vw;
        }
        p:nth-child(2) {
          color: #ADAFBC;
          font-size: 3vw;
        }
      }
    }
    .van-icon,
    .van-icon:before {
      color: #999999;
      margin-top: 2vw;
      font-size: 4vw;
    }
  }
}
.details_popup {
  width: 100%;
  height: 100%;
  background: #EFEFF0;
  ul {
    // margin: 6px 3vw;
    margin:6px 3vw 10vw 3vw;
    padding: 5vw 2vw;
    background: #FFFFFF;
    li:nth-child(1) {
      text-align: center;
      color: #333;
      font-size: 3.7vw;
      font-weight: bold;
      padding-bottom: 4vw;
      margin-bottom: 1vw;
      border-bottom: 1px solid rgba(229,229,229,1);
      // line-height: 20px;
      // margin: 5vw 0 1vw;
      // line-height: 40px;
    }
    li:nth-child(3) {
      text-align: right;
      color: #ADAFBC;
      font-size: 3vw;
      line-height: 20px;
      // padding-bottom: 3vw;
      margin-top: 5vw;
      // border-bottom: 1px solid #A0A0A0;
    }
    li:nth-child(2) {
      // opacity: 0.7;
      font-size: 3vw;
      color: rgb(182, 181, 181);
      line-height: 28px;
      // text-indent: 2em;
      > p {
        font-size: 3vw;
        color: #EEEEEE;
        line-height: 28px;
      }
    }
    li:nth-child(4) {
      font-size: 3vw;
      font-weight: bold;
      color: #EEEEEE;
      text-align: right;
      line-height: 70px;
    }
  }
}
</style>