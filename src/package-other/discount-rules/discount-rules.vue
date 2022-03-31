<template>
  <div class="discount-rules">
    <NavigationBar title="活动规则" />
    <div class="title-wrapper">
      <p class="title">饭票支付</p>
    </div>

    <div class="rule-section">
      <div class="section-title">一、商品</div>
      <p class="rule-text">(1) 使用饭票支付订单时，可享受规定的折扣价。</p>
      <p class="rule-text">
        (2) 使用饭票支付的订单发生退款时，饭票支付部分也将退回到原饭票中。
      </p>
      <p class="rule-text">
        (3) 使用多张饭票支付时，优先扣除面额较小的饭票余额。
      </p>
      <p class="rule-text">
        (4) 饭票支付不支持和微信支付、支付宝支付、红包支付合并结算。
      </p>
      <p class="rule-text">
        (5) 饭票支付与随机立减、优惠券等其他优惠方式互斥，不可同时使用。
      </p>
    </div>
    <div class="rule-section">
      <div class="section-title">二、购买</div>
      <p class="rule-text">(1) 饭票价格以人民币表示。</p>
      <!-- #ifdef MP-WEIXIN -->
      <p class="rule-text">(2) 用户购买饭票需通过微信平台付款。</p>
      <!-- #endif -->
      <!-- #ifdef MP-ALIPAY -->
      <p class="rule-text">(2) 用户购买饭票需通过支付宝平台付款。</p>
      <!-- #endif -->
    </div>
    <div class="rule-section">
      <div class="section-title">三、使用</div>
      <p class="rule-text">
        (1) 饭票为不记名卡，不挂失、不可用于兑换或提取现金、不具有透支功能。
      </p>
      <p class="rule-text">(2) 饭票内资金不产生利息或其他任何收益。</p>
      <p class="rule-text">(3) 饭票不设找零，不可充值。</p>
      <p class="rule-text">(4) 饭票仅可在购买门店使用。</p>
      <p class="rule-text">(5) 饭票内余额消耗完毕，该饭票即失效。</p>
      <p class="rule-text">
        (6) 饭票自购买日开始计算，有效期为一年，过期自动失效。
      </p>
    </div>
    <div class="rule-section">
      <div class="section-title">四、售后</div>
      <p class="rule-text">
        (1) 为保证交易公平和饭票的正常使用，一经使用不可退款。
      </p>
    </div>
    <div class="rule-section">
      <div class="section-title">五、发票</div>
      <p class="rule-text">(1) 发票问题请询问商家。</p>
      <p class="rule-text">*本活动的最终解释权归时来饭票所有。</p>
    </div>

    <div class="title-wrapper">
      <p class="title">红包支付</p>
    </div>
    <div class="rule-section">
      <div class="section-title">使用红包支付需满足以下条件</div>
      <p class="rule-text">(1) 红包余额大于本次消费订单金额</p>
      <p class="rule-text">
        (2) 仅通过时来饭票小程序扫码点餐使用，下单人微信、红包持有人的微信需一致
      </p>
      <p class="rule-text" style="color: #333333">
        (3）红包支付不能与微信支付、饭票支付、商家会员储值合并结算
      </p>
    </div>

    <div class="rule-section">
      <div class="section-title common-question">常见问题</div>
      <p class="rule-text">
        (1）使用红包支付的订单发生退款时，红包支付部分将退回到原饭票余额中
      </p>
      <p class="rule-text">(2）红包可通过到店下单消费随机获取</p>
    </div>

    <div class="title-wrapper">
      <p class="title">会员支付</p>
    </div>
    <div class="rule-section">
      <div class="section-title">使用会员支付需满足以下条件</div>
      <p class="rule-text">(1) 已成为门店注册会员并授权手机号</p>
      <p class="rule-text">(2) 会员支付不能与折扣菜、券包优惠和饭票优惠同享</p>
    </div>

    <p class="disclaimer">* 本活动的最终解释权归时来饭票所有。</p>
  </div>
</template>

<script type="text/ecmascript-6">
export default {
  setup() {},
  onLoad(options) {},
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
<style scoped lang="stylus" rel="stylesheet/stylus">
.discount-rules {
  width: 100%;
  background-color: white;

  .title-wrapper {
    display: flex;
    align-items: center;
    padding: 20px 10px 12px 12px;

    .title-icon {
      width: 18px;
      height: 18px;
    }

    .title {
      font-size: $font-size-16;
      font-weight: bold;
    }
  }

  .rule-section {
    padding: 0px 12px;

    .section-title {
      line-height: 21px;
      font-size: $font-size-14;
      font-weight: bold;
      margin-bottom: 6px;

      &.common-question {
        margin-top: 8px;
      }
    }

    .rule-text {
      line-height: 24px;
      font-size: $font-size-14;
      margin-bottom: 6px;
      color: #666666;
    }
  }

  .disclaimer {
    padding: 20px 0px 40px 12px;
    font-size: $font-size-14;
    color: #333333;
  }
}
</style>
