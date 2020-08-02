<!-- 实名认证 -->
<template>
  <div>
    <my-header :showBack="true" title="实名认证" />
    <div class="content">
      <ul class="record">
        <li>
          <p>姓名</p>
          <p><input type="text" v-model="name" placeholder="请填写姓名"></p>
        </li>
        <li>
          <p>性别</p>
          <p>
            <span>
              <input type="radio" id="one" value="男" v-model="picked">
              <label for="one">&nbsp;男</label>
            </span>
            <span>
              <input type="radio" id="two" value="女" v-model="picked">
              <label for="two">&nbsp;女</label>
            </span>
          </p>
        </li>
        <li>
          <p>身份证</p>
          <p><input type="text" v-model="idNo" maxlength="18" placeholder="请输入您的身份证号码"></p>
        </li>
      </ul>
      <div class="upload">
        <p class="titles">上传身份证:</p>
        <div v-show="myInfo.picAuthStatus==1" class="former">
          <p @click="showTradingImg(myInfo.picFront,0)"><img :src="myInfo.picFront" alt=""></p>
        </div>
        <div v-show="myInfo.picAuthStatus==1" class="former">
          <p @click="showTradingImg(myInfo.picBack,0)"><img :src="myInfo.picBack" alt=""></p>
        </div>
        <ul class="upload_ul" v-show="myInfo.picAuthStatus=='0'">
          <li>
            <label for="uploadImg1" class="img_box">
              <p v-if="files1" id="imgBox1">
                <img :src="files1" alt="">
              </p>
              <div class="imgBoxs" v-if="!files1">
                <p><img src="../../assets/img/my/zheng.png" alt=""></p>
              </div>
              <input type="file" @change="addImg(1)" accept="image/*" ref="fileInfo1" id="uploadImg1" />
            </label>
          </li>
        </ul>
        <ul class="upload_ul" v-show="myInfo.picAuthStatus=='0'">
          <li>
            <label for="uploadImg2" class="img_box">
              <p v-if="files2" id="imgBox1">
                <img :src="files2" alt="">
              </p>
              <div class="imgBoxs" v-if="!files2">
                <p><img src="../../assets/img/my/fan.png" alt=""></p>
              </div>
              <input type="file" @change="addImg(2)" accept="image/*" ref="fileInfo2" id="uploadImg2" />
            </label>
          </li>
        </ul>
      </div>
      <div class="example">
        <p>示例审核样式:</p>
        <div class="imgs">
          <img src="../../assets/img/my/identity.png" alt="">
          <img src="../../assets/img/my/identitys.png" alt="">
        </div>
      </div>
      <div class="fontX" v-show="codes==0">
        温馨提示：</br>
        1.拍照时请确保身份证照片清晰，边缘完整，避免反光</br>
        2. 上传实名认证图片，切记带有<em style="color:red;">“AXM认证专用，不可用做其他途径！+姓名+时间”</em>
      </div>
      <!-- 实名认证前 -->
      <div class="account_btn" v-if="user.primaryAuthStatus=='0'&&user.idNo==''">
        <van-button type="primary" size="large" @click="submitIdentityInfo()">提交</van-button>
      </div>
      <!-- 实名认证中 -->
      <div class="account_btn" v-if="user.primaryAuthStatus=='0'&&user.idNo">
        <van-button type="primary" size="large" disabled>审核中</van-button>
      </div>
      <!-- 实名认证完成 -->
      <div class="account_btn" v-if="user.primaryAuthStatus==1">
        <van-button type="primary" size="large" disabled>审核通过</van-button>
      </div>
      <!-- <p v-show="codes == 1" style="text-align: center;opacity:0.59;font-size: 3.2vw">注：每人只限实名扫脸三次!</p> -->
    </div>
    <div v-show="statesw == '2'" class="loadings">
      <van-loading />
    </div>
  </div>
</template>

