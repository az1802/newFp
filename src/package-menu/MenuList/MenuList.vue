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
      <div style="height: 200px"></div>
    </scroll-view>
    <scroll-view
      class="foods-container"
      scroll-y
      scroll-with-animation
      scroll-animation-duration="200"
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
      <div style="height: 100px"></div>
    </scroll-view>
    <div class="fixed-category-title">
      <div class="text">
        {{
          dishList[categoryActiveIndex] &&
          dishList[categoryActiveIndex].category.name
        }}
      </div>
      <div class="search-box" @click="navigateTo('MENU/SEARCH_DISH')">
        <img
          src="https://shilai-images.oss-cn-shenzhen.aliyuncs.com/staticImgs/common/icon-search_01.png"
          alt=""
          class="img"
        />
        <div class="text">搜索</div>
      </div>
    </div>
  </div>
</template>
<script>
const DISH_ITEM_HEIGHT = 86 + 24;
import CategoryItem from "../CategoryItem/CategoryItem.vue";
import DishItem from "../DishItem/DishItem.vue";
import { useDebounceFn, useThrottleFn } from "@vueuse/core";
import { useSystemInfo, useNavigate } from "@hooks/commonHooks";
import { navigateTo } from "@utils";
import { onMounted, ref, watch } from "vue";
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
  setup(props) {
    const { statusBarHeight, screenWidth } = useSystemInfo();
    let menuWrapperStyle = ref({
      height: `calc(100vh - 250px - ${screenWidth / 3}px)`,
    });
    let categoryActiveIndex = ref(0),
      scrollIntoView = ref("category-view-0"),
      scrollIntoCategoryView = ref("category-index-0");

    let dishScroll = useThrottleFn((e) => {
      let { categoryScrollTops } = getApp().globalData;
      let { scrollTop } = e.detail;
      let categoryIndex =
        scrollTop == 0
          ? 0
          : categoryScrollTops.findIndex((item) => item > scrollTop) - 1;
      categoryActiveIndex.value = categoryIndex;
      scrollIntoCategoryView.value = `category-index-${categoryIndex - 3}`;
    }, 100);
    function changeCategory(index) {
      categoryActiveIndex.value = index;
      scrollIntoView.value = "category-view-" + index;
    }
    watch(props.dishList, (nval) => {
      setTimeout(() => {
        categoryActiveIndex.value = 0;
      }, 2000);
    });

    return {
      categoryActiveIndex,
      scrollIntoView,
      scrollIntoCategoryView,
      dishScroll,
      changeCategory,
      menuWrapperStyle,
      navigateTo,
    };
  },
};
</script>
<style lang="less" scoped>
@import "@design/index.less";
.list-wrapper {
  .box-size();
  display: flex;
  position: relative;
  .fixed-category-title {
    .box-size(calc(100% - 80px),50px);
    .pos-tr-absolute(0,0);
    .flex-simple(space-between,center);
    padding: 0 12px;
    z-index: 30;
    .text {
      .normal-font(14px,#333);
    }
    .search-box {
      .box-size(72px,32px,#F8F8F8);
      .flex-simple(center,center);
      border-radius: 16px;
      z-index: 10;
      .img {
        .box-size(20px,20px,transparent);
        margin-left: 4px;
      }
      .text {
        .normal-font(14px,#666);
      }
    }
  }
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