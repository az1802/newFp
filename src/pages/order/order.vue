<!--
 * @Author: sunjie
 * @Date: 2022-02-08 11:55:29
 * @LastEditors: sunj
 * @LastEditTime: 2022-02-08 13:54:34
 * @FilePath: /new-fanpiao-uniapp/src/pages/order/order.vue
-->

<template>
  <view class="content">
    <image class="logo" src="/static/logo.png"></image>
    <view class="text-area">
      <text class="title">{{ title }}123</text>
    </view>
    <TestA />
  </view>
</template>

<script>
export default {
  data() {
    return {
      title: "order",
    };
  },
  onLoad() {},
  methods: {},
};
</script>

<style>
.content {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.logo {
  height: 200rpx;
  width: 200rpx;
  margin-top: 200rpx;
  margin-left: auto;
  margin-right: auto;
  margin-bottom: 50rpx;
}

.text-area {
  display: flex;
  justify-content: center;
}

.title {
  font-size: 36rpx;
  color: #8f8f94;
}
</style>
