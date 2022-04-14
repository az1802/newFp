<template>
  <div class="address-list">
    <NavigationBar title="选择地址" />
    <div class="address-wrapper">
      <div v-for="(item, index) in userAddressList" :key="index">
        <div class="address-item" @click="changeAddress(item)">
          <div class="detail-wrapper">
            <p class="address">{{ item.street + " " + item.houseNumber }}</p>
            <p class="user">
              {{
                item.username + "(" + item.gender + ")" + " " + item.mobilePhone
              }}
            </p>
          </div>
          <img
            src="https://shilai-images.oss-cn-shenzhen.aliyuncs.com/staticImgs/common/icon-edit.png"
            alt=""
            class="edit"
            @click.stop="editAddress(item.id)"
          />
        </div>
      </div>
      <div class="no-address" v-if="!userAddressList.length">
        暂无收获地址,请添加
      </div>
    </div>
    <div class="add-wrapper" @click="addAddress">
      <img
        src="https://shilai-images.oss-cn-shenzhen.aliyuncs.com/staticImgs/common/icon-add-address.png"
        alt=""
        class="icon"
      />
      <p class="content">添加收货地址</p>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
import { ref, onBeforeMount } from "vue";
import { useUserAddress } from "@hooks/userHooks";
import { useOrder } from "@hooks/orderHooks";
import { useNavigate } from "@hooks/commonHooks";

export default {
  setup() {
    const { userAddressList, requestUserAddressList } = useUserAddress();
    const { setOrderInfo } = useOrder();
    const { navigateBack, navigateTo } = useNavigate();

    onBeforeMount(async () => {
      requestUserAddressList();
    });

    function changeAddress(addressItem) {
      setOrderInfo({ selectedAddress: addressItem });
      navigateBack();
    }

    function addAddress() {
      navigateTo("OTHER/ADD_ADDRESS");
    }

    function editAddress(addressId) {
      navigateTo("OTHER/ADD_ADDRESS", { addressId });
    }

    return {
      userAddressList,
      changeAddress,
      addAddress,
      editAddress,
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
.address-list {
  width: 100%;
  padding-top: 8px;
  padding-bottom: 57px;

  .address-wrapper {
    background: white;

    .no-address {
      margin-top: 40px;
      text-align: center;
      color: #666666;
      background: #f8f8f8;
    }

    .address-item {
      display: flex;
      align-items: center;
      height: 80px;
      box-sizing: border-box;
      padding: 0 12px;

      .detail-wrapper {
        flex: 1;
        overflow: hidden;

        .address {
          margin-bottom: 10px;
          no-wrap();
          font-family: 'PingFangSC-Medium';
          font-size: 15px;
        }

        .user {
          font-size: 13px;
        }
      }

      .edit {
        width: 19px;
        height: 19px;
      }
    }
  }

  .add-wrapper {
    position: fixed;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 49px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: white;

    .icon {
      width: 17px;
      height: 17px;
    }

    .content {
      margin-left: 5px;
      font-family: 'PingFangSC-Medium';
      font-size: 16px;
      color: #F25643;
    }
  }
}
</style>
