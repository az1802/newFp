/*
 * @Author: sunjie
 * @Date: 2022-02-09 14:42:58
 * @LastEditors: sunj
 * @LastEditTime: 2022-02-14 15:49:44
 * @FilePath: /new-fanpiao-uniapp/src/state/modules/index.js
 */
import menuStore from './menu'

import { camelCase } from 'lodash'
const modules = {};

(function genModules() {
  const requireStoreModules = import.meta.globEager('./(?!urls|http|test)*.js');
  for (const fileName in requireStoreModules) {
    if (Object.prototype.hasOwnProperty.call(requireStoreModules, fileName)) {
      const module = requireStoreModules[fileName];
      const moduleName = fileName.replace(/^\.\//, '').replace(/\.\w+$/, '')
      modules[moduleName] = {
        "namespaced": true,
        ...module.default
      }
    }
  }
})()

export default {
  modules
}