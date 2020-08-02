<template>
  <div>
    <my-header :showBack="true" title="服务商"/>
    <div class="content">
      <van-pull-refresh v-model="isLoading" class="myHeight" @refresh="onRefresh">
        <van-list v-model="loading" :finished="finished" @load="loadMore" :offset="20">
          <ul v-for="(item,index) in list" :key="index">
            <li>
              <div>
                  <p>usdt：{{item.usdt}}</p>
                  <p :data-clipboard-text="item.remark">微信号：{{item.remark}}</p>
              </div>
              <div>
                <button id="wechat" @click="copy(item.remark)">复制微信号</button>
              </div>
            </li>
          </ul>
        </van-list>
      </van-pull-refresh>
    </div>
  </div>
</template>

<script>
import ClipboardJS from "Clipboard";
import { Toast,ImagePreview } from "vant";
export default {
  data(){
    return {
        pageNo: 1,
        list:'',
        isLoad: false,
        loading: false,
        isLoading: false,
        finished: true,
        pageSize: 10,
        userInfo: JSON.parse(localStorage.getItem("userInfo")),
        version: this.$information.VERSION,
    }
  },
  created(){
    this.getServiceProviderList();
  },
  methods:{
    copy(phone) {
      if (phone != "") {
        var that = this;
        var clipboard = new ClipboardJS("#wechat", {
          text: function() {
            return phone;
          }
        });
        clipboard.on("success", function(e) {
          Toast({
            message: "复制成功!",
            position: "center",duration:"1000" 
          });
        });
        clipboard.on("error", function(e) {
          Toast({
            message: "复制失败,请升级浏览器!",
            position: "center",duration:"1000" 
          });
        });
      }
    },
    getServiceProviderList(){
      let params = { version: this.version, pageNo: this.pageNo = 1, pageSize: this.pageSize};
      var formObject = encodeParams(params, this.userInfo.userId, this.userInfo.tokenId, this.userInfo.appKey);
      this.isLoad = false;
      this.$ajax(this.$api.getServiceProviderList, { version: this.version, pageNo: params.pageNo, pageSize: this.pageSize}, formObject.sign)
        .then(res => {
          this.loading = false;
          this.isLoad = true;
          if (res.code == 200) {
            if (res.data) {
              this.list = res.data.list;
              this.finished = res.data.totalCount / res.data.pageSize < this.pageNo;
            }
          } else {
            Toast({ message: res.msg, position: "center",duration:"1000" });
          }
        })
    },
    // 加载更多
    loadMore() {
      let params = { version: this.version, pageNo: this.pageNo += 1, pageSize: this.pageSize};
      var formObject = encodeParams(params, this.userInfo.userId, this.userInfo.tokenId, this.userInfo.appKey);
      this.isLoad = false;
      this.$ajax(this.$api.getServiceProviderList, { version: this.version, pageNo: params.pageNo, pageSize: this.pageSize}, formObject.sign)
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
            Toast({ message: res.msg, position: "bottom" });
          }
        })
    },
    onRefresh() {
      setTimeout(() => {
        this.getServiceProviderList()
        // this.$toast('刷新成功');
        this.isLoading = false;
      }, 500);
    }
  }
}
</script>

<style lang="less" scoped>
.content{
  ul{
    li{
      width: 90vw;
      height: 20vw;
      display: flex;
      align-content: center;
      justify-content: space-between;
      margin:3vw auto;
      padding:5vw 3vw 0vw 3vw;
      box-shadow:0px 0px 3vw 0px rgba(0, 0, 0, 0.08);
      div:first-child{
        font-size: 4vw;
        // line-height: 10vw;
        p:first-child{
          margin-bottom:3vw;
        }
      }
      div:last-child{
        color:#fff;
        overflow: hidden;
        button{
          width: 20vw;
          height: 7vw;
          border:0;
          margin-top:2vw;
          font-size:3vw;
          border-radius: 1vw;
          background-color: #EE281B;
        }
      }
    }
  }
}
</style>
