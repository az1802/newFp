<template>
  <div class="search-page">
    <NavigationBar :title="merchantInfo.merchantName" />
    <scroll-view class="scroll-view" scroll-y>
      <div class="search-wrapper">
        <div class="search-text">
          <input
            type="text"
            placeholder="请输入菜品名称"
            placeholder-style="color:#999999"
            v-model="searchStr"
            focus
            confirm-type="search"
            class="text"
          />
          <img
            v-if="searchStr"
            src="@assets/close-icon.png"
            class="close-icon"
            @click="clearSearchStr"
          />
        </div>
        <div class="right">
          <div class="vertical-line"></div>
          <text class="cuIcon-search" @click="changeSearchText"></text>
        </div>
      </div>
      <DishItem
        v-for="dishItem in searchDishList"
        :dish="dishItem"
        :key="dishItem.id"
      />
      <EmptyStatus
        v-if="searchStr && searchDishList.length == 0"
        padding="50px"
        type="dish"
        content="未查询到相关菜品"
      />
    </scroll-view>
    <MenuBottom />
    <SkuModal />
    <ChildSkuDishModal />
    <CartModal />
  </div>
</template>
<script>
import SkuModal from "./SkuModal/SkuModal.vue";
import CartModal from "./CartModal/CartModal.vue";
import MenuBottom from "./MenuBottom/MenuBottom.vue";
import ChildSkuDishModal from "./SkuModal/ChildSkuDishModal.vue";
import DishItem from "./DishItem/DishItem.vue";
import {
  useMerchantInfo,
  useFanpiaoInfo,
  useCouponInfo,
  useFanpiaoOpenScreen,
} from "@hooks/merchantHooks";
import { useDish, useSearchDish } from "@hooks/menuHooks";

export default {
  components: { SkuModal, CartModal, ChildSkuDishModal, MenuBottom, DishItem },
  setup() {
    const { merchantInfo } = useMerchantInfo();
    const { searchStr, setSearchStr, searchDishList } = useSearchDish();
    return {
      merchantInfo,
      searchStr,
      searchDishList,
      changeSearchText() {},
      clearSearchStr() {
        searchStr.value = "";
      },
    };
  },
};
</script>
<style lang="less" scoped>
@import "@design/index.less";
.search-page {
  .scroll-view {
    .box-size(100%,calc(100vh - 100px));
    padding: 0 12px;
  }
  .search-wrapper {
    .search-text {
      .box-size(calc(100%),36px,#F8F8F8);
      margin: 0 auto 12px auto;
      padding: 0 12px;
      border-radius: 18px;
      position: relative;
      .text {
        .line-center(36px);
      }
      .close-icon {
        .pos-tr-absolute(9px,50px);
        .box-size(18px,18px);
        z-index: 100;
      }
    }
    .right {
      .pos-tr-absolute(0,1px);
      .flex-simple(flex-start,center);
      height: 36px;
      .vertical-line {
        .box-size(1px,16px,#E6E6E6);
        margin: 0 11px;
      }
      .cuIcon-search {
        font-weight: bold;
      }
    }
  }
}
</style>