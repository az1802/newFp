<!--
 * @Author: sunjie
 * @Date: 2022-02-11 14:32:18
 * @LastEditors: sunj
 * @LastEditTime: 2022-02-18 18:18:21
 * @FilePath: /new-fanpiao-uniapp/src/package-menu/SkuModal/SkuModal.vue
-->
<template>
  <div class="modal-wrapper" v-show="showSkuModal">
    <div class="container">
      <div class="dish-info">
        <img
          :src="curSkuDish.thumbImage"
          alt=""
          class="img"
          mode="aspectFill"
        />
        <div class="info">
          <div class="name">{{ curSkuDish.name }}</div>
          <div class="price">{{ fenToYuan(totalPrice) }}</div>
        </div>
      </div>
      <scroll-view class="other-info" scroll-y="true">
        <AttrGroupList
          v-show="curSkuDish.attrList.length > 0"
          :attrGroupList="curSkuDish.attrList"
          v-model:selAttrIds="selAttrIds"
        />
        <SupplyCondimentList
          v-show="curSkuDish.supplyCondiments.length > 0"
          :condimentList="curSkuDish.supplyCondiments"
          :selCondiments="selCondiments"
        />
        <ChildDishList v-show="curSkuDish.childDishGroups.length > 0" />
      </scroll-view>
      <div class="sel-ok-btn" @click="selOK">选好了</div>
      <span
        class="iconfont icon-guanbi2"
        @click="toggleShowSkuModal(false)"
      ></span>
    </div>
  </div>
</template>
<script>
import AttrGroupList from "./AttrGroupList.vue";
import SupplyCondimentList from "./SupplyCondimentList.vue";
import ChildDishList from "./ChildDishList.vue";
import { useSkuDish, useDish } from "@hooks/menuHooks";
import { useTransformPrice } from "@hooks/commonHooks";
import { reactive, watch, watchEffect, ref, computed, toRaw, unref } from "vue";

export default {
  components: {
    AttrGroupList,
    SupplyCondimentList,
    ChildDishList,
  },
  props: {
    skuDish: {
      type: Object,
      default: {},
    },
    showModal: {
      type: Boolean,
      default: false,
    },
  },
  setup(props) {
    let selAttrIds = reactive([]);
    let selCondiments = reactive({});
    let childDishList = reactive([]);

    const { curSkuDish, showSkuModal, toggleShowSkuModal } = useSkuDish();
    const { addDish } = useDish();
    let { fenToYuan } = useTransformPrice();

    const attrMap = {},
      condimentMap = {};
    watch(curSkuDish, (nval) => {
      //规格菜变化时重置属性和加料的选项
      selAttrIds.splice(0, selAttrIds.length);
      for (let key in selCondiments) {
        delete selCondiments[key];
      }

      nval.attrList.forEach((attrGroupItem) => {
        attrGroupItem.attrs.forEach((attrItem) => {
          attrMap[attrItem.id] = attrItem;
        });
      });

      nval.supplyCondiments.forEach((condimentItem) => {
        condimentMap[condimentItem.id] = condimentItem;
      });
    });

    let totalPrice = computed(() => {
      let res = curSkuDish.value.price || 0;

      selAttrIds.forEach((id) => {
        res += attrMap[id].reprice;
      });

      for (let key in selCondiments) {
        res += parseFloat(condimentMap[key].marketPrice * selCondiments[key]);
      }
      return res;
    });

    return {
      selAttrIds,
      selCondiments,
      curSkuDish,
      showSkuModal,
      totalPrice,
      fenToYuan,
      toggleShowSkuModal,
      selOK() {
        let dishInfo = unref(curSkuDish),
          attrs = [],
          supplyCondiments = [];
        selAttrIds.forEach((id) => {
          attrs.push(attrMap[id]);
        });

        for (let key in selCondiments) {
          supplyCondiments.push(
            Object.assign(condimentMap[key], {
              quantity: selCondiments[key],
            })
          );
        }

        Object.assign(dishInfo, {
          attrs,
          supplyCondiments,
        });

        addDish(dishInfo);

        toggleShowSkuModal(false);
      },
    };
  },
};
</script>
<style lang="less" scoped>
@import "@design/index.less";
.container {
  .box-size(100%,500px);
  .pos-bl-absolute();
  border-radius: 10px 10px 0 0;
  padding: 20px 12px 30px 12px;
  .dish-info {
    display: flex;
    margin-bottom: 20px;
    .img {
      .box-size(80px,80px,#eee);
      border-radius: 3px;
      overflow: hidden;
      margin-right: 10px;
    }
    .info {
      .flex-between(column);
      .name {
        .bold-font(17px,#333);
      }
      .price {
        .bold-font(17px,#f25643);
        .price-symbol();
      }
    }
  }
  .other-info {
    height: calc(500px - 50px - 100px - 45px);
  }
  .icon-guanbi2 {
    .pos-tr-absolute(20px,20px);
    .normal-font(24px,#ccc);
  }
  .sel-ok-btn {
    .box-size(100%,45px);
    .btn(45px);
    .bold-font(19px,white);
  }
}
</style>