<script>
import Exif from 'exif-js'
import { Toast, ImagePreview } from "vant";
export default {
  data() {
    return {
      picked:"男",
      statesw: '1',
      user:"",
      userInfo: JSON.parse(localStorage.getItem("userInfo")),
      idNo:'',
      name: '',
      codes: sessionStorage.codes || '0',
      list: '',
      disabled: false,
      img1: '',
      files1: '',
      img2: '',
      files2: '',
      myInfo: '',
    };
  },
  components: {},
  watch: {
    '$route'(val, oldval) {
      if (oldval.fullPath.indexOf('?') != -1) {
      }
    },
  },
  created() {
    if (this.$route.fullPath.indexOf('?') != -1) {
      this.goBack();
    }
  },
  mounted() {
    // new VConsole();  // 控制台测试
    this.getCustInfo()
    // this.identificationH5()
  },
  methods: {
    showTradingImg(voucherImg) {
      let arr = [];
      arr.push(voucherImg)
      ImagePreview(arr);
    },
    submitIdentityInfo() {
      if (!this.name) {
        Toast({ message: "请输入姓名！", position: "center",duration:"1000"  });
        return;
      }
      if (!this.idNo) {
        Toast({ message: "请输入身份号！", position: "center",duration:"1000"  });
        return;
      }
      if (!this.files1) {
        Toast({ message: "请上传身份证正面照！", position: "center",duration:"1000"  });
        return;
      }
      if (!this.files2) {
        Toast({ message: "请上传身份证反面照!", position: "center",duration:"1000"  });
        return;
      }
      let params = { name: this.name, idNo: this.idNo, picFront: this.files1, picBack: this.files2 };
      var formObject = encodeParams(params, this.userInfo.userId, this.userInfo.tokenId, this.userInfo.appKey);
      this.$ajax(this.$api.submitIdentityInfo, { name: this.name, idNo: this.idNo, picFront: this.files1, picBack: this.files2 }, formObject.sign).then(res => {
        if (res.code == 200) {
          sessionStorage.codes = 1;
          this.getCustInfo();
          // this.codes = 1;
          Toast({ message: res.msg, position: "center",duration:"1000"  });
        } else {
          Toast({ message: res.msg, position: "center",duration:"1000"  });
        }
      })
    },
    dataURLtoFile(dataurl) {
      var arr = dataurl.split(','),
        mime = arr[0].match(/:(.*?);/)[1],
        bstr = atob(arr[1]),
        n = bstr.length,
        u8arr = new Uint8Array(n);
      while (n--) {
        u8arr[n] = bstr.charCodeAt(n);
      }
      return new File([u8arr], { type: mime });
    },
    //压缩图片
    compressImg(file) {
      var src;
      var files;
      var fileSize = parseFloat(parseInt(file['size']) / 1024 / 1024).toFixed(2);
      var read = new FileReader();
      var vm = this;
      read.readAsDataURL(file);
      return new Promise(function (resolve, reject) {
        read.onload = function (e) {
          var img = new Image();
          img.src = e.target.result;
          img.onload = function () {
            //默认按比例压缩
            var w = this.width,
              h = this.height;
            //生成canvas
            var canvas = document.createElement('canvas');
            var ctx = canvas.getContext('2d');
            var base64;
            // 创建属性节点
            canvas.setAttribute("width", w);
            canvas.setAttribute("height", h);
            ctx.drawImage(this, 0, 0, w, h);
            // console.log(fileSize)
            if (fileSize < 1) {
              //如果图片小于一兆 那么不执行压缩操作
              base64 = canvas.toDataURL(file['type'], 1);
            } else if (fileSize > 1 && fileSize < 2) {
              //如果图片大于1M并且小于2M 那么压缩0.5
              base64 = canvas.toDataURL(file['type'], 0.5);
            } else {
              //如果图片超过2m 那么压缩0.2
              base64 = canvas.toDataURL(file['type'], 0.2);
            }
            // 回调函数返回file的值（将base64编码转成file）
            // files = base64;
            files = vm.dataURLtoFile(base64); //如果后台接收类型为base64的话这一步可以省略
            // console.log(files)
            resolve(files)
          };
        };
      })
    },
    async beforeRead(file){//async await 解决异步问题，
          var formData = new FormData();//创建新的form
          if (file.length) {   //file.length为真的时候说明是多图上传  要循环多图将file对象放进form中
            for (let i = 0; i < file.length; i++) {
              var f = await this.compressImg(file[i]) //await只能放在async函数里 await会等待异步方法的返回值拿到以后在执行后面的方法
              formData.set('file' + i, f)
            }
          } else {
            let f = await this.compressImg(file)
            formData.set('file0', f)
          }
          // console.log(formData)
        },
    addImg(id) {
      if (id == 1) {
        let fileInfo1 = this.$refs.fileInfo1.files[0];
        this.$refs.fileInfo1.value = '';
        let fileSize1 = parseFloat(parseInt(fileInfo1['size']) / 1024 / 1024).toFixed(2);
        // if(fileSize1> 18) {
        //   Toast({ message: '上传图片过大!', position: "center",duration:"1000"  });
        //   return;
        // }
        // let aac = this.beforeRead(fileInfo1)
        // console.log(aac)
        // let picture = this.compressImg(fileInfo1)
        // picture.then(val => {
        // let bases = val;
        if (fileInfo1) {
          // let params = { type: '1',version:this.version,file: bases,source:this.source };
          // var formObject = encodeParams(params, this.userInfo.userId, this.userInfo.tokenId, this.userInfo.appKey);
          // this.$ajax(this.$api.uploadTradeImage, { type: '1',version:this.version,file: bases,source:this.source }, formObject.sign).then(res => {
          //   if (res.code == 200) {
          //     this.files1 = res.data.imageUrl;
          //     Toast({ message: res.msg, position: "center",duration:"1000"  });
          //   } else {
          //     Toast({ message: res.msg, position: "center",duration:"1000"  });
          //   }
          // })

          let vm = this, a = new FileReader();
          a.onload = function (e) { vm.img1 = e.target.result }
          a.readAsDataURL(fileInfo1);
          vm.statesw = '2';
          const baseUrl = vm.$api.baseURL
          let userId = vm.userInfo.userId
          let tokenId = vm.userInfo.tokenId
          let appKey = vm.userInfo.appKey
          let params = {
            type: 1,
            // version: vm.version,
            file: fileInfo1,
            // source: vm.source
          };
          var formObject = encodeParams(params, userId, tokenId, appKey);
          var formData = new FormData();
          // console.log(fileInfo1)
          formData.append("file", fileInfo1);
          formData.append("type", '1');
          // formData.append("version", vm.version);
          // formData.append("source", vm.source);
          $.ajax({
            url: 'https://api.yuediankeji.com/api/anon/uploadPhoto',
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
                vm.files1 = res.data.imageUrl;
                vm.statesw = '1';
              } else {
                Toast({ message: res.msg, position: "center",duration:"1000"  });
              }
              // Indicator.close();
            },
            error: function (e) {
              Toast({ message: e.msg, position: "center",duration:"1000"  });
              // Indicator.close();
              // errorState(e);
              // reject(e);
            },
            complete: function () {
              vm.statesw = '1';
            }
          });
        }
        // });
      }
      if (id == 2) {
        let fileInfo2 = this.$refs.fileInfo2.files[0];
        this.$refs.fileInfo2.value = '';
        let fileSize2 = parseFloat(parseInt(fileInfo2['size']) / 1024 / 1024).toFixed(2);
        if(fileSize2> 18) {
          Toast({ message: '上传图片过大!', position: "center",duration:"1000"  });
          return;
        }
        if (fileInfo2) {
          let vm = this, a = new FileReader();
          a.onload = function (e) { vm.img2 = e.target.result }
          a.readAsDataURL(fileInfo2);
          vm.statesw = '2';
          const baseUrl = vm.$api.baseURL
          let userId = vm.userInfo.userId
          let tokenId = vm.userInfo.tokenId
          let appKey = vm.userInfo.appKey
          let params = {
            type: 1,
            // version: vm.version,
            file: fileInfo2,
            // source: vm.source
          };
          var formObject = encodeParams(params, userId, tokenId, appKey);
          var formData = new FormData();
          // console.log(fileInfo1)
          formData.append("file", fileInfo2);
          formData.append("type", '1');
          // formData.append("version", vm.version);
          // formData.append("source", vm.source);
          $.ajax({
            url: 'https://api.yuediankeji.com/api/anon/uploadPhoto',
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
                vm.files2 = res.data.imageUrl;
                vm.statesw = '1';
              }
              // Indicator.close();
            },
            error: function (e) {
              Toast({ message: e.msg, position: "center",duration:"1000"  });
              // Indicator.close();
              // errorState(e);
              // reject(e);
            }
          });
        }
      }

    },
    getCustInfo() {
      let params = {};
      var formObject = encodeParams(params, this.userInfo.userId, this.userInfo.tokenId, this.userInfo.appKey);
      this.$ajax(this.$api.getCustInfo, {}, formObject.sign).then(res => {
        if (res.code == 200) {
          this.myInfo = res.data;
          if (res.data.primaryAuthStatus == 1) {
            this.user = res.data;
            this.idNo = res.data.idNo;
            this.name = res.data.realName;
            // this.codes = 2;
            this.disabled = true;
          }
          if (res.data.primaryAuthStatus == 0) {
            this.user = res.data;
            this.idNo = res.data.idNo;
            this.name = res.data.realName;
          }
        } else {
          Toast({ message: res.msg, position: "center",duration:"1000"  });
        }
      })
    },
    // 人脸状态
    // identificationH5() {
    //   let params = {};
    //   var formObject = encodeParams(params, this.userInfo.userId, this.userInfo.tokenId, this.userInfo.appKey);
    //   this.$ajax(this.$api.identificationH5, {}, formObject.sign).then(res => {
    //     if (res.code == 200) {
    //       this.codes = 2
    //     }
    //     if (res.code == 500) {
    //     }
    //   })
    // },
    // getH5FaceUrl() {
    //   if (!this.name) {
    //     Toast({ message: "请输入姓名！", position: "center",duration:"1000"  });
    //     return;
    //   }
    //   if (!this.idNo) {
    //     Toast({ message: "请输入身份号！", position: "center",duration:"1000"  });
    //     return;
    //   }
    //   let params = { name: this.name, idNo: this.idNo };
    //   var formObject = encodeParams(params, this.userInfo.userId, this.userInfo.tokenId, this.userInfo.appKey);
    //   this.$ajax(this.$api.getH5FaceUrl, { name: this.name, idNo: this.idNo }, formObject.sign).then(res => {
    //     if (res.code == 200) {
    //       // h5跳转
    //       // window.location.href = res.data.certifyUrl;

    //       // app跳转
    //       let vm = this;
    //       window.setTimeout(function () {
    //         vm.pushPath('/my')
    //       }, 2000);
    //       plus.runtime.openURL(res.data.certifyUrl);
    //     } else {
    //       Toast({ message: res.msg, position: "center",duration:"1000"  });
    //     }
    //   })
    // }
  }
}

