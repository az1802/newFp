<!--
 * @Author: sunjie
 * @Date: 2022-02-18 12:34:54
 * @LastEditors: sunj
 * @LastEditTime: 2022-02-18 15:00:00
 * @FilePath: /new-fanpiao-uniapp/src/package-order/TableInfo/TableInfo.vue
-->
<template>
  <div class="table-info-wrapper">
    <div
      class="table-info-container"
      v-if="!merchantInfo.enableManyPeopleOrder"
    >
      桌号:{{ orderInfo.tableName }}
    </div>
    <div class="header-title-wrapper" v-else>
      <div class="title">已下单</div>
      <div class="sub-title">美味马上就到,祝您用餐愉快</div>
    </div>
    <div class="self-pick-up" v-if="orderInfo.mealType == 'SELF_PICK_UP'">
      <div class="time-select">
        <div class="label">请选择取餐时间</div>
        <div class="time-value">
          <MealPickUpTime v-model:time="orderInfo.takeAwayTime" />
        </div>
      </div>
      <div class="phone">
        <div class="label">预留电话</div>
        <div class="phone-input-wrapper">
          <input
            v-if="phone"
            type="text"
            :value="phone"
            class="input"
            @input="changePhone"
          />
          <GetPhoneButton v-else
            ><div class="text">请填写手机号(必填)</div></GetPhoneButton
          >
          <img
            src="https://shilai-images.oss-cn-shenzhen.aliyuncs.com/staticImgs/common/icon-edit.png"
            alt=""
            class="edit-img"
          />
        </div>
      </div>
    </div>
    <div class="take-out" v-if="orderInfo.mealType == 'TAKE_OUT'">
      <div
        v-if="!orderInfo?.selectedAddress?.id"
        class="add-address"
        @click="navigateTo('OTHER/ADDRESS_LIST')"
      >
        <img
          src="https://shilai-images.oss-cn-shenzhen.aliyuncs.com/staticImgs/common/icon-add-address.png"
          alt=""
          class="add-img"
        />
        <p class="text">添加收货地址</p>
      </div>
      <div class="address-info" v-else>
        <div class="address-detail">
          <div class="text">
            {{
              orderInfo.selectedAddress.street +
              " " +
              orderInfo.selectedAddress.houseNumber
            }}
          </div>
          <p class="userinfo">
            {{
              orderInfo.selectedAddress.username +
              "(" +
              orderInfo.selectedAddress.gender +
              ")" +
              " " +
              orderInfo.selectedAddress.mobilePhone
            }}
          </p>
        </div>
        <img
          src="@assets/icon-arrow_right.svg"
          alt=""
          class="arrow-right"
          @click="navigateTo('OTHER/ADDRESS_LIST')"
        />
      </div>
    </div>
  </div>
</template>
<script>
import MealPickUpTime from "../MealPickUpTime/MealPickUpTime.vue";
import { useOrder } from "@hooks/orderHooks";
import { useMerchantInfo } from "@hooks/merchantHooks";
import { useUserPhone } from "@hooks/userHooks";
import { useNavigate } from "@hooks/commonHooks";
import { ref } from "vue";
export default {
  components: {
    MealPickUpTime,
  },
  setup() {
    let { merchantInfo } = useMerchantInfo();
    let { orderInfo, setOrderInfo } = useOrder();
    let { phone } = useUserPhone();
    const { navigateTo } = useNavigate();

    return {
      orderInfo,
      merchantInfo,
      phone,
      navigateTo,
      changePhone(e) {
        let val = e.detail.value;
        setOrderInfo({
          phone: val,
        });
      },
    };
  },
};
</script>
<style lang="less" scoped>
@import "@design/index.less";
.table-info-wrapper {
  background: #f8f8f8;
}
.table-info-container {
  .bold-font(22px,#333);
  padding: 24px 15px;
  background: #f8f8f8;
}
.header-title-wrapper {
  .box-size(100%,70px,transparent);
  padding: 12px;
  .title {
    .normal-font(20px,#333);
    margin-bottom: 8px;
  }
  .sub-title {
    .normal-font(14px,#999);
  }
}
.self-pick-up {
  .box-size(calc(100vw - 24px),unset);
  margin: 0 auto;
  padding: 0 12px;
  border-radius: 10px;
  .time-select,
  .phone {
    .flex-simple(space-between,center);
    .line-center(46px);
    .label {
      .normal-font(16px,#333);
    }
    .time-value {
    }
    .phone-input-wrapper {
      .flex-simple(flex-end,center);
      .input {
        text-align: right;
      }
      .text {
        display: inline-block;
        .normal-font(18px,#999);
      }
      .edit-img {
        .box-size(18px,18px);
        margin-left: 5px;
      }
    }
  }
}
.take-out {
  .box-size(calc(100vw - 24px),70px);
  margin: 0 auto;
  padding: 0 12px;
  border-radius: 10px;
  .add-address {
    height: 100%;
    .flex-simple(flex-start,center);
    .add-img {
      .box-size(17px,17px);
    }
    .text {
      .bold-font(18px,#f25643);
      margin-left: 6px;
    }
  }
  .address-info {
    height: 100%;
    .flex-simple(space-between,center);
    .address-detail {
      flex: 1;
      max-width: calc(100% - 20px);
      .text {
        .box-size(100%,15px);
        .bold-font(15px,#333);
        .line-center(20px);
        margin-bottom: 5px;
        .no-wrap();
      }
      .userinfo {
        .normal-font(13px,#333);
      }
    }
    .arrow-right {
      .box-size(9px,14px);
      margin-left: 10px;
    }
  }
}
</style>