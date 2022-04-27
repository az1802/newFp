<template>
  <div v-if="orderDetail.mealType === 'TAKE_OUT'" class="card-container">
    <div class="card-wrapper">
      <div class="header border-bottom-1px">配送信息</div>
      <div class="item-wrapper flex-start">
        <p class="title">配送地址</p>
        <div class="content">
          <p class="address">
            {{ orderDetail.shippingAddress.street }}
            {{ orderDetail.shippingAddress.houseNumber }}
          </p>
          <p class="content">
            {{ orderDetail.shippingAddress.username }}({{
              orderDetail.shippingAddress.gender
            }}) {{ orderDetail.shippingAddress.mobilePhone }}
          </p>
        </div>
      </div>

      <div class="item-wrapper">
        <p class="title">配送方式</p>
        <p class="content">
          {{ orderDetail.logisticsPlatform || "商家自配送" }}
        </p>
      </div>
      <div v-if="!orderDetail.logisticsPlatform" class="item-wrapper">
        <p class="title">送达时间</p>
        <p class="content">尽快送达</p>
      </div>
      <div v-if="orderDetail.logisticsPlatform" class="item-wrapper">
        <p class="title">配送骑手</p>
        <p class="content">{{ orderDetail.riderName }}</p>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    orderDetail: {
      type: Object,
      default: {},
    },
  },
};
</script>
<style lang="less" scoped>
@import "@design/index.less";
.card-container {
  width: calc(100% - 24px);
  margin: 8px auto 0 auto;
  border-radius: 8px;
  .card-wrapper {
    padding: 0 12px 16px;
    border-radius: 8px;
    background: white;
    .header {
      .line-center(47px);
      .bold-font(18px,#333130);
    }
    .item-wrapper {
      .flex-simple(space-between,center);
      color: #333333;
      &.flex-start {
        align-items: flex-start;
        margin-top: 12px;
        .content {
          text-align: right;
          .address {
            .normal-font(13px,#666);
          }
        }
      }
      .title {
        margin-right: 43px;
        white-space: nowrap;
        font-size: 14px;
      }
      .content {
        .normal-font(13px,#666);
      }
    }
    .remark-wrapper {
      .flex-simple(space-between,flex-start);
      margin-top: 6.5px;
      .title {
        font-size: 14px;
        flex-basis: 120px;
      }
      .content {
        text-align: right;
        .normal-font(13px,#666);
        line-height: 20px;
      }
    }
  }
}
</style>