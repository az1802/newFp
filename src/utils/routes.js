/*
 * @Author: sunjie
 * @Date: 2022-02-09 14:29:32
 * @LastEditors: sunj
 * @LastEditTime: 2022-02-18 15:00:18
 * @FilePath: /new-fanpiao-uniapp/src/utils/routes.js
 */
const ORDER = '/package-order';
const MENU = '/package-menu'
const OTHER = '/package-other'
const MARKETING = '/package-marketing'
const MINE = '/package-mine'
const MERCHANT = '/package-merchant'


export default {
  "TABS": {
    "HOME": '/pages/index/index',
    "ORDER": '/pages/order/order',
    "MINE": '/pages/mine/mine',
  },
  "MENU": {
    "MENU": `${MENU}/menu`,
    "LOGIN": `${MENU}/login`,
  },
  "MERCHANT": {
    "HOME": `${MERCHANT}/home`
  },
  "ORDER": {
    "CREATE_ORDER": `${ORDER}/create-order`,
    "PAY_ORDER": `${ORDER}/pay-order`,
    "PAY_SUCCESS": `${ORDER}/pay-success`,
    "SELECT_COUPON": `${ORDER}/select-coupon`,
  },
  "MARKETING": {
    "BUY_FANPIAO": `${MARKETING}/buy-fanpiao/buy-fanpiao`,
    "MAKE_DEPOSIT": `${MARKETING}/make-deposit/make-deposit`,
    "DIRECT_PAYMENT": `${MARKETING}/direct-payment/direct-payment`,
    "FANPIAO_QRCODE": `${MARKETING}/fanpiao-qrcode/fanpiao-qrcode`,
  },
  "OTHER": {
    "COUPON_ACCORD_TEXT": `${OTHER}/coupon-accord-text/coupon-accord-text`,
    "ADD_ADDRESS": `${OTHER}/add-address/add-address`,
    "ADDRESS_LIST": `${OTHER}/address-list/address-list`,
    "DEPOSIT_RULES": `${OTHER}/deposit-rules/deposit-rules`,
    "DISCOUNT_RULES": `${OTHER}/discount-rules/discount-rules`,
    "FANPIAO_RULES": `${OTHER}/fanpiao-rules/fanpiao-rules`,

  },

  "MINE": {
    "COUPON": `${MINE}/coupon/coupon`,
    "WALLET": `${MINE}/wallet/wallet`,
    "FEEDBACK": `${MINE}/feedback/feedback`,
    "REDPAPER": `${MINE}/red-paper/red-paper`,
    "FANPIAO": `${MINE}/fanpiao/fanpiao`,
    "RED_PACKET": `${MINE}/red-packet/red-packet`,
    "FANPIAO_TRANSACTION_DETAIL": `${MINE}/fanpiao/fanpiao-transaction-detail`,
    "RED_PAPER_OVERVIEW": `${MINE}/red-paper-overview/red-paper-overview`,
    "WITHDRAW": `${MINE}/withdraw/withdraw`,
    "EXPIRED_COUPON": `${MINE}/expired-coupon/expired-coupon`,
  }
}