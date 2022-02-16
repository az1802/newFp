<!--
 * @Author: sunjie
 * @Date: 2022-02-14 18:34:48
 * @LastEditors: sunj
 * @LastEditTime: 2022-02-14 18:34:49
 * @FilePath: /new-fanpiao-uniapp/src/package-menu/SkuModal/ChildDishList.vue
-->
<template>
  <div>子菜列表{{ childDishList }}</div>
</template>
<script>
export default {
  props: {
    childDishList: {
      type: Array,
      default: [],
    },
  },
};
</script>
<style lang="less">
</style>