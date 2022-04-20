<!--
 * @Author: sunj
 * @Date: 2021-07-21 10:37:26
 * @LastEditors: sunj
 * @LastEditTime: 2022-03-02 16:31:52
 * @FilePath: /fanpiao_uniapp/src/components/login-btn/login-btn.vue
-->
<template>
  <div class="login-btn-wrapper">
    <!-- #ifdef MP-ALIPAY  -->
    <button @click="aliLogin" hover-class="none" class="login-btn">
      授权登录
    </button>
    <!-- #endif -->
    <!-- #ifndef MP-ALIPAY  -->
    <button hover-class="none" class="login-btn" @click="login">
      授权登录
    </button>
    <!-- #endif -->
  </div>
</template>
<script>
import API from "@api";
import { getUserInfo, showToast } from "@utils";
export default {
  data() {
    return {
      loginError: false,
      codeMsg: "",
    };
  },
  async created() {
    this.codeMsg = await uni.login();
  },
  methods: {
    async login() {
      let userInfoRes = await getUserInfo();
      if (!userInfoRes) {
        await showToast("获取用户信息失败,请重新授权");
        return;
      }
      const { encryptedData, iv, userInfo, errMsg } = userInfoRes || {};
      if (typeof userInfoRes === "object" && errMsg !== "getUserProfile:ok") {
        this.loginError = true;
        await showToast("获取用户信息失败,请重新授权");
        return;
      }
      if (typeof userInfoRes == "object") {
        this.loginMsg = { code: this.codeMsg.code, iv, encryptedData };
        uni.setStorageSync("userInfo", userInfo);
      }
      uni.showLoading();
      let res = (await API.User.signUp(this.loginMsg)) || false;

      uni.hideLoading();

      if (!res) {
        await showToast("登录失败,请刷新小程序重新登录");
        this.loginError = true;
        return;
      } else if (!res.id) {
        this.loginError = true;
        await showToast("获取不到当前用户，请重新登录");
        return;
      }
      this.loginError = false;
      res.id = "047947c1-a5bb-4fd1-9258-42ee204f29e8";
      uni.setStorageSync("userId", res.id);
      uni.setStorageSync("wechatOpenid", res.wechatOpenid);
      API.User.setUserHeader(res.id);

      this.$emit("loginSuccess");
      return;
    },
    async _signUpAlipay(authCode) {
      if (authCode.split("&").length > 1) {
        authCode = authCode.split("&")[0];
      }
      let data = { authCode: authCode, platform: "MINIPROGRAM" };
      let res = await API.User.signUpAlipay(data);
      const { alipayProfile = {}, memberProfile, id } = res.data;

      uni.setStorageSync("userId", id);
      let useInfo = alipayProfile || memberProfile || {};
      if (useInfo) {
        useInfo.avatarUrl = useInfo.avatar;
        useInfo.nickName = useInfo.nickname;
      }
      uni.setStorageSync("userInfo", useInfo);
      API.User.setUserHeader(id);
      return;
    },
    async aliLogin(e) {
      my.getAuthCode({
        scopes: "auth_user",
        success: async (res) => {
          this.codeStr = JSON.stringify(res);
          await this._signUpAlipay(res.authCode);
          this.$emit("loginSuccess");
        },
        fail: (res) => {},
        complete: (res) => {},
      });
      return;
    },
  },
};
</script>
<style scoped lang="stylus" rel="stylesheet/stylus">
.login-btn-wrapper {
  .login-btn {
    width: 100%;
    height: 50px;
    line-height: 50px;
    border-radius: 25px;
    color: white;
    font-size: 18px;
    font-weight: bold;
    background: #f25643;
    text-align: center;
  }
}
</style>