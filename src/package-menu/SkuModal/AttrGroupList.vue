<!--
 * @Author: sunjie
 * @Date: 2022-02-11 17:28:03
 * @LastEditors: sunj
 * @LastEditTime: 2022-02-16 18:52:35
 * @FilePath: /new-fanpiao-uniapp/src/package-menu/SkuModal/AttrGroupList.vue
-->
<template>
  <div class="attr-group-container">
    <div
      v-for="attrGroupItem in attrGroupList"
      :key="attrGroupItem.groupId"
      class="attr-group"
    >
      <div class="group-title">{{ attrGroupItem.groupName }}</div>
      <div
        class="attr"
        :class="selAttrIds.indexOf(attr.id) != -1 ? 'active' : ''"
        v-for="attr in attrGroupItem.attrs"
        :key="attr.id"
        @click="toggleAttr(attr)"
      >
        {{ attr.name }}
      </div>
    </div>
    <div style="height: 12px"></div>
  </div>
</template>
<script>
export default {
  props: {
    attrGroupList: {
      type: Array,
      default: [],
    },
    selAttrIds: {
      type: Array,
      default: [],
    },
  },
  setup(props, { emit }) {
    let { selAttrIds } = props;

    return {
      toggleAttr({ id }) {
        let selIndex = selAttrIds.indexOf(id);
        // 根据不同属性组的规则进行不同的切换
        if (0) {
          //多选非必选
          selIndex == -1 ? selAttrIds.push(id) : selAttrIds.splice(selIndex, 1);
        } else if (1) {
          //单选逻辑
          selAttrIds.splice(0, selAttrIds.length, id);
        }
      },
    };
  },
};
</script>
<style lang="less" scoped>
@import "@design/index.less";

.attr-group-container {
  .attr-group {
    .group-title {
      .normal-font(12px,#999);
      .line-center(18px);
    }
    .attr {
      .common-btn(32px,#f0f0f0,4px);
      .bold-font(14px,#333);
      padding: 0 12px;
      margin: 0 8px 8px 0;
      &.active {
        color: #f25643;
        background-color: rgba(235, 75, 58, 0.2);
      }
    }
  }
}
</style>