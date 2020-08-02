<!-- register -->
<template>
  <div class="login">
    <div class="login_box">
      <my-header :showBack="true" title="选择注册城市" />
      <div>
        <div class="cityX">
          <p>热门城市</p>
          <ul>
            <li v-for="item in cityX" @click="cliCity(item)">{{item}}</li>
          </ul>
        </div>
        <van-index-bar :sticky='false'>
          <div v-for="(item,index) in citys" :key='index'>
            <van-index-anchor :index="item.code" />
            <van-cell v-for="(items,indexs) in item.cityList" :key='indexs' :title="items" @click="aaas(items)" />
          </div>
        </van-index-bar>
      </div>
    </div>
  </div>
</template>

<script>
import { Toast } from "vant";
export default {
  components: {
  },
  data() {
    return {
      citys: this.$citys,
      cityX: ['北京市', '上海市', '广州市', '深圳市', '武汉市', '重庆市', '杭州市', '成都市']
    };
  },
  computed: {},
  watch: {
    $route(val, oldval) {
      if (oldval.fullPath.indexOf("?") != -1) {
      }
    },
  },
  created() {
    if (this.$route.fullPath.indexOf('?') != -1) {
      this.goBack();
    }
  },
  mounted() {
  },
  methods: {
    aaas(id) {
      sessionStorage.setItem('city', id)
      this.goBack()
    },
    cliCity(item) {
      sessionStorage.setItem('city', item)
      this.goBack()
    },
  },
}
</script>
<style lang='less' scoped>
@import "../../assets/css/config";
.login {
  color: #fff;
  // background: #2599FF;
  box-sizing: border-box;
  overflow-y: auto;
  height: 100%;
}
/deep/.van-index-bar__index {
  color: #58C89C !important;
}
/deep/.van-index-anchor--sticky {
  display: none !important;
}
/deep/.van-cell {
  background-color: #0e0e0e !important;
  color: #58C89C;
  border-bottom: 1px solid #363636 !important;
}
/deep/.van-cell:active {
  background: #58C89C!important;
  color: #FFF!important;
}
/deep/.van-cell:not(:last-child):after {
  display: none !important;
}
.cityX {
  margin: 3vw;
  padding: 2vw 3vw 5vw;
  color: #58C89C;
  background: #182129;
  > p {
    font-size: 3.7vw;
    margin-bottom: 4vw;
  }
  ul {
    // display: flex;
    // width: 80vw;
    li {
      // flex: 1;
      // box-sizing: border-box;
      text-align: center;
      display: inline-block;
      max-width: calc(~"64vw/3");
      min-width: calc(~"64vw/3");
      font-size: 3.2vw;
      padding: 2.5vw 2vw;
      margin: 2vw 1.5vw;
      background: #10161B;
    }
    li:active {
      background: #58C89C;
      color: #fff;
    }
  }
}
/deep/.van-index-anchor {
  color: #58C89C;
}
</style>