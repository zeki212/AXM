<template>
  <div class="mine_box">
    <my-header class="headerS" :showBack="true" title="奖励中心" />
    <div class="content">
      <ul class="wallet" v-for="(item,i) in lists" :key="i">
        <li>
          <p>邀请任务{{i+1}}</p>
          <p v-html="item.detail"></p>
        </li>
        <li v-if="item.status=='0'" style="background: #FF7F00;color:#fff;padding: 1vw 2vw;border-radius:1vw;" @click="directReward(item.equipId)">领取奖励</li>
        <li v-else style="background: #BDBDBD;color:#fff;padding: 1vw 2vw;border-radius:1vw;" @click="oldrecord">已经领取</li>
      </ul>
      <ul class="wallet" v-for="(item,ondex) in list" :key="ondex+10">
        <li>
          <p>会长任务{{ondex+1}}</p>
          <p>{{item.levelCode}}<br>
            {{item.detail}}
          </p>
        </li>
        <li v-if="item.status=='0'" style="background: #FF7F00;color:#fff;padding: 1vw 2vw;border-radius:1vw;" @click="recordLevelReward(item.levelId)">领取奖励</li>
        <li v-else style="background: #BDBDBD;color:#fff;padding: 1vw 2vw;border-radius:1vw;" @click="oldrecord">已经领取</li>
      </ul>
      <div class="no_data" v-show="list.length==0">
        <img src="../../assets/img/home/zanwu.png" alt="">
      </div>
    </div>
  </div>
</template>

<script>
import { Toast, Dialog, Progress } from "vant";
export default {
  data() {
    return {
      userInfo: JSON.parse(localStorage.getItem("userInfo")),
      version: this.$information.VERSION,
      list: '',
      lists: '',
    };
  },
  watch: {
  },
  created() {
    if (this.$route.fullPath.indexOf("?") != -1) {
      this.goBack();
    }
  },
  mounted() {
    this.getLevelList();
    this.getDirectTaskList();
  },

  methods: {
    // 已领取
    oldrecord(){
       Toast({ message: "奖励已领取", position: "center",duration:"1000"  });
    },
    // 领取达人奖励
    recordLevelReward(id) {
      let params = {levelId: id};
      var formObject = encodeParams(params, this.userInfo.userId, this.userInfo.tokenId, this.userInfo.appKey);
      this.$ajax(this.$api.recordLevelReward, {levelId: id}, formObject.sign).then(res => {
        if (res.code == 200) {
          this.getLevelList();
          this.getDirectTaskList();
          Toast({ message: res.msg, position: "center",duration:"1000"  });
        } else {
          Toast({ message: res.msg, position: "center",duration:"1000"  });
        }
      })
    },
    // 领取直推奖励
    directReward(id) {
      let params = {equipId: id};
      var formObject = encodeParams(params, this.userInfo.userId, this.userInfo.tokenId, this.userInfo.appKey);
      this.$ajax(this.$api.directReward, {equipId: id}, formObject.sign).then(res => {
        if (res.code == 200) {
          this.getLevelList();
          this.getDirectTaskList();
          Toast({ message: res.msg, position: "center",duration:"1000"  });
        } else {
          Toast({ message: res.msg, position: "center",duration:"1000"  });
        }
      })
    },
    // 升级任务列表
    getLevelList() {
      let params = {};
      var formObject = encodeParams(params, this.userInfo.userId, this.userInfo.tokenId, this.userInfo.appKey);
      this.$ajax(this.$api.getLevelList, {}, formObject.sign).then(res => {
        if (res.code == 200) {
          this.list = res.data;
        } else {
          Toast({ message: res.msg, position: "center",duration:"1000"  });
        }
      })
    },
    // 直推任务列表
    getDirectTaskList() {
      let params = {};
      var formObject = encodeParams(params, this.userInfo.userId, this.userInfo.tokenId, this.userInfo.appKey);
      this.$ajax(this.$api.getDirectTaskList, {}, formObject.sign).then(res => {
        if (res.code == 200) {
          this.lists = res.data;
        } else {
          Toast({ message: res.msg, position: "center",duration:"1000"  });
        }
      })
    },
  }
};
</script>

<style lang='less' scoped>
/deep/.header_box + div {
  background: #f5f5f5;
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
.font {
  color: #333;
  font-size: 12px;
}
.wallet {
  margin: 3vw;
  padding: 3.5vw 6vw 3vw 3vw;
  background: #fff;
  display: flex;
  align-items: center;
  justify-content: space-between;
  color: #333;
  border-radius: 1.5vw;
  > li:nth-child(1) {
    width: 65vw;
    p:nth-child(1) {
      font-size: 3.7vw;
      font-weight: 600;
      margin-bottom: 2vw;
    }
    p:nth-child(2) {
      font-size: 3vw;
      line-height: 5vw;
    }
  }
  > li:nth-child(2) {
    color: #58c89c;
    font-size: 3.5vw;
    img {
      width: 19.58vw;
      height: 16vw;
    }
  }
}
</style>