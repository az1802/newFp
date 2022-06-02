import { computed, ref, reactive, toRaw, unref, watch } from 'vue'
import { useState, useMutations } from "@hooks/storeHooks.js";

export function useTimeCounterStopStatus() {

  return {
    ...useState("marketConfig", [
      "bannerTimeCounterStopStatus",
      "openScreenTimeCounterStopStatus",
      "createOrderTimeCounterStopStatus",
      "buyFanpiaoTimeCounterStopStatus",
    ]),
    ...useMutations("marketConfig", [
      "setBannerTimeCounterStatus",
      "setOpenScreenTimeCounterStatus",
      "setCreateOrderTimeCounterStatus",
      "setBuyFanpiaoTimeCounterStatus",
    ]),
  }
}