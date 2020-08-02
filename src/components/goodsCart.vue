<template>
  <section class="goods_cart" @click="pushPath('/ShoppingCart')">
    <i class="icon-goods-car iconfont"></i>
    <span v-if="goodsAmountInCart!=0" style="color:#fff">{{goodsAmountInCart}}</span>
  </section>  
</template>
<script>
import $ from 'jquery';
export default {
  computed: {
    goodsAmountInCart() {
      return this.$store.state.goodsAmountInCart;
    }
  },
  // data(){
  //   return {
  //     goodsAmountInCart:0
  //   }
  // },
  mounted(){
    this.getGoodsNum();
  },
  methods:{
    getGoodsNum(){
      let vm = this;
      $.ajax({
        url: vm.$api.baseURL + "api/customerCar/selectCustomerCarNum.do",
        type: "post",
        data: { token: localStorage.getItem("token") },
        success: res => {
          if (res.code == 0) {
            // this.goodsAmountInCart = res.data;
            vm.$store.commit("updateGoodsAmountInCart", res.data);
          }
        },
        error: e => {
          console.log(e);
        }
      });
    }
  }
}
</script>
<style>
.goods_cart{
  height: 100%;
  position: relative; 
}
.goods_cart i{
  font-size: 26px;
  line-height: 44px;
  text-align: right;
  display: block;
  padding-right: 15px;
  color: #fff;
}
.goods_cart span{
  border-radius: 50%;
  display: block!important;
  position: absolute;
  background: red;
  top: 4px;
  right: 5px;
  height: 20px;
  min-width: 14px;
  font-size: 12px;
  padding: 0px 3px!important;
  line-height: 20px;
  color: #fff;
}
</style>
