<!-- 交易市场 -->
<template>
  <div class="home" @scroll="scrollGet($event)">
    <!-- 头部 -->
    <div class="header">
      <div @click="buy">
        <img src="../../assets/img/deal/fabu.png" alt />
        <span>发布</span>
      </div>
      <!-- <div @click="pushPath('/orderList')"> -->
      <div @click="pushPath('/usdtList')">
        <img style="width:4.5vw;height:5vw;" src="../../assets/img/deal/dingdan.png" alt />
        <span style="vertical-align:bottom;">订单</span>
      </div>
    </div>
    <!-- 背景图 -->
    <div class="banner">
      <div class="up">
        <p>
          <span>累计交易量：</span>
          <span>{{quotation.orderSum || '0'}}</span>
        </p>
        <p>
          <span>累计销毁量：</span>
          <span>{{quotation.destroySum || '0'}}</span>
          <!-- 暂时为0 -->
          <!-- <span>0</span> -->
        </p>
      </div>
      <div class="down">
        <div>
          <p>{{quotation.tradeDemandSum || '0'}}</p>
          <p>当前求购量</p>
        </div>
        <div>
          <p>{{quotation.tradeVolume || '0'}}</p>
          <p>今日成交量</p>
        </div>
        <div>
          <p>{{quotation.currentPrice || '0'}}RMB</p>
          <p>今日指导价</p>
        </div>
      </div>
    </div>

    <van-pull-refresh v-model="isLoading" class="myHeight" @refresh="onRefresh">
      <div class="home_top">
        <span>七日涨幅图</span>
        <!-- <span @click="pushPath('/quickSale')">
          <img src="../../assets/img/deal/outline.png" alt="">
          快捷买卖Ｕ >
        </span>-->
      </div>
      <chart v-if="quotation.date" :chartData="quotation"></chart>
      <!-- <div class="search">
        <div>
          <img src="../../assets/img/deal/search.png" alt="">
          <input type="text" maxlength="11" v-model.trim="phones" placeholder="请输入您的关键词" @blur="blur" @focus="focuson">
        </div>
        <div @click="myExchange">搜索</div>
      </div>-->
      <div class="content">
        <div class="sou">
          <img src="../../assets/img/deal/sousuo.png" alt />
          <input
            type="text"
            maxlength="11"
            @change="myExchange"
            v-model.trim="phones"
            @blur="blur"
            @focus="focuson"
            placeholder="输入指定手机号"
          />
        </div>
        <div class="contUp">
          <van-list
            v-model="loading"
            :finished="finished"
            @load="loadMore"
            finished-text="没有更多了"
            :offset="20"
          >
            <ul v-for="(item,index) in list" :key="index">
              <div class="upleft">
                <p>
                  数量：
                  <span>{{item.num}}</span>
                </p>
                <p>
                  单价：
                  <span>{{item.price || '0'}}RMB</span>
                </p>
              </div>
              <div class="upright">
                <p>
                  合计：
                  <span>{{item.totalPrice || '0'}}RMB</span>
                </p>
                <p>
                  <button @click="sell(item)">卖出</button>
                </p>
              </div>
            </ul>
          </van-list>
        </div>
      </div>
      <!-- <p class="sell" v-show="statue == 1" @click="buy">买</p> -->
      <van-popup v-model="popupBuy" class="popBuy" position="bottom" @click-overlay="close()">
        <div>
          <span>发布订单</span>
          <!-- <span @click="goBack">
            <img src="../../assets/img/deal/del.png" alt="">
          </span>-->
        </div>
        <p>
          我的axm：
          <em>{{user.sweets || '0'}}</em>
        </p>
        <!-- <p>我的usdt：<em>{{user.usdt || '0'}}</em></p> -->
        <ul>
          <li>
            <span>求购数量</span>：
            <input type="number" v-model="num" placeholder="请输入求购数量" />
          </li>
          <li>
            <span>单价</span>：
            <!-- <input type="number" v-model="quotation.currentPrice" disabled :placeholder="quotation.currentPrice+'（不可输入）'"> -->
            <input
              type="number"
              v-if="disabled"
              disabled
              :placeholder="quotation.currentPrice+'RMB'"
            />
            <input
              type="number"
              v-model="price"
              v-if="!disabled"
              :placeholder="'请输入'+quotation.minPrice+'~'+quotation.maxPrice+'之间'"
            />
            <span class="yijia">
              <van-switch
                v-model="checked"
                @change="changechecked"
                active-color="#EE281C"
                size="15"
              />
              <span @click="showtatol">
                <img src="../../assets/img/deal/gan.png" alt />
              </span>
            </span>
            <!-- <input type="number" disabled :placeholder="quotation.currentPrice+'u'+'≈'+(quotation.currentPrice*7).toFixed(2)+'元'"> -->
          </li>
          <li class="totalPrice">
            <span>总价</span>：
            <input type="text" v-model="multiple" disabled />
            <!-- <span>
              <img src="../../assets/img/deal/mark.png" alt="">
            </span>-->
          </li>
          <li>
            <span>交易密码</span>：
            <input type="password" maxlength="6" v-model="payPwd" placeholder="请输入交易密码" />
          </li>
        </ul>
        <div class="buy_btn">
          <van-button type="primary" size="large" @click="releaseOrder()">确认发布</van-button>
          <van-button type="primary" size="large" @click="close">取消发布</van-button>
        </div>
      </van-popup>
      <van-popup v-model="popupSell" class="popBuy" position="bottom" @click-overlay="goBack()">
        <div>
          <span>卖出</span>
          <span @click="goBack">
            <img src="../../assets/img/deal/del.png" alt />
          </span>
        </div>
        <ul>
          <li>
            <span>卖出数量</span>
            <input type="text" v-model="sellNum" disabled placeholder="请输入买入数量" />
          </li>
          <li>
            <span>单价</span>
            <input type="text" disabled :placeholder="sellprice+'RMB'" />
          </li>
          <li>
            <span>验证码</span>
            <input type="text" maxlength="4" v-model="msgVerCode" placeholder="请输入验证码" />
            <span
              v-if="!sendDisabled"
              style="right: 5vw;color:#EE281C;font-size: 3vw"
              @click="getSmsCode"
            >获取验证码</span>
            <span v-if="sendDisabled" style="right: 5vw;color:#EE281C;font-size: 3vw">{{time}}s</span>
          </li>
          <li>
            <span>交易密码</span>
            <input type="password" maxlength="6" v-model="payPwdtow" placeholder="请输入交易密码" />
          </li>
        </ul>
        <div class="buy_btn">
          <van-button
            type="primary"
            style="backgroundColor:#EE281C;color:#fff;width:100%;"
            size="large"
            @click="confirmSell"
          >确认</van-button>
        </div>
      </van-popup>
    </van-pull-refresh>
    <!-- 溢价倍数解释 -->
    <van-popup v-model="showpop" class="popYijia" position="center" @click-overlay="goBack()">
      <div class="title">
        <img src="../../assets/img/deal/pop1.png" alt />
        <p>溢价价格说明</p>
      </div>
      <div class="text">
        <p>1.开启溢价后，可输入自定义金额。</p>
        <p>2.自定义金额在指导价—指导价*溢价倍数之间。</p>
        <p>3.开启溢价后，只可指定交易。</p>
      </div>
      <button @click="showpop=false">好的</button>
    </van-popup>
  </div>
