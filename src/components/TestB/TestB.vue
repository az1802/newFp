<!--
 * @Author: sunjie
 * @Date: 2022-02-08 13:57:52
 * @LastEditors: sunj
 * @LastEditTime: 2022-02-08 14:02:28
 * @FilePath: /new-fanpiao-uniapp/src/components/TestB/TestB.vue
-->
<template>
  <div>测试组件B {{ title.msg }}</div>
  <input type="text" v-model="title.msg" />
</template>
<script setup>
import { reactive } from "vue";
let title = reactive({
  msg: "aaa",
});
</script>