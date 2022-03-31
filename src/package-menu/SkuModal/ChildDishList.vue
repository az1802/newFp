<!--
 * @Author: sunjie
 * @Date: 2022-02-14 18:34:48
 * @LastEditors: sunj
 * @LastEditTime: 2022-02-14 18:34:49
 * @FilePath: /new-fanpiao-uniapp/src/package-menu/SkuModal/ChildDishList.vue
-->
<template>
  <div>
    <div
      v-for="groupItem in childDishGroups"
      class="child-group-container"
      :key="groupItem.id"
    >
      <div class="title">可选0-5份</div>
      <div class="child-dishes-list">
        <div
          class="child-dish-item"
          v-for="dishItem in groupItem.childDishes"
          :key="dishItem.id"
        >
          <div class="name">{{ dishItem.name }}</div>

          <DishOperation :isSku="dishItem.isSku" />
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import DishOperation from "../Common/DishOperation.vue";
export default {
  components: {
    DishOperation,
  },
  props: {
    childDishGroups: {
      type: Array,
      default: [],
    },
  },
};
</script>
<style lang="less">
.child-group-container {
  .title {
  }
  .child-dishes-list {
    .child-dish-item {
      height: 32px;
      line-heght: 32px;
      position: relative;
      .name {
      }
    }
  }
}
</style>