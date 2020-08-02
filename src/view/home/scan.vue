<template>
  <div class="scan">
    <div class="header_box">
      <div @click="goBack()">
        <img src="../../assets/img/account/left.png" alt="">
      </div>
      <div>扫一扫</div>
      <div @click="gallery()">
        <span>相册</span>
      </div>
    </div>
    <div id="bcid">
      <div style="height:40%"></div>
      <p class="tip" style="color: #fff">...</p>
    </div>
    <!-- <footer>
      <button @click="startRecognize">1.创建控件</button>
      <button @click="startScan">2.开始扫描</button>
      <button @click="cancelScan">3.结束扫描</button>

      <button @click="closeScan">4.关闭控件</button>
    </footer> -->
  </div>
</template>

<script type='text/ecmascript-6'>
let scan = null;

export default {
  data() {
    return {
      // codeUrl: '',
    }
  },
  mounted() {
    this.startRecognize()
    this.startScan()
  },
  beforeDestroy() {
    this.closeScan();
    this.cancelScan();
  },
  methods: {
    // 相册
    gallery() {
      let that = this;
      if (!window.plus) return;
      plus.gallery.pick(function (path) {
        // alert(path);
        plus.barcode.scan(path, function (type, result) {
          sessionStorage.setItem('qrCode', result)
          that.closeScan();
          that.cancelScan();
          that.pushPath('/extract')
        }, function (error) {
          Toast({ message: '扫描失败,请检查二维码是否正确!', position: "center",duration:"1000"  });
        });
      }, function (e) {
        // console.log( "取消选择图片" );
      }, { filter: "image" });
    },
    //创建扫描控件
    startRecognize() {
      let that = this;
      if (!window.plus) return;
      var styles = {
        frameColor: "#0E0E0E",
        scanbarColor: "#0E0E0E",
      }; //边框属性
      var filter; //扫码格式 空为全类型，不能省略
      scan = new plus.barcode.Barcode('bcid', filter, styles);
      scan.onmarked = onmarked;

      function onmarked(type, result, file) {
        switch (type) {
          case plus.barcode.QR:
            type = 'QR';
            break;
          case plus.barcode.EAN13:
            type = 'EAN13';
            break;
          case plus.barcode.EAN8:
            type = 'EAN8';
            break;
          default:
            type = '其它' + type;
            break;
        }
        result = result.replace(/\n/g, '');
        // that.codeUrl = result;
        // alert(result);
        if (result != '') {
          sessionStorage.setItem('qrCode', result)
          that.closeScan();
          that.cancelScan();
          that.pushPath('/extract')
        } else {
          that.pushPath('/home')
          Toast({ message: '扫描失败,请扫描正确的二维码!', position: "center",duration:"1000"  });
        }


      }
    },
    //开始扫描
    startScan() {
      if (!window.plus) return;
      scan.start();
    },
    //关闭扫描
    cancelScan() {
      if (!window.plus) return;
      scan.cancel();
    },
    //关闭条码识别控件
    closeScan() {
      if (!window.plus) return;
      scan.close();
    },
  }
}
</script>
<style lang="less">
.header_box {
  width: 100%;
  height: 11vw;
  line-height: 11vw;
  font-size: 4vw;
  color: #333;
  display: flex;
  // border: 1px solid #EEEEEE;
  // background: #fff;
  background: #0e0e0e;
  box-sizing: border-box;
  i {
    padding: 10px;
    font-size: 24px;
  }
  div {
    img {
      width: 2.3vw;
      margin-left: 2vw;
    }
    &:nth-child(1) {
      max-width: 90px;
      flex: 1;
      box-sizing: border-box;
    }
    &:nth-child(2) {
      flex: 1;
      text-align: center;
      letter-spacing: 2px;
      color: #fff;
      font-weight: bold;
    }
    &:nth-child(3) {
      max-width: 90px;
      flex: 1;
      text-align: right;
      font-size: 3.3vw;
      color: #fff;
      span {
        display: inline-block;
        padding-right: 15px;
        width: 100%;
        box-sizing: border-box;
      }
    }
  }
}
.header_box[data-v-867e5006] {
  z-index: 2;
  position: absolute;
  left: 0;
  top: 0;
}
.scan {
  height: 100%;
  #bcid {
    width: 100%;
    position: absolute;
    left: 0;
    right: 0;
    top: 11vw;
    bottom: 0;
    text-align: center;
    color: #fff;
    background: #1c1c1d;
  }
  footer {
    position: absolute;
    left: 0;
    bottom: 1rem;
    height: 2rem;
    line-height: 2rem;
    z-index: 2;
  }
}
</style>