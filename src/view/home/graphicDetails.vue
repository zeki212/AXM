<!-- 新闻公告 -->
<template>
  <div>
    <my-header :showBack="true" title="详情" />
      <div>
        <div class="materials">
          <p>图文材料:</p>
          <ul>
            <li v-for="(item,index) in summary" :key="index" @click="showTradingImg(item,0)">
              <img :src="item" alt="">
            </li>
          </ul>
        </div>
        <div class="videos">
          <p>视频材料:</p>
          <div v-for="(item,index) in remark" :key="index">
            <p>视频{{index+1}}:</p>
            <!-- <div @click="palys"> -->
            <video :src="item" controls></video>
            <!-- </div> -->
          </div>
        </div>
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
      summary: [],
      remark: [],
    };
  },
  components: {},
  watch: {
    '$route'(val, oldval) {
      if (oldval.fullPath.indexOf('?') != -1) {
      }
    },
  },

  mounted() {
    if(sessionStorage.getItem('summary')) {
     this.summary = sessionStorage.getItem('summary').split(",");
    }
    if(sessionStorage.getItem('remark')) {
      this.remark = sessionStorage.getItem('remark').split(",");
    }
    
  },

  methods: {
    showTradingImg(voucherImg) {
      let arr = [];
      arr.push(voucherImg)
      ImagePreview(arr);
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
  background: #0e0e0e;
}
.materials {
    background: #1c1c1d;
    margin: 0 3vw 3vw;
    padding-bottom: 3vw;
    > p {
      color: #58c89c;
      font-size: 4vw;
      padding: 3vw 2vw;
    }
    ul {
      // margin: 6px 3vw;
      // padding: 5vw 2vw;
      text-align: center;
      li {
        max-width: calc(~"85vw/3");
        min-width: calc(~"85vw/3");
        height: 26vw;
        display: inline-block;
        border: 1px solid rgb(58, 58, 58);
        margin: 1vw;
        position: relative;
        img {
          transform: translate(-50%,-50%);
          position: absolute;
          left: 50%;
          top: 50%;
          width: auto;
          max-width: 100%;
          max-height: 100%;
          margin: auto;
          display: block;
        }
      }
    }
  }
  .videos {
    background: #1c1c1d;
    margin: 0 3vw;
    padding-bottom: 3vw;
    > p {
      color: #58c89c;
      font-size: 4vw;
      padding: 3vw 2vw;
    }
    > div {
      margin-top: 3vw;
      text-align: center;
      > p {
        text-align: left;
        font-size: 3.2vw;
        color: #58c89c;
        margin-left: 5vw;
        margin-bottom: 2vw;
      }
      video {
        width: 85vw;
      }
    }
  }
</style>