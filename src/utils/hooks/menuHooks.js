/*
 * @Author: sunjie
 * @Date: 2022-02-16 18:42:01
 * @LastEditors: sunj
 * @LastEditTime: 2022-02-16 18:58:39
 * @FilePath: /new-fanpiao-uniapp/src/utils/hooks/menuHooks.js
 */
import { computed, ref, reactive } from 'vue'
import { useState, useGetters, useMutations } from "@utils/storeHooks";


export function useCategory() {

  return {
    ...useGetters("menu", ["categoryCountMap"]),
  }
}


export function useDish() {

  return {
    ...useState("menu", [
      "selectedDishes",
    ]),
    ...useGetters("menu", ["dishCountMap"]),
    ...useMutations("menu", [
      "addDish",
      "reduceDish",
    ]),
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
  }
}

export function useComboSkuDish() {

}

export function useCart() {

  return {
    ...useState("menu", [
      "showCartModal",
    ]),
    ...useMutations("menu", [
      "toggleShowCartModal",
    ])
  }
}