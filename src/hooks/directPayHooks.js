import { computed, ref, reactive, toRaw, unref } from 'vue'
import { useState, useGetters, useMutations } from "@hooks/storeHooks.js";



export function useDirectPaySelCoupon() {
  const { selCoupon, autoSelCoupon } = useState("directpay", ["selCoupon", "autoSelCoupon"]);
  const { setSelCoupon, toogleAutoSelCoupon } = useMutations("directpay", ["setSelCoupon", "toogleAutoSelCoupon"]);

  return {
    selCoupon,
    setSelCoupon,
    autoSelCoupon,
    toogleAutoSelCoupon
  }
}