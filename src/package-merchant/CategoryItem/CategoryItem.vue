<!--
 * @Author: sunjie
 * @Date: 2022-02-10 16:06:16
 * @LastEditors: sunj
 * @LastEditTime: 2022-02-16 18:43:51
 * @FilePath: /new-fanpiao-uniapp/src/package-menu/CategoryItem/categoryItem.vue
-->
<template>
  <div class="category-item" :class="[active ? 'active' : '']">
    {{ category.name }}
    <div v-if="categoryCountMap[category.id]" class="quantity">
      {{ categoryCountMap[category.id] }}
    </div>
  </div>
</template>
<script>
import { useCategory } from "@hooks/menuHooks";
export default {
  props: {
    active: {
      type: Boolean,
      default: false,
    },
    category: {
      type: Object,
      default: {},
    },
  },
  setup() {
    const { categoryCountMap } = useCategory();
    return {
      categoryCountMap,
    };
  },
};
</script>
<style lang="less" scoped>
@import "@design/index.less";
.category-item {
  padding: 13px 10px;
  box-sizing: border-box;
  position: relative;
  .normal-font(14px);
  &.active {
    .bold-font(14px,#f25643);
    background: white;
    position: relative;
    &:before {
      content: "";
      .box-size(2px,100%,#f25643);
      .pos-absolute(0,0);
      border-radius: 2px;
    }
  }
  .quantity {
    .circle(16px,#f25643);
    .normal-font(12px,white);
    .pos-tr-absolute(4px,2px);
  }
}
</style>