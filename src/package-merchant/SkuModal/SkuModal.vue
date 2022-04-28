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
      <div
        class="sel-ok-btn"
        :class="canAddComboDish ? 'enabled' : 'disabled'"
        @click="selOK"
      >
        选好了
      </div>
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
import { reactive, watch, watchEffect, ref, computed, toRaw, unref } from "vue";
import { showToast, fenToYuan, checkChildDishGroupCount } from "@utils";

export default {
  components: {
    AttrGroupList,
    SupplyCondimentList,
    ChildDishList,
  },
  props: {},
  setup(props) {
    let selAttrIds = reactive([]);
    let selCondiments = reactive({});
    let childDishList = reactive([]);
    let skuDishInfo = ref({});

    const {
      curSkuDish,
      showSkuModal,
      toggleShowSkuModal,
      selChildDishes,
      resetSelChildDishes,
    } = useSkuDish();

    const { addDish } = useDish();

    let attrMap = {},
      condimentMap = {};

    function resetData() {
      //重置内部选择对象
      attrMap = {};
      condimentMap = {};
      selAttrIds.splice(0, selAttrIds.length);
      childDishList.splice(0, childDishList.length);
      for (let key in selCondiments) {
        delete selCondiments[key];
      }
      resetSelChildDishes();
    }
    watch(curSkuDish, (nval) => {
      resetData();
      skuDishInfo.value = JSON.parse(JSON.stringify(toRaw(nval)));

      //选择规格菜的默认属性以及生成属性map结构
      skuDishInfo.value?.attrList.forEach((attrGroupItem) => {
        if (
          (attrGroupItem.selType == "SINGLE" ||
            attrGroupItem.selType == "MULTI_MUST") &&
          attrGroupItem?.attrs?.length > 0
        ) {
          selAttrIds.push(attrGroupItem.attrs[0].id); //单选默认选择第一个
        }
        attrGroupItem.attrs.forEach((attrItem) => {
          attrMap[attrItem.id] = JSON.parse(JSON.stringify(attrItem));
        });
      });

      skuDishInfo.value?.supplyCondiments.forEach((condimentItem) => {
        condimentMap[condimentItem.id] = condimentItem;
      });

      skuDishInfo.value?.childDishGroups.forEach(
        (childDishGroup, childGroupIndex) => {
          unref(selChildDishes)[childDishGroup.id] = []; //存储子菜的选择
          childDishGroup?.childDishes.forEach((dishItem) => {
            let tempDish = JSON.parse(JSON.stringify(dishItem));
            //
            if (tempDish.isSku) {
              //暂时未处理默认规格
              let tempSelAttrIds = [],
                tempSelAttrs = [],
                addPrice = 0;
              tempDish?.attrList.forEach((attrGroupItem) => {
                if (
                  (attrGroupItem.selType == "SINGLE" ||
                    attrGroupItem.selType == "MULTI_MUST") &&
                  attrGroupItem?.attrs?.length > 0
                ) {
                  let selAttrItem = attrGroupItem.attrs[0];
                  tempSelAttrIds.push(selAttrItem.id); //单选默认选择第一个
                  tempSelAttrs.push(selAttrItem);
                  addPrice += selAttrItem.reprice;
                }
              });

              tempDish.selAttrIds = tempSelAttrIds;
              tempDish.attrs = tempSelAttrs;
              tempDish.addPrice = addPrice; //子菜的加价
            }
            if (childDishGroup.isFixed) {
              //固定分组中加入
              tempDish.quantity = tempDish.quantityIncrement;
              tempDish.childDishGroupInfo = {
                groupIndex: childGroupIndex,
                groupId: childDishGroup.id,
              };
              unref(selChildDishes)[childDishGroup.id].push(tempDish);
            }
          });
        }
      );
    });

    let totalPrice = computed(() => {
      let res = unref(curSkuDish).price || 0;

      selAttrIds.forEach((id) => {
        //处理属性的加价
        res += attrMap[id].reprice;
      });

      for (let key in selCondiments) {
        //处理加料
        res += parseFloat(condimentMap[key].marketPrice * selCondiments[key]);
      }

      for (let key in unref(selChildDishes)) {
        //处理选中的子菜价格
        let groupChildDishes = unref(selChildDishes)[key];
        // price为菜品的加价  addPrice 是属性相关的价格 quantity 是
        groupChildDishes.forEach(({ price = 0, addPrice = 0, quantity }) => {
          res += (price + addPrice) * quantity;
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
      let { type, lowerLimit, upperLimit } = unref(skuDishInfo).selectionType;

      if (type == "NUMBER_REQUIRED" || type == "NUMBER_RANGE") {
        if (countNum < lowerLimit) {
          showToast(
            `${
              type == "NUMBER_REQUIRED" ? "必须" : "至少"
            }选择${lowerLimit}份加料`
          );
          return false;
        } else if (countNum > upperLimit) {
          return false;
        }
      }
      return true;
    }

    function selOK() {
      if (!unref(canAddComboDish)) {
        return;
      }
      let dishInfo = unref(skuDishInfo),
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

      if (
        dishInfo.childDishGroups.length > 0 &&
        !checkChildDishGroupCount(dishInfo)
      ) {
        return;
      }

      let oldChildGroups = dishInfo.childDishGroups || [];
      for (let groupId in unref(selChildDishes)) {
        let groupChildDishes = unref(selChildDishes)[groupId];
        oldChildGroups.forEach((groupItem) => {
          groupItem.childDishes = unref(selChildDishes)[groupItem.id] || [];
        });
        childDishes.push(...groupChildDishes);
      }

      Object.assign(dishInfo, {
        attrs,
        supplyCondiments,
        childDishes,
      });
      console.log("最终选中的套餐信息", dishInfo);
      addDish(dishInfo);
      toggleShowSkuModal(false);
    }

    const canAddComboDish = computed(() => {
      let res = true;

      let selChildDishesTemp = unref(selChildDishes);

      let { childDishGroups } = unref(skuDishInfo);
      if (!childDishGroups || childDishGroups.length == 0) {
        return true;
      }
      for (let key in selChildDishesTemp) {
        let selGrouoDishes = selChildDishesTemp[key];
        let groupInfoIndex = childDishGroups.findIndex(
          (item) => item.id == key
        );

        let { orderMin, orderMax, isFixed, childDishes } =
          childDishGroups[groupInfoIndex]; //找到当前子菜分组
        let selGrouoDishesCount = 0;
        selGrouoDishes.forEach((item) => {
          selGrouoDishesCount += item.quantity || 0;
        });
        if (
          !isFixed &&
          (selGrouoDishesCount < orderMin || selGrouoDishesCount > orderMax)
        ) {
          return false;
        }

        let isMustDishSel = childDishes.every((item) => {
          if (item.isMust) {
            //套餐里面必选菜的校验
            let mustDishIndex = selGrouoDishes.findIndex((selItem) => {
              return selItem.id == item.id;
            });
            return mustDishIndex != -1;
          }
          return true;
        });
        if (!isMustDishSel) {
          return false;
        }
      }
      return res;
    });

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
      canAddComboDish,
      skuDishInfo,
      curSkuDish,
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
  padding: 20px 0px 30px 0px;
  &.higher {
    height: max(70%, 700px);
    .other-info {
      height: calc(max(70%, 700px) - 50px - 100px - 45px);
    }
  }
  .dish-info {
    display: flex;
    margin-bottom: 20px;
    padding: 0 12px;
    box-sizing: border-box;
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
    &.disabled {
      opacity: 0.5;
    }
  }
}
</style>