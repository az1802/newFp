<!--
 * @Author: sunjie
 * @Date: 2022-02-11 14:32:18
 * @LastEditors: sunj
 * @LastEditTime: 2022-02-18 18:18:21
 * @FilePath: /new-fanpiao-uniapp/src/package-menu/SkuModal/SkuModal.vue
-->
<template>
  <div class="modal-wrapper" v-show="showSkuModal">
    <div
      class="container"
      :class="[curSkuDish.childDishGroups.length > 0 ? 'higher' : '']"
    >
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
          :selectionType="curSkuDish.selectionType"
          :selCondimentsCount="selCondimentsCount"
        />
        <ChildDishList
          v-show="curSkuDish.childDishGroups.length > 0"
          :childDishGroups="curSkuDish.childDishGroups"
          :selChildDishes="selChildDishes"
        />
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
import { showToast } from "@utils";
import { cloneDeep } from "lodash";

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

    const { curSkuDish, showSkuModal, toggleShowSkuModal, selChildDishes } =
      useSkuDish();
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
      nval?.attrList.forEach((attrGroupItem) => {
        if (
          attrGroupItem.selType == "SINGLE" &&
          attrGroupItem?.attrs?.length > 0
        ) {
          selAttrIds.push(attrGroupItem.attrs[0].id); //单选默认选择第一个
        }
        attrGroupItem.attrs.forEach((attrItem) => {
          attrMap[attrItem.id] = attrItem;
        });
      });

      nval?.supplyCondiments.forEach((condimentItem) => {
        condimentMap[condimentItem.id] = condimentItem;
      });

      nval?.childDishGroups.forEach((childDishGroup) => {
        unref(selChildDishes)[childDishGroup.id] = [];
        if (childDishGroup.isFixed) {
          //处理固定分组的菜品
          childDishGroup?.childDishes.forEach((dishItem) => {
            let tempDish = cloneDeep(dishItem);
            if (tempDish.isSku) {
              //暂时未处理默认规格
              unref(selChildDishes)[childDishGroup.id].push(tempDish);
            } else {
              tempDish.quantity = 1;
              unref(selChildDishes)[childDishGroup.id].push(tempDish);
            }
          });
        }
      });
    });

    let totalPrice = computed(() => {
      let res = unref(curSkuDish).price || 0;

      selAttrIds.forEach((id) => {
        res += attrMap[id].reprice;
      });

      for (let key in selCondiments) {
        res += parseFloat(condimentMap[key].marketPrice * selCondiments[key]);
      }

      for (let key in unref(selChildDishes)) {
        let groupChildDishes = unref(selChildDishes)[key];
        groupChildDishes.forEach((dishItem) => {
          res += dishItem.price + (dishItem.addPrice || 0);
        });
      }

      return res;
    });

    let selCondimentsCount = computed(() => {
      return Object.values(selCondiments).reduce((total, item) => {
        return (total += item || 0);
      }, 0);
    });

    function checkSupplyCondimentsCount() {
      //检查加料数量
      let countNum = unref(selCondimentsCount);
      let { type, lowerLimit, upperLimit } = unref(curSkuDish).selectionType;

      if (type == "NUMBER_REQUIRED" || type == "NUMBER_RANGE") {
        if (countNum < lowerLimit) {
          showToast(
            `${
              type == "NUMBER_REQUIRED" ? "必须" : "至少"
            }选择${lowerLimit}加料`
          );
          return false;
        } else if (countNum > upperLimit) {
          return false;
        }
      }
      return true;
    }
    function selOK() {
      let dishInfo = unref(curSkuDish),
        attrs = [],
        supplyCondiments = [],
        childDishes = [];

      // TODO 根据属性组别调整属性的顺序
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

      if (!checkSupplyCondimentsCount()) {
        return;
      }

      for (let groupId in unref(selChildDishes)) {
        let groupDishes = unref(selChildDishes)[groupId];
        childDishes.push(...groupDishes);
      }

      Object.assign(dishInfo, {
        attrs,
        supplyCondiments,
        childDishes,
      });
      addDish(dishInfo);
      toggleShowSkuModal(false);
    }

    return {
      selAttrIds,
      selCondiments,
      selChildDishes,
      curSkuDish,
      showSkuModal,
      totalPrice,
      fenToYuan,
      toggleShowSkuModal,
      selCondimentsCount,
      selOK,
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
  &.higher {
    height: max(70%, 700px);
    .other-info {
      height: calc(max(70%, 700px) - 50px - 100px - 45px);
    }
  }
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