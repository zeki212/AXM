<!-- 修改密码 -->
<template>
  <div>
    <my-header :showBack="true" title="修改密码" />
    <div class="my_info">
      <ul class="menu">
        <li @click="pushPath('/modifyPwd/1')" class="flex_between">
          <!-- <img src="../../assets/imgs/my/setting/name.png" alt=""> -->
          <span class="">修改登录密码</span>
          <!-- <span>User</span> -->
          <img src="../../assets/img/my/you.png" alt="">
        </li>
        <li @click="pushPath('/modifyPwd/2')" class="flex_between">
          <!-- <img src="../../assets/imgs/my/setting/name.png" alt=""> -->
          <span class="">修改资金密码</span>
          <!-- <span>12321321</span> -->
          <img src="../../assets/img/my/you.png" alt="">
        </li>
      </ul>
    </div>
  </div>
</template>
<script>
import { Toast, Dialog } from "vant";
import { Indicator } from "mint-ui";
export default {
  data() {
    return {
      paramsr: {
        appid: this.$information.AppId,
        version: this.$information.VERSION,
      },
      img1: '',
      files1: '',
      userInfo: '',
      // time: 60,
      // authenticationStatus: 
    };
  },
  computed: {},
  watch: {
    '$route'(val, oldval) {
      if (oldval.fullPath.indexOf('?') != -1) {
        this.exitPopup = false;
      }
    },
  },
  mounted() {
    if (this.$route.fullPath.indexOf('?') != -1) {
      this.goBack();
    }
  },
  methods: {
    soonOpen() {
      Toast({ message: "暂未开放，敬请期待！", position: "center",duration:"1000"  });
      // Dialog.alert({
      //   message: "暂未开放，敬请期待！"
      // }).then(() => {
      //   // on close
      // });
    },
  },
}
</script>
<style lang='less' scoped>
@import "../../assets/css/config";
.menu {
  color:#333;
  font-size: 4vw;
  > li {
    // margin: 0 6vw;
    padding: 2vh 5vw;
    border-bottom: 1px solid rgba(238,238,238,1);
    > img {
        width: 1.8vw;
        height: 2.75vw;
        margin-left: 2vw;
      }
    > span:nth-child(1) {
      flex: 1;
      // margin: 0 3vw;
      // color: #fff;
      font-family:PingFang SC;
      font-weight:500;
      color:rgba(51,51,51,1);
      // line-height:46px;
    }
    > span:nth-child(2) {
      color: #959595;
      display: flex;
      align-items: center;
      
    }
  }
}
.van-cell:not(:last-child):after {
  display: none;
}
[class*="van-hairline"]:after {
  display: none;
}
.van-cell {
  background-color: #fff;
  border-bottom: 1px solid rgb(245, 242, 242);
}
.van-cell__title {
  color: #333333;
  font-weight: bold;
}
.spaces {
  margin-top: 5px;
}
.my_info {
  // background: #0E0E0E;
}
</style>