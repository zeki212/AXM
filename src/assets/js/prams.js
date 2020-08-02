// App打包
// var source = 2;
// var u = navigator.userAgent;
// var isAndroid = u.indexOf('Android') > -1 || u.indexOf('Adr') > -1; //android终端
// var isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios终端
// if (isiOS) {
//   source = 1
// }
// if (isAndroid) {
//   source = 2
// }
// if (!window.plus) { // H5
//   source = 3
// }

// H5页面打包
var source = 3;

const VERSION = '2.2.0'


export default
{
  source,
  VERSION,
  // deviceid,
  // mobileIp,
  // timestamp,
  // nonce,
}