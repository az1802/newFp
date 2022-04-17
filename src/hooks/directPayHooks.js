import { computed, ref, reactive, toRaw, unref } from 'vue'
import { useState, useGetters, useMutations } from "@hooks/storeHooks.js";



export function useDirectPaySelCoupon() {
  const { selCoupon } = useState("directpay", ["selCoupon"]);
  const { setSelCoupon } = useMutations("directpay", ["setSelCoupon"]);
  console.log('%csetSelCoupon: ', 'color: MidnightBlue; background: Aquamarine; font-size: 20px;', setSelCoupon);



  return {
    selCoupon,
    setSelCoupon
  }
}