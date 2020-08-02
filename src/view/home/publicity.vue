<!-- 新闻公告 -->
<template>
  <div>
    <my-header :showBack="true" title="公益资讯" />
    <div class="content">
      <ul>
        <li @click="goToNews(1)">
          <div class="left">
              <p>中华慈善总会召开第五届会员代表大会</p>
              <p>2020年7月9日</p>
          </div>
          <div class="right">
            <img src="../../assets/img/home/c1.png" alt="">
          </div>
        </li>
        <li @click="goToNews(2)">
          <div class="left">
              <p>第十七届（2020）中国慈善榜发布</p>
              <p>2020年6月16日</p>
          </div>
          <div class="right">
            <img src="../../assets/img/home/c2.png" alt="">
          </div>
        </li>
        <li @click="goToNews(3)">
          <div class="left">
              <p>来自我国大西南地区“三区三州”产业扶贫的报告</p>
              <p>2020年7月10日</p>
          </div>
          <div class="right">
            <img src="../../assets/img/home/c2.png" alt="">
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import { Toast, ImagePreview } from "vant";
export default {
  data() {
    return {
      userInfo: JSON.parse(localStorage.getItem("userInfo")),
      version: this.$information.VERSION,
      pageNo: 1,
      pageSize: 10,
      // detailsPopup: false,
      list: [],
      isLoad: false,
      loading: false,
      finished: true,
      // summary: [],
      // remark: [],
    };
  },
  components: {},
  watch: {
    '$route'(val, oldval) {
      if (oldval.fullPath.indexOf('?') != -1) {
        // this.detailsPopup = false;
      }
    },
  },

  mounted() {
    this.getNoticeList();
  },

  methods: {
    // 资讯详情
    goToNews(id){
      this.$router.push({name:'publicityList',params:{newsId:id}});
    },
    showTradingImg(voucherImg) {
      let arr = [];
      arr.push(voucherImg)
      ImagePreview(arr);
    },
    getNoticeList() {
      let params = { version: this.version, type: '4' };
      var formObject = encodeParams(params, this.userInfo.userId, this.userInfo.tokenId, this.userInfo.appKey);
      this.isLoad = false;
      this.$ajax(this.$api.getNoticeList, { version: this.version, type: '4' }, formObject)
        .then(res => {
          if (res.code == 200) {
            if (res.data) {
              this.list = res.data;
            }
          } else {
            Toast({ message: res.msg, position: "center" ,duration:"1000" });
          }
        })
    },
    showDetailsPopup(item) {
      // if (window.location.href.indexOf("?detailsPopup") == -1) {
      //   window.location.href = window.location.href + "?detailsPopup";
      // }
      // this.detailsPopup = true;
      // this.summary = item.summary.split(",");
      // this.remark = item.remark.split(",");
      sessionStorage.setItem('summary',item.summary)
      sessionStorage.setItem('remark',item.remark)
      this.pushPath('/graphicDetails')
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
.content {
  ul{
    li{
      width: 90vw;
      margin:0 auto;
      display: flex;
      height: 25vw;
      border-top:1px solid rgba(235,235,235,1);
      align-content: center;
      justify-content: space-between;
      padding: 4vw 2vw;
      .left{
        font-size: 4vw;
        color:#333333;
        margin-right:6vw;
        p:nth-of-type(1){
          margin-bottom:10vw;
        }
        p:nth-of-type(2){
          color:#999999;
          font-size: 3vw;
          text-align: right;
        }
      }
      .right{
        img{
          width: 40vw;
          height: 25vw;
        }
      }
    }
    li:last-child{
      border-bottom:1px solid rgba(235,235,235,1);
    }
  }
}
</style>