<template>
  <div
    class="option-modal"
    :class="showOptionModal ? 'fade-modal-enter-active' : 'hide'"
    @click.stop="stop"
  >
    <div
      class="option-modal-wrapper border-bottom-1px"
      :class="showOptionModal ? 'up-modal-enter-active' : 'up-modal-leave-to'"
      @click.stop="stop"
    >
      <div class="person-wrapper">
        <p class="title">就餐人数</p>
        <p class="table" v-if="tableName">{{ tableName }}</p>
        <div class="select-container">
          <div
            class="select-wrapper"
            v-for="(number, index) in personSelect"
            :key="index"
          >
            <div
              class="select"
              :class="{ active: number === selectedPersonNumber }"
              @click="changePersonNumber(number)"
            >
              <span class="content">{{ number }}人</span>
            </div>
          </div>
        </div>
      </div>

      <div class="btn-wrapper">
        <div class="btn" @click="selected">开始点餐</div>
      </div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
import { computed, ref, unref } from "vue";
import { useOptionModal } from "@hooks/menuHooks";
export default {
  props: {
    tableName: {
      type: String,
      default: "",
    },
    personLimit: {
      type: Number,
      default: 16,
    },
  },
  setup(props, { emit }) {
    let selectedPersonNumber = ref(1);
    let { showOptionModal, toggleShowOptionModal } = useOptionModal();
    let personSelect = computed(() => {
      let personLimit = props.personLimit;
      return Array.apply(null, Array(personLimit)).map((item, i) => {
        return Number(i + 1);
      });
    });

    function selected() {
      toggleShowOptionModal(false);
      emit("selPeopleOk", unref(selectedPersonNumber));
    }

    function changePersonNumber(num) {
      selectedPersonNumber.value = num;
    }

    return {
      showOptionModal,
      show() {
        toggleShowOptionModal(true);
      },
      hideModal() {
        toggleShowOptionModal(false);
      },
      stop() {
        return "";
      },
      personSelect,
      selected,
      selectedPersonNumber,
      changePersonNumber,
    };
  },
};
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
.option-modal {
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

  &.hide {
    z-index: -100;
    opacity: 0;
    transition: all 0.5s;
  }

  .option-modal-wrapper {
    position: fixed;
    left: 0;
    right: 0;
    bottom: 0;
    padding: 17px 0;
    box-sizing: border-box;
    border-radius: 10px 10px 0 0;
    background: white;

    .person-wrapper {
      padding: 0 12px;

      .title {
        font-family: 'PingFangSC-Medium';
        font-size: 19px;
      }

      .table {
        margin-top: 15px;
        font-size: 14px;
      }

      .select-container {
        padding-top: 10px;

        .select-wrapper {
          display: inline-block;
          width: 20%;

          .select {
            width: 55px;
            height: 36px;
            margin-top: 15px;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            margin-left: 19px;
            border-radius: 18px;
            background: white;
            transition: background 0.4s;

            &.active {
              background: #F25643;

              .content {
                color: white;
              }
            }

            &:first-child, &.left {
              margin-left: 0;
            }

            .content {
              font-size: 14px;
              transition: color 0.4s;
            }
          }
        }
      }
    }

    .payment-wrapper {
      padding: 20px 12px 0;

      .title {
        font-family: 'PingFangSC-Medium';
        font-size: 19px;

        .desc {
          font-family: 'PingFangSC-Regular';
          font-size: 12px;
          color: #999999;
        }
      }

      .select-wrapper {
        padding-top: 24px;

        .select {
          width: 77px;
          height: 35px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          margin-left: 19px;
          border-radius: 18px;
          background: white;
          transition: background 0.4s;

          &.active {
            background: #F25643;

            .content {
              color: white;
            }
          }

          &:first-child, &.left {
            margin-left: 0;
          }

          .content {
            font-size: 14px;
            transition: color 0.4s;
          }
        }
      }
    }

    .btn-wrapper {
      margin-top: 25px;
      padding: 0 40px;

      .btn {
        height: 45px;
        line-height: 45px;
        border-radius: 23px;
        text-align: center;
        font-family: 'PingFangSC-Medium';
        font-size: 19px;
        color: white;
        background: #F25643;
      }
    }
  }
}
</style>
