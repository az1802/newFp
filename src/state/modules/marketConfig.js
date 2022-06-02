export default {
  state: {
    bannerTimeCounterStopStatus: false,
    openScreenTimeCounterStopStatus: true,
    createOrderTimeCounterStopStatus: true,
    buyFanpiaoTimeCounterStopStatus: true,
  },
  getters: {},
  mutations: {
    setBannerTimeCounterStatus(state, val) {
      state.bannerTimeCounterStopStatus = val;
    },
    setOpenScreenTimeCounterStatus(state, val) {
      state.openScreenTimeCounterStopStatus = val;
    },
    setCreateOrderTimeCounterStatus(state, val) {
      state.createOrderTimeCounterStopStatus = val;
    },
    setBuyFanpiaoTimeCounterStatus(state, val) {
      state.buyFanpiaoTimeCounterStopStatus = val;
    },

  },
}