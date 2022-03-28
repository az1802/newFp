/*
 * @Author: sunjie
 * @Date: 2022-02-16 18:42:01
 * @LastEditors: sunj
 * @LastEditTime: 2022-02-18 18:18:54
 * @FilePath: /new-fanpiao-uniapp/src/utils/hooks/menuHooks.js
 */
import { computed, ref, reactive, toRaw, unref } from 'vue'
import { useState, useGetters, useMutations } from "@hooks/storeHooks.js";
import { setStorage } from "@utils/common"

export function useCategory() {

  return {
    ...useGetters("menu", ["categoryCountMap"]),
  }
}


export function useDish() {

  let {
    addSelDish,
    reduceSelDish,
    resetSelectedDishes,
    saveSelectedDishesStorage } = useMutations("menu", [
      "addSelDish",
      "reduceSelDish",
      "resetSelectedDishes",
      "saveSelectedDishesStorage"
    ]);

  function addDish(dish) {
    addSelDish(dish);
    saveSelectedDishesStorage()
  }

  function reduceDish(dishId) {
    reduceSelDish(dishId);
    saveSelectedDishesStorage()
  }

  function resetSelDishes(dishes = []) {
    resetSelectedDishes(dishes);
    saveSelectedDishesStorage()
  }

  return {
    ...useState("menu", [
      "selectedDishes",
    ]),
    ...useGetters("menu", ["dishCountMap", "selectedDishesTotalQuantity", "selectedDishesTotalPrice"]),
    addDish,
    reduceDish,
    resetSelDishes
  }
}

export function useSkuDish() {



  function genDishDescribeText(dish) {
    let attrTexts = dish.attrs.map((item) => item.name);
    let condimentTexts = dish.supplyCondiments.map(item => `${item.name}*${item.quantity}`);
    return attrTexts.concat(condimentTexts).join(",")
  }

  function calcSkuDishPrice(dish) {
    let { supplyCondiments = [], attrs = [], childDishGroups = [], price, quantity = 0 } = dish;
    let attrPrice = attrs.reduce((sum, { reprice }) => sum += reprice, 0);
    let condimentPrice = supplyCondiments.reduce((sum, { marketPrice, quantity = 0 }) => sum += marketPrice * quantity, 0);
    return (price + attrPrice + condimentPrice) * quantity;
  }

  return {
    ...useState("menu", [
      "curSkuDish",
      "showSkuModal",
    ]),
    ...useMutations("menu", [
      "setCurSkuDish",
      "toggleShowSkuModal",
    ]),
    genDishDescribeText,
    calcSkuDishPrice
  }
}

export function useComboSkuDish() {

}

export function useCart() {
  const { selectedDishes } = useState("menu", [
    "selectedDishes",
  ])
  const { toggleShowCartModal, addCartDish, reduceCartDish, saveSelectedDishesStorage } = useMutations("menu", [
    "toggleShowCartModal",
    "addCartDish",
    "reduceCartDish",
    "saveSelectedDishesStorage"
  ])



  return {
    ...useState("menu", [
      "showCartModal",
    ]),
    toggleShowCartModal,
    addCartDish(...args) {
      addCartDish(...args);
      saveSelectedDishesStorage()
    },
    reduceCartDish(...args) {
      reduceCartDish(...args);
      saveSelectedDishesStorage()
    }

  }
}