/*
 * @Author: sunjie
 * @Date: 2022-02-08 14:34:21
 * @LastEditors: sunj
 * @LastEditTime: 2022-02-09 15:31:30
 * @FilePath: /new-fanpiao-uniapp/src/api/http.js
 */
import axios from "axios";
import settle from "axios/lib/core/settle";
import buildURL from "axios/lib/helpers/buildURL.js";
const { VITE_BASE_URL = "https://shilai.zhiyi.cn/v1.6", VITE_TIME_OUT = 10 * 1000 } = import.meta.env;

// 自定义适配器来适配uniapp语法
axios.defaults.adapter = function (config) {
  return new Promise((resolve, reject) => {
    uni.request({
      method: config.method.toUpperCase(),
      url:
        config.baseURL +
        buildURL(config.url, config.params, config.paramsSerializer),
      header: config.headers,
      data: config.data,
      dataType: config.dataType,
      responseType: config.responseType,
      sslVerify: config.sslVerify,
      complete: function complete(response) {
        response = {
          data: response.data,
          status: response.statusCode,
          errMsg: response.errMsg,
          header: response.header,
          config: config,
        };
        settle(resolve, reject, response);
      },
    });
  });
};


const baseConfig = {
  baseURL: VITE_BASE_URL,
  timeout: VITE_TIME_OUT,
  headers: {
    test: "sunj",
  },
  transformResponse(data) {
    return data;
  }
}

const http = axios.create(baseConfig);

http.interceptors.response.use(function (response) {
  // 此处可以查看url 做响应的数据埋点,日志记录
  // TODO 根据不同的status对数据做不同的处理 然后返回.
  if (response.data.errcode == 0) {
    if (response.config.url == "/wallet") {
      let res = {
        ...response.data.wallet,
        ...response.data.data,

      }
      return res
    }
    return response.data.data || response.data;
  } else {
    let arr = ['/order/create', '/payment/prepay']
    if (arr.indexOf(response.config.url)) {
      return response.data
    }
    return false;
  }
}, function (error) {
  // 对响应错误做点什么
  return Promise.reject(error);
});

// 设置通用请求头
http.setHeaders = (headers) => {
  for (const key in headers) {
    http.defaults.headers[key] = headers[key];
  }
}
export default http;
