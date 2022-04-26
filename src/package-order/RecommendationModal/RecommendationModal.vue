<template>
  <div
    class="recommendation-modal"
    :class="isShow ? 'fade-modal-enter-active' : 'hide-modal'"
    @touchmove.stop="stop"
  >
    <div class="content-wrapper">
      <div class="header">
        <p class="main-title">亲爱的顾客</p>
        <p class="sub-title">根据您选择的菜品, 建议您添加以下美食</p>
      </div>

      <scroll-view scroll-y="true" class="scroll-wrap border-bottom-1px">
        <div
          class="item-wrapper"
          v-for="(item, index) in recommendedDishes"
          :key="index"
        >
          <img :src="item.image" alt="" class="picture" mode="aspectFill" />
          <div class="detail">
            <p class="name">{{ item.name }}</p>
            <div class="bottom-wrapper">
              <div class="price-wrapper">
                <p class="price">{{ item.price / 100 }}</p>
                <p class="origin" v-if="item.marketPrice > item.price">
                  {{ item.marketPrice / 100 }}
                </p>
                <div class="count-container">
                  <div class="count-wrapper">
                    <div class="reduce" :class="{ show: item.quantity }">
                      <img
                        src="https://shilai-images.oss-cn-shenzhen.aliyuncs.com/staticImgs/common/icon-reduce-cart.png"
                        alt=""
                        class="icon"
                        @click.stop="reduceCart(item)"
                      />
                      <p class="count">{{ item.quantity }}</p>
                    </div>
                  </div>
                  <img
                    src="https://shilai-images.oss-cn-shenzhen.aliyuncs.com/staticImgs/common/icon-add-cart.png"
                    alt=""
                    class="add-cart"
                    @click.stop="addCart(item)"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </scroll-view>

      <div class="actions">
        <button hover-class="none" class="cancel-btn" @click="hideModal">
          不了, 谢谢
        </button>
        <button hover-class="none" class="confirm-btn" @click="confirm">
          选好了
        </button>
      </div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
import API from "@api";
import { useModal, useNavigate } from "@hooks/commonHooks";
import { useDish } from "@hooks/menuHooks";
import { getDishInfoById } from "@utils";
export default {
  props: {
    recommendedDishes: {
      type: Array,
      default: [],
    },
  },
  setup(props) {
    let { isShow, showModal, hideModal, stop } = useModal();
    let { addDish, reduceDish } = useDish();

    return {
      isShow,
      showModal,
      hideModal,
      stop,
      reduceCart(dish) {
        if (dish.quantity > 0) {
          dish.quantity -= 1;
        }
      },
      addCart(dish) {
        dish.quantity += 1;
      },
      confirm() {
        props.recommendedDishes.forEach((addDishItem) => {
          if (addDishItem.quantity) {
            let dishTemp = JSON.parse(
              JSON.stringify(getDishInfoById(addDishItem.id) || addDishItem)
            );
            dishTemp.quantity = addDishItem.quantity;
            addDish(dishTemp);
          }
        });
        props.recommendedDishes.forEach((addDishItem) => {
          addDishItem.quantity = 0;
        });
        setTimeout(hideModal, 0);
      },
    };
  },
};
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
.recommendation-modal {
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: -100;
  display: flex;
  align-items: center;
  justify-content: center;
  box-sizing: border-box;
  background: rgba(0, 0, 0, 0.2);

  &.fade-modal-enter-active {
    display: flex;
    z-index: 100;
  }

  &.hide-modal {
    opacity: 0;
    transition: all 0.5s;
    z-index: -100;
  }

  .content-wrapper {
    width: 100%;
    max-width: 325px;
    height: 458px;
    display: flex;
    flex-direction: column;
    align-items: center;
    box-sizing: border-box;
    border-radius: 15px;
    background: white;

    .header {
      display: flex;
      flex-direction: column;
      align-items: center;
      margin: 15px 0px;

      .main-title {
        font-size: 20px;
      }

      .sub-title {
        font-size: 15px;
        margin-top: 10px;
      }
    }
  }

  .scroll-wrap {
    width: 100%;
    padding: 0 12px;
    box-sizing: border-box;
    height: 320px;
    background-color: #F8F8F8;

    .item-wrapper {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 8px;
      border-top: 8px solid #F8F8F8;
      background-color: white;

      .picture {
        flex: 0 0 80px;
        width: 80px;
        height: 80px;
        border-radius: 3px;
      }

      .detail {
        flex: 1;
        height: 80px;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        margin-left: 10px;

        .name {
          font-size: 16px;
          font-weight: bold;
        }

        .tag {
          display: inline-block;
          padding: 2px 4px;
          border: 1px solid #F25643;
          font-size: 10px;
          color: #F25643;
        }

        .price-wrapper {
          display: flex;
          align-items: flex-end;
          justify-content: space-between;

          .price {
            font-family: 'PingFangSC-Medium';
            font-size: 17px;
            color: #F25643;

            &::before {
              display: inline-block;
              content: '¥';
              font-size: 11px;
            }
          }

          .origin {
            white-space: nowrap;
            margin-left: 4px;
            font-family: 'PingFangSC-Medium';
            font-size: 14px;
            color: #666666;
            text-decoration: line-through;

            &::before {
              display: inline-block;
              content: '¥';
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

                &.show {
                  opacity: 1;
                  transform: translate3d(0, 0, 0);
                }

                .icon {
                  width: 24px;
                  height: 24px;
                  // padding: 0 5px
                  border: 5px solid transparent;
                  border-top: 0px solid transparent;
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
              width: 24px;
              height: 24px;
              // padding: 0 5px
              border: 5px solid transparent;
              border-top: 0px solid transparent;
              border-bottom: 0px solid transparent;
            }
          }

          .sku {
            position: relative;
            height: 25px;
            line-height: 25px;
            padding: 0 10px;
            border-radius: 13px;
            font-size: 12px;
            color: white;
            background: #F25643;

            .quantity {
              position: absolute;
              top: -8px;
              right: 0;
              width: 13px;
              height: 13px;
              border-radius: 100%;
              border: 1px solid white;
              line-height: 13px;
              text-align: center;
              font-family: 'PingFangSC-Medium';
              font-size: 10px;
              color: white;
              background: #F25643;
            }
          }
        }
      }
    }
  }

  .actions {
    width: 100%;
    height: 70px;
    line-height: 70px;
    flex: 1;
    box-sizing: border-box;
    display: flex;
    justify-content: space-evenly;
    align-items: center;
    padding: 5px 0px;

    .cancel-btn {
      height: 39px;
      line-height: 39px;
      border-radius: 25px;
      text-align: center;
      font-family: 'PingFangSC-Medium';
      font-size: 16px;
      color: #666666;
      background: white;

      &:after {
        border: 0px solid white;
      }
    }

    .confirm-btn {
      width: 150px;
      height: 39px;
      line-height: 39px;
      border-radius: 25px;
      text-align: center;
      font-family: 'PingFangSC-Medium';
      font-size: 16px;
      color: white;
      background: #F25643;
    }
  }
}
</style>
