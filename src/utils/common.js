/*
 * @Author: sunjie
 * @Date: 2022-02-09 14:28:26
 * @LastEditors: sunj
 * @LastEditTime: 2022-02-18 18:18:28
 * @FilePath: /new-fanpiao-uniapp/src/utils/common.js
 */


export async function sleep(time) {
  return new Promise(resolve => {
    setTimeout(resolve, time)
  })
}

export function noop() {

}
