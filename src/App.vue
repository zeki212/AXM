<template>
  <div id="app">
    <transition name="slide-left">
      <keep-alive include="mall">
        <router-view class="child-view"></router-view>
      </keep-alive>
    </transition>
    <my-footer v-show="needShowFooter"></my-footer>
  </div>
</template>

<script>
import myFooter from "@/components/footer.vue";

export default {
  name: "App",
  data() {
    return {
    };
  },
  components: {
    "my-footer": myFooter
  },
  computed: {
    needShowFooter() {
      return this.$store.state.needShowFooter;
    },
  },
  mounted() {
    
  },
  watch: {
    '$route'(to, from) {
      if (to.name == "home" || to.name == "shoppingMall" || to.name == "protect" || to.name == "deal" || to.name == "my") {
        this.$store.commit("updateNeedShowFooter", true);
      } else {
        setTimeout(() => {
          this.$store.commit("updateNeedShowFooter", false);
        }, 10)
      }
    },
  },
  methods: {

  }
};
</script>

<style>
* {
  -webkit-overflow-scrolling: touch;
}
.child-view {
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  overflow: auto;
  transition: all 0.4s cubic-bezier(0.55, 0, 0.1, 1);
}
.slide-left-enter,
.slide-right-leave-active {
  opacity: 0;
  -webkit-transform: translate(30px, 0);
  transform: translate(30px, 0);
}
.slide-left-leave-active,
.slide-right-enter {
  opacity: 0;
  -webkit-transform: translate(-30px, 0);
  transform: translate(-30px, 0);
}
</style>
