<template>
  <div class="remark-info-wrapper">
    <div class="remark-header" @click="isShowRemark = !isShowRemark">
      <p class="title">备注</p>
      <img
        src="@assets/icon-arrow_right.svg"
        alt=""
        class="arrow-right"
        :class="!isShowRemark ? 'down' : 'up'"
      />
    </div>
    <div v-if="isShowRemark" class="textarea-wrapper">
      <textarea
        v-if="isShowRemark"
        class="textarea"
        placeholder-class="placeholder"
        maxlength="60"
        v-model="orderInfo.remark"
        placeholder="请输入口味、偏好或其他要求"
      ></textarea>
    </div>
  </div>
</template>
<script>
import { useOrder } from "@hooks/orderHooks";
import { ref } from "vue";
export default {
  components: {},
  setup() {
    let isShowRemark = ref(true);
    let { orderInfo } = useOrder();

    return {
      orderInfo,
      isShowRemark,
    };
  },
};
</script>
<style lang="less" scoped>
@import "@design/index.less";
.remark-info-wrapper {
  .box-size(calc(100% - 24px),unset,white);
  margin: 0px auto 52px;
  padding: 0 12px 12px;
  .remark-header {
    .flex-simple(space-between,center);
    .arrow-right {
      .box-size(12px,12px);
      &.down {
        transform: rotate(90deg);
      }
      &.up {
        transform: rotate(-90deg);
      }
    }
    .title {
      .line-center(40px);
      font-size: 14px;
    }
  }
  .textarea-wrapper {
    padding: 10px;
    border-radius: 10px;
    border: 1px solid #e0e0e0;
    .textarea {
      .box-size(100%,60px);
      font-size: 14px;
    }
  }
}
</style>