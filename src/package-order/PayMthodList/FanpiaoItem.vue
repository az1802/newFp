<template>
  <div
    class="fanpiao-item"
    :class="[active ? 'active' : '']"
    @click.stop="emit('select', fanpiaoInfo)"
  >
    <div class="discount-info">
      买单享<span class="discount-number">{{
        (100 - fanpiaoInfo.discount) / 10
      }}</span
      >折
    </div>
    <div class="price">
      {{ fanpiaoInfo.totalValue / 100 }}
    </div>
    <div class="tooltip">售完为止</div>
    <div class="super-tag" v-if="isSuperFanpiao">
      超值
      <img v-if="active" src="@assets/recommend.png" class="recommend-icon" />
      <img v-else src="@assets/recommend2.png" class="recommend-icon" />
    </div>
  </div>
</template>
<script>
export default {
  props: {
    isSuperFanpiao: {
      type: Boolean,
      default: false,
    },
    active: {
      type: Boolean,
      default: false,
    },
    fanpiaoInfo: {
      type: Object,
      default: {},
    },
  },
  setup(props, { emit }) {
    return {
      emit,
    };
  },
};
</script>
<style lang="less" scoped>
@import "@design/index.less";
.fanpiao-item {
  .box-size(100%,61px,transparent);
  background-image: url("https://shilai-images.oss-cn-shenzhen.aliyuncs.com/staticImgs/package-static/package-order/fanpiao-item-bg.png"); // shilai-images.oss-cn-shenzhen.aliyuncs.com/staticImgs/package-static/package-order/wallet-pay-header_bg.png);
  background-size: 100% 100%;
  background-repeat: no-repeat;
  border-radius: 4px;
  position: relative;
  display: flex;
  overflow: hidden;
  .discount-info {
    .box-size(63.5%,100%,transparent);
    .flex-simple(center,center);
    .normal-font(15px,rgba(0,0,0,0.8));
    .discount-number {
      .bold-font(16px,#F25643);
    }
  }
  .price {
    flex: 1;
    .flex-center();
    .bold-font(18px, #f25643);
    .price-symbol(18px,#f25643,bold);
  }
  .tooltip,
  .super-tag {
    .box-size(56px,14px);
    .line-center(14px);
    .pos-absolute(0,0);
    .normal-font(10px,#c97c0d);
    text-align: center;
    background: linear-gradient(180deg, #ffc87b 0%, #fff1d5 100%);
    border-radius: 8px 8px 8px 0;
  }
  .super-tag {
    right: 0px;
    left: unset;
    .recommend-icon {
      .box-size(10px,10px,transparent);
      margin-left: 2px;
    }
  }
  &.active {
    background-image: url("https://shilai-images.oss-cn-shenzhen.aliyuncs.com/staticImgs/package-static/package-order/fanpiao-item-bg-active.png");
    .discount-info,
    .tooltip,
    .discount-number {
      color: white;
    }
    .price {
      color: white;
      .price-symbol(18px,white,bold);
    }
    .tooltip {
      background: linear-gradient(180deg, #f25643 0%, #eb7b3a 100%);
    }
    .super-tag {
      background: linear-gradient(180deg, #f25643 0%, #eb7b3a 100%);
      color: white;
    }
  }
}
</style>