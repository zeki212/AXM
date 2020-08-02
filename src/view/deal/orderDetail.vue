<template>
  <div>
    <my-header class="headerS" :showBack="false" :white="true" title="订单详情" />
    <!-- 内容 -->
    <div class="content">
      <!-- 订单状态 -->
      <div class="type">
        订单状态：
        <span v-if="tradeStatus==1" style="color:#ED271B;">待匹配</span>
        <span v-if="tradeStatus==2" style="color:#ED271B;">待付款</span>
        <span v-if="tradeStatus==3" style="color:#ED271B;">待确认</span>
        <span v-if="tradeStatus==4" style="color:#ED271B;">已完成</span>
        <span v-if="tradeStatus==5" style="color:#ED271B;">已取消</span>
        <span v-if="tradeStatus==6" style="color:#ED271B;">申诉中</span>
      </div>
      <!-- 订单信息 -->
      <div class="newTwo">
        <p>
          <img src="../../assets/img/deal/dingdan.png" alt />
          订单信息
        </p>
        <div>
          <p>
            <span>成交数量：</span>
            <span>{{orderDetail.num}}</span>
          </p>
          <p>
            <span>成交单价：</span>
            <span>{{orderDetail.price}}RMB</span>
          </p>
          <p>
            <span>成交总价：</span>
            <span>{{users.totalPrice || '0'}}RMB</span>
          </p>
          <p>
            <span>交易时间：</span>
            <span>{{orderDetail.orderTime|formatDate('yyyy-MM-dd hh:mm:ss')}}</span>
          </p>
        </div>
      </div>
      <!-- 卖家信息-->
      <div class="newOne" v-if="type == 1 && (tradeStatus == 2 || tradeStatus == 3)">
        <p>
          <img src="../../assets/img/deal/ren.png" alt />
          <span>卖方信息</span>
        </p>
        <div>
          <p>
            <span>姓名：</span>
            <span>{{users.sellerName}}</span>
          </p>
          <p>
            <span>电话：</span>
            <span>{{users.sellerMobile}}</span>
          </p>
          <p>
            <span>支付宝账号：</span>
            <span class="zhi">{{users.sellerAlipayAccount}}</span>
            <span class="fu" :data-clipboard-text="users.sellerAlipayAccount" @click="promote()">
              <img src="../../assets/img/deal/fuzhi.png" alt />
            </span>
          </p>
        </div>
      </div>
      <!--  买家信息  -->
      <div
        class="newOne"
        v-if="type == 2 && (tradeStatus == 2 || tradeStatus == 3 || tradeStatus == 4)"
      >
        <p>
          <img src="../../assets/img/deal/ren.png" alt />
          <span>买方信息</span>
        </p>
        <div>
          <p>
            <span>姓名：</span>
            <span>{{users.buyerName}}</span>
          </p>
          <p>
            <span>电话：</span>
            <span>{{users.buyerMobile}}</span>
          </p>
        </div>
      </div>
      <!-- 收款码 -->
      <div class="money">
        <p>
          <img src="../../assets/img/deal/zhifu.png" alt />
          <span v-if="type==1">他的收款码</span>
          <span v-if="type==2">买方付款凭证</span>
          <span class="shengsu" v-if="type==2 && tradeStatus == 3" @click="goCompText">申诉</span>
        </p>
        <!-- 买家上传付款截图 -->
        <div class="imgCode" v-if="type==1">
          <div class="comon">
            <div class="former" v-if="users.sellerAlipayCode">
              <p @click="showTradingImg(users.sellerAlipayCode)">
                <img style="width:100%;" :src="users.sellerAlipayCode" alt />
              </p>
            </div>
            <span v-else>收款码</span>
          </div>
          <div class="out">
            <div class="former" v-if="tradeVoucher">
              <p @click="showTradingImg(tradeVoucher)">
                <img :src="tradeVoucher" alt />
              </p>
            </div>
            <label v-else for="uploadImg" class="labelimg">
              <p v-if="imgURL" class="labelone">
                <img :src="imgURL" alt />
              </p>
              <p v-else class="labeltwo">
                <img class="imgone" src="../../assets/img/deal/jia.png" alt />
                <span>点击上传截图</span>
              </p>
              <input
                type="file"
                @change="addImg(orderDetail)"
                accept="image/*"
                ref="fileInfo"
                id="uploadImg"
              />
            </label>
          </div>
        </div>
        <!-- 卖家查看买家付款截图 -->
        <div
          class="imgCode"
          v-if="type==2 && (tradeStatus == 2 || tradeStatus == 3 || tradeStatus == 4)"
        >
          <div class="comon">
            <div class="former" v-if="users.tradeVoucher">
              <p @click="showTradingImg(users.tradeVoucher)">
                <img style="width:100%;" :src="users.tradeVoucher" alt />
              </p>
            </div>
            <div v-else>
              <img src="../../assets/img/deal/mai.png" alt />
              <p>等待对方上传支付凭证</p>
            </div>
          </div>
        </div>
      </div>
      <!-- 底部信息 -->
      <div class="footer">
        <!-- 买家付款前 -->
        <div v-if="type==1 && tradeStatus == 2">
          <p style="fontSize:2.8vw;">
            截止时间：
            {{endTime|formatDate('yyyy-MM-dd hh:mm:ss')}}
          </p>
          <p>
            <button @click="confirmPay">确认付款</button>
          </p>
        </div>
        <!-- 买家付款后 -->
        <div v-if="type==1 && tradeStatus == 3">
          <p style="width:100%;font-size:2.8vw;">
            截止时间：
            {{endTime|formatDate('yyyy-MM-dd hh:mm:ss')}}
          </p>
        </div>
        <!-- 卖家收款前 -->
        <div v-if="type==2 && tradeStatus == 2">
          <p style="width:100%;">
            截止时间：
            {{endTime|formatDate('yyyy-MM-dd hh:mm:ss')}}
          </p>
        </div>
        <!-- 卖家收款后 -->
        <div v-if="type==2 && tradeStatus == 3">
          <!-- <p style="font-size: 2.8vw;">剩余确认时间：{{endTime|formatDate('yyyy-MM-dd hh:mm:ss')}}</p> -->
          <p style="font-size: 2.8vw;">
            截止时间：
            {{endTime|formatDate('yyyy-MM-dd hh:mm:ss')}}
          </p>
          <p>
            <button @click="showconfirmRecive">确认收款</button>
          </p>
        </div>
      </div>
      <div v-show="statesw == '2'" class="loadings">
        <van-loading />
      </div>
    </div>
    <!-- 申诉按钮 -->
    <van-popup v-model="compText" class="textX" @click-overlay="compText==false">
      <div class="img" @click="goDownimg">
        <img src="../../assets/img/deal/del.png" alt />
      </div>
      <ul>
        <li style="textAlign:center;margin-bottom:2vw;">申诉</li>
        <li>
          <textarea v-model="complaintDetail" name id cols="30" rows="10" placeholder="请输入申诉内容"></textarea>
        </li>
        <li>注:申诉后资产将会冻结，恶意申诉将会冻结账号</li>
        <li>
          <span @click="complaint">确定</span>
        </li>
      </ul>
    </van-popup>
    <!-- 确认收款输入密码 -->
    <van-popup v-model="confirmPop" class="textS" @click-overlay="goDown()">
      <ul>
        <li>请输入交易密码</li>
        <li>成交数量：{{orderDetail.num||'0'}}</li>
        <li>成交单价：{{orderDetail.price || '0'}}RMB</li>
        <li>成交总价：{{users.totalPrice || '0'}}RMB</li>
        <!-- <li>成交总价：{{users.totalPrice || '0'}}usdt≈￥{{totalPriceAll}}</li> -->
        <li>
          <input type="password" v-model="payPwd" />
        </li>
        <li>
          <span style="border-right:1px solid #E83D27;color:#5D6369;" @click="goDown()">取消</span>
          <span @click="confirmRecive">确定</span>
        </li>
      </ul>
    </van-popup>
  </div>
