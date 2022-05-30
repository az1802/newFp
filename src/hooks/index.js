/*
 * @Author: sunjie
 * @Date: 2022-02-16 17:57:49
 * @LastEditors: sunj
 * @LastEditTime: 2022-02-16 19:03:16
 * @FilePath: /new-fanpiao-uniapp/src/utils/hooks/index.js
 */


// 将所有的接口请求都通过这个统一输出

const requireApiModules = import.meta.globEager('./(?!urls|http|test)*.js')
const hooks = {}
for (const key in requireApiModules) {
  if (Object.prototype.hasOwnProperty.call(requireApiModules, key)) {
    let apiKey = key.replace(/(\.\/|\.js)/g, '');
    Object.assign(hooks, requireApiModules[key]);
  }
}

export default {
  ...hooks
};