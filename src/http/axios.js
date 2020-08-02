// import i18n from '../assets/js/i18n'
import axios from "axios";
import qs from "qs";
import router from "../router/index";
import { Indicator } from "mint-ui";
import { Toast } from "vant";
import api from "./api";
import informations from '../assets/js/prams';

const baseURL = api.baseURL;

axios.interceptors.request.use(
  config => {
    // if(config.showLoading){
    //   // setTimeout(()=>{
    //     Indicator.open({
    //       spinnerType: "fading-circle"  
    //     });
    //   // },200)
    // }
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);

axios.interceptors.response.use(
  response => {
    return response;
  },
  error => {
    return Promise.resolve(error.response);
  }
);

function errorState(response) {
  // setTimeout(()=>{
    Indicator.close();
    // Toast({message: response.status,position: "bottom",duration:"1000",duration:"1000"});
  // },200)
  // 如果http状态码正常，则直接返回数据
  if (
    response &&(response.status === 304 ||response.status === 400||response.status === 200)) {
    // Toast({message: '网络不给力',position: "bottom",duration:"1000"});
    return response.data;
  } else {
    // Toast({
    //   message: '网络不给力',
    //   position: "bottom",duration:"1000"
    // });
  }
}

function successState(response) {
  // setTimeout(()=>{
    Indicator.close();
    // Toast({message: response.data.code,position: "bottom",duration:"1000"});
  // },200)
  //统一判断后端返回的错误码
  if (response.data.code == "403") {
    // router.push({path: "/login",});
  } else if (response.data.code == "1000") {
    if(response.data.msg!='token不能为空！'){
      // Toast({
      //   message: response.data.msg || "网络不给力",
      //   position: "bottom",duration:"1000"
      // });
    }
    
  } else if (response.data.code == "10000") {
    Toast({
      message: "登录信息已失效！",
      position: "center",
    });
    if(router.history.current.path!='/login'){
      localStorage.setItem("token", "");
      router.push({
        path: "/login",
      // query: { redirect: routers.history.current.path }
      });
    }
  }
}

const httpServer = (opts, data,headersKey) => {
  let Public = {
    //公共参数
    // access_token: localStorage.getItem("token")||"",
    source: informations.source,
    // version: informations.VERSION,
  };
  // sessionStorage.setItem('singx',headersKey.sign )
  let httpDefaultOpts = {
    //http默认配置
    method: opts.method,
    baseURL: baseURL,
    url: opts.url,
    timeout: 60000,
    params: Object.assign(Public, data),
    data: qs.stringify(Object.assign(Public, data)),
    headers: 
      opts.method == "get"
        ? {
          "X-Requested-With": "XMLHttpRequest",
          // Accept: "application/json",
          "Content-Type": "application/json; charset=UTF-8",
          "userId": localStorage.getItem("userId")||"",
          "tokenId": localStorage.getItem("token")||"",
          "sign": headersKey||"",
          }
        : {
          "X-Requested-With": "XMLHttpRequest",
          "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
          // "Accept-Language":i18n.locale == "en_US"?"en-us":'',
          "userId": localStorage.getItem("userId")||"",
          "tokenId": localStorage.getItem("token")||"",
          "sign": headersKey||"",  
          }
  };
  // if(localStorage.getItem("userId")!=''&&localStorage.getItem("userId")!= null) {
  //   httpDefaultOpts.headers.userId = localStorage.getItem("userId")
  // }
  // if(localStorage.getItem("token")!=''&&localStorage.getItem("token")!= null) {
  //   httpDefaultOpts.headers.tokenId = localStorage.getItem("token")
  // }
  // if(headersKey!=''&&headersKey!= null) {
  //   httpDefaultOpts.headers.sign = headersKey
  // }
  if (opts.method == "get") {
    delete httpDefaultOpts.data;
  } else {
    delete httpDefaultOpts.params;
  }
  httpDefaultOpts.showLoading = !(data&&data.showLoading=='0')

  let promise = new Promise(function(resolve, reject) {
    axios(httpDefaultOpts)
      .then(res => {
        successState(res);
        resolve(res.data);
      })
      .catch(response => {
        errorState(response);
        reject(response);
      });
  });
  return promise;
};

export default httpServer;
