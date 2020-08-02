import Vue from "vue";
import store from "./store/index";
import router from "./router";

import { Picker } from 'mint-ui';
Vue.component(Picker.name, Picker);
//按需引入vant
import {
  Tabbar, CountDown, Overlay, TabbarItem, Swipe, SwipeItem, Popup, Button, Cell, CellGroup, Icon, List, Lazyload, Tab, Tabs, Field,
  PasswordInput, AddressList, NumberKeyboard, Switch, NavBar,
  Search, ActionSheet, SwitchCell, Progress, DropdownMenu, DropdownItem, PullRefresh, RadioGroup,
  Radio, IndexBar, IndexAnchor, Loading, ImagePreview, NoticeBar
} from 'vant';

Vue.use(Tabbar).use(CountDown).use(TabbarItem).use(Swipe).use(SwipeItem).use(Popup).use(Button).use(Cell).use(CellGroup).use(Icon)
  .use(Lazyload).use(List).use(Tab).use(Tabs).use(Field).use(PasswordInput).use(NumberKeyboard).use(Switch).use(Overlay)
  .use(NavBar).use(Search).use(ActionSheet).use(SwitchCell).use(Progress).use(DropdownMenu).use(DropdownItem).use(PullRefresh).use(Loading).use(RadioGroup).use(Radio).use(AddressList).use(IndexBar).use(IndexAnchor).use(ImagePreview).use(NoticeBar)

import plus from 'vue-h5-plus'
Vue.use(plus)

import "../src/assets/css/common.less"; //公共样式
import "../src/assets/css/vant-common.less"; //公共样式

import myHeader from "@/components/header.vue";
Vue.component(myHeader.name, myHeader);

import citys from '@/store/city';
Vue.prototype.$citys = citys;


import encodeParams from './assets/js/encode';
window.encodeParams = encodeParams;

import information from './assets/js/prams';
Vue.prototype.$information = information;

import filter from '@/store/filter';
Object.keys(filter).forEach(key => {
  Vue.filter(key, filter[key])
});

import App from "./App";
import httpServer from "./http/axios"; //封装ajax请求
import Api from "./http/api"; //接口api
import validator from "./store/validator";
Object.assign(Vue.prototype, {
  $ajax: httpServer,
  $api: Api,
  $validator: validator,
  goBack: () => {
    router.go(-1);
    return false;
  },
  pushPath: (path) => {
    router.push(path);
  },
})

Vue.config.productionTip = false;

router.beforeEach((to, from, next) => {
  sessionStorage.setItem('lastPage', from.name)
  //检查token有没有
  if (to.meta.requiresAuth) {
    if (localStorage.getItem("token")) {
      next();
    } else {
      next({ path: "/login" });
    }
  } else {
    next();
    store.commit('updateLoginState', false)
  }
});


new Vue({
  el: "#app",
  router,
  store,
  components: { App },
  template: "<App/>"
});
