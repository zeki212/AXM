<!-- 我要留言 -->
<template>
  <div>
    <my-header class="header" :white="true" :showBack="false" title="我要留言" />
    <div class="content">
      <div class="liuyan">
          <div class="title">留言</div>
          <div class="cont">
            <p>内容填写<span style="color:#999999;">（详细填写）</span></p>
            <textarea name="message" v-model="leaveWord" id="" cols="30" rows="10" placeholder="感谢您对我们提出的宝贵问题，我们会尽快优化
产品，提升用户体验"></textarea>
          </div>
          <div class="account_btns">
            <van-button type="primary" size="large" @click="emails()">提交</van-button>
          </div>
      </div>
      <!-- <ul class="record">
        <li>
          <span>留言邮箱：</span>
          <span><input type="text" style="color: #58C89C" readonly v-model="email" placeholder="请输入邮箱"></span>
        </li>
        <li>
          <span>留言内容：</span>
          <span><input type="text" disabled v-model="leaveWord" placeholder="账号+留言内容"></span>
        </li>
      </ul> -->
      <!-- <div class="account_btn">我们会及时给与邮箱回复</div> -->
      <!-- <p class="fontP" style="opacity:0.59;font-size: 3.2vw"> 注：有问题请先反馈上级或者团队长，团队长联系客服，减少
客服压力，谢谢配合！</p> -->
    </div>
  </div>
</template>

<script>
import { Toast } from "vant";
export default {
  data() {
    return {
      email: '',
      leaveWord: '',
    };
  },
  components: {},
  watch: {
    '$route'(val, oldval) {
      if (oldval.fullPath.indexOf('?') != -1) {
      }
    },
  },

  mounted() {
  },

  methods: {
    emails() {
      if(!this.leaveWord) {
        Toast({ message: '请输入留言内容!', position: "center",duration:"1000"  });
        return;
      }
      this.leaveWord = '';
      Toast({ message: '处理成功,我们将尽快给您答复!', position: "center",duration:"1000"  });
    }
  }
}

</script>
<style lang='less' scoped>
@import "../../assets/css/config";
.header{
  color:#fff!important;
  background: #FF4444!important;
}
.content {
  overflow: hidden;
  background: #F0F0F0;
  .liuyan{
    width:80vw;
    height:55vh;
    margin:0 auto;
    margin-top:4vw;
    padding:5vw;
    background:rgba(255,255,255,1);
    border-radius:1vw;
    .title{
      font-size:4.2vw;
      font-family:PingFang SC;
      font-weight:600;
      margin-bottom:6vw;
      color:rgba(51,51,51,1);
      // line-height:72px;
    }
    .cont{
      p{
        font-size:3vw;
        font-family:PingFang SC;
        font-weight:400;
        color:rgba(51,51,51,1);
        margin-bottom:2vw;
      }
      textarea{
        width:75vw;
        resize: none;
        // height:382px;
        font-family:PingFang SC;
        font-weight:400;
        padding: 2vw;
        font-size: 2.4vw;
        background:rgba(255,255,255,1);
        border:1px solid rgba(220,220,220,1);
        border-radius:1vw;
      }
      textarea::-webkit-input-placeholder{
        color:rgba(204,204,204,1) !important;;
      }
      textarea:-moz-placeholder{
        color:rgba(204,204,204,1) !important;;
      }
      textarea:-ms-input-placeholder{
        color:rgba(204,204,204,1) !important;;
      }
    }
  }
}
.account_btn {
  margin: 3vw 5vw 3vw;
  font-size: 3.7vw;
}
.account_btns {
  margin: 15vw auto;
  button {
    background: #FF4444;
    border-radius: 1vw;
  }
}
.record {
  margin: 0 5vw;
  li {
    span:nth-child(1) {
      display: inline-block;
      // width: 14vw;
      // text-align-last: justify;
      font-size: 3.7vw;
    }
    span {
      padding: 3vw 0 2vw;
      input {
        width: 58vw;
        border: 0;
        background: #0e0e0e;
        margin-left: 5vw;
        font-size: 3.2vw;
      }
      /* WebKit browsers */
      input::-webkit-input-placeholder {
        color: #9B9B9B;
      }
      /* Mozilla Firefox 4 to 18 */
      input:-moz-placeholder {
        color: #9B9B9B;
      }
      /* Mozilla Firefox 19+ */
      input::-moz-placeholder {
        color: #9B9B9B;
      }
      /* Internet Explorer 10+ */
      input:-ms-input-placeholder {
        color: #9B9B9B;
      }
    }
  }
}
.fontP {
  position: fixed;
  bottom: 10vw;
  left: 5vw;
  margin-right: 5vw;
  line-height: 5.5vw;
}
</style>