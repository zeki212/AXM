<template>
  <div class="header_box">
    <div v-if="showBack==true"  @click="goBack">
      <img src="../assets/img/account/left.png" alt="">
    </div>
    <div v-else  @click="goBack">
      <img src="../assets/img/account/left2.png" alt="">
    </div>
    <div v-if="white==true" style="color:#fff;">{{title}}</div>
    <div v-else>{{title}}</div>
    <div @click="rightAction">
      <span v-show="showRight">{{rightText}}</span>
    </div>                                                                                                                                                                                                                          
  </div>
</template>

<script>
export default {
  name:'my-header',
  props: ["showBack", "title", "rightText","showRight","white"],
  methods:{
    rightAction(){
      this.$emit('rightAction');
    }
  }
};
</script>

<style lang="less" scoped>
@import "../assets/css/config";
.header_box {
  width: 100%;
  height: 11vw;
  line-height: 11vw;
  font-size: 4vw;
  color: #333333;
  display: flex;
  background-color: #fff;
  box-sizing: border-box;
  i{
    padding:10px;
    font-size: 24px;
  }
  div{
    img {
      width: 2.3vw;
      margin-left: 3vw;
    }
    &:nth-child(1) {
      max-width: 60px;
      flex: 1;
      box-sizing: border-box;
    }
    &:nth-child(2){
      flex: 1;
      font-size: 4.5vw;
      text-align:center;
      letter-spacing: 2px;
      color: #333333;
      font-weight: bold;
    }
    &:nth-child(3) {
      max-width: 60px;
      flex: 1;
      text-align:right;
      font-size:4vw;
      color: #333333;
      span{
        display: inline-block;
        padding-right: 15px;
        width: 100%;
        box-sizing: border-box;
      }
    }
    
  }
}
</style>