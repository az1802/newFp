export function calcRecommendCoupon(couponList = [], billFee) {

  let res = {}, availableFee = 0;
  for (let i = 0; i < couponList.length; i++) {
    if (couponList[i]?.availableFee <= billFee) {
      res = couponList[i]; //推荐最接近使用门款的券包
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


export function calcRecommendRecharge(merchantRechargeList = [], billFee, balance) {
  let res = [];

  if (billFee > balance) {
    res = merchantRechargeList.filter(item => {
      return item.amount > billFee - balance;
    })
  }


  return res
}


export function calcFanpiaoDiscountPrice(fanpiaoList, billFee) {
  let maxFanpiaoDiscount = 0, minFanpiaoDiscount = 100;
  fanpiaoList.forEach(({ discount }) => {

    if (maxFanpiaoDiscount < discount) {
      maxFanpiaoDiscount = discount
    }
    if (minFanpiaoDiscount > discount) {
      minFanpiaoDiscount = discount
    }
  })

  return {
    maxFanpiaoDiscount,
    minFanpiaoDiscount
  }
}