</template>

<script>
import { Toast, ImagePreview, CountDown } from "vant";
import ClipboardJS from "Clipboard";
export default {
  data() {
    return {
      confirmPop: false,
      payPwd: "",
      files: "",
      myInfo: "",
      users: "",
      source: 1,
      list: "",
      type: "",
      tradeStatus: "",
      pageNo: 1,
      pageSize: 10,
      endTime: "",
      // 申诉弹框
      compText: false,
      complaintDetail: "",
      tradeVoucher: "",
      imgURL: "",
      version: this.$information.VERSION,
      source: this.$information.source,
      time: JSON.parse(sessionStorage.getItem("time")) || 10,
      minute: JSON.parse(sessionStorage.getItem("minute")) || 0,
      second: JSON.parse(sessionStorage.getItem("second")) || 0,
      orderDetail: JSON.parse(sessionStorage.getItem("orderDetail")),
      statesw: "1",
      userInfo: JSON.parse(localStorage.getItem("userInfo")),
    };
  },
  computed: {
    totalPriceAll() {
      return (this.users.totalPrice * 7 || 0).toFixed(2);
    },
  },
  created() {
    this.getCustInfo();
  },
  mounted() {
    this.getTradeDetail();
  },
  methods: {
    promote() {
      if (this.users.sellerAlipayAccount != "") {
        const clipboard = new ClipboardJS(".fu");
        clipboard.on("success", function (e) {
          e.clearSelection();
          Toast({
            message: "复制成功!",
            position: "bottom",
          });
        });
        clipboard.on("error", function (e) {
          Toast({
            message: "复制失败,请升级浏览器!",
            position: "bottom",
          });
        });
      }
    },
    goDown() {
      this.confirmPop = false;
      this.payPwd = "";
    },
    goDownimg() {
      this.compText = false;
      this.complaintDetail = "";
    },
    goCompText() {
      this.compText = true;
    },
    // 点击图片，放大显示
    showTradingImg(voucherImg) {
      let arr = [];
      arr.push(voucherImg);
      ImagePreview(arr);
    },
    // 上传截图
    getObjectURL(file) {
      let url = null;
      if (window.createObjectURL != undefined) {
        // basic
        url = window.createObjectURL(file);
      } else if (window.URL != undefined) {
        // mozilla(firefox)
        url = window.URL.createObjectURL(file);
      } else if (window.webkitURL != undefined) {
        // webkit or chrome
        url = window.webkitURL.createObjectURL(file);
      }
      return url;
    },
    // 订单详情
    getTradeDetail() {
      const baseUrl = this.$api.baseURL;
      const _this = this;
      let userId = this.userInfo.userId;
      let tokenId = this.userInfo.tokenId;
      let appKey = this.userInfo.appKey;
      let params = {
        source: this.source,
        version: this.version,
        orderId: this.orderDetail.orderId,
      };
      var formObject = encodeParams(params, userId, tokenId, appKey);
      $.ajax({
        type: "POST",
        url: baseUrl + "/api/trade/getTradeDetail",
        headers: {},
        data: {
          source: params.source,
          version: params.version,
          orderId: params.orderId,
        },
        beforeSend: function (xhr) {
          xhr.setRequestHeader("sign", formObject.sign);
          xhr.setRequestHeader("userId", userId);
          xhr.setRequestHeader("tokenid", tokenId);
        },
        success: function (data) {
          if (data.code == "200") {
            if (data.data) {
              _this.users = data.data;
              _this.type = data.data.type;
              _this.tradeStatus = data.data.tradeStatus;
              _this.tradeVoucher = data.data.tradeVoucher;

              _this.endTime = data.data.endTime;
            }
          }
        },
        error: function (data) {
          Toast({ message: data.msg, position: "bottom" });
        },
      });
    },
    // 添加图片
    addImg(item) {
      // console.log(this.$refs.fileInfo[0].files[0])
      let refDom = fileInfo;
      let fileInfo = this.$refs.fileInfo.files[0];
      let fileSize = parseFloat(
        parseInt(fileInfo["size"]) / 1024 / 1024
      ).toFixed(2);
      if (fileSize > 18) {
        Toast({ message: "上传图片过大!", position: "bottom" });
        return;
      }

      // this.$refs[refDom].value = '';
      if (fileInfo) {
        let vm = this,
          a = new FileReader();
        a.onload = function (e) {
          vm.img1 = e.target.result;
        };
        a.readAsDataURL(fileInfo);
        vm.statesw = "2";
        let objUrl = this.getObjectURL(fileInfo);
        // this.$refs.img.src = objUrl;
        const baseUrl = vm.$api.baseURL;
        let userId = vm.userInfo.userId;
        let tokenId = vm.userInfo.tokenId;
        let appKey = vm.userInfo.appKey;
        let params = {
          type: 3,
          version: vm.version,
          file: fileInfo,
          source: vm.source,
        };
        var formObject = encodeParams(params, userId, tokenId, appKey);
        var formData = new FormData();
        formData.append("file", fileInfo);
        formData.append("type", "3");
        formData.append("version", vm.version);
        formData.append("source", vm.source);
        $.ajax({
          url: "https://api.yuediankeji.com/api/anon/uploadPhoto",
          type: "post",
          data: formData,
          cache: false,
          processData: false,
          contentType: false,
          beforeSend: function (xhr) {
            xhr.setRequestHeader("sign", formObject.sign);
            xhr.setRequestHeader("userId", userId);
            xhr.setRequestHeader("tokenid", tokenId);
          },
          success: function (res) {
            if (res.code == 200) {
              // Toast({ message: '已上传图片,请点击付款按钮!', position: "bottom" });
              // item.imgs = res.data.imageUrl
              vm.imgURL = res.data.imageUrl;
            }
            // Indicator.close();
          },
          error: function (e) {
            Toast({ message: e.msg, position: "bottom" });
            // Indicator.close();
            // errorState(e);
            // reject(e);
          },
          complete: function () {
            vm.statesw = "1";
          },
        });
      }
    },
    //确认付款
    confirmPay() {
      if (!this.imgURL) {
        Toast({ message: "请先上传图片!", position: "bottom" });
        return;
      }
      let params = {
        voucherUrl: this.imgURL,
        orderId: this.orderDetail.orderId,
      };
      var formObject = encodeParams(
        params,
        this.userInfo.userId,
        this.userInfo.tokenId,
        this.userInfo.appKey
      );
      this.$ajax(
        this.$api.confirmPay,
        { voucherUrl: this.imgURL, orderId: this.orderDetail.orderId },
        formObject.sign
      ).then((res) => {
        if (res.code == 200) {
          this.getTradeDetail();
          Toast({ message: res.msg, position: "bottom" });
        } else {
          Toast({ message: res.msg, position: "bottom" });
        }
      });
    },
    // 收款弹框
    showconfirmRecive() {
      this.confirmPop = true;
    },
    // 投诉
    complaint() {
      if (!this.complaintDetail) {
        Toast({ message: "请输入投诉内容!", position: "bottom" });
        return;
      }
      let params = {
        complaintDetail: this.complaintDetail,
        type: "2",
        orderId: this.orderDetail.orderId,
      };
      var formObject = encodeParams(
        params,
        this.userInfo.userId,
        this.userInfo.tokenId,
        this.userInfo.appKey
      );
      this.$ajax(
        this.$api.complaint,
        {
          complaintDetail: this.complaintDetail,
          type: "2",
          orderId: this.orderDetail.orderId,
        },
        formObject.sign
      ).then((res) => {
        if (res.code == 200) {
          Toast({ message: res.msg, position: "center", duration: "1000" });
          this.getTradeDetail();
          this.compText = false;
          this.complaintDetail = "";
        } else {
          Toast({ message: res.msg, position: "center", duration: "1000" });
        }
      });
    },
    // 确认收款
    confirmRecive() {
      if (!this.payPwd) {
        Toast({ message: "请输入交易密码!", position: "bottom" });
        return;
      }
      let params = {
        orderId: this.orderDetail.orderId,
        paypwd: this.payPwd,
      };
      var formObject = encodeParams(
        params,
        this.userInfo.userId,
        this.userInfo.tokenId,
        this.userInfo.appKey
      );
      this.$ajax(
        this.$api.confirmRecive,
        {
          orderId: this.orderDetail.orderId,
          paypwd: this.payPwd,
        },
        formObject.sign
      ).then((res) => {
        if (res.code == 200) {
          // 收款成功
          Toast({ message: res.msg, position: "center", duration: "1000" });
          this.getTradeDetail();
          this.confirmPop = false;
        } else {
          Toast({ message: res.msg, position: "center", duration: "1000" });
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
          this.myInfo = res.data;
          // if (res.data.primaryAuthStatus == 1) {
          //   this.user = res.data;
          //   this.idNo = res.data.idNo;
          //   this.name = res.data.realName;
          //   // this.codes = 2;
          //   this.disabled = true;
          // }
          // if (res.data.primaryAuthStatus == 0) {
          //   this.user = res.data;
          //   this.idNo = res.data.idNo;
          //   this.name = res.data.realName;
          // }
        } else {
          Toast({ message: res.msg, position: "center", duration: "1000" });
        }
      });
    },
  },
};
</script>

