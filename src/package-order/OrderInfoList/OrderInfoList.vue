<template>
  <div class="info-list-wrapper" v-if="show">
    <div class="title">订单信息</div>
    <div class="info-list">
      <div class="info-item" v-for="keyItem in orderKeyList" :key="keyItem">
        <div class="label">{{ keyItem.label }}</div>
        <div class="value">{{ orderInfo[keyItem.key] }}</div>
      </div>
    </div>
  </div>
</template>
<script>
import { computed, unref, ref, toRefs, watch } from "vue";
import { formatTme, payMethodMap } from "@utils";
const orderKeyList = [
  {
    label: "订单号",
    key: "id",
  },
  {
    label: "支付方式",
    key: "payMethod",
  },
  {
    label: "支付时间",
    key: "paidTime",
  },
  {
    label: "桌号",
    key: "tableName",
  },
  {
    label: "备注",
    key: "remark",
  },
];
export default {
  props: {
    orderInfo: {
      type: [Object],
      default: {},
    },
  },
  setup(props) {
    let { orderInfo } = toRefs(props);

    let show = computed(() => {
      return Object.keys(unref(orderInfo)).length > 0;
    });

    watch(orderInfo, (newOrderInfo) => {
      if (newOrderInfo.id) {
        newOrderInfo.payMethod = payMethodMap[newOrderInfo.payMethod];
        newOrderInfo.paidTime = formatTme(
          newOrderInfo.paidTime,
          "yyyy-MM-dd hh:mm"
        );
      }
    });

    return {
      show,
      orderInfo,
      orderKeyList,
    };
  },
};
</script>
<style lang="less" scoped>
@import "@design/index.less";
.info-list-wrapper {
  .box-size(calc(100vw - 24px),unset,white);
  padding: 0 12px 16px;
  margin: 12px auto 0;
  border-radius: 8px;
  .title {
    .line-center(47px);
    .bold-font(18px,#333130);
    .border-bottom-1px();
  }
  .info-list {
    .info-item {
      .flex-simple(space-between,center);
      .line-center(34px);
      .label {
        .normal-font(14px,#333);
      }
      .value {
        .normal-font(14px,#666);
      }
    }
  }
}
</style>