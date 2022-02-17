<!--
 * @Author: sunjie
 * @Date: 2022-02-10 16:05:56
 * @LastEditors: sunj
 * @LastEditTime: 2022-02-17 12:08:02
 * @FilePath: /new-fanpiao-uniapp/src/package-menu/DishItem/DishItem.vue
-->
<template>
  <div class="container">
    <div class="img-wrapper">
      <div class="placeholder" v-if="showPlaceHolder || !dish.thumbImage"></div>
      <img
        :src="dish.thumbImage"
        class="img"
        mode="aspectFill"
        lazy-load
        @load="imgLoaded"
      />
    </div>
    <div class="info">
      <div class="name">
        {{ dish.name }}
      </div>
      <div class="price">{{ fenToYuan(dish.price) }}</div>
    </div>
    <DishOperation :dishId="dish.id" :isSku="dish.isSku" />
  </div>
</template>
<script>
import DishOperation from "./DishOperation.vue";
import { ref, onMounted } from "vue";
import { useTransformPrice } from "@hooks/commonHooks";
export default {
  components: {
    DishOperation,
  },
  props: {
    dish: {
      type: Object,
      default: {},
    },
  },
  setup({ dish }) {
    let showPlaceHolder = ref(true);
    let { fenToYuan } = useTransformPrice();
    return {
      showPlaceHolder,
      imgLoaded(e) {
        showPlaceHolder.value = false;
      },
      fenToYuan,
    };
  },
};
</script>
<style lang="less" scoped>
@import "@design/index.less";
.container {
  display: flex;
  margin-bottom: 24px;
  position: relative;
  .img-wrapper {
    .box-size(86px,86px,#eee);
    position: relative;
    border-radius: 3px;
    overflow: hidden;
    margin-right: 10px;
    .placeholder {
      .box-size(100%,100%,#eee);
      .pos-absolute();
    }
    .img {
      .box-size(100%,100%);
    }
  }
  .info {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    .bold-font(16px,#333);
    .name {
      color: #333;
    }
    .price {
      color: #f25643;
    }
  }
}
</style>