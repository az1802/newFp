<!--
 * @Descripttion: 
 * @version: 
 * @Author: xinguangding
 * @Date: 2021-07-29 12:27:08
 * @LastEditors: xinguangding
 * @LastEditTime: 2021-08-18 14:57:59
-->
<template>
  <div
    class="empty-status"
    :class="{ couponEmpty: type == 'coupon' }"
    :style="{ padding: padding + 'px 0' }"
  >
    <p v-if="type === 'unLogin'" class="content">暂未登录</p>
    <p v-if="type === 'memberCard'" class="content">暂未领取会员卡</p>
    <p v-if="type === 'dining'" class="content">暂无饭局</p>
    <div v-if="type === 'coupon'" class="content coupon">
      <img
        src="https://shilai-images.oss-cn-shenzhen.aliyuncs.com/staticImgs/common/none-tooltip_02.png"
        alt=""
      />
      <div class="text">{{ content }}</div>
    </div>
    <p v-if="type === 'order'" class="content">暂无订单</p>
    <p v-if="type === 'private'" class="content">{{ content }}</p>
    <p v-if="type === 'feedStats'" class="content">暂无投喂</p>
    <div v-if="type === 'fanpiao'" class="content fanpiao">
      <img
        src="https://shilai-images.oss-cn-shenzhen.aliyuncs.com/staticImgs/common/none-tooltip_02.png"
        alt=""
      />
      <div class="text">{{ content }}</div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
export default {
  props: {
    type: String,
    padding: String,
    content: String,
  },
};
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
.empty-status {
  width: 100%;
  padding: 50px 0;

  &.couponEmpty {
    padding: 40px 0 15px 0;
  }

  .content {
    text-align: center;
    font-size: 15px;

    &.coupon, &.fanpiao {
      .text {
        text-align: center;
        font-size: 14px;
        color: #999999;
        padding-top: 10px;
      }

      img {
        width: 315px;
        height: 195px;
      }
    }
  }
}
</style>
