<template>
  <div
    class="meal-types"
    :class="[mealCounts == 2 ? 'big' : '']"
    v-if="merchantInfo.merchantId != 'b46b022cf7024f0aab9ba1793cb75036'"
  >
    <div
      class="meal-type-item"
      @click="handleMealType('EAT_IN')"
      v-if="
        !(
          merchantInfo.enableEatIn ||
          merchantInfo.enableSelfPickUp ||
          merchantInfo.enableTakeOut ||
          merchantInfo.enableTakeAway
        )
      "
    >
      <img
        src="https://shilai-images.oss-cn-shenzhen.aliyuncs.com/staticImgs/invite-share-icon-simple_01.png"
        alt=""
        class="icon"
      />
      <div class="content">
        {{ enableOrderingService ? "单人用餐" : "单人买单" }}
      </div>
    </div>

    <div
      v-if="merchantInfo.enableEatIn"
      class="meal-type-item"
      @click="handleMealType('EAT_IN')"
    >
      <img
        src="https://shilai-images.oss-cn-shenzhen.aliyuncs.com/staticImgs/invite-share-icon-eat-in_01.png"
        alt=""
        class="icon"
      />
      <p class="content">堂 食</p>
    </div>
    <div
      v-if="merchantInfo.enableSelfPickUp"
      class="meal-type-item"
      @click="handleMealType('SELF_PICK_UP')"
    >
      <img
        v-if="merchantInfo.opening"
        src="https://shilai-images.oss-cn-shenzhen.aliyuncs.com/staticImgs/invite-share-icon-self-pick-up_01.png"
        class="icon"
      />
      <p v-if="merchantInfo.opening" class="content">自 提</p>
      <img
        v-if="!merchantInfo.opening"
        src="https://shilai-images.oss-cn-shenzhen.aliyuncs.com/staticImgs/common/icon-self_pick_up_closed.png"
        class="icon"
      />
      <p v-if="!merchantInfo.opening" class="closed">非自提营业时间</p>
    </div>

    <div
      v-if="merchantInfo.enableTakeOut"
      class="meal-type-item"
      @click="handleMealType('TAKE_OUT')"
    >
      <img
        v-if="merchantInfo.opening"
        src="https://shilai-images.oss-cn-shenzhen.aliyuncs.com/staticImgs/invite-share-icon-take_out_01.png"
        alt=""
        class="icon"
      />
      <p v-if="merchantInfo.opening" class="content">外 卖</p>
      <img
        v-if="!merchantInfo.opening"
        src="https://shilai-images.oss-cn-shenzhen.aliyuncs.com/staticImgs/common/icon-take_out_closed.png"
        alt=""
        class="icon"
      />
      <p v-if="!merchantInfo.opening" class="closed">非外卖营业时间</p>
    </div>

    <div
      v-if="merchantInfo.enableTakeAway"
      class="meal-type-item"
      @click="handleMealType('TAKE_AWAY')"
    >
      <img
        v-if="merchantInfo.opening"
        src="https://shilai-images.oss-cn-shenzhen.aliyuncs.com/staticImgs/invite-share-icon-take_out_01.png"
        alt=""
        class="icon"
      />
      <p v-if="merchantInfo.opening" class="content">外 带</p>
      <img
        v-if="!merchantInfo.opening"
        src="https://shilai-images.oss-cn-shenzhen.aliyuncs.com/staticImgs/common/icon-take_out_closed.png"
        alt=""
        class="icon"
      />
      <p v-if="!merchantInfo.opening" class="closed">非外卖营业时间</p>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    merchantInfo: {
      type: Object,
      default: {},
    },
    enableOrderingService: {
      type: Boolean,
      default: true,
    },
  },
  components: {},
  setup(props, { emit }) {
    // const mealCounts = computed(() => {
    //   let count = 0;
    //   let optionsArr = [
    //     "enableEatIn",
    //     "enableSelfPickUp",
    //     "enableTakeOut",
    //     "enableTakeAway",
    //   ];
    //   optionsArr.forEach((item) => {
    //     if (!!props.merchantInfo.value[item]) {
    //       count++;
    //     }
    //   });
    //   return count;
    // });
    let mealCounts = 2;

    return {
      mealCounts,
      handleMealType(mealType) {
        emit("mealTypeClick", mealType);
      },
    };
  },
};
</script>
<style lang="less" scoped>
@import "@design/index.less";
.meal-types {
  .flex-simple(space-between,center);
  padding: 18px 12px 0 12px;
  .meal-type-item {
    .flex-center(column);
    .box-size(unset,112px,white);
    border-radius: 8px;
    overflow: hidden;
    flex: 1;
    margin-left: 9px;
    &:first-child {
      margin-left: 0px;
    }
    .icon {
      .box-size(50px,50px,white);
    }
    .content {
      .bold-font(16px,#333);
    }
  }
}
</style>