// 将所有的接口请求都通过这个统一输出
import { upperFirst } from '@utils';

const requireApiModules = import.meta.globEager('./(?!urls|http|test)*.js');
const API = {};
for (const key in requireApiModules) {
  if (Object.prototype.hasOwnProperty.call(requireApiModules, key)) {
    let apiKey = key.replace(/(\.\/|\.js)/g, '');
    API[upperFirst(apiKey.replace(/\.js/, ''))] = requireApiModules[key];
  }
}

export default API;
