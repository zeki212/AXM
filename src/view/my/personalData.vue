<template>
  <div>
    <my-header :showBack="true" title="个人信息"/>
    <div class="content">
      <ul>
        <li>
          <p>用户名</p>
          <p>{{user.realName}}</p>
          <!-- <input type="text" v-model="user.realName" placeholder="12364587954"> -->
        </li>
        <li>
          <p>注册时间</p>
          <!-- <input type="text" v-model="formatDate"> -->
          <p>{{user.registerTime|formatDate('yyyy-MM-dd hh:mm:ss')}}</p>
        </li>
        <li>
          <p>用户等级</p>
          <p v-if="user.level==0">普通矿工</p>
          <p v-if="user.level==1">好心人</p>
          <p v-if="user.level==2">志愿者</p>
          <p v-if="user.level==3">大慈善家</p>
          <p v-if="user.level==4">有义之士</p>
        </li>
      </ul>
      <ul>
        <li>
          <p>用户姓名</p>
          <input type="text" :readonly='disabled' v-model="user.realName" placeholder="请输入姓名">
          <!-- <input type="text" v-model="username" placeholder="请输入姓名"> -->
        </li>
        <li>
          <p>身份证号</p>
          <input type="text" :readonly='disabled' v-model="user.idNo" placeholder="请输入身份证号">
        </li>
        <li>
          <p>支付宝</p>
          <input type="text" :readonly='disabled' v-model="alipayAccount" placeholder="请输入支付宝账号">
        </li>
        <li>
          <p>银行卡</p>
          <input type="text" :readonly='disabled' v-model="bankCardNo" placeholder="请输入银行卡号">
        </li>
        <li>
          <p>银行开户行</p>
          <input type="text" :readonly='disabled' v-model="bankCode" placeholder="请输入开户行，如建设银行">
        </li>
        <li>
          <p>联系电话</p>
          <input type="text" :readonly='disabled' maxlength="11" v-model="contactNumber" placeholder="请填写您的手机号码">
        </li>
        <button @click="updateUserPayInfo" v-if="disabled == false">保存</button>
        <p v-show="disabled == false">注：每个账号只有一次保存支付信息机会哟！</p>
      </ul>
    </div>
  </div>
</template>

<script>
import { Toast } from "vant";
export default {
  data(){
    return {
      username:'',
      idNo:'',
      alipayAccount:'',
      bankCardNo:'',
      bankCode:'',
      disabled:false,
      contactNumber:'',
      user:JSON.parse(localStorage.getItem('user')),
      userInfo: JSON.parse(localStorage.getItem("userInfo")),
      version: this.$information.VERSION,
    }
  },
  created(){
    this.getCustInfo();
  },
  methods:{
    getCustInfo() {
      let params = {};
      var formObject = encodeParams(params, this.userInfo.userId, this.userInfo.tokenId, this.userInfo.appKey);
      this.$ajax(this.$api.getCustInfo, {}, formObject.sign).then(res => {
        if (res.code == 200) {
          this.user = res.data;
          if(res.data.alipayAccount!=''&&res.data.bankCardNo!=''&&res.data.bankCode!=''&&res.data.contactNumber!='') {
            this.disabled = true;
            this.alipayAccount = res.data.alipayAccount;
            this.bankCardNo = res.data.bankCardNo;
            this.bankCode = res.data.bankCode;
            this.contactNumber = res.data.contactNumber;
          }
        } else {
          Toast({ message: res.msg, position: "center" });
        }
      })
    },
    updateUserPayInfo() {
      if (!this.alipayAccount) {
        Toast({ message: "请输入支付宝账号", position: "center" });
        return;
      }
      if (!this.bankCardNo) {
        Toast({ message: "请输入银行卡账号", position: "center" });
        return;
      }
      if (!this.bankCode) {
        Toast({ message: "请输入开户行", position: "center" });
        return;
      }
      if (!this.contactNumber) {
        Toast({ message: "请输入您的手机号码", position: "center" });
        return;
      }
      let params = {alipayAccount:this.alipayAccount,bankCardNo:this.bankCardNo,bankCode:this.bankCode,contactNumber:this.contactNumber};
      var formObject = encodeParams(params, this.userInfo.userId, this.userInfo.tokenId, this.userInfo.appKey);
      this.$ajax(this.$api.updateUserPayInfo, {alipayAccount:this.alipayAccount,bankCardNo:this.bankCardNo,bankCode:this.bankCode,contactNumber:this.contactNumber}, formObject.sign).then(res => {
        if (res.code == 200) {
          Toast({ message: res.msg, position: "center" });
          this.getCustInfo();
        } else {
          Toast({ message: res.msg, position: "center" });
        }
      })
    },
  }
}
</script>

<style lang="less" scoped>
.content{
  background-color: #F6F6F6;
  ul:first-child{
    height: 55vw;
    margin-bottom: 4vw;
    padding-top:10vw;
    background-color: #fff;
    li{
      width: 95vw;
      margin:0 auto 3.5vw;
      border-bottom:1px solid rgba(228,228,228,1);
      p{
        font-size:3.5vw;
        font-family:PingFang SC;
        font-weight:500;
        color:rgba(153,153,153,1);
      }
      input{
        width: 100%;
        height: 10vw;
        border:0;
      }
      p:last-child{
        color:#333;
        width: 100%;
        height: 10vw;
        line-height: 10vw;
      }
    }
  }
  ul:last-child{
    height: 130vw;
    padding-top:5vw;
    background-color: #fff;
    li{
      width: 95vw;
      margin:0 auto 3.5vw;
      border-bottom:1px solid rgba(228,228,228,1);
      p{
        font-size:3.5vw;
        font-family:PingFang SC;
        font-weight:500;
        color:rgba(153,153,153,1);
      }
      input{
        width: 100%;
        height: 10vw;
        border:0;
      }
    }
    button{
      width:95vw;
      height:10vw;
      border:0;
      margin-left:2vw;
      font-size:3.5vw;
      font-family:PingFang SC;
      font-weight:bold;
      color:#fff;
      background:rgba(237,39,27,1);
      border-radius:1vw;
    }
    >p{
      // width:464px;
      height:10vw;
      font-size:2.5vw;
      line-height: 10vw;
      text-align: center;
      font-family:PingFang SC;
      font-weight:bold;
      padding-bottom:8vw;
      color:rgba(153,153,153,1);
    }
  }
}
</style>