/*
 * @Author: sunjie
 * @Date: 2022-02-09 16:32:28
 * @LastEditors: sunj
 * @LastEditTime: 2022-02-18 13:59:51
 * @FilePath: /new-fanpiao-uniapp/src/state/modules/menu.js
 */
import { setStorage, calcSkuDishPrice } from "@utils"
export default {
  state: {
    selectedDishes: [],
    curSkuDish: {
      attrList: [],
      supplyCondiments: [],
      childDishGroups: []
    },
    showSkuModal: false,
    showCartModal: false,
    curChildSkuDish: {
      attrList: [],
      supplyCondiments: [],
      childDishGroups: []
    },
    curDishDetail: {
      attrList: [],
      supplyCondiments: [],
      childDishGroups: []
    },
    showDishDetailModal: false,

    showChildSkuDishModal: false,
    selChildDishes: {},

    showFanpiaoOpenScreenModal: false,
    // showPhoneAuthorize: false,
    showScanModal: false,
    showOptionModal: false,
    showAddOrderModal: false,
    // showDishDetail: false,
    // showCodeExpiredModal: false,
    showOrderStatusModal: false,

    recommendedDishes: [],
    packagingBoxConfig: {
      packageBoxType: "KRY_BOX_QTY", // LADDER
      packageBoxDishPrice: 0,
    }
  },
  getters: {
    getDishCountById: state => dishId => {
      let res = 0;
      state.selectedDishes.forEach(dishItem => {
        const { id, quantity } = dishItem;
        if (dishId == id) {
          res += quantity;
        }
      });
      return res;
    },
    dishCountMap(state) {
      let res = {};
      state.selectedDishes.forEach(dishItem => {
        const { id, quantity } = dishItem;
        res[id] = (res[id] || 0) + quantity;
      });

      return res;
    },
    categoryCountMap(state) {
      let res = {};
      state.selectedDishes.forEach(dishItem => {
        const { categoryId, quantity } = dishItem
        res[categoryId] = (res[categoryId] || 0) + quantity;
      });
      return res;
    },
    selectedDishesTotalQuantity(state) {
      return state.selectedDishes.reduce((sum, item) => sum += item.quantity, 0)
    },
    selectedDishesTotalPrice(state) { //菜品的原价总价
      return state.selectedDishes.reduce((sum, dishItem) => {
        return sum += calcSkuDishPrice(dishItem, 'origin')
      }, 0)
    },
    selectedDishesDiscountPrice(state) { //菜品的折扣价部分
      return state.selectedDishes.reduce((sum, dishItem) => {
        return sum += (dishItem.discountPrice * dishItem.quantity)
      }, 0)
    },
    selectedDishesPackageboxTotalPrice(state) {
      let sum = 2000, { packageBoxType, packageBoxDishPrice = 0 } = state.packagingBoxConfig;
      if (packageBoxType == "KRY_BOX_QTY") { //按菜品收取打包费 
        state.selectedDishes.reduce((sum, dishItem) => {
          return sum += (dishItem.boxQty * dishItem.quantity) * packageBoxDishPrice;
        }, 0)
      } else if (packageBoxType == "LADDER") { //TODO 阶梯收取打包费
        return 0
      }
      return sum;
    },
    selectedDishesFinalTotalPrice(state) { //菜品最终的总价
      return state.selectedDishes.reduce((sum, dishItem) => {
        return sum += calcSkuDishPrice(dishItem)
      }, 0)
    },
    maxFanpiaoDiscount() {

    },

  },
  mutations: {
    resetSelectedDishes(state, selectedDishes) {
      state.selectedDishes = selectedDishes;
    },
    // addNormalDish(({ selectedDishes }, dishInfo,quantity){
    //   dishInfo = JSON.parse(JSON.stringify(dishInfo))
    //   dishInfo.quantity = quantity || 1; //此菜品每次递增的数量
    //   let index = selectedDishes.findIndex(item => item.id == dishInfo.id);
    //   if (index == -1) {
    //     selectedDishes.push(dishInfo)
    //   } else {
    //     selectedDishes[index].quantity += quantity || 1;
    //   }
    // },
    // addSkuDish(({ selectedDishes }, dishInfo,quantity){
    //   if(quantity){//
    //     let index = selectedDishes.findIndex(item=>item.id == dishInfo.id);
    //     (index!=-1)&&(selectedDishes[index].quantity += quantity); //此菜品每次递增的数量
    //   }else{
    //     dishInfo = JSON.parse(JSON.stringify(dishInfo))
    //     dishInfo.quantity = 1; //此菜品每次递增的数量
    //     selectedDishes.push(dishInfo)
    //   }


    // },
    addCartDish({ selectedDishes }, index, quantity = 1) {
      if (selectedDishes[index]) {
        selectedDishes[index].quantity += quantity;
      }
    },
    reduceCartDish({ selectedDishes }, index, quantity = 1) {
      if (selectedDishes[index]) {
        let { quantity: oldVal } = selectedDishes[index];
        if (selectedDishes[index].quantity > quantity) {
          selectedDishes[index].quantity -= quantity;
        } else {
          selectedDishes.splice(index, 1);
        }
      }
    },
    addSelDish({ selectedDishes }, dishInfo) {
      dishInfo = JSON.parse(JSON.stringify(dishInfo))
      dishInfo.quantity = dishInfo.quantity || 1; //此菜品每次递增的数量
      if (dishInfo.isSku) {
        selectedDishes.push(dishInfo)
      } else {
        let index = selectedDishes.findIndex(item => item.id == dishInfo.id);
        if (index == -1) {
          selectedDishes.push(dishInfo)
        } else {
          selectedDishes[index].quantity += 1
        }
      }
    },
    reduceSelDish({ selectedDishes }, dishId) {
      let index = selectedDishes.findIndex(item => item.id == dishId);
      if (index != -1) {
        let { quantity } = selectedDishes[index];
        if (quantity > 1) {
          selectedDishes[index].quantity -= 1;
        } else {
          selectedDishes.splice(index, 1);
        }
      }
    },
    toggleShowSkuModal(state, val) {
      state.showSkuModal = val
    },
    toggleShowChildSkuModal(state, val) {
      state.showChildSkuDishModal = val
    },
    toggleShowCartModal(state, val) {
      state.showCartModal = val
    },
    toggleShowDishDetailModal(state, val) {
      state.showDishDetailModal = val
    },
    setCurDishDetail(state, val) {
      state.curDishDetail = val;
    },
    setCurSkuDish(state, dishInfo) {
      dishInfo = JSON.parse(JSON.stringify(dishInfo))
      state.curSkuDish = dishInfo
    },
    setCurChildSkuDish(state, dishInfo) {
      dishInfo = JSON.parse(JSON.stringify(dishInfo))
      state.curChildSkuDish = dishInfo
    },
    saveSelectedDishesStorage({ selectedDishes }) {
      let merchantId = uni.getStorageSync("merchantId")
      setStorage(`selected-dishes-${merchantId}`, selectedDishes)
    },
    addDishQuantity() {

    },
    reduceDishQuantity() {

    },
    toggleShowFanpiaoOpenScreenModal(state, val) {
      state.showFanpiaoOpenScreenModal = val
    },
    setRecommendedDishes(state, val) {
      state.recommendedDishes = val;
    },
    setPackagingBoxConfig(state, packagingBoxConfig) {
      for (let key in packagingBoxConfig) {
        state.packagingBoxConfig[key] = packagingBoxConfig[key];
      }
    },
    toggleShowScanModal(state, isShow) {
      state.showScanModal = isShow;
    },
    toggleShowOptionModal(state, isShow) {
      state.showOptionModal = isShow;
    },
    toggleShowAddOrderModal(state, isShow) {
      state.showAddOrderModal = isShow;
    },
    resetDishModal(state) {
      console.log("重置菜单页面弹窗");
      state.showScanModal = false;
      state.showOptionModal = false;
      state.showAddOrderModal = false;
      state.showDishDetailModal = false;
      state.showChildSkuDishModal = false;
      state.showOrderStatusModal = false;
    }

  },
  actions: {

  }
}