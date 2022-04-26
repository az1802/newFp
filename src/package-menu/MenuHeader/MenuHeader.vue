<!--
 * @Author: sunjie
 * @Date: 2022-02-15 16:58:58
 * @LastEditors: sunj
 * @LastEditTime: 2022-02-16 11:34:32
 * @FilePath: /new-fanpiao-uniapp/src/package-menu/MenuHeader/MenuHeader.vue
-->
<template>
  <div class="menu-container">
    <!-- <MenuHeaderImg /> -->
    <MenuHeaderInfo />
    <MenuHeaderBanner />
    <MenuPendingOrder />
  </div>
</template>
<script>
// import MenuHeaderImg from "./MenuHeaderImg.vue";
import MenuHeaderInfo from "./MenuHeaderInfo.vue";
import MenuHeaderBanner from "./MenuHeaderBanner.vue";
import MenuPendingOrder from "./MenuPendingOrder.vue";
export default {
  components: {
    // MenuHeaderImg,
    MenuHeaderBanner,
    MenuHeaderInfo,
    MenuPendingOrder,
  },
};
</script>
<style lang="less" scoped>
</style>