<!--
 * @Author: sunjie
 * @Date: 2022-02-11 19:08:00
 * @LastEditors: sunj
 * @LastEditTime: 2022-02-16 16:04:41
 * @FilePath: /new-fanpiao-uniapp/src/package-menu/SkuModal/SupplyCondimentList.vue
-->
<template>
  <div class="condiment-list-container">
    <div class="title">配料</div>
    <div
      class="condiment-item"
      v-for="condimentItem in condimentList"
      :key="condimentItem.id"
    >
      <div class="name">{{ condimentItem.name }}</div>
      <div class="price">¥{{ condimentItem.marketPrice }}</div>
      <QuantityOperation
        :num="selCondiments[condimentItem.id]"
        @add="addCondiment(condimentItem)"
        @reduce="reduceCondiment(condimentItem)"
      />
    </div>
    <div style="height: 12px"></div>
  </div>
</template>
<script>
export default {
  props: {
    condimentList: {
      type: Array,
      default: [],
    },
    selCondiments: {
      type: Object,
      default: {},
    },
  },
  setup(props) {
    let { selCondiments } = props;
    return {
      addCondiment({ id }) {
        selCondiments[id] == undefined
          ? (selCondiments[id] = 1)
          : (selCondiments[id] += 1);
      },
      reduceCondiment({ id }) {
        selCondiments[id] -= 1;
      },
    };
  },
};
</script>
<style lang="less" scoped>
@import "@design/index.less";
.condiment-list-container {
  .title {
    .normal-font(12px,#999);
    .line-center(18px);
  }
  .condiment-item {
    .flex-simple(space-between,center);
    height: 32px;
    .name {
      flex-basis: 120px;
      .bold-font(14px,#333);
    }
    .price {
      .normal-font(14px,#333);
      flex-basis: 100px;
    }
  }
}
</style>