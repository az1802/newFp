<!--
 * @Author: sunjie
 * @Date: 2022-02-15 12:35:07
 * @LastEditors: sunj
 * @LastEditTime: 2022-02-16 15:17:19
 * @FilePath: /new-fanpiao-uniapp/src/components/QuantityOperation/QuantityOperation.vue
-->
<template>
  <div class="quantity-operation">
    <div v-if="num" class="iconfont icon-jian" @click.stop="reduce"></div>
    <div v-if="num" class="num">{{ num }}</div>
    <div
      class="iconfont icon-jia"
      :class="[disableAdd ? 'disabled' : '']"
      @click.stop="add"
    ></div>
  </div>
</template>
<script>
import { toRefs } from "vue";
export default {
  props: {
    num: {
      type: Number,
      default: 0,
    },
    disableAdd: {
      type: Boolean,
      default: false,
    },
  },
  setup(props, { emit }) {
    let { num } = toRefs(props);
    return {
      reduce() {
        if (num.value < 1) {
          return;
        }
        emit("reduce");
      },
      add() {
        emit("add");
      },
    };
  },
};
</script>
<style lang="less" scoped>
@import "@design/index.less";
.quantity-operation {
  .flex-simple(flex-end,center,inline-flex);
  width: 75px;
  .icon-jian,
  .icon-jia {
    .normal-font(24px,#f25643);
    display: inline-block;
    padding: 0 2px;
    &.disabled {
      opacity: 0.5;
    }
  }
  .num {
    min-width: 20px;
    text-align: center;
  }
}
</style>