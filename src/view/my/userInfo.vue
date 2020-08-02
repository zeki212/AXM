<!-- 用户信息 -->
<template>
  <div>
    <my-header class="headers" :white="true" :showBack="false" title="个人账单" />
    <div class="list">
      <van-pull-refresh v-model="isLoading" class="myHeight" @refresh="onRefresh">
        <van-list  v-model="loading" :finished="finished" @load="loadMore" :offset="10">
          <ul v-for="(item,index) in list" :key="index">
            <li>
              <p>
                <span>{{item.detail}}</span>
                <span style="color:#FF4444;" v-if="item.value>0">+{{item.value}}</span>
                <span style="color:#FF4444;" v-else>{{item.value}}</span>
              </p>
              <p>
                <span>流水号:{{item.id}}</span>
                <span>{{item.createTime|formatDate('yyyy-MM-dd hh:mm:ss')}}</span>
              </p>
            </li>
          </ul>
        </van-list>
      </van-pull-refresh>
      <div class="no_data" v-show="isLoad&&list.length==0">
        <img src="../../assets/img/home/zanwu.png" alt="">
      </div>
    </div>
  </div>
</template>

<script>
import { Toast } from "vant";
export default {
  data() {
    return {
      userInfo: JSON.parse(localStorage.getItem("userInfo")),
      user: '',
      time: '',
      list:"",
      version: this.$information.VERSION,
      pageNo: 1,
      pageSize: 10,
      isLoad: false,
      loading: false,
      finished: true,
      isLoading: false,
      type: 1,
      alipayAccount: '',
      bankCardNo: '',
      bankCode: '',
      contactNumber: '',
      disabled: false,
    };
  },
  components: {},
  watch: {
    '$route'(val, oldval) {
      if (oldval.fullPath.indexOf('?') != -1) {
      }
    },
  },
  watch: {
    active(val) {
      this.pageNo = 1
      this.finished = true
      if (val == 0) {
        this.type = 1
      }
      if (val == 1) {
        this.type = 6
      }
      if (val == 2) {
        this.type = 5
      }
      // this.getProfitRecord();
    }
  },
  mounted() {
    this.getCustInfo()
    this.getProfitRecord();
  },

  methods: {
    getProfitRecord() {
      let params = { version: this.version, pageNo: this.pageNo = 1, pageSize: this.pageSize};
      var formObject = encodeParams(params, this.userInfo.userId, this.userInfo.tokenId, this.userInfo.appKey);
      this.isLoad = false;
      // console.log(params);
      this.$ajax(this.$api.getProfitRecord, { version: this.version, pageNo: params.pageNo, pageSize: this.pageSize}, formObject.sign)
        .then(res => {
          // console.log(res);
          this.loading = false;
          this.isLoad = true;
          if (res.code == 200) {
            if (res.data) {
              this.list = res.data.list;
              this.finished = res.data.totalCount / res.data.pageSize < this.pageNo;
            }
          } else {
            Toast({ message: res.msg, position: "center",duration:"1000"  });
          }
        })
    },  
    loadMore() {
      setTimeout(() => {
        let params = { version: this.version, pageNo: this.pageNo += 1, pageSize: this.pageSize};
        var formObject = encodeParams(params, this.userInfo.userId, this.userInfo.tokenId, this.userInfo.appKey);
        this.isLoad = false;
        this.$ajax(this.$api.getProfitRecord, { version: this.version, pageNo: params.pageNo, pageSize: this.pageSize}, formObject.sign)
          .then(res => {
            this.loading = false;
            if (res.code == 200) {
              if (res.data && res.data.list.length > 0) {
                this.list = this.list.concat(res.data.list);
                this.finished = res.data.totalCount / res.data.pageSize < this.pageNo;
              } else {
                this.finished = true;
              }
            } else {
              Toast({ message: res.msg, position: "center",duration:"1000"  });
            }
          })
      }, 1000);
    },
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
          Toast({ message: res.msg, position: "center",duration:"1000"  });
        }
      })
    },
    onRefresh() {
      setTimeout(() => {
        this.getProfitRecord()
        // this.$toast('刷新成功');
        this.isLoading = false;
      }, 500);
    },
  }
}

</script>
<style lang='less' scoped>
@import "../../assets/css/config";
.headers{
  background: #FF4444!important;
  div{
    color:#fff!important;
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
.list{
  padding-bottom: 5vw;
  background-color: #F0F0F0;
  li{
    width:85vw;
    height:16vw;
    margin:0 auto;
    margin-top:2vw;
    padding:3vw;
    background:rgba(255,255,255,1);
    box-shadow:0px 0px 15px 0px rgba(44,49,140,0.11);
    border-radius:1vw;
    p:nth-child(1){
      display: flex;
      font-size:3.2vw;
      font-family:PingFang SC;
      font-weight:bold;
      color:rgba(55,60,64,1);
      align-items: center;
      line-height: 8vw;
      justify-content: space-between;
    }
    p:nth-child(2){
      display: flex;
      font-size:2.6vw;
      font-family:PingFang SC;
      font-weight:400;
      color:#8D8D8D;
      line-height: 8vw;
      align-items: center;
      justify-content: space-between;
    }
  }
}
.content {
  background: #0e0e0e;
}
.account_btn {
  margin: 15vw 5vw 3vw;
  button {
    background: #58c89c;
    border-radius: 1vw;
  }
}
.record {
  margin: 0 6vw 0 3vw;
  li {
    display: flex;
    justify-content: space-between;
    border-bottom: 1px solid #000000;
    span:nth-child(1) {
      font-size: 3.7vw;
      color: #fff;
    }
    span {
      padding: 4vw 0;
      font-size: 3.2vw;
      color: #999999;
      input {
        width: 58vw;
        border: 0;
        text-align: right;
        background: #0e0e0e;
        // margin-left: 5vw;
      }
      /* WebKit browsers */
      input::-webkit-input-placeholder {
        color: #9b9b9b;
      }
      /* Mozilla Firefox 4 to 18 */
      input:-moz-placeholder {
        color: #9b9b9b;
      }
      /* Mozilla Firefox 19+ */
      input::-moz-placeholder {
        color: #9b9b9b;
      }
      /* Internet Explorer 10+ */
      input:-ms-input-placeholder {
        color: #9b9b9b;
      }
    }
  }
}
</style>