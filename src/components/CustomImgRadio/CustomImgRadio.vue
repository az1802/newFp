<template>
  <div class="custom-img-radio">
    <img v-if="checked" src="@assets/checked.svg" class="checkbox" />
    <img v-else src="@assets/no-checked.png" class="checkbox" />
  </div>
</template>
<script>
export default {
  props: {
    checked: {
      type: Boolean,
      default: false,
    },
  },
  setup() {},
};
</script>
<style lang="less" scoped>
@import "@design/index.less";
.custom-img-radio {
  .box-size(34px,34px,transparent);
  display: inline-block;
  .checkbox {
    .box-size(100%,100%,transparent);
  }
}
</style>