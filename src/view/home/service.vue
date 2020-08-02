<template>
  <div class="service">
    <my-header
      :showBack="true"
      title="商学院"
    />
    <div class="cont" @click="pushPath('/serviceList')">
      <img src="../../assets/img/home/images@2x.png" alt="">
    </div>
    <!-- <header>
      <em @click="goBack"></em>
      <h1>服务商</h1>
    </header>
    <section>
      <van-list v-model="loading" :finished="finished" @load="loadMore" :offset="20">
      <ul class="lists" v-if="flag">
        <li v-for="(item,i) in user" :key="i">
          <div class="left">
            <p>等级: <span>{{ item.type | service }}</span></p>
            <p>钻石: <span>{{ item.coin }}</span></p>
            <p>微信: <span>{{ item.weixinCode }}</span></p>
          </div>
          <div class="right">已质押担证金</div>
        </li>
      </ul>
      </van-list>
    </section> -->
  </div>
</template>

<script>
  export default {
    data() {
      return {
        userInfo: JSON.parse(localStorage.getItem("userInfo")),
        version: this.$information.VERSION,
        user: '',
        type: '',
        pageNo: 1,
        pageSize: 10,
        flag: false,
        loading: false,
        finished: true,
      }
    },
    created() {
      if (this.$route.fullPath.indexOf("?") != -1) {
        this.goBack();
      }
    },
    mounted() {
      // this.getServiceProviderList();
    },
    methods: {
      // getServiceProviderList() {
      //   let params = { version: this.version, pageNo: this.pageNo = 1, pageSize: this.pageSize };
      //   var formObject = encodeParams(params, this.userInfo.userId, this.userInfo.tokenId, this.userInfo.appKey);
      //   this.$ajax(this.$api.getServiceProviderList, { version: this.version, pageNo: params.pageNo, pageSize: this.pageSize }, formObject.sign)
      //     .then(res => {
      //       this.loading = false;
      //       this.isLoad = true;
      //       if (res.code == 200) {
      //         // if (res.data) {
      //           this.user = res.data.list;
      //           this.finished = res.data.totalCount / res.data.pageSize < this.pageNo;
      //           if (this.user.type != "") {
      //             this.flag = true;
      //           } else {  
      //             this.flag = false;
      //           }
      //         // }
      //       } else {
      //         Toast({ message: res.msg, position: "center" });
      //       }
      //     })
      // },
      loadMore() {
        let params = { version: this.version, pageNo: this.pageNo += 1, pageSize: this.pageSize };
        var formObject = encodeParams(params, this.userInfo.userId, this.userInfo.tokenId, this.userInfo.appKey);
        this.isLoad = false;
        this.$ajax(this.$api.getServiceProviderList, { version: this.version, pageNo: params.pageNo, pageSize: this.pageSize }, formObject.sign)
          .then(res => {
            this.loading = false;
            if (res.code == 200) {
              if (res.data && res.data.list.length > 0) {
                this.user = this.user.concat(res.data.list);
                this.finished = res.data.totalCount / res.data.pageSize < this.pageNo;
                if (this.user.type != "") {
                  this.flag = true;
                } else {  
                  this.flag = false;
                }
              } else {
                this.finished = true;
              }
            } else {
              Toast({ message: res.msg, position: "center",duration:"1000"  });
            }
          })
      },
    },
    filters: {
      service(type) { // type=1 一级服务商 其它：服务商
        if (type == "1") {
          return "一级服务商"
        } else {
          return "服务商"
        }
      } 
    }
  }
</script>

<style lang="less" scoped>
  .service {
    width: 100vw;
    .cont{
      width: 95vw;
      height: 45vw;
      margin:0 2.5vw;
      margin-top:5vw;
      img{
        width: 100%;
      }
    }
    header {
      display: flex;
      flex-wrap: nowrap;
      justify-content: center;
      align-items: center;
      color: #fff;
      padding: 2vw 3vh;
      font-size: 2.4vw;
      em {
        position: absolute;
        left: 5vw;
        width: 2vw;
        height: 2.5vh;
        background: url(../../assets/img/home/back.png) no-repeat center/cover;
        background-size: 100% 100%;
      }
    }
    section {
      .lists {
        margin-top: 2vh;
          li {
            width: 94vw;
            height: 12vh;
            background:rgba(27,27,29,1);
            border-radius: 2vw;
            margin: 0 auto;
            margin: 0 auto;
            display: flex;
            flex-wrap: nowrap;
            align-items: center;
            justify-content: space-between;
            box-sizing: border-box;
            padding: 3vw;
            margin-bottom: 3vw;
            .left {
              p {
                color: #CECECE;
                span {
                  color: #fff;
                  font-weight: bold;
                  margin-left: 2vw;
                }
              }
            }
            .right {
              text-align: center;
              background:rgba(0,183,237,1);
              border-radius:2vw 2vw 0 2vw;
              width: 24vw;
              height: 4vh;
              line-height: 4vh;
            }
          }
      }    
    }
  }
.child-view {
  overflow: auto;
}
</style>