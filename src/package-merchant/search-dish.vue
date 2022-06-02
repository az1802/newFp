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
      <SearchDishItem
        v-for="dishItem in searchDishList"
        :dish="dishItem"
        :key="dishItem.id + searchStr"
        :highLightStr="searchStr"
      />
      <EmptyStatus
        v-if="searchStr && searchDishList.length == 0"
        padding="50px"
        type="dish"
        content="未查询到相关菜品"
      />
      <div style="height: 140px"></div>
    </scroll-view>
    <SearchMenuBottom />
    <SkuModal />
    <ChildSkuDishModal />
    <CartModal />
  </div>
</template>
<script>
import SkuModal from "./SkuModal/SkuModal.vue";
import CartModal from "./CartModal/CartModal.vue";
import MenuBottom from "./MenuBottom/MenuBottom.vue";
import SearchMenuBottom from "./SearchMenuBottom/SearchMenuBottom.vue";
import ChildSkuDishModal from "./SkuModal/ChildSkuDishModal.vue";
import SearchDishItem from "./SearchDishItem/SearchDishItem.vue";
import {
  useMerchantInfo,
  useFanpiaoInfo,
  useCouponInfo,
  useFanpiaoOpenScreen,
} from "@hooks/merchantHooks";
import { useDish, useSearchDish } from "@hooks/menuHooks";
export default {
  components: {
    SkuModal,
    CartModal,
    ChildSkuDishModal,
    SearchDishItem,
    MenuBottom,
    SearchMenuBottom,
  },
  onShow() {
    //#ifndef MP-ALIPAY
    my.hideBackHome();
    //#endif
  },
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
    position: relative;
    .search-text {
      .box-size(calc(100%),36px,#F8F8F8);
      margin: 0 auto 12px auto;
      padding: 0 12px;
      border-radius: 18px;
      position: relative;
      .text {
        width: calc(100% - 70px);
        .line-center(36px);
        background: transparent;
      }
      .close-icon {
        .pos-tr-absolute(9px,50px);
        .box-size(18px,18px);
        z-index: 10;
      }
    }
    .right {
      .pos-tr-absolute(0,10px);
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