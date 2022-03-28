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

  // 个人信息相关
  USER_MERCHANT_INFO: "/user/user_merchant_info",
  USER_FANPIAO_BALANCE: "/fanpiao/get_user_fanpiao_fee",
  USER_MEMBER_BALANCE: "/membership/get_user_member_card_deposit",

}