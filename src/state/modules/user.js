/*
 * @Author: sunjie
 * @Date: 2022-02-09 16:58:52
 * @LastEditors: sunj
 * @LastEditTime: 2022-02-09 17:06:29
 * @FilePath: /new-fanpiao-uniapp/src/state/modules/user.js
 */
export default {
  state: {
    count: 1
  },
  mutations: {
    addCount(state) {
      state.count++;
    }
  }
}