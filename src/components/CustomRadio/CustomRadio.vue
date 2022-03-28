<!--
 * @Author: sunjie
 * @Date: 2022-02-18 19:14:45
 * @LastEditors: sunj
 * @LastEditTime: 2022-02-21 12:33:22
 * @FilePath: /new-fanpiao-uniapp/src/components/CustomRadio/CustomRadio.vue
-->
<template>
  <div class="custom-radio-wrapper" @click="change">
    <span
      class="iconfont icon-xuanzhong"
      :class="[checked ? 'checked' : '']"
    ></span>
  </div>
</template>
<script>
import { toRefs } from "vue";
export default {
  props: {
    checked: {
      type: Boolean,
      default: true,
    },
  },
  setup(props, { emit }) {
    console.log(
      "%cprops: ",
      "color: MidnightBlue; background: Aquamarine; font-size: 20px;",
      props
    );
    return {
      // ...toRefs(props),
      change() {
        emit("change");
      },
    };
  },
};
</script>
<style lang="less" scoped>
.custom-radio-wrapper {
  display: inline-block;
  .icon-xuanzhong.checked {
    color: #f25643;
  }
}
</style>