<template>
  <!-- #ifdef MP-WEIXIN  -->
  <button
    hover-class="none"
    class="phone-button"
    @getphonenumber="getPhone"
    open-type="getPhoneNumber"
  >
    <slot />
  </button>
  <!-- #endif -->
  <!-- #ifdef MP-ALIPAY  -->
  <button
    hover-class="none"
    class="phone-button"
    @getphonenumber="getAliPhone"
    @getAuthorize="getAliPhone"
    @error="getAliPhoneError"
    open-type="getAuthorize"
    scope="phoneNumber"
  >
    <slot />
  </button>
  <!-- #endif -->
</template>
<script>
import { getAliPhoneNumber, getWechatPhone } from "@utils";
import { useUserPhone } from "@hooks/userHooks";
export default {
  setup(props, { emit }) {
    const { setPhone } = useUserPhone();
    return {
      async getPhone(e) {
        let phoneRes = false;
        for (let i = 0; i < 3; i++) {
          phoneRes = await getWechatPhone(e);
          if (phoneRes) {
            setPhone(phoneRes || "");
            break;
          }
        }
        emit("success", phoneRes);
      },
      async getAliPhone() {
        let phoneRes = await getAliPhoneNumber();
        setPhone(phoneRes?.mobile || "");
        emit("success", phoneRes?.mobile);
      },
      getAliPhoneError() {
        console.log("err---", e);
      },
    };
  },
};
</script>
<style lang="less" scoped>
.phone-button {
  display: inline-block;
  width: 100%;
  height: 100%;
  margin: 0;
  padding: 0;
  border: none;
  border-radius: 0;
  outline: 0;
  overflow: visible;
  background: transparent;
  font-size: inherit;
  line-height: 1;
  color: inherit;
  display: inline-block;
  &:after {
    border-width: 0px;
  }
}
</style>