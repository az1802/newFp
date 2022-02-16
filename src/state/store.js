/*
 * @Author: sunjie
 * @Date: 2022-02-09 14:40:05
 * @LastEditors: sunj
 * @LastEditTime: 2022-02-10 16:39:33
 * @FilePath: /new-fanpiao-uniapp/src/state/store.js
 */
import { createStore, storeKey } from 'vuex'
import modules from './modules'


const store = createStore(modules)

export default store;