<template>
  <div class="recommend-wrapper" v-if="dishList.length != 0">
    <div class="title">推荐菜展示</div>
    <div class="recommend">
      <scroll-view class="scroll" scroll-x scroll-with-animation>
        <div class="food-wrapper" v-for="(url, index) in dishList" :key="index">
          <img :src="url" alt="" class="picture" mode="aspectFill" />
        </div>
      </scroll-view>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    dishList: {
      type: Array,
      default: [],
    },
  },
  components: {},
  setup() {},
};
</script>
<style lang="less" scoped>
@import "@design/index.less";
.recommend-wrapper {
  .box-size(calc(100vw - 24px),unset);
  margin: 16px auto 0;
  border-radius: 8px;
  padding: 0px 12px;
  .title {
    .normal-font(14px);
    padding: 12px 12px 12px 0;
    .no-wrap();
  }
  .recommend {
    .scroll {
      white-space: nowrap;
      padding-bottom: 12px;
      .food-wrapper {
        .box-size(85px,85px,white);
        display: inline-block;
        margin-right: 8px;
        border-radius: 4px;
        border: 1px solid #f8f8f8;
        overflow: hidden;
        &:last-child {
          margin-right: 0px;
        }
        .picture {
          .box-size(85px,85px,white);
        }
      }
    }
  }
}
</style>