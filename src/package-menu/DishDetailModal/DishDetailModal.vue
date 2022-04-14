<template>
  <div
    class="detail-modal"
    :class="showDishDetailModal ? 'fade-modal-enter-active' : 'hide'"
    @touchmove.stop="stop"
    @click.stop="hideModal"
  >
    <div
      class="detail-modal-wrapper"
      :class="
        showDishDetailModal ? 'up-modal-enter-active' : 'up-modal-leave-to'
      "
      @click.stop="stop"
    >
      <div class="picture-wrapper">
        <img
          :src="curDishDetail.image"
          alt=""
          class="picture"
          mode="aspectFill"
        />
        <img
          src="https://shilai-images.oss-cn-shenzhen.aliyuncs.com/staticImgs/common/icon-close_03.png"
          alt=""
          class="close"
          @click="hideModal"
        />
      </div>
      <div class="detail-wrapper">
        <div class="name-wrapper">
          <p class="name">{{ curDishDetail.name }}</p>
          <p class="desc"></p>
        </div>
        <div>
          <div
            class="count-container"
            v-if="
              !curDishDetail.attrList.length &&
              !curDishDetail.childDishGroups.length
            "
          >
            <div class="count-wrapper">
              <div class="reduce" :class="{ showQuantity: quantity }">
                <img
                  src="https://shilai-images.oss-cn-shenzhen.aliyuncs.com/staticImgs/common/icon-reduce-cart.png"
                  alt=""
                  class="icon"
                  @click="reduceCart"
                />
                <p class="count">{{ quantity }}</p>
              </div>
            </div>
            <img
              src="https://shilai-images.oss-cn-shenzhen.aliyuncs.com/staticImgs/common/icon-add-cart.png"
              alt=""
              class="add-cart"
              @click="addCart"
            />
          </div>
          <div
            class="sku"
            v-if="curDishDetail.attrList.length"
            @click="selectSku"
          >
            选规格<span v-if="quantity" class="quantity">{{ quantity }}</span>
          </div>
          <div
            class="sku"
            v-if="curDishDetail.childDishGroups.length"
            @click.stop="selectComboSku"
          >
            选规格<span v-if="quantity" class="quantity">{{ quantity }}</span>
          </div>
        </div>
      </div>
      <p class="price">{{ curDishDetail.price / 100 }}</p>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
import { ref, computed, unref } from "vue";
import { useDishDetail, useDish, useSkuDish } from "@hooks/menuHooks";

import { getDishInfoById } from "@utils";
export default {
  setup() {
    let { addDish, reduceDish, dishCountMap } = useDish();
    let { showDishDetailModal, curDishDetail, toggleShowDishDetailModal } =
      useDishDetail();
    let { setCurSkuDish, toggleShowSkuModal } = useSkuDish();
    let quantity = computed(() => {
      let dishId = unref(curDishDetail).id;
      return unref(dishCountMap)[dishId] || 0;
    });
    return {
      curDishDetail,
      showDishDetailModal,
      hideModal() {
        toggleShowDishDetailModal(false);
      },
      stop() {
        return "";
      },
      quantity,
      reduceCart() {
        let dishId = unref(curDishDetail).id || "";

        reduceDish(dishId);
      },
      addCart() {
        let dishInfo = getDishInfoById(unref(curDishDetail).id);
        addDish(dishInfo);
      },
      selectSku() {
        let dishInfo = getDishInfoById(unref(curDishDetail).id);
        setCurSkuDish(dishInfo);
        toggleShowDishDetailModal(false);
        toggleShowSkuModal(true);
      },
    };
  },
};
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
.detail-modal {
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: -100;
  background: rgba(0, 0, 0, 0.5);

  &.fade-modal-enter-active {
    display: flex;
    z-index: 100;
  }

  &.hide-modal {
    opacity: 0;
    transition: all 0.5s;
    z-index: -100;
  }

  .detail-modal-wrapper {
    position: fixed;
    left: 0;
    right: 0;
    bottom: 0;
    box-sizing: border-box;
    border-radius: 10px 10px 0 0;
    overflow: hidden;
    background: white;

    .picture-wrapper {
      position: relative;
      width: 100vw;
      height: 100vw;

      .picture {
        display: block;
        width: 100vw;
        height: 100vw;
        background: lightgray;
      }

      .close {
        position: absolute;
        top: 13px;
        right: 13px;
        display: block;
        width: 33px;
        height: 33px;
      }
    }

    .detail-wrapper {
      display: flex;
      justify-content: space-between;
      padding: 20px 12px 0;

      .name-wrapper {
        flex: 1;
        overflow: hidden;

        .name {
          font-size: 18px;
          line-height: 23px;
        }

        .desc {
          font-size: 14px;
          color: #999999;
        }
      }

      .count-container {
        display: flex;
        align-items: center;

        .count-wrapper {
          overflow: hidden;

          .reduce {
            display: flex;
            align-items: center;
            opacity: 0.3;
            transform: translate3d(150%, 0, 0);
            transition: all 0.4s;

            &.showQuantity {
              opacity: 1;
              transform: translate3d(0, 0, 0);
            }

            .icon {
              width: 23px;
              height: 23px;
              // padding: 5px 5px 0
              border: 5px solid transparent;
              border-bottom: 0px solid transparent;
            }

            .count {
              width: 30px;
              padding-top: 5px;
              text-align: center;
            }
          }
        }

        .add-cart {
          width: 23px;
          height: 23px;
          // padding: 5px 5px 0
          border: 5px solid transparent;
          border-bottom: 0px solid transparent;
        }
      }

      .sku {
        position: relative;
        height: 27px;
        line-height: 27px;
        padding: 0 10px;
        border-radius: 13px;
        font-size: 14px;
        color: white;
        background: #F25643;

        .quantity {
          position: absolute;
          top: -8px;
          right: 0;
          width: 15px;
          height: 15px;
          border-radius: 100%;
          border: 1px solid white;
          line-height: 15px;
          text-align: center;
          font-size: 11px;
          color: white;
          background: #F25643;
        }
      }
    }

    .price {
      margin-top: 30px;
      padding-left: 12px;
      padding-bottom: 48px;
      font-family: 'PingFangSC-Medium';
      font-size: 24px;
      color: #F25643;

      &::before {
        display: inline-block;
        content: '¥';
        font-size: 16px;
      }
    }
  }
}
</style>
