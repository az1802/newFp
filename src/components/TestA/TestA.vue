<!--
 * @Author: sunjie
 * @Date: 2022-02-08 13:53:44
 * @LastEditors: sunj
 * @LastEditTime: 2022-02-14 15:53:58
 * @FilePath: /new-fanpiao-uniapp/src/components/TestA/TestA.vue
-->
<template>
  <div>测试组件A {{ msg }}---{{ count }}</div>
  <input type="text" v-model="msg" />
  <button @click="addCount">add</button>
</template>
<script >
import { reactive, toRefs } from "vue";
import API from "@api";
export default {
  setup() {
    let title = reactive({
      msg: "aaa",
    });

    return toRefs(title);
  },
  async mounted() {
    let res = await API.Merchant.getMerchantInfo();
  },
};
</script>