<template>
  <div class="checkbox-wrapper">
    <div
      v-if="type === 'tick'"
      class="tick-wrapper"
      :class="{ unchecked: !checked }"
      :style="{ borderColor: color }"
      @click="check"
    >
      <img v-if="checked" src="./icon-selected.svg" alt="" class="checked" />
    </div>
    <div
      v-if="type === 'circle'"
      class="circle-wrapper"
      :class="{ unchecked: !checked }"
      @click="check"
    >
      <div class="circle" :class="{ checked: checked }"></div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
const COMPONENT_NAME = "CHECK_BOX";

export default {
  name: COMPONENT_NAME,
  props: {
    type: {
      type: String,
      default: "tick",
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    checked: {
      type: Boolean,
      default: false,
    },
    value: {
      type: String,
      default: "",
    },
    color: {
      type: String,
      default: "#b2b2b2",
    },
  },
  methods: {
    check() {
      if (this.disabled) {
        return;
      }
      this.$emit("check", this.value);
    },
  },
};
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
.checkbox-wrapper {
  display: inline-block;

  .tick-wrapper {
    width: 23px;
    height: 23px;
    box-sizing: border-box;
    border-radius: 100%;

    &.unchecked {
      border: 1px solid #e0e0e0;
    }

    .checked {
      width: 23px;
      height: 23px;
    }
  }

  .circle-wrapper {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 18px;
    height: 18px;
    padding: 1px;
    box-sizing: border-box;
    border-radius: 100%;
    border: 1px solid #F25643;
    background: white;

    .circle {
      width: 100%;
      height: 100%;
      border-radius: 100%;
      background: #F25643;
      transform: scale(0);
      transition: all 0.4s;

      &.checked {
        transform: scale(1);
      }
    }
  }
}
</style>
