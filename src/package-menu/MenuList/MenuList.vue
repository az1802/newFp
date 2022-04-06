<!--
 * @Author: sunjie
 * @Date: 2022-02-10 15:51:23
 * @LastEditors: sunj
 * @LastEditTime: 2022-02-17 15:01:54
 * @FilePath: /new-fanpiao-uniapp/src/package-menu/MenuList/MenuList.vue
-->
<template>
  <div class="list-wrapper">
    <scroll-view
      class="category-container"
      scroll-y="true"
      :scroll-into-view="scrollIntoCategoryView"
    >
      <div
        v-for="(categoryItem, index) in dishList"
        :key="categoryItem.category.id"
        :id="'category-index-' + index"
        class="category-item-wrapper"
        @click="changeCategory(index)"
      >
        <CategoryItem
          :category="categoryItem.category"
          :active="index == categoryActiveIndex"
        ></CategoryItem>
      </div>
    </scroll-view>
    <scroll-view
      class="foods-container"
      scroll-y="true"
      scroll-with-animation="trye"
      scroll-animation-duration="200"
      enable-back-to-top="true"
      scroll-anchoring="true"
      :scroll-into-view="scrollIntoView"
      @scroll="dishScroll"
    >
      <div
        v-for="(categoryItem, index) in dishList"
        :key="categoryItem.category.id"
        :id="'category-view-' + index"
        class="category-view-wrapper"
      >
        <div class="category-title">{{ categoryItem.category.name }}</div>
        <DishItem
          v-for="dishItem in categoryItem.dishList"
          :dish="dishItem"
          :key="dishItem.id"
        />
      </div>
    </scroll-view>
  </div>
</template>
<script>
const DISH_ITEM_HEIGHT = 86 + 24;
import CategoryItem from "../CategoryItem/CategoryItem.vue";
import DishItem from "../DishItem/DishItem.vue";
import { useDebounceFn, useThrottleFn } from "@vueuse/core";
import { ref } from "vue";
export default {
  components: {
    CategoryItem,
    DishItem,
  },
  props: {
    dishList: {
      type: Array,
      default: [],
    },
  },
  setup() {
    let categoryActiveIndex = ref(0),
      scrollIntoView = ref("category-view-0"),
      scrollIntoCategoryView = ref("category-index-0");
    return {
      categoryActiveIndex,
      scrollIntoView,
      scrollIntoCategoryView,
      dishScroll: useThrottleFn((e) => {
        let { categoryScrollTops } = getApp().globalData;
        let { scrollTop } = e.detail;
        let categoryIndex =
          categoryScrollTops.findIndex((item) => item > scrollTop) - 1;
        categoryActiveIndex.value = categoryIndex;
        scrollIntoCategoryView.value = `category-index-${categoryIndex - 3}`;
      }, 100),
      changeCategory(index) {
        categoryActiveIndex.value = index;
        scrollIntoView.value = "category-view-" + index;
      },
    };
  },
};
</script>
<style lang="less" scoped>
@import "@design/index.less";
.list-wrapper {
  .box-size();
  display: flex;
  .category-container {
    .box-size(80px,100%);
    flex-basis: 80px;
    background: #f8f8f8;
    .category-item-wrapper:last-child {
      padding-bottom: 30px;
    }
  }
  .foods-container {
    flex: 1;
    height: 100%;
    padding: 0 12px;
    box-sizing: border-box;
    .category-view-wrapper:last-child {
      padding-bottom: 60px;
    }
    .category-title {
      .box-size(100%,50px);
      .normal-font(14px,#333);
      padding: 12px 0;
    }
  }
}
</style>