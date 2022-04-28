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
  GET_MERCHANT_DISH_CATEGORY: "/merchant/dish_catalog",
  DISH_SOLD_NUMBER: "/dish/sold-number", //获取菜品基本的销售数量
  GET_FANPIAO_CATEGORIES: "/fanpiao/fanpiao_categories",
  GET_COUPON_PACKAGE: "/merchant/coupon_package_v2",
  MERCHANT_FANPIAO_BUY_RECORD: "/fanpiao/recently/buy", //饭票购买记录
  GET_RECOMMEND_DISHES: '/order/recommend_dishes', //获取推荐菜
  MERCHANT_QRCODE_INFO: '/qrcode-info',    // 获取商户二维码信息

  // 订单相关
  CREATE_ORDER: "/order/create",
  ADD_ORDER: "/order/add_dish",
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
  // 获取商家储值额度选项
  GET_RECHARGE_CONFIGS: '/membership/recharge_config',


  // 个人信息相关
  USER_SIGN_UP: '/user/sign_up',
  SIGN_UP_ALIPAY: '/user/alipay/sign_up',
  USER_MERCHANT_INFO: "/user/user_merchant_info",
  USER_FANPIAO_BALANCE: "/fanpiao/get_user_fanpiao_fee",
  USER_MEMBER_BALANCE: "/membership/get_user_member_card_deposit",
  USER_INFO: "/user/info",
  UPDATE_USER_INFO: '/user/update',
  USER_SAVING_STATS: "/user/saving_stats",
  USER_WALLET: '/wallet',
  USER_FANPIAO_RECORDS: '/fanpiao/get_user_fanpiao_list',
  USER_RED_PAPER_LIST: '/red_packet/list',
  USER_WITHDRAW: '/wallet/withdraw',
  USER_OWN_COUPON_LIST: '/coupon/list',
  USER_MERCHANT_COUPON: '/coupon/package',
  GET_ALI_USER_PHONE: '/alipay/miniprogram/user_info',// 获取阿里用户手机
  GET_USER_PHONE: '/user/phone_authorize',  // 授权用户手机号
  GET_USER_PROFILE: '/user/user_profile',// 获取用户信息
  ADD_SHIPPING_ADDRESS: '/user/add_shipping_address',// 添加收货人地址
  UPDATE_SHIPPING_ADDRESS: '/user/update_shipping_address/', // 更新收货人地址
  SHIPPING_ADDRESS_DETAIL: '/user/shipping_address/',// 获取接口详情
  GET_USE_SHOW_PAID_FEE: '/fanpiao/get_use_show_paid_fee',// 获取用户指定金额用饭票支付时的实付金额
  GET_ORDER_SHOW_PAID_FEE: '/fanpiao/get_order_show_paid_fee',
  FEEDBACK: '/user/feedback',


  // 饭票所有的购买记录
  FANPIAO_PLATFORM_RECORDS: "/fanpiao/platform/purchase/records",

  // 用户支付接口
  PAYMENT_PREPAY: '/payment/prepay',

  // 二维码参数解析相关
  MPQRCODE_TABLE: '/mpqrcode/table',
  // 获取桌台信息
  GET_TABLE_INFO: '/merchant/table_info',
  // 根据scene获取桌台相关参数
  DISH_CATALOG_SCENE: '/merchant/dish_catalog/scene',

  GET_USER_QRCODE: '/fanpiao/scan-qrcode',  // 获取用户的二维码
}