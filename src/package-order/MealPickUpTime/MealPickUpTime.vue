<template>
  <div class="meal-pick-up-time">
    <!-- #ifdef MP-WEIXIN  -->
    <picker
      mode="multiSelector"
      :range="multiArray"
      range-key="text"
      @change="changeTakeawayTime"
    >
      <div class="right-wrapper">
        <p class="content">{{ time || "立即取餐" }}</p>
        <img src="@assets/icon-arrow_right.svg" alt="" class="arrow-right" />
      </div>
    </picker>
    <!-- #endif -->
    <!-- #ifdef MP-ALIPAY  -->
    <picker mode="time" @change="changeTakeawayTimeAli">
      <div class="right-wrapper">
        <p class="content">{{ time || "立即取餐" }}</p>
        <img src="@assets/icon-arrow_right.svg" alt="" class="arrow-right" />
      </div>
    </picker>
    <!-- #endif -->
  </div>
</template>
<script>
import { ref, unref } from "vue";
const MULTI_ARRAY = [
  [
    {
      text: "00时",
      value: "00",
    },
    {
      text: "01时",
      value: "01",
    },
    {
      text: "02时",
      value: "02",
    },
    {
      text: "03时",
      value: "03",
    },
    {
      text: "04时",
      value: "04",
    },
    {
      text: "05时",
      value: "05",
    },
    {
      text: "06时",
      value: "06",
    },
    {
      text: "07时",
      value: "07",
    },
    {
      text: "08时",
      value: "08",
    },
    {
      text: "09时",
      value: "09",
    },
    {
      text: "10时",
      value: "10",
    },
    {
      text: "11时",
      value: "11",
    },
    {
      text: "12时",
      value: "12",
    },
    {
      text: "13时",
      value: "13",
    },
    {
      text: "14时",
      value: "14",
    },
    {
      text: "15时",
      value: "15",
    },
    {
      text: "16时",
      value: "16",
    },
    {
      text: "17时",
      value: "17",
    },
    {
      text: "18时",
      value: "18",
    },
    {
      text: "19时",
      value: "19",
    },
    {
      text: "20时",
      value: "20",
    },
    {
      text: "21时",
      value: "21",
    },
    {
      text: "22时",
      value: "22",
    },
    {
      text: "23时",
      value: "23",
    },
  ],
  [
    {
      text: "00分",
      value: "00",
    },
    {
      text: "15分",
      value: "15",
    },
    {
      text: "30分",
      value: "30",
    },
    {
      text: "45分",
      value: "45",
    },
  ],
];
export default {
  props: {
    time: {
      type: String,
      default: "",
    },
  },
  setup(props, { emit }) {
    let multiArray = ref(MULTI_ARRAY);
    return {
      multiArray,
      changeTakeawayTime(e) {
        let index = e.target.value;
        let takeawayTime =
          unref(multiArray)[0][index[0]].value +
          ":" +
          unref(multiArray)[1][index[1]].value;
        emit("update:time", takeawayTime);
      },
      changeTakeawayTimeAli(e) {
        let takeawayTime = e.detail.value;
        emit("update:time", takeawayTime);
      },
    };
  },
};
</script>
<style lang="less" scoped>
@import "@design/index.less";
.meal-pick-up-time {
  .right-wrapper {
    .flex-simple(center,center);
    .content {
      .normal-font(17px,#333);
    }
    .arrow-right {
      .box-size(9px,14px);
      margin: 0 5px;
    }
  }
}
</style>