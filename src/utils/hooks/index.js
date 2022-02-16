/*
 * @Author: sunjie
 * @Date: 2022-02-16 17:57:49
 * @LastEditors: sunj
 * @LastEditTime: 2022-02-16 18:20:12
 * @FilePath: /new-fanpiao-uniapp/src/utils/hooks/index.js
 */


// 将所有的接口请求都通过这个统一输出
import { upperFirst, camelCase } from 'lodash'

const requireApiModules = import.meta.globEager('./(?!urls|http|test)*.js')
console.log('%crequireApiModules: ', 'color: MidnightBlue; background: Aquamarine; font-size: 20px;', requireApiModules);
const hooks = {}
for (const key in requireApiModules) {
  if (Object.prototype.hasOwnProperty.call(requireApiModules, key)) {
    let apiKey = key.replace(/(\.\/|\.js)/g, '');
    Object.assign(hooks, requireApiModules[key]);
  }
}

console.log('%ccommonHooks: ', 'color: MidnightBlue; background: Aquamarine; font-size: 20px;', hooks);


export default {
  ...hooks
};