</template>

<script>
import { Toast, Dialog } from "vant";
import chart from "@/components/chart.vue";
export default {
  components: {},
  data() {
    return {
      userInfo: JSON.parse(localStorage.getItem("userInfo")),
      version: this.$information.VERSION,
      user: "",
      checked: false,
      pageNo: 1,
      prise: "" || "1",
      pageSize: 10,
      showpop: false,
      isLoad: false,
      loading: false,
      finished: true,
      statue: 1,
      isLoading: false,
      active: 0,
      type: 1,
      disabled: true,
      quotation: "",
      popupBuy: false,
      popupSell: false,
      price: "",
      // multiple: 1,
      // currentPrice:'',
      sellNum: "",
      sellprice:'',
      list: "",
      payPwd: "",
      num: "",
      buyData: "",
      time: 60, // 发送验证码倒计时
      sendDisabled: false,
      msgVerCode: "",
      payPwdtow: "",
      phones: "",
      minPrice: "",
      maxPrice: "",
    };
  },
  computed: {
    multiple: function () {
      if(this.checked){
        return (this.num * this.price).toFixed(2) + "RMB" || 0.0;
      }else{
        return (this.num * this.quotation.currentPrice).toFixed(2) + "RMB" || 0.0;
      }
    },
  },
  watch: {
    $route(val, oldval) {
      if (val.fullPath.indexOf("?") == -1) {
        this.$store.commit("updateNeedShowFooter", true);
        this.popupBuy = false;
        this.popupSell = false;
      }
    },
    active(val) {
      this.pageNo = 1;
      this.finished = true;
      if (val == 0) {
        this.type = 1;
      }
      if (val == 1) {
        this.type = 2;
      }
      this.getOrderList();
    },
    phones(val) {
      if (val == "") {
        this.active = 0;
        this.type = 1;
        this.getOrderList();
      }
    },
  },
  components: {
    chart,
  },
  created() {
    this.getCustInfo();
    if (this.$route.fullPath.indexOf("?") != -1) {
      this.goBack();
    }
    this.$store.commit("updateNeedShowFooter", true);
    this.$store.commit("updateSelected", 2);
  },
  mounted() {
    this.getOrderList();
    this.getOrderStatistics();

    if (this.quotation == "") {
      this.quotation = JSON.parse(localStorage.getItem("quotation"));
    }
  },
  methods: {
    // 议价提示
    showtatol() {
      this.showpop = true;
    },
    changechecked() {
      if (this.checked) {
        this.disabled = false;
      } else {
        this.disabled = true;
      }
    },
    // 取消发布
    close() {
      this.popupBuy = false;
      this.num = "";
      this.price = '';
      this.checked =false;
      this.changechecked();
      this.payPwd = "";
      this.$store.commit("updateNeedShowFooter", true);
    },
    // 失去焦点
    blur() {
      this.$store.commit("updateNeedShowFooter", true);
    },
    // 获得焦点
    focuson() {
      this.$store.commit("updateNeedShowFooter", false);
    },
    // 搜索
    myExchange() {
      if (!this.$validator.isPhone(this.phones)) {
        Toast({
          message: "请填写正确的手机号码！",
          position: "center",
          duration: "1000",
        });
        return;
      }
      let params = {
        version: this.version,
        pageNo: (this.pageNo = 1),
        pageSize: this.pageSize,
        mobile: this.phones,
      };
      var formObject = encodeParams(
        params,
        this.userInfo.userId,
        this.userInfo.tokenId,
        this.userInfo.appKey
      );
      this.$ajax(
        this.$api.getOrderList,
        {
          version: this.version,
          pageNo: params.pageNo,
          pageSize: this.pageSize,
          mobile: this.phones,
        },
        formObject.sign
      ).then((res) => {
        if (res.code == 200) {
          if (res.data) {
            this.list = res.data.list;
          }
        } else {
          Toast({ message: res.msg, position: "center", duration: "1000" });
          this.phones = "";
        }
      });
    },
    getCustInfo() {
      let params = {};
      var formObject = encodeParams(
        params,
        this.userInfo.userId,
        this.userInfo.tokenId,
        this.userInfo.appKey
      );
      this.$ajax(this.$api.getCustInfo, {}, formObject.sign).then((res) => {
        if (res.code == 200) {
          this.user = res.data;
          localStorage.setItem("user", JSON.stringify(res.data));
        } else {
          Toast({ message: res.msg, position: "center", duration: "1000" });
        }
      });
    },
    // 发送验证码
    getSmsCode() {
      let params = { orderId: this.buyData.orderId, msgType: "6" };
      var formObject = encodeParams(
        params,
        this.userInfo.userId,
        this.userInfo.tokenId,
        this.userInfo.appKey
      );
      this.$ajax(
        this.$api.sendMsgCode,
        { orderId: this.buyData.orderId, msgType: "6" },
        formObject.sign
      ).then((res) => {
        if (res.code == 200) {
          Toast({ message: res.msg, position: "center", duration: "1000" });
          //倒计时
          let vm = this;
          vm.sendDisabled = true;
          let interval = window.setInterval(function () {
            if (vm.time-- <= 0) {
              vm.time = 60;
              vm.sendDisabled = false;
              window.clearInterval(interval);
            }
          }, 1000);
        } else {
          Toast({ message: res.msg, position: "center", duration: "1000" });
        }
      });
    },
    // 交易首页数据
    getOrderStatistics() {
      let params = { version: this.version };
      var formObject = encodeParams(
        params,
        this.userInfo.userId,
        this.userInfo.tokenId,
        this.userInfo.appKey
      );
      this.$ajax(
        this.$api.getOrderStatistics,
        { version: this.version },
        formObject.sign
      ).then((res) => {
        if (res.code == 200) {
          // sessionStorage.setItem('echartData', JSON.stringify(res.data));
          this.quotation = res.data;
          // this.currentPrice = res.data.currentPrice;
          this.minPrice = res.data.minPrice;
          this.maxPrice = res.data.maxPrice;
          let aa = [];
          res.data.date.forEach((element) => {
            element = element.substring(5);
            aa.push(element);
          });
          this.quotation.date = aa.reverse();
          this.quotation.value = res.data.value.reverse();
          localStorage.setItem("quotation", JSON.stringify(this.quotation));
        } else {
          Toast({ message: res.msg, position: "center", duration: "1000" });
        }
      });
    },
    // 交易订单列表
    getOrderList() {
      let params = {
        version: this.version,
        pageNo: (this.pageNo = 1),
        pageSize: this.pageSize,
        type: this.type,
      };
      var formObject = encodeParams(
        params,
        this.userInfo.userId,
        this.userInfo.tokenId,
        this.userInfo.appKey
      );
      this.isLoad = false;
      this.$ajax(
        this.$api.getOrderList,
        {
          version: this.version,
          pageNo: params.pageNo,
          pageSize: this.pageSize,
          type: this.type,
        },
        formObject.sign
      ).then((res) => {
        this.loading = false;
        this.isLoad = true;
        if (res.code == 200) {
          if (res.data) {
            // let dataList = res.data.list;
            // let realName = JSON.parse(localStorage.getItem("user")).realName;
            // var userList = dataList.filter(obj=>{
            //   return obj.buyerAvatar !== realName;
            // })
            // this.list = userList;
            this.list = res.data.list;
            this.finished =
              res.data.totalCount / res.data.pageSize < this.pageNo;
          }
        } else {
          Toast({ message: res.msg, position: "center", duration: "1000" });
        }
      });
    },
    loadMore() {
      let params = {
        version: this.version,
        pageNo: (this.pageNo += 1),
        pageSize: this.pageSize,
        type: this.type,
      };
      var formObject = encodeParams(
        params,
        this.userInfo.userId,
        this.userInfo.tokenId,
        this.userInfo.appKey
      );
      this.isLoad = false;
      this.$ajax(
        this.$api.getOrderList,
        {
          version: this.version,
          pageNo: params.pageNo,
          pageSize: this.pageSize,
          type: this.type,
        },
        formObject.sign
      ).then((res) => {
        this.loading = false;
        if (res.code == 200) {
          if (res.data && res.data.list.length > 0) {
            this.list = this.list.concat(res.data.list);
            this.finished =
              res.data.totalCount / res.data.pageSize < this.pageNo;
          } else {
            this.finished = true;
          }
        } else {
          Toast({ message: res.msg, position: "center", duration: "1000" });
        }
      });
    },
    // 发布买单
    releaseOrder() {
      if (!this.num) {
        Toast({
          message: "请输入求购数量!",
          position: "center",
          duration: "1000",
        });
        return;
      }
      if (!this.payPwd) {
        Toast({
          message: "请输入交易密码！",
          position: "center",
          duration: "1000",
        });
        return;
      }
      if (this.disabled) {
        let params = {
          num: this.num,
          premium: 1,
          payPwd: this.payPwd,
          price: this.quotation.currentPrice.toString(),
        };
        var formObject = encodeParams(
          params,
          this.userInfo.userId,
          this.userInfo.tokenId,
          this.userInfo.appKey
        );
        this.$ajax(
          this.$api.releaseOrder,
          {
            num: this.num,
            premium: 1,
            payPwd: this.payPwd,
            price: this.quotation.currentPrice.toString(),
          },
          formObject.sign
        ).then((res) => {
          if (res.code == 200) {
            Toast({ message: res.msg, position: "center", duration: "1000" });
            this.num = "";
            this.payPwd = "";
            this.goBack();
            setTimeout(() => {
              this.getOrderList();
            }, 1000);
          } else {
            Toast({ message: res.msg, position: "top", duration: "1000" });
            this.num = "";
            this.payPwd = "";
          }
        });
      } else {
        let params = {
          num: this.num,
          premium: 2,
          payPwd: this.payPwd,
          price: this.price,
        };
        var formObject = encodeParams(
          params,
          this.userInfo.userId,
          this.userInfo.tokenId,
          this.userInfo.appKey
        );
        this.$ajax(
          this.$api.releaseOrder,
          {
            num: this.num,
            premium: 2,
            payPwd: this.payPwd,
            price: this.price,
          },
          formObject.sign
        ).then((res) => {
          if (res.code == 200) {
            Toast({ message: res.msg, position: "center", duration: "1000" });
            this.num = "";
            this.price = "";
            this.payPwd = "";
            this.goBack();
            setTimeout(() => {
              this.getOrderList();
            }, 1000);
          } else {
            Toast({ message: res.msg, position: "top", duration: "1000" });
            this.num = "";
            this.price = "";
            this.payPwd = "";
          }
        });
      }
    },
    // 售出确认
    confirmSell() {
      if (!this.msgVerCode) {
        Toast({
          message: "请输入验证码！",
          position: "center",
          duration: "1000",
        });
        return;
      }
      if (!this.payPwdtow) {
        Toast({
          message: "请输入交易密码！",
          position: "center",
          duration: "1000",
        });
        return;
      }
      let params = {
        msgVerCode: this.msgVerCode,
        payPwd: this.payPwdtow,
        orderId: this.buyData.orderId,
      };
      var formObject = encodeParams(
        params,
        this.userInfo.userId,
        this.userInfo.tokenId,
        this.userInfo.appKey
      );
      this.$ajax(
        this.$api.confirmSell,
        {
          msgVerCode: this.msgVerCode,
          payPwd: this.payPwdtow,
          orderId: this.buyData.orderId,
        },
        formObject.sign
      ).then((res) => {
        if (res.code == 200) {
          Toast({ message: res.msg, position: "center", duration: "1000" });
          this.popupSell = false;
          this.msgVerCode = "";
          this.payPwdtow = "";
          this.goBack();
          this.getOrderList();
        } else {
          Toast({ message: res.msg, position: "center", duration: "1000" });
        }
      });
    },
    // 发布
    buy() {
      if (window.location.href.indexOf("?popupBuy") == -1) {
        window.location.href = window.location.href + "?popupBuy";
      }
      this.popupBuy = true;
      let _this = this;
      window.setTimeout(function () {
        _this.$store.commit("updateNeedShowFooter", false);
      }, 100);
    },
    // 卖出
    sell(item) {
      // Toast({ message: "暂未开放，敬请期待！", position: "center",duration:"1000" });
      this.buyData = item;
      this.sellNum = item.num;
      this.sellprice = item.price;  
      if (window.location.href.indexOf("?popupSell") == -1) {
        window.location.href = window.location.href + "?popupSell";
      }
      this.msgVerCode = "";
      this.payPwdtow = "";
      this.popupSell = true;
      // 清除验证码倒计时
      this.sendDisabled = false;
      // window.clearInterval(interval);
      let _this = this;
      window.setTimeout(function () {
        _this.$store.commit("updateNeedShowFooter", false);
      }, 100);
    },
    scrollGet(e) {
      if (e.target.scrollTop > 0) {
        this.statue = 2;
      } else {
        this.statue = 1;
      }
    },
    onRefresh() {
      setTimeout(() => {
        this.getOrderStatistics();
        this.getOrderList();
        // this.$toast('刷新成功');
        this.isLoading = false;
      }, 500);
    },
  },
};
</script>
<style lang='less' scoped>
@import "../../assets/css/config";
.home {
  overflow-y: auto;
  // bottom: 11vw;
  // height: auto;
}
/* WebKit browsers */
input::-webkit-input-placeholder {
  font-size: 3.3vw;
  color: #333;
  // color: #BFBFBF;
}
/* Mozilla Firefox 4 to 18 */
input:-moz-placeholder {
  font-size: 3.3vw;
  color: #333;
  // color: #BFBFBF;
}
/* Mozilla Firefox 19+ */
input::-moz-placeholder {
  font-size: 3.3vw;
  color: #333;
  // color: #BFBFBF;
}
/* Internet Explorer 10+ */
input:-ms-input-placeholder {
  font-size: 3.3vw;
  color: #333;
  // color: #BFBFBF;
}
// 头部
.header {
  width: 95vw;
  height: 11vw;
  line-height: 11vw;
  font-size: 4vw;
  color: #333333;
  display: flex;
  margin: 0 auto;
  box-sizing: border-box;
  align-items: center;
  justify-content: space-between;
  div {
    font-size: 4vw;
    font-family: PingFang SC;
    font-weight: bold;
    color: rgba(51, 51, 51, 1);
    line-height: 7vw;
    img {
      width: 5.2vw;
      height: 5.2vw;
      vertical-align: middle;
      margin-right: 0.5vw;
    }
  }
}
.banner {
  width: 95vw;
  height: 41vw;
  padding-top: 5vw;
  margin: 0 auto;
  border-radius: 1vw;
  background: url(../../assets/img/deal/banner.png) no-repeat;
  background-size: cover;
  .up {
    margin-bottom: 8vw;
    margin-left: 7vw;
    p {
      font-size: 3.6vw;
      font-family: PingFang SC;
      font-weight: bold;
      color: rgba(255, 255, 255, 1);
      line-height: 8vw;
    }
  }
  .down {
    width: 90vw;
    display: flex;
    font-size: 3.7vw;
    font-family: PingFang SC;
    font-weight: bold;
    color: rgba(255, 255, 255, 1);
    align-items: center;
    margin-left: 7vw;
    justify-content: space-between;
    p:nth-of-type(1) {
      margin-bottom: 3vw;
      // padding-left: 8vw;
    }
    div {
      width: 25vw;
    }
    div:nth-of-type(1) {
      border-right: 1px solid #fff;
    }
    div:nth-of-type(2) {
      border-right: 1px solid #fff;
    }
  }
}
.sou {
  width: 95vw;
  height: 10vw;
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin: 3vw auto;
  background: rgba(255, 255, 255, 1);
  border: 1px solid rgba(229, 229, 229, 1);
  box-shadow: 3px 5px 10px 0px rgba(226, 226, 226, 0.3);
  border-radius: 3vw;
  img {
    width: 2.9vw;
    height: 2.9vw;
    margin-left: 5vw;
  }
  input {
    border: 0;
    width: 85vw;
    height: 10vw;
    border-top-right-radius: 3vw;
    border-bottom-right-radius: 3vw;
  }
}
.contUp {
  width: 90vw;
  // height:16vw;
  margin: 0 auto;
  padding-bottom: 15vw;
  box-shadow: 0px 8px 10px 0px rgba(229, 229, 229, 0.3);
  border-radius: 1vw;
  ul {
    display: flex;
    padding: 3vw;
    align-items: center;
    margin-bottom: 3vw;
    background: rgba(255, 255, 255, 1);
    justify-content: space-between;
    .upleft {
      width: 30vw;
    }
    .upright {
      width: 65vw;
      text-align: right;
    }
  }
  p {
    font-size: 3.6vw;
    font-family: PingFang SC;
    font-weight: bold;
    line-height: 8vw;
    color: rgba(91, 91, 91, 1);
    white-space: nowrap;
    // line-height:20px;
    span {
      color: #ee2a1e;
    }
    button {
      width: 16vw;
      height: 7vw;
      border: 0;
      color: #fff;
      line-height: 5vw;
      background: rgba(238, 40, 28, 1);
      border-radius: 1vw;
    }
  }
}
.home_top {
  font-size: 4.4vw;
  font-family: PingFang SC;
  font-weight: bold;
  color: rgba(10, 2, 4, 1);
  margin: 5vw auto;
  margin-left: 3vw;
  // line-height:20px;
  display: flex;
  align-content: bottom;
  justify-content: space-between;
  span:last-child {
    color: #ef2a1e;
    font-size: 3vw;
    overflow: hidden;
    line-height: 6vw;
    margin-right: 3vw;
    img {
      width: 4vw;
      height: 3vw;
      margin-top: -1px;
      vertical-align: middle;
    }
  }
}
/deep/.van-tabs__line {
  width: 12vw !important;
  border-radius: 3vw;
  background-color: #58c89c !important;
  // margin-left: 10.6% !important;
}
/deep/.van-tabs--line {
  padding-top: 12vw;
}
/deep/.van-tab--active {
  color: #58c89c !important;
}
/deep/[class*="van-hairline"]:after {
  display: none !important;
}
/deep/.van-ellipsis {
  // font-weight: bold !important;
  font-size: 3.7vw;
}
/deep/.van-tabs__nav {
  background: #1c1c1d;
}
/deep/.van-field__control {
  color: #333333;
}
/deep/.van-tabs--line .van-tabs__wrap {
  height: 12vw;
}
/deep/.van-tab {
  line-height: 12vw;
  color: #fff;
}
.content {
  min-height: 40vh;
  overflow: hidden;
  background-color: #f5f5f5;
  // margin: 1.5vw 3vw 0;
  // padding-bottom: 18vw;
}
.wallet {
  margin: 0.5vw 0;
  padding: 3vw 3vw 2vw;
  // background: #1c1c1d;
  li {
    display: flex;
    justify-content: space-between;
    font-size: 3.2vw;
  }
  li:nth-child(1) {
    margin-bottom: 1.5vw;
  }
  li:nth-child(2) {
    align-items: center;
    > span:nth-child(2) {
      background: #58c89c;
      padding: 1vw 2.5vw;
      font-size: 3.5vw;
      border-radius: 1.5vw;
    }
  }
}
.sell {
  z-index: 999;
  position: fixed;
  top: 65vh;
  right: 7vw;
  width: 14vw;
  height: 14vw;
  line-height: 14vw;
  text-align: center;
  color: #fff;
  border-radius: 50%;
  background: #ff654d;
  font-size: 4vw;
}
.popBuy {
  width: 100%;
  background: #fff;
  color: #333333;
  border-radius: 3vw 3vw 0 0;
  p {
    font-size: 3.5vw;
    font-family: PingFang SC;
    font-weight: 500;
    padding: 0 11vw;
    color: rgba(102, 102, 102, 1);
    line-height: 8vw;
  }
  > div:nth-child(1) {
    position: relative;
    text-align: center;
    padding: 2vw 0;
    font-family: PingFang SC;
    font-weight: 500;
    color: rgba(51, 51, 51, 1);
    // line-height:30px;
    font-size: 4.2vw;
    span:nth-child(2) {
      transform: translateY(-50%);
      position: absolute;
      top: 45%;
      right: 2vw;
      img {
        width: 4vw;
        height: 4vw;
      }
    }
  }
  > ul {
    padding: 2vw 10vw;
    li {
      padding: 2.5vw 1vw;
      // border-bottom: 1px solid #eee;
      display: flex;
      position: relative;
      align-items: center;
      > span:nth-child(1) {
        display: inline-block;
        width: 25vw;
        text-align-last: justify;
        font-size: 3.9vw;
      }
      input {
        width: 80vw;
        height: 8vw;
        border: 0;
        // color:#333;
        margin-left: 3vw;
        font-size: 3.5vw;
        padding-left: 2vw;
        background: #fff;
        border-radius: 2vw;
        -webkit-appearance: none;
        border: 1px solid rgba(170, 170, 170, 1);
      }
    }
    .totalPrice {
      input[disabled] {
        color: #333;
        opacity: 1;
      }
    }
    li:nth-child(3) {
      position: relative;
      > span:nth-child(3) {
        transform: translateY(-50%);
        position: absolute;
        top: 50%;
        right: 3vw;
        img {
          width: 3.5vw;
          height: 3.5vw;
        }
      }
    }
  }
  .buy_btn {
    margin: 3vw 10vw 3vw;
    display: flex;
    font-size: 3.9vw;
    line-height: 11vw;
    align-content: center;
    justify-content: space-between;
    button:first-child {
      width: 38vw;
      height: 11vw;
      border-radius: 5vw;
      background: #ee281c;
    }
    button:last-child {
      width: 38vw;
      height: 11vw;
      color: #333;
      border-radius: 5vw;
      background: rgba(220, 220, 220, 1);
    }
  }
}
.no_data {
  margin: 11vh auto 0;
  img {
    width: 40vw;
  }
  div {
    margin-top: 2vh;
    font-size: 3.5vw;
    color: #999;
  }
}
/deep/.van-pull-refresh {
  overflow: visible !important;
}
.search {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 2vw 3vw;
  > div:nth-child(1) {
    // width: 35vw;
    padding: 3vw 4vw;
    background: #1c1c1d;
    border-radius: 30vw;
    display: flex;
    align-items: center;
    img {
      width: 4.5vw;
      height: 4.5vw;
      margin-right: 3vw;
    }
    input {
      width: 65vw;
      background-color: transparent;
      border: 0;
      font-size: 3.2vw;
    }
    /* WebKit browsers */
    input::-webkit-input-placeholder {
      color: #666666;
    }
    /* Mozilla Firefox 4 to 18 */
    input:-moz-placeholder {
      color: #666666;
    }
    /* Mozilla Firefox 19+ */
    input::-moz-placeholder {
      color: #666666;
    }
    /* Internet Explorer 10+ */
    input:-ms-input-placeholder {
      color: #666666;
    }
  }
  > div:nth-child(2) {
    margin-right: 2vw;
    font-size: 4vw;
  }
}
.yijia {
  position: absolute;
  top: 0;
  right: 3vw;
  display: block;
  // overflow: hidden;
  padding-top: 5vw;
  img {
    width: 4vw;
    height: 4vw;
    vertical-align: top;
    padding: 1vw;
    padding-top: 0;
  }
}
.wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
}
.block {
  width: 120px;
  height: 120px;
  background-color: #fff;
}
.popYijia {
  width: 80vw;
  height: 90vw;
  color:#fff;
  overflow-y: visible;
  border-radius: 2vw;
  background: url("../../assets/img/deal/bg1.png") no-repeat;
  background-size: cover;
  .title {
    font-size:3.5vw;
    font-family:PingFang SC;
    font-weight:bold;
    padding-top: 29vw;
    text-align: center;
    position: relative;
    margin-bottom:3vw;
    img {
      width: 50vw;
      position: absolute;
      top: -10vw;
      left: 18%;
    }
  }
  .text{
    width: 54vw;
    margin: 0 auto;
    font-size:3.4vw;
    font-family:PingFang SC;
    font-weight:500;
    line-height: 6vw;
    margin-bottom:7vw;
  }
  button{
    width:35vw;
    height:7vw;
    border:0;
    font-size:3.5vw;
    font-family:PingFang SC;
    font-weight:500;
    text-align: center;
    color:rgba(51,51,51,1);
    line-height:6vw;
    margin-left:22vw;
    background:rgba(255,255,255,1);
    border-radius:4vw;
  }
}
</style>
