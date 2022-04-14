<template>
  <div
    class="scan-modal"
    :class="isShow ? 'fade-modal-enter-active' : 'hide'"
    @touchmove.stop="stop"
    @click="hideModal"
  >
    <div
      class="scan-modal-wrapper border-bottom-1px"
      :class="isShow ? 'up-modal-enter-active' : 'up-modal-leave-to'"
      @click.stop="stop"
    >
      <div v-if="!tableId">
        <p class="title">请扫桌上二维码下单</p>
        <p class="tip">你的菜已保存到购物车</p>
        <img
          src="https://shilai-images.oss-cn-shenzhen.aliyuncs.com/staticImgs/common/icon-scan.png"
          alt=""
          class="icon"
          @click="scanCode"
        />
        <div class="btn-wrapper">
          <div class="btn" @click="scanCode">扫描二维码</div>
        </div>
        <div class="cancel" @click="hideModal">稍后下单</div>
      </div>
      <div v-if="tableId">
        <p class="table">{{ tableName }}</p>
        <div class="btn-wrapper">
          <div class="btn" @click="confirm">确定</div>
        </div>
        <div class="cancel" @click="scanCode">换桌</div>
      </div>
    </div>
  </div>
</template>

<script>
import { showToast } from "@utils";
import { ref, unref } from "vue";
import API from "@api";

function formatPathStr(pathStr) {
  let res = {};
  if (pathStr.indexOf("?") != -1) {
    pathStr = pathStr.slice(pathStr.indexOf("?") + 1);
    let valStrs = pathStr.split("&");
    for (let i = 0; i < valStrs.length; i++) {
      let temp = valStrs[i].split("=");
      res[temp[0]] = temp[1];
    }
  }

  return res;
}

const SPLIT_STR = "package-merchant/menu?scene=";
export default {
  setup(props, { emit }) {
    let isShow = ref(false),
      tableId = ref(""),
      tableName = ref(""),
      mealType = ref("");

    async function scanCode() {
      let code = await uni.scanCode(false);
      if (
        code.result == undefined &&
        !code.result &&
        (!code.path || code.path.indexOf(SPLIT_STR) < 0)
      ) {
        await showToast("请扫描正确的二维码");
        return;
      }

      //二合一的码会包含result信息 微信单独的码没有result 只有path
      let scene = "";
      if (code.result && code.scanType.indexOf("QR") != -1) {
        let resStr = code.result || "";
        let resJson = formatPathStr(resStr);
        scene = resJson.id || "";
      } else if (code.path && code.scanType == "WX_CODE") {
        let resJson = formatPathStr(code.path);
        scene = resJson.scene || resJson.id || "";
      }

      if (!scene) {
        await showToast("请扫描正确的二维码");
        return;
      }

      let res = await API.Merchant.getDishCatalogScene(scene);
      tableId.value = res.tableId;
      tableName.value = res.tableName;
      mealType.value = res.mealType;
    }

    function confirm() {
      isShow.value = false;
      emit("scan", unref(tableId), unref(tableName), unref(mealType));
    }

    return {
      tableId,
      tableName,
      isShow,
      show() {
        isShow.value = true;
      },
      hideModal() {
        isShow.value = false;
      },
      stop() {
        return "";
      },
      confirm,
      scanCode,
    };
  },
};
</script>

<style scoped lang="stylus">
.scan-modal {
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: -100;
  background: rgba(0, 0, 0, 0.5);
  display: none;

  &.fade-modal-enter-active {
    display: flex;
    z-index: 100;
  }

  &.hide {
    z-index: -100;
    opacity: 0;
    transition: all 0.5s;
  }

  .scan-modal-wrapper {
    position: fixed;
    left: 0;
    right: 0;
    bottom: 0;
    box-sizing: border-box;
    border-radius: 10px 10px 0 0;
    text-align: center;
    background: white;

    .title {
      margin-top: 17px;
      font-family: 'PingFangSC-Medium';
      font-size: 19px;
    }

    .tip {
      margin-top: 15px;
      font-size: 14px;
    }

    .icon {
      width: 118px;
      height: 118px;
      margin-top: 13px;
    }

    .table {
      margin-top: 22px;
      padding-bottom: 9px;
      font-size: 50px;
      font-family: 'PingFangSC-Medium';
      min-height: 50px;
    }

    .btn-wrapper {
      margin-top: 13px;
      padding: 0 40px;

      .btn {
        height: 45px;
        line-height: 45px;
        border-radius: 23px;
        font-family: 'PingFangSC-Medium';
        font-size: 19px;
        color: white;
        background: #F25643;
      }
    }

    .cancel {
      display: inline-block;
      margin-top: 22px;
      padding-bottom: 22px;
      font-family: 'PingFangSC-Medium';
      font-size: 19px;
    }
  }
}
</style>
