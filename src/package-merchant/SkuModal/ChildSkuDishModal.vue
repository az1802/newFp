<!--
 * @Author: sunjie
 * @Date: 2022-02-11 14:32:18
 * @LastEditors: sunj
 * @LastEditTime: 2022-02-18 18:18:21
 * @FilePath: /new-fanpiao-uniapp/src/package-menu/SkuModal/SkuModal.vue
-->
<template>
  <div class="modal-wrapper" v-if="showChildSkuDishModal">
    <div class="container higher">
      <div class="dish-info">
        <img
          :src="curChildSkuDish.thumbImage"
          alt=""
          class="img"
          mode="aspectFill"
        />
        <div class="info">
          <div class="name">{{ curChildSkuDish.name }}</div>
          <div class="price">{{ fenToYuan(totalPrice) }}</div>
        </div>
      </div>
      <scroll-view class="other-info" scroll-y="true">
        <AttrGroupList
          v-if="curChildSkuDish.attrList.length > 0"
          :attrGroupList="curChildSkuDish.attrList"
          v-model:selAttrIds="selAttrIds"
        />
        <SupplyCondimentList
          v-if="curChildSkuDish.supplyCondiments.length > 0"
          :condimentList="curChildSkuDish.supplyCondiments"
          :selCondiments="selCondiments"
          :selectionType="curChildSkuDish.selectionType"
          :selCondimentsCount="selCondimentsCount"
        />
      </scroll-view>
      <div class="sel-ok-btn" @click="selOk">选好了</div>
      <div class="iconfont icon-guanbi2" @click.stop="closeModal"></div>
    </div>
  </div>
</template>
<script>
import AttrGroupList from "./AttrGroupList.vue";
import SupplyCondimentList from "./SupplyCondimentList.vue";
import { useSkuDish, useDish } from "@hooks/menuHooks";
import { reactive, watch, watchEffect, ref, computed, toRaw, unref } from "vue";
import { showToast, fenToYuan } from "@utils";

export default {
  components: {
    AttrGroupList,
    SupplyCondimentList,
  },
  setup(props) {
    let selAttrIds = reactive([]);
    let selCondiments = reactive({});

    const {
      curChildSkuDish,
      showChildSkuDishModal,
      toggleShowChildSkuModal,
      selChildDishes,
    } = useSkuDish();

    let attrMap = {},
      condimentMap = {};

    function resetData() {
      selAttrIds.splice(0, selAttrIds.length);
      for (let key in selCondiments) {
        delete selCondiments[key];
      }
      attrMap = {};
      condimentMap = {};
    }
    watch(curChildSkuDish, (nval) => {
      //重置组建内部数据以及选中默认的属性和加料
      resetData();
      nval.attrList.forEach((attrGroupItem) => {
        if (
          (attrGroupItem.selType == "SINGLE" ||
            attrGroupItem.selType == "MULTI_MUST") &&
          attrGroupItem?.attrs?.length > 0
        ) {
          selAttrIds.push(attrGroupItem.attrs[0].id); //单选默认选择第一个
        }
        attrGroupItem.attrs.forEach((attrItem) => {
          attrMap[attrItem.id] = attrItem;
        });
      });
      nval.supplyCondiments.forEach((condimentItem) => {
        condimentMap[condimentItem.id] = condimentItem;
      });
    });

    let totalPrice = computed(() => {
      let res = unref(curChildSkuDish).price || 0;

      selAttrIds.forEach((id) => {
        res += attrMap[id].reprice;
      });

      for (let key in selCondiments) {
        res += parseFloat(condimentMap[key].marketPrice * selCondiments[key]);
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
      let { type, lowerLimit, upperLimit } =
        unref(curChildSkuDish).selectionType;

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
    function selOk() {
      let dishInfo = JSON.parse(JSON.stringify(unref(curChildSkuDish))),
        attrs = [],
        supplyCondiments = [];

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

      dishInfo.quantity = dishInfo.quantityIncrement || 1;
      dishInfo.addPrice = unref(totalPrice);
      dishInfo.attrs = attrs;
      dishInfo.supplyCondiments = supplyCondiments;

      let selGroupChilDish = unref(selChildDishes)[dishInfo.groupId];

      if (!dishInfo.isFixed) {
        //非固定组直接做增加处理
        //添加
        selGroupChilDish.push(dishInfo);
      } else {
        //修改

        let index = selGroupChilDish.findIndex((item) => {
          return item.customId == dishInfo.customId;
        });
        if (index == -1) {
          selGroupChilDish.push(dishInfo);
        } else {
          selGroupChilDish.splice(index, 1, dishInfo);
        }
      }

      toggleShowChildSkuModal(false);
    }

    return {
      selAttrIds,
      selCondiments,
      curChildSkuDish,
      showChildSkuDishModal,
      totalPrice,
      fenToYuan,
      toggleShowChildSkuModal,
      selCondimentsCount,
      selOk,
      closeModal() {
        toggleShowChildSkuModal(false);
      },
    };
  },
  watch: {
    showChildSkuDishModal(nval) {
      if (nval) {
        setTimeout(() => {
          this.$forceUpdate();
        }, 40);
      }
    },
  },
};
</script>
<style lang="less" scoped>
@import "@design/index.less";
.modal-wrapper {
  z-index: 1000;
}
.container {
  .box-size(100%,500px);
  .pos-bl-absolute();
  border-radius: 10px 10px 0 0;
  padding: 20px 12px 30px 12px;
  &.higher {
    height: max(70%, 600px);
    .other-info {
      height: calc(max(70%, 600px) - 50px - 100px - 45px);
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
    display: inline-block;
    z-index: 1000;
  }
  .sel-ok-btn {
    .box-size(100%,45px);
    .btn(45px);
    .bold-font(19px,white);
  }
}
</style>