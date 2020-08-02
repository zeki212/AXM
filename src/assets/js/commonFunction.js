import { Toast } from 'vant';
import { Indicator } from 'mint-ui';
import Api from "../../http/api";
import Exif from 'exif-js'
export default {
  dataURLtoFile(dataurl, filename) {//将base64转换为文件
    var arr = dataurl.split(','), mime = arr[0].match(/:(.*?);/)[1], bstr = atob(arr[1]), n = bstr.length, u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new File([u8arr], filename, { type: mime });
  },
  //imgPreview 压缩图片
  imgPreview(file) {
    let compressImg = new Promise((resolve, reject) => {
      let self = this;
      let Orientation;
      //去获取拍照时的信息，解决拍出来的照片旋转问题
      Exif.getData(file, function () {
        Orientation = Exif.getTag(this, 'Orientation');
      });
      // 看支持不支持FileReader
      if (!file || !window.FileReader) return;

      if (/^image/.test(file.type)) {
        // 创建一个reader
        let reader = new FileReader();
        // 将图片2将转成 base64 格式
        reader.readAsDataURL(file);
        // 读取成功后的回调
        reader.onloadend = function () {
          let result = this.result;
          let img = new Image();
          img.src = result;
          let data
          //判断图片是否大于100K,是就直接上传，反之压缩图片
          // if (this.result.length <= (100 * 1024)) {
          //   data = "";
          //   resolve(data)
          // } else {
            img.onload = function () {
              data = self.compress(img, Orientation);
              resolve(data)
            }
          // }
        }
      }
    })
    return compressImg
  },

  rotateImg(img, direction, canvas) {
    //最小与最大旋转方向，图片旋转4次后回到原方向    
    const min_step = 0;
    const max_step = 3;
    if (img == null) return;
    //img的高度和宽度不能在img元素隐藏后获取，否则会出错    
    let height = img.height;
    let width = img.width;
    let step = 2;
    if (step == null) {
      step = min_step;
    }
    if (direction == 'right') {
      step++;
      //旋转到原位置，即超过最大值    
      step > max_step && (step = min_step);
    } else {
      step--;
      step < min_step && (step = max_step);
    }
    //旋转角度以弧度值为参数    
    let degree = step * 90 * Math.PI / 180;
    let ctx = canvas.getContext('2d');
    switch (step) {
      case 0:
        canvas.width = width;
        canvas.height = height;
        ctx.drawImage(img, 0, 0);
        break;
      case 1:
        canvas.width = height;
        canvas.height = width;
        ctx.rotate(degree);
        ctx.drawImage(img, 0, -height);
        break;
      case 2:
        canvas.width = width;
        canvas.height = height;
        ctx.rotate(degree);
        ctx.drawImage(img, -width, -height);
        break;
      case 3:
        canvas.width = height;
        canvas.height = width;
        ctx.rotate(degree);
        ctx.drawImage(img, -width, 0);
        break;
    }
  },
  compress(img, Orientation) {
    let canvas = document.createElement("canvas");
    let ctx = canvas.getContext('2d');
    //瓦片canvas
    let tCanvas = document.createElement("canvas");
    let tctx = tCanvas.getContext("2d");
    let initSize = img.src.length;
    let width = img.width;
    let height = img.height;
    //如果图片大于四百万像素，计算压缩比并将大小压至400万以下
    let ratio;
    if ((ratio = width * height / 4000000) > 1) {
      // console.log("大于400万像素")
      ratio = Math.sqrt(ratio);
      width /= ratio;
      height /= ratio;
    } else {
      ratio = 1;
    }
    canvas.width = width;
    canvas.height = height;
    //        铺底色
    ctx.fillStyle = "#fff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    //如果图片像素大于100万则使用瓦片绘制
    let count;
    if ((count = width * height / 1000000) > 1) {
      // console.log("超过100W像素");
      count = ~~(Math.sqrt(count) + 1); //计算要分成多少块瓦片
      //            计算每块瓦片的宽和高
      let nw = ~~(width / count);
      let nh = ~~(height / count);
      tCanvas.width = nw;
      tCanvas.height = nh;
      for (let i = 0; i < count; i++) {
        for (let j = 0; j < count; j++) {
          tctx.drawImage(img, i * nw * ratio, j * nh * ratio, nw * ratio, nh * ratio, 0, 0, nw, nh);
          ctx.drawImage(tCanvas, i * nw, j * nh, nw, nh);
        }
      }
    } else {
      ctx.drawImage(img, 0, 0, width, height);
    }
    //修复ios上传图片的时候 被旋转的问题
    if (Orientation != "" && Orientation != 1) {
      switch (Orientation) {
        case 6://需要顺时针（向左）90度旋转
          this.rotateImg(img, 'left', canvas);
          break;
        case 8://需要逆时针（向右）90度旋转
          this.rotateImg(img, 'right', canvas);
          break;
        case 3://需要180度旋转
          this.rotateImg(img, 'right', canvas);//转两次
          this.rotateImg(img, 'right', canvas);
          break;
      }
    }
    //进行最小压缩
    let ndata = canvas.toDataURL('image/jpeg', 0.1);
    // console.log('压缩前：' + initSize);
    // console.log('压缩后：' + ndata.length);
    // console.log('压缩率：' + ~~(100 * (initSize - ndata.length) / initSize) + "%");
    tCanvas.width = tCanvas.height = canvas.width = canvas.height = 0;
    // console.log(ndata)
    return ndata;
  },


  uploadImg(data, isBase64) {
    const vm = this;
    let uploadMethod = new Promise((resolve, reject) => {
      var formData = new FormData();
      if (isBase64) {
        formData.append("file", vm.dataURLtoFile(data, "upload.png"));
      } else {
        formData.append("file", data);
      }
      formData.append('token', localStorage.getItem('token'))
      Indicator.open({
        spinnerType: "fading-circle"
      });
      $.ajax({
        url: Api.baseURL + Api.uploadImage.url,
        type: "post",
        data: formData,
        cache: false,
        processData: false,
        contentType: false,
        success: function (res) {
          if (res.code == 0) {
            resolve(res.data)
          } else if (res.code == 1) {
            if (response.data.msg != 'token不能为空！') {
              Toast({ message: response.data.msg || "网络不给力", position: "center" ,duration:"1000"});
            }
          } else if (res.code == 2) {
            Toast({ message: "登录信息已失效！", position: "center",,duration:"1000" });
            vm.$route.push({ path: "/login" });
          }
          Indicator.close();
        },
        error: function (e) {
          Indicator.close();
          errorState(e);
          reject(e);
        }
      });
    })
    return uploadMethod
  },
}