import API from '@api'

const DEFAULT_PAGE = '/pages/idnex/index'

export default {

  onShow() {
    this._saveCurrentPage()
  },
  methods: {
    $storage(key, val) {
      if (val || (!val && typeof val === 'boolean')) {
        uni.setStorageSync(key, val)
      } else {
        return uni.getStorageSync(key)
      }
    },
    // 记录页面路径
    _saveCurrentPage() {

      if (!this.$mp) return
      let url = this.$getUrl()

      // 记录页面栈
      if (!url || url.includes('pages/lost') || url.includes('pages/network-error') || url.includes('pages/login')) {
        return
      }
      this.$storage('errorUrl', url)
    },
    $checkIsTabPage(path) {
      const TAB_REG = /(pages\/home)|(pages\/message)|(pages\/mine)/
      return TAB_REG.test(path)
    },
    // 获取当前页面的完整路径
    $getUrl(path = '', query = '') {
      let url = path || (this.$root.$mp.page && this.$root.$mp.page.route)
      let status = this.$checkIsTabPage(url)
      query = query || this.$root.$mp.query
      if (!status) {
        let string = ''
        for (let value in query) {
          string += `&${value}=${query[value]}`
        }
        url = string ? `${url}?${string.slice(1)}` : url
      }
      return url
    },
    navigate(url) {
      this.$uni.navigate(url)
    },
    redirect(url) {
      this.$uni.redirect(url)
    },
    reLaunch(url) {
      this.$uni.reLaunch(url)
    },
    back(delta = 1) {
      // eslint-disable-next-line no-undef
      let pages = getCurrentPages()
      if (+pages.length === 1) {
        this.$uni.switchTab(DEFAULT_PAGE)
      } else {
        //#ifndef MP-ALIPAY
        this.$uni.back(delta)
        //#endif
        //#ifdef MP-ALIPAY
        my.navigateBack(delta)
        //#endif
      }
    },
    async subscribeMessage(tmplIds) {
      return new Promise((resolve, reject) => {
        uni.requestSubscribeMessage({
          tmplIds,
          success: (res) => {
            resolve(res)
          },
          fail: () => {
            resolve(false)
          }
        })
      })
    },
    tradePay(tradeNO) {
      return new Promise((resolve, reject) => {
        my.tradePay({
          // 调用统一收单交易创建接口（alipay.trade.create），获得返回字段支付宝交易号trade_no
          tradeNO: tradeNO,
          success: (res) => {
            resolve(res)
            // my.alert({
            //   content: JSON.stringify(res),
            // });
          },
          fail: (res) => {
            reject(res)
            // my.alert({
            //   content: JSON.stringify(res),
            // });
          }
        });
      })
    }
  }
}
