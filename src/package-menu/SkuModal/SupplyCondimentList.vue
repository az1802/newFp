<!--
 * @Author: sunjie
 * @Date: 2022-02-11 19:08:00
 * @LastEditors: sunj
 * @LastEditTime: 2022-02-17 14:56:09
 * @FilePath: /new-fanpiao-uniapp/src/package-menu/SkuModal/SupplyCondimentList.vue
-->
<template>
  <div class="condiment-list-container">
    <div class="title">
      配料
      <span v-if="tooltipText" class="sel-count">{{ selCondimentsCount }}</span>
      <span class="tooltip-text">{{ tooltipText }}</span>
    </div>
    <div
      v-for="condimentItem in condimentList"
      class="condiment-item"
      :class="[condimentItem.status === 'SOLD_OUT' ? 'sell-out' : '']"
      :key="condimentItem.id"
    >
      <div class="name">{{ condimentItem.name }}</div>
      <div class="price">¥{{ fenToYuan(condimentItem.marketPrice) }}</div>

      <div class="status" v-if="condimentItem.status === 'SOLD_OUT'">
        已售罄
      </div>
      <QuantityOperation
        v-else
        :num="selCondiments[condimentItem.id]"
        @add="addCondiment(condimentItem)"
        @reduce="reduceCondiment(condimentItem)"
      />
    </div>
    <div style="height: 12px"></div>
  </div>
</template>
<script>
import { fenToYuan } from "@utils";
import { computed } from "vue";
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
    selectionType: {
      type: Object,
      default: {},
    },
    selCondimentsCount: {
      type: [String, Number],
      default: 0,
    },
  },
  setup(props) {
    let { selCondiments } = props;

    let tooltipText = computed(() => {
      let selectionType = props.selectionType;
      if (selectionType.type == "NUMBER_REQUIRED") {
        return `/${selectionType.upperLimit}`;
      } else if (selectionType.type == "NUMBER_RANGE") {
        return `/${selectionType.lowerLimit}-${selectionType.upperLimit}`;
      } else {
        return "";
      }
    });

    function addCondiment({ id }) {
      let countNum = props.selCondimentsCount;
      let { type, lowerLimit, upperLimit } = props.selectionType;
      console.log(
        "type, lowerLimit, upperLimit : ",
        type,
        lowerLimit,
        upperLimit
      );
      if (countNum >= upperLimit && type != "UNLIMITED" && type != "NONE") {
        return;
      }
      selCondiments[id] == undefined
        ? (selCondiments[id] = 1)
        : (selCondiments[id] += 1);
    }
    function reduceCondiment({ id }) {
      if (selCondiments[id] < 1) {
        return;
      }
      selCondiments[id] -= 1;
    }

    return {
      addCondiment,
      reduceCondiment,
      tooltipText,
      fenToYuan,
    };
  },
};
</script>
<style lang="less" scoped>
@import "@design/index.less";
.condiment-list-container {
  box-sizing: border-box;
  padding: 0 12px;
  .title {
    .normal-font(12px,#999);
    .line-center(18px);
    .sel-count {
      color: #f25643;
      margin-left: 10px;
    }
    .tooltip-text {
      .line-center(18px);
      .normal-font(12px,#999);
      margin-left: 12px;
    }
  }
  .condiment-item {
    .flex-simple(space-between,center);
    height: 32px;
    &.sell-out {
      background-color: #f0f0f0;
      .name,
      .price {
        color: #666;
      }
    }
    .name {
      flex-basis: 120px;
      .bold-font(14px,#333);
    }
    .price {
      .normal-font(14px,#333);
      flex-basis: 100px;
    }
    .status {
      .normal-font(14px,#666);
      width: 100px;
      text-align: right;
    }
  }
}
</style>