</script>
<style lang='less' scoped>
@import "../../assets/css/config";
.content {
  background: #F0F0F0;
}
input[type="radio"]{
  display: none;
}
input[type='radio'] + label:before{
    content: "";
    display: inline-block;
    width: 2vw;
    height: 2vw;
    border-radius: 50%;
    border: 1px solid #BFBFBF;
}
input[type='radio']:checked + label:before{
    background-color: #FF3A2E;
}
.account_btn {
  width: 100vw;
  height: auto;
  text-align: center;
  overflow: hidden;
  background-color: #fff;
  button {
    width: 95vw;
    margin: 3vw auto;
    background: #FF3A2E;
    border-radius: 1vw;
  }
}
.record {
  background-color: #fff;
  margin:2vw 0 3vw;
  padding: 0 3vw;
  li {
    display: flex;
    align-items: center;
    justify-content: space-between;
    border-bottom:1px solid rgba(229,229,229,1);
    P:nth-child(1) {
      display: inline-block;
      width: 14vw;
      text-align-last: justify;
      font-size: 3.7vw;
    }
    P:nth-child(2) {
      width: 80vw;
      // display: flex;
      // align-items: center;
      // justify-content: space-around;
      // border-bottom: 1px solid #343434;
      span{
        margin-left:5vw;
        // width: 30vw;
        // display: flex;
        // float:left;
        // align-items: center;
        // input{
        //   width: 5vw;
        // }
      }
    }
    P {
      padding: 7vw 0 2vw;
      input {
        width: 72vw;
        border: 0;
        // background: #0e0e0e;
        margin-left: 5vw;
        font-size: 3.2vw;
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
.hint_popup {
  width: 100%;
  height: 100%;
  iframe {
    width: 100vw;
    height: 100vh;
  }
}
.upload {
  text-align: center;
  background: #fff;
  padding: 3vw;
  overflow: hidden;
  padding-top: 8vw;
  .titles{
    text-align: left;
  }
  img{
    width: 60vw;
    margin-top:6vw;
  }
}
ul.upload_ul {
  margin: 15px 13vw 0;
  text-align: center;
  // background-color: #eeeeee;
  li {
    // border: 1px dotted #333;
    &:nth-child(1) {
      display: flex;
      // padding: 15px 0;
      justify-content: center;
    }
    &:nth-child(2) {
      font-size: 12px;
      width: 80vw;
      margin: 5px auto;
      padding-bottom: 15px;
      color: #787878;
    }
  }
}
.img_box {
  display: block;
  align-items: center;
  width: 100%;
  height: 43vw;
  overflow: hidden;
  position: relative;
  // margin-right: 10px;
  &:nth-child(3) {
    margin-right: 0;
  }
  #imgBox1 {
    width: 99%;
    height: 99%;
    display: flex;
    justify-content: center;
    align-items: center;
    border: 1px dashed #8e8e8e;
    border-radius: 3vw;
    img {
      width: auto;
      max-width: 100%;
      max-height: 100%;
      margin: auto;
      display: block;
    }
  }
  .imgBoxs {
    p {
      img {
        // width: 30%;
      }
    }
  }
  input {
    display: none;
  }
  div {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;

    img {
      margin: auto;
      display: block;
    }
    span {
      display: block;
      margin-top: 10px;
    }
  }
}
[class*="van-hairline"]:after {
  display: none;
}
.example {
  padding-bottom:5vw;
  background-color: #fff;
  p{
    color:#333333;
    font-size: 4vw;
    margin-left: 8vw;
    line-height: 10vw;
  }
  .imgs{
    width: 95vw;
    margin: 0 auto;
    display: flex;
    align-content: center;
    justify-content: space-around;
    img{
      width: 37vw;
      height: 28vw;
    }
  }
}
.fontX {
  color: #333333;
  font-size: 3.3vw;
  text-align: left;
  padding: 0vw 9vw;
  background-color: #fff;
}
.former {
  // background-color: #fff;
  // margin: 5px 0;
  // padding: 10px 15px;
  margin: 15px 13vw 0;
  text-align: center;
  p {
    width: 100%;
    height: 43vw;
    margin: 15px auto 0;
    display: flex;
    justify-content: center;
    // background-color: #eee;
    align-items: center;
    border: 1px dashed #8e8e8e;
    border-radius: 3vw;
  }
  img {
    width: auto;
    max-width: 100%;
    max-height: 100%;
    margin: auto;
    display: block;
  }
}
.loadings {
  transform: translate(-50%, -50%);
  position: absolute;
  top: 50%;
  left: 50%;
}
</style>