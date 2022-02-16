/*
 * @Author: sunjie
 * @Date: 2022-02-09 14:55:25
 * @LastEditors: sunj
 * @LastEditTime: 2022-02-09 15:13:05
 * @FilePath: /new-fanpiao-uniapp/src/utils/app-plugins.js
 */
import Vue from 'vue'
import store from '@state/store'

// 定义插件
const AppPlugin = {
  install: function () {
    Vue.prototype.$store = store
  }
}
// 使用插件
Vue.use(AppPlugin)

// TODO 捕捉网络变化
uni.onNetworkStatusChange(function (res) {

})

// TODO 捕捉手机内存警告
uni.onMemoryWarning(function (res) {

})
