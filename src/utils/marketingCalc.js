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


export function calcRecommendFanpiao(fanpiaoList = [], billFee = 0, fanpiaoPaidFee = 0) {
  let needPaidFee = billFee - fanpiaoPaidFee, recommendFanpiaoList = [];
  if (needPaidFee <= 0) {
    recommendFanpiaoList = [] //不需要推荐饭票
  } else {
    recommendFanpiaoList = fanpiaoList.filter(({ totalValue, discount }) => {
      return (totalValue / (1 - discount / 100)) > needPaidFee;
    })
  }

  return recommendFanpiaoList;
}


export function calcUserAvailableMerchantCoupon(userMerchantCoupons, billFee) {
  let res = [];
  for (let i = 0; i < userMerchantCoupons.length; i++) {
    let couponItem = userMerchantCoupons[i];
    if (couponItem?.leastCost <= billFee && couponItem.state == "ACCEPTED") {
      res.push(couponItem)
    }
  }
  return res;
}