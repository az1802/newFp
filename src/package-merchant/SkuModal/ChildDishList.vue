<!--
 * @Author: sunjie
 * @Date: 2022-02-14 18:34:48
 * @LastEditors: sunj
 * @LastEditTime: 2022-02-14 18:34:49
 * @FilePath: /new-fanpiao-uniapp/src/package-menu/SkuModal/ChildDishList.vue
-->
<template>
  <div>
    <div
      v-for="groupItem in childDishGroups"
      class="child-group-container"
      :key="groupItem.id"
    >
      <div class="title">
        <div class="group-name">
          {{ groupItem.groupName }} {{ selRangeText(groupItem) }}
        </div>
        <div v-if="!groupItem.isFixed" class="sel-text-wrapper">
          <div class="sel-text">
            已选
            <div class="count">
              {{ dishSelMap[groupItem.id].childTotalCount || 0 }}
            </div>
            份/
          </div>
          <div class="range-text">{{ genRangeText(groupItem) }}</div>
        </div>
      </div>
      <div class="child-dishes-list">
        <div
          class="child-dish-item"
          v-for="dishItem in groupItem.childDishes"
          :key="dishItem.id"
          :class="[
            dishItem.status == 'NOT_IN_TIME_LIMIT_SALE' ? 'time-limit-out' : '',
            dishItem.status == 'SOLD_OUT' ? 'sold-out' : '',
          ]"
        >
          <div class="name">
            {{ dishItem.name }}
            <div
              class="price-tag"
              v-if="
                dishSelMap[groupItem.id].childAddPriceMap[dishItem.customId] ||
                dishItem.price
              "
            >
              +¥{{
                (dishSelMap[groupItem.id].childAddPriceMap[dishItem.customId] ||
                  dishItem.price) / 100
              }}
            </div>
          </div>
          <div class="operation">
            <div
              class="is-must"
              v-if="
                dishItem.isMust &&
                dishItem.status == 'NORMAL' &&
                !dishSelMap[groupItem.id].childCountMap[dishItem.customId]
              "
            >
              必选
            </div>
            <div
              class="status"
              v-if="dishItem.status == 'NOT_IN_TIME_LIMIT_SALE'"
            >
              不在可售卖时间
              <text
                class="cuIcon-question"
                @click.stop="showTimeLimitSaleTooltip"
              ></text>
            </div>
            <div
              v-else-if="
                dishItem.status == 'SOLD_OUT' || dishItem.status == 'GUQING'
              "
              class="status"
            >
              已售罄
            </div>
            <div v-else-if="groupItem.isFixed" class="fixed-operation">
              <div v-if="!dishItem.isSku" class="fixed-quantity">
                {{
                  dishSelMap[groupItem.id].childCountMap[dishItem.customId] || 1
                }}
              </div>
              <div v-else class="mod-sku" @click="modSku(groupItem, dishItem)">
                修改规格
                <div class="num-tag">
                  {{
                    dishSelMap[groupItem.id].childCountMap[dishItem.customId] ||
                    1
                  }}
                </div>
              </div>
            </div>
            <DishOperation
              v-else
              :disableAdd="
                dishSelMap[groupItem.id].childTotalCount ==
                  groupItem.orderMax ||
                (!groupItem.allowDuplicate &&
                  dishSelMap[groupItem.id].childCountMap[dishItem.customId] >=
                    1)
              "
              :quantity="
                dishSelMap[groupItem.id].childCountMap[dishItem.customId]
              "
              @add="addChildDish(groupItem, dishItem)"
              @reduce="reduceChildDish(groupItem, dishItem)"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import DishOperation from "../Common/DishOperation.vue";
