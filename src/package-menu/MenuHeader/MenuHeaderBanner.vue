<!--
 * @Author: sunjie
 * @Date: 2022-02-15 17:01:20
 * @LastEditors: sunj
 * @LastEditTime: 2022-02-16 12:16:48
 * @FilePath: /new-fanpiao-uniapp/src/package-menu/MenuHeader/MenuHeaderBanner.vue
-->
<template>
  <div class="banner-container">
    <div class="banner">
      <img
        class="banner-background"
        src="https://shilai-images.oss-cn-shenzhen.aliyuncs.com/staticImgs/package-static/package-merchant/menu/fanpiaoBannerBackground_04.png"
        alt=""
      />
      <div class="fanpiao-discount">
        {{
          maxDiscountFanpiao.discount ? 100 - maxDiscountFanpiao.discount : ""
        }}
      </div>
    </div>
  </div>
</template>
<script>
import { useGetters } from "@utils/storeHooks";
export default {
  setup() {
    const { maxDiscountFanpiao } = useGetters("merchant", [
      "maxDiscountFanpiao",
    ]);

    return {
      maxDiscountFanpiao,
    };
  },
};
</script>
<style lang="less" scoped>
@import "@design/index.less";

.banner-container {
  .box-size(100%,104px);
  padding: 8px 12px 8px 12px;
  .banner {
    position: relative;
    .box-size();
    .banner-background {
      .fill-box();
    }
  }
  .fanpiao-discount {
    min-width: 34px;
    .pos-absolute(9.1%,59.6%);
    .bold-font(28px,#E62600);
  }
}
</style>