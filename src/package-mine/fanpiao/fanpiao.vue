<template>
  <div class="fanpiao-record">
    <NavigationBar title="饭票详情" />
    <div class="tabs-wrapper">
      <div
        v-for="(item, index) in tabs"
        class="tab-item"
        :key="item.value"
        :class="{ active: index === curTabIndex }"
        @click="switchTab(index)"
      >
        {{ item.text }}
      </div>
    </div>
    <div class="container-wrapper">
      <scroll-view class="scroll-view" scroll-y>
        <div class="container-item" v-if="curTabIndex == 0">
          <FanpiaoItem
            v-for="(fanpiaoItem, index) in avaiableList"
            :fanpiao="fanpiaoItem"
            :key="index"
            class="fanpiao-item-wrapper"
          ></FanpiaoItem>
        </div>
        <div class="container-item" v-else>
          <FanpiaoItem
            v-for="(fanpiaoItem, index) in unAvailableList"
            :fanpiao="fanpiaoItem"
            :key="index"
            class="fanpiao-item-wrapper"
          ></FanpiaoItem>
        </div>
      </scroll-view>
    </div>
  </div>
</template>
<script>
const TAB_ARR = [
  {
    text: "可用",
    value: "available",
  },
  {
    text: "不可用",
    value: "unavailable",
  },
];
import { useTabs, useSystemInfo } from "@hooks/commonHooks";
import { useUserInfo } from "@hooks/userHooks";
import { onBeforeMount, computed, unref } from "vue";
import FanpiaoItem from "./FanpiaoItem.vue";
export default {
  components: {
    FanpiaoItem,
  },
  setup() {
    let { curTabIndex, switchTab, tabs } = useTabs(TAB_ARR);
    const { userFanpiaoRecords, requestUserFanpiaoRecords } = useUserInfo();
    onBeforeMount(async () => {
      uni.showLoading();
      await requestUserFanpiaoRecords();
      uni.hideLoading();
    });

    const avaiableList = computed(() => {
      return unref(userFanpiaoRecords).filter((item) => {
        return item.presentValue != 0;
      });
    });
    const unAvailableList = computed(() => {
      return unref(userFanpiaoRecords).filter((item) => {
        return item.presentValue == 0;
      });
    });
    return {
      curTabIndex,
      switchTab,
      tabs,
      userFanpiaoRecords,
      avaiableList,
      unAvailableList,
    };
  },
};
</script>
<style scoped lang="stylus" rel="stylesheet/stylus">
.fanpiao-record {
  width: 100vw;
  height: 100vh;
  background: #f8f8f8;

  .tabs-wrapper {
    width: 100%;
    display: flex;
    padding: 21px 0 11px 0;
    position: fixed;
    z-index: 1000;
    background-color: white;

    .tab-item {
      flex: 1;
      text-align: center;
      color: #332E2B;
      font-size: 18px;
      position: relative;

      &.active {
        color: #EB4B3A;
        font-weight: bold;

        &:after {
          content: '';
          position: absolute;
          bottom: -8px;
          display: inline-block;
          width: 36px;
          height: 3px;
          background-color: #EB4B3A;
          left: 50%;
          transform: translateX(-50%);
          border-radius: 3px;
        }
      }
    }
  }

  .container-wrapper {
    position: absolute;
    left: 0;
    right: 0;
    bottom: 0;
    top: 138px;

    .scroll-view {
      width: 100%;
      height: 100%;
    }

    .container-item {
      width: 100%;
      height: 100%;
      box-sizing: border-box;
      padding: 8px 12px 60px 12px;

      .fanpiao-item-wrapper {
        margin-bottom: 8px;
        display: block;
      }
    }
  }
}
</style>