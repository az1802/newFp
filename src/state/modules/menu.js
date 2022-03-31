/*
 * @Author: sunjie
 * @Date: 2022-02-09 16:32:28
 * @LastEditors: sunj
 * @LastEditTime: 2022-02-18 13:59:51
 * @FilePath: /new-fanpiao-uniapp/src/state/modules/menu.js
 */
import { setStorage } from "@utils"
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
    showChildSkuModal: false,
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
    selectedDishesTotalPrice(state) {

      return state.selectedDishes.reduce((sum, dishItem) => {
        let { supplyCondiments = [], attrs = [], childDishGroups = [], price, quantity = 0 } = dishItem;
        let attrPrice = attrs.reduce((sum, { reprice }) => sum += reprice, 0);
        let condimentPrice = supplyCondiments.reduce((sum, { marketPrice, quantity = 0 }) => sum += marketPrice * quantity, 0);
        return sum + (price + attrPrice + condimentPrice) * quantity;
      }, 0)
    }

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
      dishInfo.quantity = 1; //此菜品每次递增的数量
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
      state.showChildSkuModal = val
    },
    toggleShowCartModal(state, val) {
      state.showCartModal = val
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
      setStorage("selected-dishes", selectedDishes)
    },
    addDishQuantity() {

    },
    reduceDishQuantity() {

    }
  },
  actions: {

  }
}