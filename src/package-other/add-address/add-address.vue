<template>
  <div class="add-address">
    <NavigationBar title="添加地址" />
    <div class="form-wrapper">
      <div class="item-wrapper border-bottom-1px">
        <p class="title">联系人：</p>
        <input
          v-model="addressInfo.username"
          type="text"
          class="input"
          placeholder="请填写收货人姓名"
        />
      </div>
      <div class="item-wrapper border-bottom-1px">
        <div class="check-wrapper" @click="addressInfo.gender = '先生'">
          <CheckBox
            type="circle"
            :checked="addressInfo.gender === '先生'"
          ></CheckBox>
          <p class="content">先生</p>
        </div>
        <div class="check-wrapper" @click="addressInfo.gender = '女士'">
          <CheckBox
            type="circle"
            :checked="addressInfo.gender === '女士'"
          ></CheckBox>
          <p class="content">女士</p>
        </div>
      </div>
      <div class="item-wrapper border-bottom-1px">
        <p class="title">联系电话：</p>
        <input
          v-model="addressInfo.mobilePhone"
          maxlength="11"
          type="number"
          class="input"
          placeholder="请填写收货人手机号"
        />
      </div>
      <div class="item-wrapper flex-start border-bottom-1px">
        <p class="title">地址：</p>
        <img
          src="https://shilai-images.oss-cn-shenzhen.aliyuncs.com/staticImgs/common/icon-address-active.png"
          alt=""
          class="icon-address"
        />
        <p
          class="address"
          :class="{ none: !addressInfo.street }"
          @click="getLocation"
        >
          {{ addressInfo.street || "点击选择" }}
        </p>
        <img src="@assets/icon-arrow_right.svg" alt="" class="arrow-right" />
      </div>
      <div class="item-wrapper">
        <p class="title">门牌号：</p>
        <input
          v-model="addressInfo.houseNumber"
          type="text"
          class="input"
          placeholder="详细地址，例：4号楼208室"
        />
      </div>
    </div>
    <div class="btn-save" @click="save">保存并使用</div>
  </div>
</template>

<script type="text/ecmascript-6">
import { useUserAddress } from "@hooks/userHooks";
import { useNavigate } from "@hooks/commonHooks";
import { onBeforeMount, ref, unref } from "vue";
import { chooseLocation, showToast, sleep } from "@utils";

let addressId = "";
export default {
  onLoad(opts) {
    addressId = opts.addressId;
  },
  setup() {
    let addressInfo = ref({
      username: "",
      gender: "先生",
      mobilePhone: "",
      houseNumber: "",
      street: "",
      latitude: "",
      longitude: "",
    });
    const {
      addAddress,
      updateAddress,
      getAddressDetail,
      requestUserAddressList,
    } = useUserAddress();
    const { navigateBack } = useNavigate();
    onBeforeMount(async () => {
      if (addressId) {
        let addressDetail = await getAddressDetail(addressId);
        addressDetail.street = addressDetail.street;
        addressInfo.value = addressDetail;
      }
    });
    function checkAddressInfo(newAddressInfo) {
      let errorMessage = "";
      if (!newAddressInfo.username) {
        errorMessage = "请填写收货人姓名";
      } else if (!newAddressInfo.mobilePhone) {
        errorMessage = "请填写收货人手机号";
      } else if (!newAddressInfo.street) {
        errorMessage = "请选择收货地址";
      } else if (!newAddressInfo.houseNumber) {
        errorMessage = "请填写门牌号";
      }
      if (errorMessage) {
        showToast(errorMessage);
        return false;
      }
      return true;
    }
    async function save() {
      let saveRes = false;
      let newAddressInfo = unref(addressInfo);
      if (!checkAddressInfo(newAddressInfo)) {
        return;
      }
      if (addressId) {
        saveRes = await updateAddress(newAddressInfo);
      } else {
        saveRes = await addAddress(newAddressInfo);
      }
      await showToast(saveRes ? "保存成功" : "保存失败");
      await sleep(1000);
      if (saveRes) {
        requestUserAddressList();
      }
      saveRes && navigateBack();
    }

    async function getLocation() {
      let locatioRes = await chooseLocation();
      for (let key in locatioRes) {
        unref(addressInfo)[key] = locatioRes[key];
      }
    }
    return {
      addressInfo,
      save,
      getLocation,
    };
  },
};
</script>

<style>
page {
  background: #f8f8f8;
}
</style>

<style scoped lang="stylus" rel="stylesheet/stylus">
.add-address {
  width: 100%;
  padding-top: 8px;

  .form-wrapper {
    padding: 0 12px;
    background: white;

    .item-wrapper {
      display: flex;
      align-items: center;
      min-height: 50px;

      &.flex-start {
        align-items: center;
        box-sizing: border-box;
        padding-bottom: 13px;
        padding-top: 13px;

        .title {
          padding-top: 4px;
        }

        .icon-address {
          aligin-self: center;
        }

        .arrow-right {
          aligin-self: center;
        }
      }

      .title {
        font-size: 16px;
        color: #666666;
      }

      .input {
        flex: 1;
        margin-left: 6px;
        font-size: 16px;
      }

      .icon-address {
        width: 19px;
        height: 19px;
        margin-left: 5px;
      }

      .address {
        flex: 1;
        margin-left: 5px;
        overflow: hidden;
        line-height: 24px;
        font-size: 16px;

        &.none {
          color: #999;
        }
      }

      .arrow-right {
        margin-left: 10px;
        width: 9px;
        height: 14px;
      }

      .check-wrapper {
        display: flex;
        align-items: center;
        margin-left: 30px;

        &:first-child {
          padding-left: 40px;
        }

        .content {
          margin-left: 6px;
          font-size: 16px;
          color: #666666;
        }
      }
    }
  }

  .btn-save {
    height: 45px;
    line-height: 45px;
    margin: 30px 40px 0;
    border-radius: 25px;
    text-align: center;
    font-family: 'PingFangSC-Medium';
    font-size: 19px;
    color: white;
    background: #F25643;
  }
}
</style>