import { useSkuDish, useDish } from "@hooks/menuHooks";
import { reactive, watch, watchEffect, ref, computed, toRaw, unref } from "vue";
import { showToast, fenToYuan } from "@utils";
import { cloneDeep } from "@utils";
export default {
  components: {
    DishOperation,
  },
  props: {
    childDishGroups: {
      type: Array,
      default: [],
    },
    selChildDishes: {
      type: Object,
      default: {},
    },
    skuDishInfo: {
      type: Object,
      default: {},
    },
  },
  setup(props) {
    const { setCurChildSkuDish, toggleShowChildSkuModal } = useSkuDish();

    function genRangeText({ orderMin, orderMax }) {
      if (orderMin === orderMax) {
        return `选${orderMin}份`;
      } else if (orderMin === 0) {
        return `至多选${orderMax}份`;
      } else {
        return `选${orderMin}-${orderMax}份`;
      }
    }

    let dishSelMap = computed(() => {
      let selChildDishes = props.selChildDishes;
      let res = {};
      for (let key in selChildDishes) {
        res[key] = {
          childTotalCount: 0,
          childCountMap: {},
          childAddPriceMap: {},
        };
        selChildDishes[key]?.forEach((item) => {
          if (!res[key].childCountMap[item.customId]) {
            res[key].childCountMap[item.customId] = 0;
          }
          if (!res[key].childAddPriceMap[item.customId]) {
            res[key].childAddPriceMap[item.customId] = 0;
          }

          res[key].childCountMap[item.customId] += item.quantity || 0; //单个紫菜的数量
          res[key].childTotalCount += item.quantity || 0; //子菜总数量

          res[key].childAddPriceMap[item.customId] +=
            (item.addPrice || 0) * item.quantity; //子菜总价的计算
        });
      }
      return res;
    });

    function showTimeLimitSaleTooltip() {
      console.log("显示不可售卖原因");
    }

    function addChildDish({ id, orderMax, orderMin }, childDishInfo) {
      if (unref(dishSelMap)[id].childTotalCount >= orderMax) {
        return;
      }
      if (childDishInfo.isSku) {
        // 添加规格菜
        childDishInfo.groupId = id;
        setCurChildSkuDish(childDishInfo);
        toggleShowChildSkuModal(true);
      } else {
        let selChildDishes = props.selChildDishes;
        let selGroupChilDish = selChildDishes[id];
        let index = selGroupChilDish.findIndex(
          (item) => item.id == childDishInfo.id
        );
        if (index != -1) {
          selGroupChilDish[index].quantity += 1;
        } else {
          let cloneDishInfo = cloneDeep(childDishInfo);
          cloneDishInfo.quantity = 1;
          cloneDishInfo.groupId = id;
          selGroupChilDish.push(cloneDishInfo);
        }
      }
    }
    function reduceChildDish({ id, orderMin }, childDishInfo) {
      // if (unref(dishSelMap)[id].childTotalCount <= orderMin) {  //数量不够在最终添加时校验
      //   return;
      // }
      let selChildDishes = props.selChildDishes;
      let selGroupChilDish = selChildDishes[id];
      let index = selGroupChilDish.findIndex(
        (item) => item.id == childDishInfo.id
      );
      if (index != -1) {
        if (selGroupChilDish[index].quantity == 1) {
          selGroupChilDish.splice(index, 1);
        } else {
          selGroupChilDish[index].quantity -= 1;
        }
      }
    }

    function modSku(group, childDishInfo) {
      let { id } = group;
      let temp = JSON.parse(JSON.stringify(childDishInfo));
      temp.groupId = id;
      if (group.isFixed) {
        temp.isFixed = true;
      }
      setCurChildSkuDish(temp);
      toggleShowChildSkuModal(true);
    }

    function selRangeText(group) {
      let text = "";
      if (group.isFixed) {
        let num = 0;
        group.childDishes.forEach((item) => {
          num += item.quantityIncrement;
        });
        return `必选${num}份`;
      } else {
        text = `(${
          group.orderMax != group.orderMin
            ? "可选" + group.orderMin + "-"
            : "必选"
        }${group.orderMax}份)`;
      }
      return text;
    }

    return {
      dishSelMap,
      genRangeText,
      showTimeLimitSaleTooltip,
      addChildDish,
      reduceChildDish,
      modSku,
      selRangeText,
    };
  },
};
</script>
<style lang="less">
@import "@design/index.less";
.child-group-container {
  margin-top: 20px;
  .title {
    .flex-simple(flex-start,center);
    .box-size(100%,21px);
    margin-bottom: 4px;
    padding: 0 12px;
    .group-name {
      .normal-font(12px,#999);
    }
    .sel-text-wrapper {
      display: flex;
    }
    .sel-text {
      .normal-font(12px,#999);
      display: flex;
      margin-left: 10px;
      .count {
        color: #f25643;
      }
    }
    .range-text {
      .normal-font(12px,#999);
    }
  }
  .child-dishes-list {
    .child-dish-item {
      .flex-simple(space-between,center);
      .line-center(36px);
      position: relative;
      padding: 0 12px;
      &.time-limit-out,
      &.sold-out {
        background: #f8f8f8;
        .name {
          color: #999;
          font-weight: bold;
          .price-tag {
            border: 1px solid #999;
            color: #999;
          }
        }
        .operation .status {
          color: #999;
        }
      }
      .name {
        .bold-font(14px,#333);
        .price-tag {
          display: inline-block;
          .line-center(14px);
          .normal-font(12px,#333);
          margin-left: 8px;
          border-radius: 2px;
          border: 1px solid #333;
          padding: 0 6px;
        }
      }
      .operation {
        .box-size(unset,100%);
        position: relative;
        min-width: 120px;
        .is-must {
          .box-size(38px,18px,transparent);
          .line-center(18px);
          .normal-font(11px,#f2513c);
          .pos-tr-absolute(7px,25px);
          text-align: center;
          border: 1px solid #f2513c;
          margin-right: 8px;
        }
        .status {
          text-align: right;
          background: #f8f8f8;
          color: #666;
        }
        .fixed-operation {
          .flex-simple(flex-end,center);
          .fixed-quantity {
            margin-right: 8px;
          }
          .mod-sku {
            .box-size(60px,25px,#f2513c);
            .line-center(25px);
            .normal-font(12px,white);
            display: inline-block;
            text-align: center;
            position: relative;
            border-radius: 25px;
            .num-tag {
              .box-size(14px,14px,#f2513c);
              .line-center(14px);
              .normal-font(10px,white);
              .pos-tr-absolute(-7.5px,0);
              display: inline-block;
              border-radius: 50%;
            }
          }
        }
      }
    }
  }
}
</style>