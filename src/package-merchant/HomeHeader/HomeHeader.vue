<template>
  <div class="base-info">
    <div class="logo">
      <img
        :src="merchantInfo.logoUrl"
        alt="logo图"
        mode="aspectFill"
        class="img"
      />
    </div>
    <div class="name">{{ merchantInfo.name }}</div>
    <div class="detail-wrapper">
      <div class="detail-info">
        <p class="time">营业时间：{{ merchantInfo.openingHoursDesc || "" }}</p>
        <p class="address">{{ merchantInfo.address }}</p>
      </div>
      <button class="button icon-wrapper" hover-class="none" open-type="share">
        <img
          src="https://shilai-images.oss-cn-shenzhen.aliyuncs.com/staticImgs/common/icon-share_a.png"
          alt=""
          class="img"
        />
        <p class="text">分享</p>
      </button>
      <!-- #ifndef MP-ALIPAY  -->
      <div class="phone" v-if="merchantInfo.phone">
        <img
          src="https://shilai-images.oss-cn-shenzhen.aliyuncs.com/staticImgs/common/icon-phone_b.png"
          alt="电话"
          class="img"
        />
        <p class="text">电话</p>
      </div>
      <!-- #endif -->
    </div>
  </div>
</template>
<script>
export default {
  props: {
    merchantInfo: {
      type: Object,
      default: {},
    },
    enableOrderingService: {
      type: Boolean,
      default: false,
    },
  },
  components: {},
  setup() {
    return {
      makePhoneCall() {},
    };
  },
};
</script>
<style lang="less" scoped>
@import "@design/index.less";
.base-info {
  .box-size(100%,100px,transparent);
  position: relative;
  padding-left: 12px;
  border-radius: 8pt 8pt 0 0;
  margin-top: -8px;
  .logo {
    .box-size(50px,50px,#F8F8F8);
    .pos-tl-absolute(-18px,12px);
    border-radius: 5px;
    border: 1px solid #eeebe9;
    z-index: 100;
    overflow: hidden;
    .img {
      .box-size(100%,100%);
    }
  }
  .name {
    .box-size(100%,46.5px,transparent);
    .bold-font(20px,#333);
    line-height: 1;
    .no-wrap();
    padding: 12px 21px 14.5px 62px;
  }
  .detail-wrapper {
    .flex-simple(space-between,center);
    .detail-info {
      .normal-font(12px,#666);
      font-family: monospace;
      flex: 1;
      .address {
        .line-center(18px);
        margin-top: 6px;
      }
    }
    .icon-wrapper,
    .phone {
      .box-size(24px,36px,transparent);
      margin-right: 15px;
      text-align: center;
      line-height: 1;
      .img {
        .box-size(24px,24px,transparent);
      }
      .text {
        .normal-font(10px,#666260);
        margin-top: 2px;
      }
    }
  }
}
</style>