<!--
 * @Descripttion: 
 * @version: 
 * @Author: xinguangding
 * @Date: 2021-07-29 12:27:08
 * @LastEditors: sunj
 * @LastEditTime: 2021-12-14 18:41:40
-->
<template>
  <div class="feedback">
    <NavigationBar title="反馈"></NavigationBar>
    <p class="title">问题描述</p>
    <textarea
      cols="30"
      rows="10"
      placeholder="请写下您遇到的问题"
      class="problem"
      placeholder-class="placeholder"
      v-model="feedback"
    ></textarea>
    <p class="title">留下您的信息以便联系(选填)</p>
    <textarea
      cols="30"
      rows="10"
      placeholder="姓名+联系电话"
      class="message"
      placeholder-class="placeholder"
      v-model="userInfo"
    ></textarea>
    <div class="submit-wrapper">
      <button
        hover-class="none"
        class="submit"
        :class="{ active: feedback }"
        @click="submit"
      >
        提交
      </button>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
import API from "@api";
import { navigateTo, navigateBack, showToast, sleep } from "@utils";
export default {
  data() {
    return {
      feedback: "",
      userInfo: "",
    };
  },
  methods: {
    async submit() {
      if (!uni.getStorageSync("userId")) {
        navigateTo("MENU/LOGIN");
        return;
      }
      let data = {
        feedback: this.feedback,
        userinfo: this.userInfo,
      };
      let res = await API.User.feedback(data);
      await showToast(res ? "提交成功" : "提交失败");
      await sleep(1500);
      navigateBack();
    },
  },
};
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
.feedback {
  width: 100%;
  min-height: 100vh;
  box-sizing: border-box;
  padding: 10px;
  background: white;

  .title {
    margin-bottom: 10px;
    font-size: 17px;
    color: #353535;
  }

  .problem, .message {
    width: 100%;
    padding: 10px;
    box-sizing: border-box;
    border-radius: 10px;
    border-1px();
    font-size: 14px;
  }

  .problem {
    height: 146px;
    margin-bottom: 15px;
  }

  .message {
    height: 58px;
    margin-bottom: 50px;
  }

  .placeholder {
    font-size: 14px;
    color: #b2b2b2;
  }

  .submit-wrapper {
    text-align: center;

    .submit {
      display: inline-block;
      margin: 0 auto;
      width: 100%;
      padding: 10px 0;
      border-radius: 25px;
      font-size: 19px;
      color: white;
      background: rgba(227, 81, 63, 0.5);

      &.active {
        background: rgba(227, 81, 63, 1);
      }
    }
  }
}
</style>
