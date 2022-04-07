/*
 * @Author: sunjie
 * @Date: 2022-02-16 18:42:01
 * @LastEditors: sunj
 * @LastEditTime: 2022-02-18 18:18:54
 * @FilePath: /new-fanpiao-uniapp/src/utils/hooks/menuHooks.js
 */
import { computed, ref, reactive, toRaw, unref } from 'vue'
import { useState, useGetters, useMutations } from "@hooks/storeHooks.js";
import { setStorage, genDishDescribeText, calcSkuDishPrice } from "@utils"



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

export function useChildSkuDish() {

  return {
    ...useState("menu", [
      "curChildSkuDish",
      "showChildSkuDishModal",
    ]),
    ...useMutations("menu", [
      "setCurChildSkuDish",
      "toggleShowChildSkuModal",
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