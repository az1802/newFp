/*
 * @Author: sunjie
 * @Date: 2022-02-08 14:46:29
 * @LastEditors: sunj
 * @LastEditTime: 2022-02-21 14:17:37
 * @FilePath: /new-fanpiao-uniapp/src/api/urls.js
 */
export default {
  // 获取商家详情
  GET_MERCHANT_INFO: "/merchant",
  DISH_CATALOG_SCENE: "/merchant/dish_catalog/scene/",
  GET_MERCHANT_DISH_CATEGORY: "/merchant/dish_catalog/",
  GET_FANPIAO_CATEGORIES: "/fanpiao/fanpiao_categories",
  GET_COUPON_PACKAGE: "/merchant/coupon_package_v2",

  // 订单相关
  CREATE_ORDER: "/order/create",
  ORDER_DETAIL: "/order/get",
  USER_ORDER_LIST: '/transaction/ordering/list',
  // 用户券包信息
  USER_COUPON_LIST: '/transaction/buy_coupon_package/list',
  // 用户饭票信息
  USER_FANPIAO_LIST: '/transaction/buy_fanpiao/list',
  // 用户饭票退款
  USER_REFUND_FANPIAO: '/refund/fanpiao/',
  // 用户券包退款
  USER_REFUND_COUPON: '/refund/coupon_package/',
  // 用户饭票余额退款
  USER_REFUND_FANPIAO_APPLY: '/fanpiao/balance/refund-apply',
  // 用户饭票交易记录
  GET_FANPIAO_TRANSACTION_DETAIL: "/fanpiao/fanpiao-usage",


  // 个人信息相关
  USER_MERCHANT_INFO: "/user/user_merchant_info",
  USER_FANPIAO_BALANCE: "/fanpiao/get_user_fanpiao_fee",
  USER_MEMBER_BALANCE: "/membership/get_user_member_card_deposit",
  USER_INFO: "/user/info",
  USER_SAVING_STATS: "/user/saving_stats",
  USER_WALLET: '/wallet',
  USER_FANPIAO_RECORDS: '/fanpiao/get_user_fanpiao_list',
  USER_RED_PAPER_LIST: '/red_packet/list',

  // 饭票所有的购买记录
  FANPIAO_PLATFORM_RECORDS: "/fanpiao/platform/purchase/records",

  // 用户支付接口
  PAYMENT_PREPAY: '/payment/prepay',
}