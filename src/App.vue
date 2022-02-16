<!--
 * @Author: sunjie
 * @Date: 2022-01-20 18:54:05
 * @LastEditors: sunj
 * @LastEditTime: 2022-02-14 17:13:45
 * @FilePath: /new-fanpiao-uniapp/src/App.vue
-->
<script>
export default {
  globalData: {
    systemInfo: {},
    dishesMap: {},
    dishSrollTops: [],
    categoryScrollTops: [],
  },
  onLaunch: function () {
    this._initSystemInfo();
  },
  onShow: function () {
    console.log("App Show");
  },
  onHide: function () {
    console.log("App Hide");
  },
  methods: {
    _initSystemInfo() {
      this.globalData.systemInfo = uni.getSystemInfoSync();
    },
  },
};
</script>

<style>
/*每个页面公共css */
</style>
