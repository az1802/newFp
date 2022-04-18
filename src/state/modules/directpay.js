export default {
  state: {
    selCoupon: {},
    autoSelCoupon: true
  },
  getters: {},
  mutations: {
    setSelCoupon(state, selCoupon) {
      state.selCoupon = selCoupon;
    },
    toogleAutoSelCoupon(state, autoSelCoupon) {
      state.autoSelCoupon = autoSelCoupon
    }
  },

  actions: {

  }
}