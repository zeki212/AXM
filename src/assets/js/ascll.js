import md5 from 'js-md5';
let apiConfig = require('../js/prams.js');

function sort_ASCII(params = {}) {
    const timestamp = getTimeStamp().toString();
    const nonce = getNonce(10).toString();
    sessionStorage.setItem('timestamp',timestamp)
    sessionStorage.setItem('nonce',nonce)
    params.appid = apiConfig.default.AppId.toString();
    params.version = apiConfig.default.VERSION.toString();
    params.timestamp = timestamp;
    params.nonce = nonce;
    params.access_token = localStorage.getItem("token")||"";
    // console.log(timestamp)
    var arr = getArray(params);
    // console.log(arr)
    arr = arr.sort();
    var str = '';
    for (var item in arr) {
        str += arr[item] + '&';
    }
    str = str.replace('~', '%7e').replace(')', '%29').replace('(', '%28').replace('!', '%21').replace(':','%3a')
    str = str.toLocaleLowerCase();
    str = str + 'appSecret='+apiConfig.default.AppSecret;
    // console.log(str)
    var signature = md5(str).toLocaleLowerCase();
    return signature;
}



// 获取当前时间戳
function getTimeStamp() {
  return Date.parse(new Date()) / 1000;
}

//获取随机数
function getNonce(len) {
  len = len || 8;
  var chars = '0123456789';
  var maxPos = chars.length;
  var str = '';
  for (var i = 0; i < len; i++) {
      str += chars.charAt(Math.floor(Math.random() * maxPos));
  }
  return str;
}

// 排序
function getArray(params) {
  var arr = [];
  for (var key in params) {
      if (!params.hasOwnProperty(key)) {
          continue;
      }
      arr.push(key + '=' + encodeURIComponent(params[key]));
  }
  return arr;
}


export default
{
    sort_ASCII,
    getArray,
    getNonce,
    getTimeStamp
}   