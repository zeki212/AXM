<!-- 选择币种 -->
<template>
  <div>
    <my-header title='选择币种' :showBack="true" />
    <div>
      <ol class="choose_coin">
        <li v-for="(item,index) in coinData" @click="chooseCoin(item)">
          <p><img :src="item.logo" alt=""></p>
          <h2>{{item.blockname}}</h2>
        </li>
      </ol>
    </div>
  </div>
</template>

<script>
export default {
  components: {},
  data() {
    return {
      coinData:JSON.parse(sessionStorage.getItem('coinList'))
    };
  },
  computed: {},
  watch: {},
  created() {
    
  },
  mounted() {
    
  },
  methods: {
    chooseCoin(data){
      this.$emit('choose',data);
    }
  },
}
</script>
<style lang='less' scoped>
.choose_coin{
  background-color: #fff;
  padding: 0 5%;
  li{
    display: flex;
    align-items: center;
    padding: 15px 5px;
    border-bottom: 1px solid #f7f7f7;
    &:last-child{
      border-bottom:none;
    }
    p{
      flex: 1;
      max-width: 40px;
      height: 40px;
    }
    h2{
      font-size: 18px;
      margin-left: 20px;
    }
  }
}
</style>