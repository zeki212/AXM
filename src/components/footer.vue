<template>
  <div class="my_footer">
    <van-tabbar v-model="selected">
      <van-tabbar-item @click="pushPage('/home')">
        <i :class="[selected==0?'footer_icon_selected':'footer_icon','icon_home']"></i>
        <span class="font_S">首页</span>
      </van-tabbar-item>
      <van-tabbar-item @click="pushPage('/shoppingMall')">
        <i :class="[selected==1?'footer_icon_selected1':'footer_icon1','icon_miner']"></i>
        <span class="font_S">矿机</span>
      </van-tabbar-item>
      <van-tabbar-item @click="pushPage('/deal')">
        <i :class="[selected==2?'footer_icon_selected2':'footer_icon2','icon_trade']"></i>
        <!-- <i class="footer_icon2"></i> -->
        <span class="font_S">交易</span>
      </van-tabbar-item>
      <van-tabbar-item @click="pushPage('/my')">
        <i :class="[selected==3?'footer_icon_selected3':'footer_icon3','icon_my']"></i>
        <span class="font_S">我的</span>
      </van-tabbar-item>
    </van-tabbar>
  </div>
</template>

<script>
import { Dialog,Toast } from "vant";
export default {
  name: "myFooter",
  data() {
    return {};
  },
  props:[],
  computed: {
    selected: {
      get() {
        return this.$store.state.footerSelected;
      },
      set(newValue) {
        this.$store.state.footerSelected = newValue
      }      
    }
  },
  methods: {
    soonOpen() {
      Toast({ message: '暂未开放,敬请期待!', position: "center",duration:"1000" });
      // Dialog.alert({
      //   message: "暂未开放，敬请期待！"
      // }).then(() => {
      //   // on close
      // });
    },
    pushPage(path) {
      this.$router.replace(path);
    },
    skip() {
      if (localStorage.getItem("token")) {
        this.pushPath('/my');
      } else {
        this.pushPath('/login');
      }
    },
  }
};
</script>
<style lang="less" scoped>
@import "../assets/css/config";
.font_S {
  font-size: 3vw;
}
.my_footer{
  position: fixed;
  width: 100%;
  bottom: 0;
}
.van-tabbar{
  background: #fff;
  height: 11vw;
  box-shadow:0px 0px 8px 0px rgba(186,186,186,0.46);
}
.van-tabbar i{
  display: block;
  text-align: center;
}
.van-tabbar-item{
  flex-direction:initial;
  text-align: center;
  color: #AFAFB3;
  // background: #1C1C1D;
  background: #fff;
  // background: -webkit-linear-gradient(left, rgb(247, 124, 75) , rgb(243, 76, 10)); /* Safari 5.1 - 6.0 */
  // background: -o-linear-gradient(right, rgb(247, 124, 75) , rgb(243, 76, 10)); /* Opera 11.1 - 12.0 */
  // background: -moz-linear-gradient(right, rgb(247, 124, 75) , rgb(243, 76, 10)); /* Firefox 3.6 - 15 */
  // background: linear-gradient(to right, rgb(247, 124, 75) , rgb(243, 76, 10)); /* 标准的语法 */
}
.van-tabbar-item--active {
  color: #EC2A17;
}
.van-hairline--top-bottom:after {
  border: 0;
}
.footer_icon{
  background-image: url(../assets/img/home/homes.png);
  background-repeat: no-repeat;
  width: 5vw;
  height: 5vw;
  background-size:cover;
  margin:0 auto 1vw;
  display: block;
}
.footer_icon1{
  background-image: url(../assets/img/home/shoppings.png);
  background-repeat: no-repeat;
  width: 5vw;
  height: 5vw;
  background-size:cover;
  margin:0 auto 1vw;
  display: block;
}
.footer_icon2{
  background-image: url(../assets/img/home/lives.png);
  background-repeat: no-repeat;
  width: 5vw;
  height: 5vw;
  background-size:cover;
  margin:0 auto 1vw;
  display: block;
}
.footer_icon3{
  background-image: url(../assets/img/home/mys.png);
  background-repeat: no-repeat;
  width: 5vw;
  height: 5vw;
  background-size:cover;
  margin:0 auto 1vw;
  display: block;
}
.footer_icon_selected{
  background-image: url(../assets/img/home/home.png);
  background-repeat: no-repeat;
  width: 5vw;
  height: 5vw;
  background-size: 100%;
  margin:0 auto 1vw;
  display: block;
}
.footer_icon_selected1{
  background-size: 100%;
  background-image: url(../assets/img/home/shopping.png);
  background-repeat: no-repeat;
  width: 5vw;
  height: 5vw;
  background-size: 100%;
  margin:0 auto 1vw;
  display: block;
}
.footer_icon_selected2{
  background-image: url(../assets/img/home/live.png);
  background-repeat: no-repeat;
  width: 5vw;
  height: 5vw;
  background-size: 100%;
  margin:0 auto 1vw;
  display: block;
}
.footer_icon_selected3{
  background-image: url(../assets/img/home/my.png);
  background-repeat: no-repeat;
  width: 5vw;
  height: 5vw;
  background-size: 100%;
  margin:0 auto 1vw;
  display: block;
}
// .icon_home{
//   background-position: 0% 0%;
// }
// .icon_miner{
//   background-position: 0 33.33%;
// }
// .icon_trade{
//   background-position: 0 66.66%;
// }
// .icon_my{
//   background-position: 0 100%;
// }
</style>
