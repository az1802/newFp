<template>
  <div class="fanpiao-rules">
    <NavigationBar title="饭票使用规则" />
    <div class="title-wrapper">
      <img
        class="title-icon"
        src="https://shilai-images.oss-cn-shenzhen.aliyuncs.com/staticImgs/common/icon-rules.png"
      />
      <p class="title">规则说明</p>
    </div>

    <div class="rule-section">
      <div class="section-title">1. 商品</div>
      <p class="rule-text">- 使用饭票支付订单时，可享受规定的折扣价。</p>
      <p class="rule-text">
        - 使用饭票支付的订单发生退款时，饭票支付部分也将退回到原饭票中。
      </p>
      <p class="rule-text">
        - 使用多张饭票支付时，优先扣除面额较小的饭票余额。
      </p>
      <p class="rule-text">
        - 饭票支付不支持和微信支付、支付宝支付、红包支付合并结算。
      </p>
      <p class="rule-text">
        - 饭票支付与随机立减、优惠券等其他优惠方式互斥，不可同时使用。
      </p>
    </div>

    <div class="rule-section">
      <div class="section-title">2. 购买</div>
      <p class="rule-text">- 饭票价格以人民币表示。</p>
      <!-- #ifdef MP-ALIPAY -->
      <p class="rule-text">- 用户购买饭票需通过支付宝平台付款。</p>
      <!-- #endif -->
      <!-- #ifdef MP-WEIXIN -->
      <p class="rule-text">- 用户购买饭票需通过微信平台付款。</p>
      <!-- #endif -->
    </div>

    <div class="rule-section">
      <div class="section-title">3. 使用</div>
      <p class="rule-text">
        - 饭票为不记名卡，不挂失、不可用于兑换或提取现金、不具有透支功能。
      </p>
      <p class="rule-text">- 饭票内资金不产生利息或其他任何收益。</p>
      <p class="rule-text">- 饭票不设找零，不可充值。</p>
      <p class="rule-text">- 饭票仅可在购买门店使用。</p>
      <p class="rule-text">- 饭票内余额消耗完毕，该饭票即失效。</p>
      <p class="rule-text">
        - 饭票自购买日开始计算，有效期为一年，过期自动失效。
      </p>
    </div>

    <div class="rule-section">
      <div class="section-title">4.售后</div>
      <p class="rule-text">
        - 为保证交易公平和饭票的正常使用，一经使用不可退款。
      </p>
    </div>

    <div class="rule-section">
      <div class="section-title">5.发票</div>
      <p class="rule-text">- 发票问题请询问商家。</p>
    </div>

    <p class="disclaimer">* 本活动的最终解释权归时来饭票所有。</p>
  </div>
</template>

<script type="text/ecmascript-6">
export default {
  setup() {},
  onShow() {
    uni.setStorageSync("viewRules", true);
  },
  onHide() {
    setTimeout(() => {
      uni.setStorageSync("viewRules", false);
    }, 500);
  },
  onUnload() {
    setTimeout(() => {
      uni.setStorageSync("viewRules", false);
    }, 500);
  },
};
</script>

<style>
page {
  background: #f8f8f8;
}
</style>

<style scoped lang="stylus" rel="stylesheet/stylus">
.fanpiao-rules {
  width: 100%;

  .title-wrapper {
    display: flex;
    align-items: center;
    padding: 15px 10px;

    .title-icon {
      width: 18px;
      height: 18px;
    }

    .title {
      font-size: $font-size-15;
      font-weight: bold;
      margin-left: 5px;
    }
  }

  .rule-section {
    padding: 0px 20px;
    margin-bottom: 20px;

    .section-title {
      font-size: $font-size-15;
      margin-bottom: 10px;
      font-weight: bold;
    }

    .rule-text {
      font-size: $font-size-13;
      line-height: 21px;
    }
  }

  .disclaimer {
    margin: 30px 0px 50px 20px;
    font-size: $font-size-13;
  }
}
</style>
