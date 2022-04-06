<!--
 * @Author: sunjie
 * @Date: 2022-02-15 12:35:07
 * @LastEditors: sunj
 * @LastEditTime: 2022-02-16 15:17:19
 * @FilePath: /new-fanpiao-uniapp/src/components/QuantityOperation/QuantityOperation.vue
-->
<template>
  <div class="quantity-operation">
    <span v-if="num" class="iconfont icon-jian" @click.stop="reduce"></span>
    <div v-if="num" class="num">{{ num }}</div>
    <span class="iconfont icon-jia" @click.stop="add"></span>
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
  width: 60px;
  .icon-jian,
  .icon-jia {
    .normal-font(24px,#f25643);
    padding: 0 2px;
  }
  .num {
    min-width: 20px;
    text-align: center;
  }
}
</style>