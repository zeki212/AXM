<template>
  <div></div>
</template>

<script>
import { Toast } from "vant";
export default {
  filters: {
    formatDate(time) {
      var date = new Date(time);
      return timeFormat.formatDate(date, "yyyy.MM.dd hh:mm");
    }
  },
  data() {
    return {};
  },
  mounted() {
    // let token = this.$route.query;
    let url = window.location.href;
    // console.log(url);
    url = url.split("?")[1];
    localStorage.setItem("token", url);
    Toast({ message: "即将跳转到新的页面。。。", position: "center",duration:"1000" });
    setTimeout(() => {
      this.pushPath("/");
    }, 100);
  },
  methods: {}
};
</script>

<style scoped>
.capp_box {
  margin-bottom: 46px;
}
.more_title {
  display: flex;
  background: #ffffff;
  padding: 8px 10px 8px 10px;
}
.more_title img {
  width: 18px;
  height: 18px;
  margin-right: 6px;
}
.capp_serve {
  overflow: hidden;
  background: #fff;
  border-top: 1px #eeeeee solid;
  margin-bottom: 0px;
}
.capp_serve li {
  float: left;
  text-align: center;
  border-left: 1px solid #eeeeee;
  border-bottom: 1px solid #eeeeee;
  width: 33.3vw;
  box-sizing: border-box;
  padding: 26px 0;
}

.capp_serve .my_icon_box {
  width: 30px;
  height: 30px;
  overflow: hidden;
  margin: 14px auto;
  background-repeat: no-repeat;
  background-size: cover;
}
.ci_img1 {
  background-position: 0 0;
}
.ci_img2 {
  background-position: 0 11%;
}
.ci_img3 {
  background-position: 0 22%;
}
.ci_img4 {
  background-position: 0 33%;
}
.ci_img5 {
  background-position: 0 45%;
}
.ci_img6 {
  background-position: 0 56.5%;
}
.ci_img7 {
  background-position: 0 69%;
}
.ci_img8 {
  background-position: 0 82%;
}
.ci_img9 {
  background-position: 0 93%;
}

.user_app li:last-child {
  border-right: 1px solid #eeeeee;
}

.capp_serve .ac_icon_box {
  width: 30px;
  height: 30px;
  overflow: hidden;
  margin: 14px auto;
  background-repeat: no-repeat;
  background-size: cover;
}
.ac_img1 {
  background-position: 0 0;
}
.ac_img2 {
  background-position: 0 11%;
}
.ac_img3 {
  background-position: 0 22%;
}
.ac_img4 {
  background-position: 0 34%;
}
</style>
