/*
 * @Author: sunjie
 * @Date: 2022-02-09 16:32:28
 * @LastEditors: sunj
 * @LastEditTime: 2022-02-16 18:41:37
 * @FilePath: /new-fanpiao-uniapp/src/state/modules/menu.js
 */
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

  },
  mutations: {
    addDish({ selectedDishes }, dishInfo) {
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
    reduceDish({ selectedDishes }, dishId) {
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
    toggleShowCartModal(state, val) {
      state.showCartModal = val
    },
    setCurSkuDish(state, dishInfo) {
      dishInfo = JSON.parse(JSON.stringify(dishInfo))
      state.curSkuDish = dishInfo
    },
    addDishQuantity() {

    },
    reduceDishQuantity() {

    }
  },
  actions: {

  }
}