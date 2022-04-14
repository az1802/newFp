export function calcRecommendCoupon(couponList = [], billFee) {

  let res = {};
  for (let i = 0; i < couponList.length; i++) {
    if (couponList[i]?.availableFee <= billFee) {
      res = couponList[i];
      break;
    }
  }
  return res;
}


export function calcRecommendFanpiao(fanpiaoList = [], billFee, fanpiaoBalance = 0) {

}


export function calcUserAvailableMerchantCoupon(userMerchantCoupons, billFee) {
  let res = [];
  for (let i = 0; i < userMerchantCoupons.length; i++) {
    let couponItem = userMerchantCoupons[i];
    if (couponItem?.leastCost <= billFee) {
      res.push(couponItem)
    }
  }
  return res;
}