<style lang="less" scoped>
.headerS {
  background-color: #ed281c !important;
}
.content {
  background-color: #f0edf1;
  .type {
    height: 10vw;
    padding-left: 3vw;
    line-height: 10vw;
    background-color: #fff;
    font-size: 3.5vw;
    font-family: PingFang SC;
    font-weight: bold;
    margin-bottom: 2vw;
    color: rgba(51, 51, 51, 1);
  }
}
.newOne {
  margin-bottom: 3vw;
  background: rgba(255, 255, 255, 1);
  > p:first-child {
    height: 10vw;
    line-height: 11vw;
    font-size: 3.5vw;
    font-family: PingFang SC;
    font-weight: bold;
    color: rgba(0, 0, 0, 1);
    border-bottom: 1px solid rgba(228, 228, 228, 1);
    img {
      width: 4.3vw;
      margin-left: 3vw;
      margin-right: 1vw;
      margin-top: -4px;
      // vertical-align: top;
    }
  }
  > div {
    width: 83vw;
    margin: 0 auto;
    p {
      display: flex;
      line-height: 10vw;
      font-size: 3.5vw;
      font-family: PingFang SC;
      font-weight: 500;
      color: rgba(51, 51, 51, 1);
      align-content: center;
      justify-content: space-between;
      .zhi {
        flex:1;
        text-align: right;
        // margin-right: -35vw;
      }
      .fu {
        width: 8vw;
        height: 10vw;
        text-align: center;
        img {
          width: 4vw;
        }
      }
    }
  }
}
.newTwo {
  // height: 33vw;
  margin-bottom: 2vw;
  background: rgba(255, 255, 255, 1);
  > p:first-child {
    height: 10vw;
    line-height: 11vw;
    font-size: 3.5vw;
    font-family: PingFang SC;
    font-weight: bold;
    color: rgba(0, 0, 0, 1);
    // margin-bottom:4vw;
    border-bottom: 1px solid rgba(228, 228, 228, 1);
    img {
      width: 4.3vw;
      margin-left: 3vw;
      margin-right: 1vw;
      // vertical-align: top;
    }
  }
  > div {
    width: 83vw;
    margin: 0 auto;
    // padding-top:3.2vw;
    p {
      display: flex;
      line-height: 10vw;
      font-size: 3.5vw;
      font-family: PingFang SC;
      font-weight: 500;
      color: rgba(51, 51, 51, 1);
      align-content: center;
      justify-content: space-between;
    }
  }
}
.money {
  margin-bottom: 3vw;
  background-color: #fff;
  > p:first-child {
    height: 10vw;
    overflow: hidden;
    line-height: 11vw;
    font-size: 3.5vw;
    font-family: PingFang SC;
    font-weight: bold;
    color: rgba(0, 0, 0, 1);
    // margin-bottom:4vw;
    border-bottom: 1px solid rgba(228, 228, 228, 1);
    img {
      width: 4.3vw;
      margin-left: 3vw;
      margin-right: 1vw;
      // vertical-align: top;
    }
  }
  .imgCode {
    width: 100%;
    height: 65vw;
    display: flex;
    align-content: center;
    justify-content: space-around;
    .comon {
      width: 40vw;
      height: 50vw;
      line-height: 50vw;
      text-align: center;
      margin-top: 7vw;
      background: rgba(245, 245, 245, 1);
      border-radius: 2vw;
      img {
        width: 17vw;
      }
      p {
        height: 10vw;
        line-height: 10vw;
        font-size: 3vw;
        font-family: PingFang SC;
        font-weight: 400;
        color: rgba(101, 101, 101, 1);
      }
      span {
        font-size: 3vw;
        font-family: PingFang SC;
        font-weight: 400;
        color: rgba(101, 101, 101, 1);
      }
    }
    .out {
      width: 40vw;
      height: 50vw;
      line-height: 50vw;
      text-align: center;
      margin-top: 7vw;
      position: relative;
      background: rgba(245, 245, 245, 1);
      border-radius: 2vw;
      .labelimg {
        width: 100%;
        height: 50vw;
        line-height: 70vw;
        position: absolute;
        top: 0;
        left: 0;
        .labelone {
          width: 100%;
          height: 100% !important;
          // margin: 15px auto 0;
          display: flex;
          justify-content: center;
          background-color: #fff;
          align-items: center;
          border: 1px dashed #8e8e8e;
          border-radius: 3vw;
          img {
            width: auto;
            max-width: 100%;
            max-height: 100%;
            // margin: auto;
            display: block;
            position: relative;
            top: 0;
            left: 0;
            border-radius: 3vw;
          }
        }
        .labeltwo {
          img:first-child {
            width: 8vw;
            position: absolute;
            left: 16vw;
            bottom: 22vw;
          }
          span {
            font-size: 3vw;
            font-family: PingFang SC;
            font-weight: 400;
            color: rgba(101, 101, 101, 1);
          }
        }
      }
      input {
        display: none;
      }
    }
  }
}
.former {
  width: 100%;
  height: 50vw;
  // margin: 15px 13vw 0;
  text-align: center;
  p {
    width: 100%;
    height: 100% !important;
    // margin: 15px auto 0;
    display: flex;
    justify-content: center;
    background-color: #fff;
    align-items: center;
    border: 1px dashed #8e8e8e;
    border-radius: 3vw;
  }
  img {
    width: auto;
    max-width: 100%;
    max-height: 100%;
    // margin: auto;
    display: block;
    border-radius: 3vw;
  }
}
.loadings {
  transform: translate(-50%, -50%);
  position: absolute;
  top: 50%;
  left: 50%;
}
.footer {
  width: 100%;
  height: 15vw;
  > div {
    display: flex;
    text-align: center;
    align-content: center;
    justify-content: space-between;
    background-color: #fff;
    p {
      // display: flex;
      text-align: center !important;
      // align-items: center;
      // justify-content: space-between;
    }
  }
  p {
    width: 50%;
  }
  p:first-child {
    font-size: 3.5vw;
    text-align: center;
    line-height: 15vw;
    font-family: PingFang SC;
    font-weight: 400;
    color: rgba(255, 59, 67, 1);
  }
  p:last-child {
    button {
      width: 100%;
      height: 100%;
      border: 0;
      color: #fff;
      font-size: 3.8vw;
      background: rgba(233, 59, 39, 1);
    }
  }
}
.textS {
  width: 70vw;
  border-radius: 2vw;
  background: #fff;
  border: 1px solid #e83d27;
  li:nth-child(1) {
    font-size: 4vw;
    text-align: center;
    margin: 4.5vw 0 4vw;
  }
  li:nth-child(2),
  li:nth-child(3),
  li:nth-child(4) {
    font-size: 3.2vw;
    color: #e83d27;
    margin-left: 3vw;
    margin-bottom: 4vw;
  }
  li:nth-child(5) {
    margin: 0 3vw 3vw;
    input {
      width: 60vw;
      background: #fff;
      border: 1px solid #e83d27;
      color: #e83d27;
      font-size: 3.2vw;
      height: 8vw;
      padding: 0 2vw;
    }
  }
  li:nth-child(6) {
    display: flex;
    span {
      box-sizing: border-box;
      text-align: center;
      display: inline-block;
      width: 35vw;
      font-size: 3.5vw;
      padding: 3vw 0;
      color: #e83d27;
      border-top: 1px solid #e83d27;
    }
  }
}
.ddtime {
  text-align: center;
  line-height: 20vw;
  color: #e83d27;
  width: 100% !important;
}
.shengsu {
  float: right;
  width: 15vw;
  height: 7vw;
  line-height: 7vw;
  text-align: center;
  color: #fff;
  margin-right: 8vw;
  margin-top: 1.5vw;
  font-size: 3vw;
  border-radius: 1vw;
  background-color: #e83d27;
}
.textX {
  width: 80vw;
  background-color: #fff;
  padding: 5vw;
  border-radius: 2vw;
  .img {
    position: absolute;
    top: 5vw;
    right: 5vw;
    width: 5vw;
    z-index: 100;
  }
  li:nth-child(1) {
    font-size: 4vw;
    color: #010c1c;
    text-align: center;
    margin: 4.5vw 0 4vw;
  }
  li:nth-child(2) {
    margin: 0 auto;
    textarea {
      width: 80vw;
      height: 40vw;
      background-color: #f7f4f8;
      border: none;
      color: #010c1c;
      font-size: 3.2vw;
      box-sizing: border-box;
      padding: 4vw;
      border-radius: 4vw;
      resize: none;
      textarea::-webkit-input-placeholde {
        color: #f7f4f8;
      }
      textarea::-moz-placeholder {
        color: #f7f4f8;
      }
      textarea::-moz-placeholder {
        color: #f7f4f8;
      }
      textarea::-ms-input-placeholder {
        color: #f7f4f8;
      }
    }
  }
  li:nth-child(3) {
    font-size: 3vw;
    color: #333;
    margin: 3vw 5vw;
  }
  li:nth-child(4) {
    display: flex;
    span {
      display: block;
      width: 54vw;
      height: 7vw;
      text-align: center;
      line-height: 7vw;
      background-color: #e83d27;
      border-radius: 2vw;
      font-size: 3vw;
      color: #fff;
      margin: 3vw auto;
    }
  }
}
</style>