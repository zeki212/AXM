<template>
  <div class="serlist">
    <my-header
      :showBack="true"
      title="流程图"
    />
    <div class="contents" @click="showTradingImg(img1)">
      <img class="imgs" :src="img1" alt="">
    </div>
  </div>
</template>

<script>
import html2canvas from 'html2canvas'
import { Toast , ImagePreview} from 'vant';
import img1 from '../../assets/img/home/serlist.png'
export default {
  data(){
    return {
      show:false,
      showImg:false,
      img1
    }
  },
  mounted(){

  },
  methods:{
    showTradingImg(imgUrl){
      ImagePreview([
        imgUrl
      ])
    }
  }
}
</script>

<style lang="less" scoped>
.serlist{
  width: 100vw;
  height: 100vh;
  .contents{
    img{
      width: 100%;
    }
  }
  .van-popup{
    font-size: 4.6vw;
    text-align: center;
    background-color: #F0F0F0;
    p{
      height: 10vw;
      line-height: 10vw;
      background-color: #fff;
    }
    p:first-child{
      margin-bottom:1px;
    }
  }
}
</style>